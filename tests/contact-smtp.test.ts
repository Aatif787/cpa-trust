import test from "node:test";
import assert from "node:assert/strict";
import { validateEnquiry } from "../src/lib/contact-validation";
import {
  createHostingerTransport,
  escapeHtml,
  parseAutoReplyFlag,
  readSmtpConfig,
  sanitizeHeaderValue,
  SmtpConfigurationError,
  type SmtpConfig,
  type SmtpTransportLike,
} from "../src/lib/mail/smtp";
import { InMemoryRateLimiter } from "../src/lib/mail/rate-limit";
import { processContactRequest } from "../src/lib/mail/contact-service";

const MOCK_CONFIG: SmtpConfig = {
  host: "smtp.example.test",
  port: 465,
  secure: true,
  user: "noreply@example.test",
  pass: "mock-secret-pass-value",
  from: '"Santosh Arora Trust" <noreply@example.test>',
  contactToEmail: "trust-inbox@example.test",
  sendAutoReply: true,
};

function makeRequest(
  payload: unknown,
  options: { contentType?: string; ip?: string } = {}
): Request {
  const body =
    typeof payload === "string" ? payload : JSON.stringify(payload);
  return new Request("http://localhost:3000/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": options.contentType ?? "application/json",
      "x-forwarded-for": options.ip ?? "203.0.113.10",
    },
    body,
  });
}

const VALID_ENQUIRY = {
  fullName: "Ananya Sharma",
  email: "ananya@example.org",
  organisation: "Community Initiative",
  category: "Education & Literacy",
  subject: "Volunteering enquiry",
  message:
    "We would like to understand upcoming education literacy initiatives in Delhi.",
};

test("readSmtpConfig parses valid Hostinger env and defaults SMTP_SEND_AUTO_REPLY to true", () => {
  const cfg = readSmtpConfig({
    NODE_ENV: "test",
    SMTP_HOST: "smtp.example.test",
    SMTP_PORT: "465",
    SMTP_SECURE: "true",
    SMTP_USER: "trust@example.test",
    SMTP_PASS: "app-secret",
    CONTACT_TO_EMAIL: "office@example.test",
  });

  assert.equal(cfg.host, "smtp.example.test");
  assert.equal(cfg.port, 465);
  assert.equal(cfg.secure, true);
  assert.equal(cfg.from, '"Santosh Arora Trust" <trust@example.test>');
  assert.equal(cfg.contactToEmail, "office@example.test");
  assert.equal(cfg.sendAutoReply, true);
  assert.equal(parseAutoReplyFlag("false"), false);
  assert.equal(parseAutoReplyFlag(undefined), true);
});

test("readSmtpConfig fails closed when required SMTP env variables are missing", () => {
  assert.throws(() => readSmtpConfig({ NODE_ENV: "test" }), SmtpConfigurationError);
});

test("security helpers escape HTML and strip header injection sequences", () => {
  assert.equal(
    escapeHtml('<script>alert("xss")</script> & \'quote\''),
    "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt; &amp; &#39;quote&#39;"
  );
  assert.equal(
    sanitizeHeaderValue("Hello\r\nBcc: evil@example.com\0"),
    "Hello Bcc: evil@example.com"
  );
});

test("validateEnquiry preserves exact existing rules and messages", () => {
  const emptyErrors = validateEnquiry({
    fullName: "",
    email: "",
    organisation: "",
    category: "",
    subject: "",
    message: "",
  });

  assert.deepEqual(emptyErrors, {
    fullName: "Please enter your full name.",
    email: "Please enter your email address.",
    category: "Please choose a topic.",
    subject: "Please enter a short subject.",
    message: "Please enter your message.",
  });
});

test("POST workflow rejects invalid payloads, malformed JSON, wrong Content-Type, and honeypot without calling SMTP", async () => {
  let sendCalls = 0;
  const neverCalledTransport: SmtpTransportLike = {
    async sendMail() {
      sendCalls += 1;
      return { accepted: ["nobody@example.test"] };
    },
  };

  // Non-JSON content-type
  const wrongType = await processContactRequest(
    makeRequest(VALID_ENQUIRY, { contentType: "text/plain" }),
    { getSmtpConfig: () => MOCK_CONFIG, transport: neverCalledTransport }
  );
  assert.equal(wrongType.status, 415);
  assert.equal(wrongType.body.ok, false);

  // Malformed JSON
  const badJson = await processContactRequest(makeRequest("{broken json"), {
    getSmtpConfig: () => MOCK_CONFIG,
    transport: neverCalledTransport,
  });
  assert.equal(badJson.status, 400);
  assert.equal(badJson.body.ok, false);

  // Invalid fields (tampered category + short message + bad email)
  const invalidFields = await processContactRequest(
    makeRequest({
      ...VALID_ENQUIRY,
      email: "not-an-email",
      category: "Injected Category",
      message: "Too short",
    }),
    {
      rateLimiter: new InMemoryRateLimiter(),
      getSmtpConfig: () => MOCK_CONFIG,
      transport: neverCalledTransport,
    }
  );
  assert.equal(invalidFields.status, 400);
  assert.equal(invalidFields.body.ok, false);
  if (!invalidFields.body.ok) {
    assert.equal(invalidFields.body.fieldErrors?.category, "Please choose a topic.");
    assert.ok(invalidFields.body.fieldErrors?.email);
    assert.ok(invalidFields.body.fieldErrors?.message);
  }

  // Filled honeypot trap
  const honeypot = await processContactRequest(
    makeRequest({
      ...VALID_ENQUIRY,
      contactTrap: "https://spam.example.invalid",
    }),
    {
      rateLimiter: new InMemoryRateLimiter(),
      getSmtpConfig: () => MOCK_CONFIG,
      transport: neverCalledTransport,
    }
  );
  assert.equal(honeypot.status, 400);
  assert.equal(honeypot.body.ok, false);

  assert.equal(sendCalls, 0);
});

test("successful submission sends Trust notification and escaped visitor acknowledgement via mocked SMTP", async () => {
  const sentMessages: Array<Record<string, unknown>> = [];
  const mockTransport: SmtpTransportLike = {
    async sendMail(options) {
      sentMessages.push(options as Record<string, unknown>);
      return {
        accepted: [String(options.to)],
        rejected: [],
        messageId: `<mock-${sentMessages.length}@example.test>`,
      };
    },
  };

  const res = await processContactRequest(
    makeRequest({
      ...VALID_ENQUIRY,
      subject: "Question\r\nBcc: attacker@evil.test",
      message:
        'Hello <script>alert("x")</script> team, we would like to collaborate with you.',
    }),
    {
      rateLimiter: new InMemoryRateLimiter(),
      getSmtpConfig: () => MOCK_CONFIG,
      transport: mockTransport,
    }
  );

  assert.equal(res.status, 200);
  assert.equal(res.body.ok, true);
  if (res.body.ok) {
    assert.equal(res.body.acknowledgementSent, true);
  }

  assert.equal(sentMessages.length, 2);

  const [notification, acknowledgement] = sentMessages;
  assert.equal(notification.to, MOCK_CONFIG.contactToEmail);
  assert.equal(notification.from, MOCK_CONFIG.from);
  assert.equal(notification.replyTo, VALID_ENQUIRY.email);
  assert.equal(
    String(notification.subject).includes("\r") ||
      String(notification.subject).includes("\n"),
    false
  );
  assert.equal(String(notification.html).includes("<script>"), false);
  assert.equal(String(notification.html).includes("&lt;script&gt;"), true);

  assert.equal(acknowledgement.to, VALID_ENQUIRY.email);
  assert.equal(acknowledgement.replyTo, MOCK_CONFIG.contactToEmail);
  assert.equal(
    String(acknowledgement.html).includes(VALID_ENQUIRY.fullName),
    true
  );
});

test("primary SMTP failure returns 502 error without claiming delivery or exposing secrets", async () => {
  const failingTransport: SmtpTransportLike = {
    async sendMail() {
      throw new Error(
        `Authentication failed for ${MOCK_CONFIG.user} with password ${MOCK_CONFIG.pass}`
      );
    },
  };

  const res = await processContactRequest(makeRequest(VALID_ENQUIRY), {
    rateLimiter: new InMemoryRateLimiter(),
    getSmtpConfig: () => MOCK_CONFIG,
    transport: failingTransport,
  });

  assert.equal(res.status, 502);
  assert.equal(res.body.ok, false);
  const serialized = JSON.stringify(res.body);
  assert.equal(serialized.includes(MOCK_CONFIG.pass), false);
  assert.equal(serialized.includes("Authentication failed"), false);

  // Also ensure empty accepted[] is treated as failure
  const rejectedTransport: SmtpTransportLike = {
    async sendMail() {
      return { accepted: [], rejected: [MOCK_CONFIG.contactToEmail] };
    },
  };
  const rejectedRes = await processContactRequest(makeRequest(VALID_ENQUIRY), {
    rateLimiter: new InMemoryRateLimiter(),
    getSmtpConfig: () => MOCK_CONFIG,
    transport: rejectedTransport,
  });
  assert.equal(rejectedRes.status, 502);
  assert.equal(rejectedRes.body.ok, false);
});

test("acknowledgement email failure succeeds Trust delivery while honestly setting acknowledgementSent to false", async () => {
  let attempt = 0;
  const partialTransport: SmtpTransportLike = {
    async sendMail(options) {
      attempt += 1;
      if (attempt === 1) {
        return {
          accepted: [String(options.to)],
          messageId: "<trust-msg-1@example.test>",
        };
      }
      throw new Error("Simulated recipient mailbox temporary failure");
    },
  };

  const res = await processContactRequest(makeRequest(VALID_ENQUIRY), {
    rateLimiter: new InMemoryRateLimiter(),
    getSmtpConfig: () => MOCK_CONFIG,
    transport: partialTransport,
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.ok, true);
  if (res.body.ok) {
    assert.equal(res.body.acknowledgementSent, false);
    assert.equal(res.body.message.includes("confirmation email has been sent"), false);
  }
});

test("unconfigured server env returns 503 safely without leaking internals", async () => {
  const res = await processContactRequest(makeRequest(VALID_ENQUIRY), {
    rateLimiter: new InMemoryRateLimiter(),
    getSmtpConfig: () => readSmtpConfig({ NODE_ENV: "test" }),
  });

  assert.equal(res.status, 503);
  assert.equal(res.body.ok, false);
});

test("SMTP_SEND_AUTO_REPLY=false skips visitor acknowledgement while delivering Trust notification", async () => {
  const sentMessages: Array<Record<string, unknown>> = [];
  const transport: SmtpTransportLike = {
    async sendMail(options) {
      sentMessages.push(options as Record<string, unknown>);
      return { accepted: [String(options.to)], messageId: "<only-1@example.test>" };
    },
  };

  const res = await processContactRequest(makeRequest(VALID_ENQUIRY), {
    rateLimiter: new InMemoryRateLimiter(),
    getSmtpConfig: () => ({ ...MOCK_CONFIG, sendAutoReply: false }),
    transport,
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.ok, true);
  if (res.body.ok) {
    assert.equal(res.body.acknowledgementSent, false);
  }
  assert.equal(sentMessages.length, 1);
  assert.equal(sentMessages[0].to, MOCK_CONFIG.contactToEmail);

  // Also verify real Nodemailer transport instantiation succeeds cleanly
  const realShapeTransport = createHostingerTransport(MOCK_CONFIG);
  assert.equal(typeof realShapeTransport.sendMail, "function");
});

test("in-memory rate limiter enforces per-IP limits cleanly", async () => {
  const limiter = new InMemoryRateLimiter({ maxRequests: 2, windowMs: 60_000 });
  const r1 = await limiter.consume("198.51.100.5");
  const r2 = await limiter.consume("198.51.100.5");
  const r3 = await limiter.consume("198.51.100.5");

  assert.equal(r1.allowed, true);
  assert.equal(r2.allowed, true);
  assert.equal(r3.allowed, false);
  assert.ok(r3.retryAfterSeconds >= 1);
});
