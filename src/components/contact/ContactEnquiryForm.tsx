"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  Info,
  Loader2,
  Mail,
  RefreshCw,
  Send,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SANTOSH_ARORA_TRUST } from "@/data/trust";

export const ENQUIRY_CATEGORIES = [
  "General Enquiry",
  "Education & Literacy",
  "Women Empowerment",
  "Healthcare & Medical Relief",
  "Skill Development",
  "Social Welfare",
  "Other",
] as const;

export type EnquiryCategory = (typeof ENQUIRY_CATEGORIES)[number];

export interface EnquiryFormValues {
  fullName: string;
  email: string;
  organisation: string;
  category: EnquiryCategory | "";
  subject: string;
  message: string;
}

type FieldName = keyof EnquiryFormValues;
type FieldErrors = Partial<Record<FieldName, string>>;
type FormStatus = "idle" | "submitting" | "success" | "error";

const INITIAL_VALUES: EnquiryFormValues = {
  fullName: "",
  email: "",
  organisation: "",
  category: "",
  subject: "",
  message: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const STATE_EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Inspects the workspace configuration honestly:
 * No email transport, API endpoint, or serverless mailer is currently configured
 * in this repository. Switch this boundary only once a real server-side route
 * handler or verified delivery integration is connected and tested.
 */
const BACKEND_DELIVERY_ENABLED = false;

function validateEnquiry(values: EnquiryFormValues): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Please enter your full name.";
  } else if (values.fullName.trim().length < 2) {
    errors.fullName = "Full name should be at least 2 characters.";
  }

  if (!values.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Please enter a valid email address (e.g. name@example.org).";
  }

  if (!values.category) {
    errors.category = "Please choose a topic.";
  }

  if (!values.subject.trim()) {
    errors.subject = "Please enter a short subject.";
  } else if (values.subject.trim().length < 3) {
    errors.subject = "Subject should be at least 3 characters.";
  }

  if (!values.message.trim()) {
    errors.message = "Please enter your message.";
  } else if (values.message.trim().length < 15) {
    errors.message =
      "Please share a little more detail (at least 15 characters).";
  }

  return errors;
}

function buildMailtoHref(values: EnquiryFormValues, recipient: string): string {
  const subjectPrefix = values.category ? `[${values.category}] ` : "";
  const subject = encodeURIComponent(
    `${subjectPrefix}${values.subject.trim()}`
  );
  const lines = [
    `Name: ${values.fullName.trim()}`,
    values.organisation.trim()
      ? `Organisation: ${values.organisation.trim()}`
      : null,
    `Category: ${values.category || "General Enquiry"}`,
    `Reply Email: ${values.email.trim()}`,
    "",
    values.message.trim(),
  ].filter((line): line is string => line !== null);

  return `mailto:${recipient}?subject=${subject}&body=${encodeURIComponent(lines.join("\n"))}`;
}

function SubmissionSuccessPanel({
  values,
  onReset,
}: {
  values: EnquiryFormValues;
  onReset: () => void;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-[var(--radius-card)] border border-brand-lime/55 bg-bg-sage-wash p-6 sm:p-8"
    >
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-forest text-white shadow-[var(--shadow-soft)]">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <Eyebrow tone="forest">Message Sent</Eyebrow>
          <h3 className="text-heading-2 mt-3 text-text-primary">
            Thank you, {values.fullName.trim()}.
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary sm:text-base">
            Your message about <strong>{values.category}</strong> has been
            sent. We will reply to{" "}
            <strong className="text-text-primary">{values.email.trim()}</strong>.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 border-t border-brand-lime/30 pt-5">
        <Button type="button" variant="secondary" size="md" onClick={onReset}>
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          <span>Send Another Message</span>
        </Button>
      </div>
    </div>
  );
}

export function ContactEnquiryForm() {
  const prefersReduced = useReducedMotion();
  const { correspondenceEmail } = SANTOSH_ARORA_TRUST.registration;

  const [values, setValues] = useState<EnquiryFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [copiedEmail, setCopiedEmail] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const inputBaseClass =
    "mt-2 block w-full rounded-xl border bg-bg-cream-soft/65 px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/70 transition-all duration-200 focus:bg-bg-white focus:outline-none focus:ring-4 sm:text-[15px]";

  function getFieldClasses(hasError: boolean): string {
    if (hasError) {
      return `${inputBaseClass} border-[#b43c2f] focus:border-[#b43c2f] focus:ring-[#b43c2f]/15`;
    }
    return `${inputBaseClass} border-border-warm hover:border-brand-forest/40 focus:border-brand-forest focus:ring-brand-lavender/30`;
  }

  function handleChange<K extends FieldName>(
    field: K,
    nextValue: EnquiryFormValues[K]
  ) {
    const updated = { ...values, [field]: nextValue };
    setValues(updated);

    if (touched[field] || errors[field]) {
      const nextErrors = validateEnquiry(updated);
      setErrors((prev) => ({ ...prev, [field]: nextErrors[field] }));
    }
  }

  function handleBlur(field: FieldName) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const nextErrors = validateEnquiry(values);
    setErrors((prev) => ({ ...prev, [field]: nextErrors[field] }));
  }

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(correspondenceEmail);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      setCopiedEmail(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateEnquiry(values);
    setTouched({
      fullName: true,
      email: true,
      organisation: true,
      category: true,
      subject: true,
      message: true,
    });
    setErrors(validationErrors);

    const firstInvalidField = (
      ["fullName", "email", "category", "subject", "message"] as const
    ).find((field) => Boolean(validationErrors[field]));

    if (firstInvalidField) {
      const el = formRef.current?.querySelector<HTMLElement>(
        `[name="${firstInvalidField}"]`
      );
      el?.focus();
      return;
    }

    // Never pretend enquiries are delivered when no backend exists.
    if (!BACKEND_DELIVERY_ENABLED) {
      setStatus("error");
      setStatusMessage(
        "This form cannot send messages by itself yet, so your message has not been sent. Your details are ready. Use the button below to send them from your own email app."
      );
      return;
    }

    setStatus("submitting");
    setStatusMessage("");
  }

  function handleReset() {
    setValues(INITIAL_VALUES);
    setErrors({});
    setTouched({});
    setStatus("idle");
    setStatusMessage("");
  }

  return (
    <div
      id="enquiry-form"
      className="scroll-mt-28 rounded-[var(--radius-panel)] border border-border-warm bg-bg-white p-6 shadow-[var(--shadow-elevated)] sm:p-8 lg:p-10"
    >
      <div className="border-b border-border-subtle pb-6">
        <Eyebrow tone="lime">Message Form</Eyebrow>
        <h2 className="text-heading-2 mt-4 text-text-primary">
          Send Us a Message
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
          Write to us with questions about the trust, our goals, or working
          together.
        </p>

        {/* Honest Backend Configuration Notice */}
        <div
          role="note"
          className="mt-5 flex items-start gap-3 rounded-xl border border-brand-lavender/45 bg-bg-lavender-wash/75 p-4"
        >
          <Info
            className="mt-0.5 h-4 w-4 shrink-0 text-brand-lavender-deep"
            aria-hidden="true"
          />
          <p className="text-xs leading-relaxed text-text-primary sm:text-[13px]">
            <strong>Please note:</strong> This form cannot send messages by
            itself yet. When you press the button, we check your details and
            open a ready-to-send email to{" "}
            <a
              href={`mailto:${correspondenceEmail}`}
              className="font-semibold text-brand-forest underline decoration-brand-lime underline-offset-4 hover:text-text-primary"
            >
              {correspondenceEmail}
            </a>{" "}
            in your email app. We do not save your message.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success-state"
              initial={prefersReduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: STATE_EASE }}
            >
              <SubmissionSuccessPanel values={values} onReset={handleReset} />
            </motion.div>
          ) : (
            <motion.form
              key="form-state"
              ref={formRef}
              noValidate
              onSubmit={handleSubmit}
              initial={prefersReduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {status === "error" ? (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="rounded-2xl border border-brand-orange/60 bg-bg-orange-wash p-5"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      className="mt-0.5 h-5 w-5 shrink-0 text-[#9c4215]"
                      aria-hidden="true"
                    />
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-serif text-xl font-semibold text-text-primary">
                          Message Not Sent Yet
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-text-primary/85">
                          {statusMessage}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <a
                          href={buildMailtoHref(values, correspondenceEmail)}
                          className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-forest px-5 text-xs font-semibold text-white shadow-[var(--shadow-soft)] transition-all hover:bg-[#293d2f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lavender-deep focus-visible:ring-offset-2 sm:text-sm"
                        >
                          <Mail className="h-4 w-4" aria-hidden="true" />
                          <span>Open Email</span>
                        </a>

                        <button
                          type="button"
                          onClick={handleCopyEmail}
                          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-bg-white px-4 text-xs font-medium text-brand-forest ring-1 ring-border-forest transition-colors hover:bg-bg-sage-wash focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lavender-deep sm:text-sm"
                        >
                          {copiedEmail ? (
                            <>
                              <Check className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Copied Address</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Copy {correspondenceEmail}</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setStatus("idle");
                            setStatusMessage("");
                          }}
                          className="inline-flex h-10 cursor-pointer items-center px-3 text-xs font-medium text-text-secondary underline underline-offset-4 hover:text-text-primary sm:text-sm"
                        >
                          Continue Editing
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="contact-full-name"
                    className="block text-xs font-semibold uppercase tracking-[0.12em] text-text-primary"
                  >
                    Full Name <span aria-hidden="true" className="text-[#b43c2f]">*</span>
                  </label>
                  <input
                    id="contact-full-name"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={
                      errors.fullName ? "contact-full-name-error" : undefined
                    }
                    value={values.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    onBlur={() => handleBlur("fullName")}
                    placeholder="e.g. Ananya Sharma"
                    className={getFieldClasses(Boolean(errors.fullName))}
                  />
                  {errors.fullName ? (
                    <p
                      id="contact-full-name-error"
                      className="mt-1.5 text-xs font-medium text-[#b43c2f]"
                    >
                      {errors.fullName}
                    </p>
                  ) : null}
                </div>

                {/* Email Address */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-semibold uppercase tracking-[0.12em] text-text-primary"
                  >
                    Email Address <span aria-hidden="true" className="text-[#b43c2f]">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={
                      errors.email ? "contact-email-error" : undefined
                    }
                    value={values.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="you@organisation.org"
                    className={getFieldClasses(Boolean(errors.email))}
                  />
                  {errors.email ? (
                    <p
                      id="contact-email-error"
                      className="mt-1.5 text-xs font-medium text-[#b43c2f]"
                    >
                      {errors.email}
                    </p>
                  ) : null}
                </div>

                {/* Organisation (optional) */}
                <div>
                  <label
                    htmlFor="contact-organisation"
                    className="block text-xs font-semibold uppercase tracking-[0.12em] text-text-primary"
                  >
                    Organisation{" "}
                    <span className="font-normal normal-case tracking-normal text-text-subtle">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="contact-organisation"
                    name="organisation"
                    type="text"
                    autoComplete="organization"
                    value={values.organisation}
                    onChange={(e) => handleChange("organisation", e.target.value)}
                    onBlur={() => handleBlur("organisation")}
                    placeholder="Institution, NGO, or community group"
                    className={getFieldClasses(false)}
                  />
                </div>

                {/* Enquiry Category */}
                <div>
                  <label
                    htmlFor="contact-category"
                    className="block text-xs font-semibold uppercase tracking-[0.12em] text-text-primary"
                  >
                    Topic <span aria-hidden="true" className="text-[#b43c2f]">*</span>
                  </label>
                  <select
                    id="contact-category"
                    name="category"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(errors.category)}
                    aria-describedby={
                      errors.category ? "contact-category-error" : undefined
                    }
                    value={values.category}
                    onChange={(e) =>
                      handleChange(
                        "category",
                        e.target.value as EnquiryFormValues["category"]
                      )
                    }
                    onBlur={() => handleBlur("category")}
                    className={getFieldClasses(Boolean(errors.category))}
                  >
                    <option value="">Select a topic...</option>
                    {ENQUIRY_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category ? (
                    <p
                      id="contact-category-error"
                      className="mt-1.5 text-xs font-medium text-[#b43c2f]"
                    >
                      {errors.category}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="contact-subject"
                  className="block text-xs font-semibold uppercase tracking-[0.12em] text-text-primary"
                >
                  Subject <span aria-hidden="true" className="text-[#b43c2f]">*</span>
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={
                    errors.subject ? "contact-subject-error" : undefined
                  }
                  value={values.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  onBlur={() => handleBlur("subject")}
                  placeholder="What is your message about?"
                  className={getFieldClasses(Boolean(errors.subject))}
                />
                {errors.subject ? (
                  <p
                    id="contact-subject-error"
                    className="mt-1.5 text-xs font-medium text-[#b43c2f]"
                  >
                    {errors.subject}
                  </p>
                ) : null}
              </div>

              {/* Message */}
              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold uppercase tracking-[0.12em] text-text-primary"
                  >
                    Message <span aria-hidden="true" className="text-[#b43c2f]">*</span>
                  </label>
                  <span className="text-[11px] text-text-subtle">
                    Minimum 15 characters
                  </span>
                </div>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  aria-required="true"
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={
                    errors.message ? "contact-message-error" : undefined
                  }
                  value={values.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  onBlur={() => handleBlur("message")}
                  placeholder="Tell us how we can help or how you would like to work with us..."
                  className={`${getFieldClasses(Boolean(errors.message))} resize-y`}
                />
                {errors.message ? (
                  <p
                    id="contact-message-error"
                    className="mt-1.5 text-xs font-medium text-[#b43c2f]"
                  >
                    {errors.message}
                  </p>
                ) : null}
              </div>

              {/* Actions Row */}
              <div className="flex flex-col items-start justify-between gap-4 border-t border-border-subtle pt-5 sm:flex-row sm:items-center">
                <p className="text-xs leading-relaxed text-text-subtle">
                  Fields marked <span className="text-[#b43c2f]">*</span> are
                  required.
                </p>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={status === "submitting"}
                  aria-busy={status === "submitting"}
                  className="group w-full sm:w-auto"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2
                        className="h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                      <span>Sending Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <span>Prepare My Email</span>
                      <Send
                        className="h-4 w-4 text-brand-orange transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </>
                  )}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
