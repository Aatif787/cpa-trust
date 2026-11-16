/**
 * Server-only Hostinger SMTP transport and email composition helpers.
 * Never import this module from Client Components or expose env values.
 */

import nodemailer, { type SendMailOptions } from "nodemailer";
import {
  EMAIL_PATTERN,
  type NormalizedEnquiryPayload,
} from "../contact-validation";

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  contactToEmail: string;
  sendAutoReply: boolean;
}

export interface SmtpSendResult {
  accepted?: Array<unknown>;
  rejected?: Array<unknown>;
  messageId?: string;
  response?: string;
}

export interface SmtpTransportLike {
  sendMail(options: SendMailOptions): Promise<SmtpSendResult>;
}

export interface SendContactEmailsResult {
  notificationMessageId: string;
  acknowledgementSent: boolean;
  acknowledgementAttempted: boolean;
}

export class SmtpConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SmtpConfigurationError";
  }
}

export class SmtpDeliveryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SmtpDeliveryError";
  }
}

const CONTROL_CHARS_PATTERN = /[\u0000-\u001f\u007f\u2028\u2029]+/g;

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * Removes CR, LF, NUL, and control sequences to block SMTP header injection.
 */
export function sanitizeHeaderValue(value: string): string {
  return value.replace(CONTROL_CHARS_PATTERN, " ").trim();
}

export function assertSafeEmailAddress(rawAddress: string): string {
  const candidate = sanitizeHeaderValue(rawAddress);
  if (
    !candidate ||
    candidate.length > 254 ||
    /[<>,;\s\\]/.test(candidate) ||
    !EMAIL_PATTERN.test(candidate)
  ) {
    throw new SmtpDeliveryError("Invalid email address format.");
  }
  return candidate;
}

/**
 * Parses a boolean environment variable, defaulting to `true` when omitted
 * so production auto-replies are enabled unless explicitly disabled.
 */
export function parseAutoReplyFlag(rawValue: string | undefined): boolean {
  if (rawValue === undefined || rawValue.trim() === "") {
    return true;
  }
  const normalized = rawValue.trim().toLowerCase();
  if (["false", "0", "no", "off"].includes(normalized)) {
    return false;
  }
  if (["true", "1", "yes", "on"].includes(normalized)) {
    return true;
  }
  throw new SmtpConfigurationError(
    "SMTP_SEND_AUTO_REPLY must be a boolean string (true/false)."
  );
}

/**
 * Validates and loads Hostinger SMTP settings from server environment variables.
 */
export function readSmtpConfig(
  env: NodeJS.ProcessEnv = process.env
): SmtpConfig {
  const host = sanitizeHeaderValue(env.SMTP_HOST ?? "");
  const portRaw = (env.SMTP_PORT ?? "").trim();
  const user = sanitizeHeaderValue(env.SMTP_USER ?? "");
  const pass = env.SMTP_PASS ?? "";
  const contactToEmailRaw = sanitizeHeaderValue(env.CONTACT_TO_EMAIL ?? "");

  if (!host) {
    throw new SmtpConfigurationError("SMTP_HOST is missing.");
  }

  const port = Number(portRaw);
  if (!portRaw || !Number.isInteger(port) || port < 1 || port > 65535) {
    throw new SmtpConfigurationError("SMTP_PORT must be a valid TCP port.");
  }

  if (!user) {
    throw new SmtpConfigurationError("SMTP_USER is missing.");
  }

  if (!pass) {
    throw new SmtpConfigurationError("SMTP_PASS is missing.");
  }

  if (
    !contactToEmailRaw ||
    /[<>,;\s\\]/.test(contactToEmailRaw) ||
    !EMAIL_PATTERN.test(contactToEmailRaw)
  ) {
    throw new SmtpConfigurationError("CONTACT_TO_EMAIL is missing or invalid.");
  }

  const secureRaw = (env.SMTP_SECURE ?? "").trim().toLowerCase();
  let secure: boolean;
  if (!secureRaw) {
    secure = port === 465;
  } else if (["true", "1"].includes(secureRaw)) {
    secure = true;
  } else if (["false", "0"].includes(secureRaw)) {
    secure = false;
  } else {
    throw new SmtpConfigurationError("SMTP_SECURE must be true or false.");
  }

  const fromRaw = sanitizeHeaderValue(env.SMTP_FROM ?? "");
  const from = fromRaw || `"Santosh Arora Trust" <${user}>`;
  const sendAutoReply = parseAutoReplyFlag(env.SMTP_SEND_AUTO_REPLY);

  return {
    host,
    port,
    secure,
    user,
    pass,
    from,
    contactToEmail: contactToEmailRaw,
    sendAutoReply,
  };
}

export function createHostingerTransport(config: SmtpConfig): SmtpTransportLike {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
}

function formatMessageHtml(message: string): string {
  return escapeHtml(message.replace(/\r\n/g, "\n")).replaceAll("\n", "<br />");
}

export function buildNotificationMail(
  enquiry: NormalizedEnquiryPayload,
  config: SmtpConfig
): SendMailOptions {
  const safeSenderEmail = assertSafeEmailAddress(enquiry.email);
  const safeName = sanitizeHeaderValue(enquiry.fullName);
  const safeOrg = sanitizeHeaderValue(enquiry.organisation);
  const safeCategory = sanitizeHeaderValue(enquiry.category);
  const safeSubject = sanitizeHeaderValue(enquiry.subject);

  const textLines = [
    "New Contact Enquiry — Santosh Arora Trust",
    "",
    `Name: ${safeName}`,
    `Email: ${safeSenderEmail}`,
    safeOrg ? `Organisation: ${safeOrg}` : null,
    `Topic: ${safeCategory}`,
    `Subject: ${safeSubject}`,
    "",
    "Message:",
    enquiry.message,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #0d2140; line-height: 1.6; max-width: 640px;">
      <h2 style="margin: 0 0 16px; color: #0d2140;">New Contact Enquiry — Santosh Arora Trust</h2>
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 18px;">
        <tbody>
          <tr><td style="padding: 6px 12px 6px 0; font-weight: 600; vertical-align: top;">Full Name:</td><td style="padding: 6px 0;">${escapeHtml(safeName)}</td></tr>
          <tr><td style="padding: 6px 12px 6px 0; font-weight: 600; vertical-align: top;">Email:</td><td style="padding: 6px 0;">${escapeHtml(safeSenderEmail)}</td></tr>
          ${safeOrg ? `<tr><td style="padding: 6px 12px 6px 0; font-weight: 600; vertical-align: top;">Organisation:</td><td style="padding: 6px 0;">${escapeHtml(safeOrg)}</td></tr>` : ""}
          <tr><td style="padding: 6px 12px 6px 0; font-weight: 600; vertical-align: top;">Topic:</td><td style="padding: 6px 0;">${escapeHtml(safeCategory)}</td></tr>
          <tr><td style="padding: 6px 12px 6px 0; font-weight: 600; vertical-align: top;">Subject:</td><td style="padding: 6px 0;">${escapeHtml(safeSubject)}</td></tr>
        </tbody>
      </table>
      <div style="padding: 14px 16px; background: #f4f8fe; border-left: 3px solid #184385; border-radius: 6px;">
        <p style="margin: 0 0 8px; font-weight: 600;">Message:</p>
        <p style="margin: 0;">${formatMessageHtml(enquiry.message)}</p>
      </div>
    </div>
  `.trim();

  return {
    from: config.from,
    to: config.contactToEmail,
    replyTo: safeSenderEmail,
    subject: `[Trust Enquiry] [${safeCategory}] ${safeSubject}`,
    text: textLines,
    html,
  };
}

export function buildAcknowledgementMail(
  enquiry: NormalizedEnquiryPayload,
  config: SmtpConfig
): SendMailOptions {
  const safeRecipientEmail = assertSafeEmailAddress(enquiry.email);
  const safeName = sanitizeHeaderValue(enquiry.fullName);
  const safeCategory = sanitizeHeaderValue(enquiry.category);
  const safeSubject = sanitizeHeaderValue(enquiry.subject);

  const text = [
    `Dear ${safeName},`,
    "",
    "Thank you for contacting Santosh Arora Trust.",
    "This message confirms that your enquiry has been received by our team.",
    "",
    `Topic: ${safeCategory}`,
    `Subject: ${safeSubject}`,
    "",
    "If you need to add further details, you may reply directly to this email.",
    "",
    "With regards,",
    "Santosh Arora Trust",
    "New Delhi, India",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #0d2140; line-height: 1.65; max-width: 600px;">
      <p style="margin: 0 0 14px;">Dear ${escapeHtml(safeName)},</p>
      <p style="margin: 0 0 14px;">
        Thank you for contacting <strong>Santosh Arora Trust</strong>. This message confirms that your enquiry has been received by our team.
      </p>
      <div style="margin: 16px 0; padding: 12px 16px; background: #f4f8fe; border-left: 3px solid #184385; border-radius: 6px;">
        <p style="margin: 0 0 4px;"><strong>Topic:</strong> ${escapeHtml(safeCategory)}</p>
        <p style="margin: 0;"><strong>Subject:</strong> ${escapeHtml(safeSubject)}</p>
      </div>
      <p style="margin: 0 0 16px;">
        If you need to share additional details, please reply to this email.
      </p>
      <p style="margin: 0; color: #1a3560;">
        With regards,<br />
        <strong>Santosh Arora Trust</strong><br />
        New Delhi, India
      </p>
    </div>
  `.trim();

  return {
    from: config.from,
    to: safeRecipientEmail,
    replyTo: config.contactToEmail,
    subject: "Enquiry received — Santosh Arora Trust",
    text,
    html,
  };
}

function assertSmtpAccepted(result: SmtpSendResult | undefined): void {
  if (!result || !Array.isArray(result.accepted) || result.accepted.length === 0) {
    throw new SmtpDeliveryError("SMTP server did not accept any recipient.");
  }
}

export async function sendContactEmails(
  enquiry: NormalizedEnquiryPayload,
  deps: {
    config?: SmtpConfig;
    transport?: SmtpTransportLike;
  } = {}
): Promise<SendContactEmailsResult> {
  const config = deps.config ?? readSmtpConfig();
  const transport = deps.transport ?? createHostingerTransport(config);

  const notificationResult = await transport.sendMail(
    buildNotificationMail(enquiry, config)
  );
  assertSmtpAccepted(notificationResult);

  const notificationMessageId = notificationResult.messageId ?? "";

  if (!config.sendAutoReply) {
    return {
      notificationMessageId,
      acknowledgementSent: false,
      acknowledgementAttempted: false,
    };
  }

  try {
    const ackResult = await transport.sendMail(
      buildAcknowledgementMail(enquiry, config)
    );
    assertSmtpAccepted(ackResult);
    return {
      notificationMessageId,
      acknowledgementSent: true,
      acknowledgementAttempted: true,
    };
  } catch (error) {
    console.warn(
      "[contact-smtp] Visitor acknowledgement failed:",
      formatSafeErrorSummary(error, config.pass)
    );
    return {
      notificationMessageId,
      acknowledgementSent: false,
      acknowledgementAttempted: true,
    };
  }
}

export function formatSafeErrorSummary(error: unknown, secret?: string): string {
  const errObj = error as { code?: unknown; responseCode?: unknown; message?: unknown } | null;
  const codePart = typeof errObj?.code === "string" ? `code=${errObj.code}` : "";
  const statusPart =
    typeof errObj?.responseCode === "number"
      ? `smtpStatus=${errObj.responseCode}`
      : "";
  let messagePart =
    error instanceof Error ? error.message : "Unknown mail error";

  if (secret && secret.length > 0) {
    messagePart = messagePart.replaceAll(secret, "[REDACTED]");
  }

  const meta = [codePart, statusPart].filter(Boolean).join(" ");
  return meta ? `${meta} (${messagePart})` : messagePart;
}
