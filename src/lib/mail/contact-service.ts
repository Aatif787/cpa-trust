/**
 * Server-side submission workflow shared by POST /api/contact and automated tests.
 */

import {
  extractEnquirySubmission,
  normalizeEnquiryValues,
  validateEnquiry,
  type EnquiryFieldErrors,
} from "../contact-validation";
import {
  createDefaultRateLimiter,
  extractClientIp,
  type RateLimiter,
} from "./rate-limit";
import {
  formatSafeErrorSummary,
  readSmtpConfig,
  sendContactEmails,
  SmtpConfigurationError,
  type SmtpConfig,
  type SmtpTransportLike,
} from "./smtp";

const MAX_REQUEST_BYTES = 24 * 1024;

export interface ContactApiSuccessBody {
  ok: true;
  message: string;
  acknowledgementSent: boolean;
}

export interface ContactApiErrorBody {
  ok: false;
  error: string;
  fieldErrors?: EnquiryFieldErrors;
}

export type ContactApiResponseBody = ContactApiSuccessBody | ContactApiErrorBody;

export interface ContactServiceDeps {
  rateLimiter?: RateLimiter;
  getSmtpConfig?: () => SmtpConfig;
  createTransport?: (config: SmtpConfig) => SmtpTransportLike;
  transport?: SmtpTransportLike;
}

export interface ContactServiceResponse {
  status: number;
  body: ContactApiResponseBody;
  headers?: Record<string, string>;
}

const defaultRateLimiter = createDefaultRateLimiter();

export async function processContactRequest(
  request: Request,
  deps: ContactServiceDeps = {}
): Promise<ContactServiceResponse> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return {
      status: 415,
      body: {
        ok: false,
        error: "Unsupported request format. Please submit via the website form.",
      },
    };
  }

  let rawText: string;
  try {
    rawText = await request.text();
  } catch {
    return {
      status: 400,
      body: {
        ok: false,
        error: "Unable to read the submitted form payload.",
      },
    };
  }

  if (Buffer.byteLength(rawText, "utf8") > MAX_REQUEST_BYTES) {
    return {
      status: 413,
      body: {
        ok: false,
        error:
          "Your message submission is too large. Please shorten your message and try again.",
      },
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    return {
      status: 400,
      body: {
        ok: false,
        error: "Invalid JSON payload.",
      },
    };
  }

  const extracted = extractEnquirySubmission(parsed);
  if (!extracted) {
    return {
      status: 400,
      body: {
        ok: false,
        error: "Invalid contact submission.",
      },
    };
  }

  // Honeypot guard: reject silently-filled trap fields without invoking SMTP or claiming success
  if (extracted.honeypot.trim().length > 0) {
    return {
      status: 400,
      body: {
        ok: false,
        error: "Unable to process your submission. Please use email directly.",
      },
    };
  }

  const rateLimiter = deps.rateLimiter ?? defaultRateLimiter;
  const clientIp = extractClientIp(request.headers);
  const rateResult = await rateLimiter.consume(clientIp);
  if (!rateResult.allowed) {
    return {
      status: 429,
      headers: {
        "Retry-After": String(rateResult.retryAfterSeconds),
      },
      body: {
        ok: false,
        error:
          "Too many messages were sent recently from your connection. Please wait a few minutes before trying again or email us directly.",
      },
    };
  }

  const fieldErrors = validateEnquiry(extracted.values);
  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: 400,
      body: {
        ok: false,
        error: "Please check the highlighted fields and try again.",
        fieldErrors,
      },
    };
  }

  const normalized = normalizeEnquiryValues(extracted.values);

  let config: SmtpConfig;
  try {
    config = deps.getSmtpConfig ? deps.getSmtpConfig() : readSmtpConfig();
  } catch (error) {
    const reason =
      error instanceof SmtpConfigurationError
        ? error.message
        : "SMTP configuration check failed";
    console.error("[contact-api] Server mail configuration unavailable:", reason);
    return {
      status: 503,
      body: {
        ok: false,
        error:
          "Email delivery is not configured on this server right now. Please use your email app or copy our email address below.",
      },
    };
  }

  try {
    const transport =
      deps.transport ??
      (deps.createTransport ? deps.createTransport(config) : undefined);

    const delivery = await sendContactEmails(normalized, {
      config,
      transport,
    });

    const confirmationMessage = delivery.acknowledgementSent
      ? `Your message has been delivered to Santosh Arora Trust, and a confirmation email has been sent to ${normalized.email}.`
      : `Your message has been delivered to Santosh Arora Trust.`;

    return {
      status: 200,
      body: {
        ok: true,
        message: confirmationMessage,
        acknowledgementSent: delivery.acknowledgementSent,
      },
    };
  } catch (error) {
    console.error(
      "[contact-api] Failed to deliver enquiry via SMTP:",
      formatSafeErrorSummary(error, config.pass)
    );
    return {
      status: 502,
      body: {
        ok: false,
        error:
          "We could not deliver your message through the mail server just now. Please try again or use your email app below.",
      },
    };
  }
}
