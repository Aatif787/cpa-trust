"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  Info,
  Loader2,
  Mail,
  RefreshCw,
  Send,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import {
  MotionReveal,
  MotionStagger,
  MotionStaggerItem,
} from "@/components/ui/MotionReveal";
import { SANTOSH_ARORA_TRUST } from "@/data/trust";
import {
  ENQUIRY_CATEGORIES,
  INITIAL_ENQUIRY_VALUES,
  buildFormattedBody,
  buildMailtoHref,
  validateEnquiry,
  type EnquiryCategory,
  type EnquiryFieldErrors,
  type EnquiryFieldName,
  type EnquiryFormValues,
} from "@/lib/contact-validation";

export { ENQUIRY_CATEGORIES, type EnquiryCategory, type EnquiryFormValues };

type FormStatus = "idle" | "submitting" | "sent" | "error";

interface ContactApiResponse {
  ok?: boolean;
  message?: string;
  error?: string;
  acknowledgementSent?: boolean;
  fieldErrors?: EnquiryFieldErrors;
}

const STATE_EASE = [0.22, 1, 0.36, 1] as const;

export function ContactEnquiryForm() {
  const prefersReduced = useSafeReducedMotion();
  const { correspondenceEmail } = SANTOSH_ARORA_TRUST.registration;

  const [values, setValues] = useState<EnquiryFormValues>(
    INITIAL_ENQUIRY_VALUES
  );
  const [contactTrap, setContactTrap] = useState("");
  const [errors, setErrors] = useState<EnquiryFieldErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<EnquiryFieldName, boolean>>
  >({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [acknowledgementSent, setAcknowledgementSent] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const isSubmitting = status === "submitting";

  const inputBaseClass =
    "mt-2 block w-full rounded-xl border bg-[#f4f8fe] px-4 py-3 text-sm text-[#0d2140] placeholder:text-[#4b6a99]/80 transition-all duration-200 focus:bg-white focus:outline-none focus:ring-4 sm:text-[15px]";

  function getFieldClasses(hasError: boolean): string {
    if (hasError) {
      return `${inputBaseClass} border-[#184385] focus:border-[#184385] focus:ring-[#77a2e2]/30`;
    }
    return `${inputBaseClass} border-[#b9cff0] hover:border-[#77a2e2] focus:border-[#184385] focus:ring-[#77a2e2]/25`;
  }

  function handleChange<K extends EnquiryFieldName>(
    field: K,
    nextValue: EnquiryFormValues[K]
  ) {
    const updated = { ...values, [field]: nextValue };
    setValues(updated);

    if (status === "error") {
      setStatus("idle");
      setSubmitError(null);
    }

    if (touched[field] || errors[field]) {
      const nextErrors = validateEnquiry(updated);
      setErrors((prev) => ({ ...prev, [field]: nextErrors[field] }));
    }
  }

  function handleBlur(field: EnquiryFieldName) {
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

  async function handleCopyMessage() {
    try {
      const fullDraft = `To: ${correspondenceEmail}\nSubject: [${values.category || "General Enquiry"}] ${values.subject.trim()}\n\n${buildFormattedBody(values)}`;
      await navigator.clipboard.writeText(fullDraft);
      setCopiedMessage(true);
      window.setTimeout(() => setCopiedMessage(false), 2500);
    } catch {
      setCopiedMessage(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

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

    const orderedFields: readonly EnquiryFieldName[] = [
      "fullName",
      "email",
      "category",
      "subject",
      "message",
    ];
    const firstInvalidField = orderedFields.find((field) =>
      Boolean(validationErrors[field])
    );

    if (firstInvalidField) {
      const el = formRef.current?.querySelector<HTMLElement>(
        `[name="${firstInvalidField}"]`
      );
      el?.focus();
      return;
    }

    setStatus("submitting");
    setSubmitError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          contactTrap,
        }),
      });

      let payload: ContactApiResponse | null = null;
      try {
        payload = (await response.json()) as ContactApiResponse;
      } catch {
        payload = null;
      }

      if (response.ok && payload?.ok === true) {
        setAcknowledgementSent(Boolean(payload.acknowledgementSent));
        setStatus("sent");
        return;
      }

      if (payload?.fieldErrors) {
        setErrors(payload.fieldErrors);
        const firstServerField = orderedFields.find((field) =>
          Boolean(payload?.fieldErrors?.[field])
        );
        if (firstServerField) {
          formRef.current
            ?.querySelector<HTMLElement>(`[name="${firstServerField}"]`)
            ?.focus();
        }
      }

      setStatus("error");
      setSubmitError(
        payload?.error ||
          "We could not send your message right now. Please try again or use your email app below."
      );
    } catch {
      setStatus("error");
      setSubmitError(
        "Unable to reach the server right now. Please check your connection or use your email app below."
      );
    }
  }

  function handleReset() {
    setValues(INITIAL_ENQUIRY_VALUES);
    setContactTrap("");
    setErrors({});
    setTouched({});
    setStatus("idle");
    setSubmitError(null);
    setAcknowledgementSent(false);
    setCopiedEmail(false);
    setCopiedMessage(false);
  }

  return (
    <div
      id="enquiry-form"
      className="scroll-mt-28 rounded-[var(--radius-panel)] border border-border-warm bg-bg-white p-6 shadow-[var(--shadow-elevated)] sm:p-8 lg:p-10"
    >
      <MotionReveal variant="fromLeft">
        <div className="border-b border-border-subtle pb-6">
          <Eyebrow tone="lime">Message Form</Eyebrow>
          <h2 className="text-heading-2 mt-4 text-text-primary">
            Send Us a Message
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
            Write to us with questions about the trust, our goals, or working
            together.
          </p>

          {/* Direct Correspondence & Delivery Notice */}
          <div
            role="note"
            className="mt-5 flex items-start gap-3 rounded-xl border border-brand-lavender/45 bg-bg-lavender-wash/75 p-4"
          >
            <Info
              className="mt-0.5 h-4 w-4 shrink-0 text-brand-lavender-deep"
              aria-hidden="true"
            />
            <p className="text-xs leading-relaxed text-text-primary sm:text-[13px]">
              <strong>Direct correspondence:</strong> When you submit this form,
              your enquiry is delivered securely to Santosh Arora Trust. You can
              also write directly to{" "}
              <a
                href={`mailto:${correspondenceEmail}`}
                className="font-semibold text-brand-forest underline decoration-brand-lime underline-offset-4 hover:text-text-primary"
              >
                {correspondenceEmail}
              </a>
              .
            </p>
          </div>
        </div>
      </MotionReveal>

      <div className="mt-6">
        <AnimatePresence mode="wait">
          {status === "sent" ? (
            <motion.div
              key="sent-state"
              role="status"
              aria-live="polite"
              initial={prefersReduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: STATE_EASE }}
              className="rounded-[var(--radius-card)] border border-[#77a2e2]/45 bg-[#edf4fd] p-6 sm:p-8"
            >
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#184385] text-white shadow-[var(--shadow-soft)]">
                  <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <Eyebrow tone="forest">Enquiry Sent</Eyebrow>
                  <h3 className="text-heading-2 mt-3 text-[#0d2140]">
                    Thank you, {values.fullName.trim()}.
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#1a3560] sm:text-base">
                    {acknowledgementSent ? (
                      <>
                        Your message has been delivered to Santosh Arora Trust,
                        and a confirmation email has been sent to{" "}
                        <strong>{values.email.trim()}</strong>.
                      </>
                    ) : (
                      <>
                        Your message has been delivered to Santosh Arora Trust.
                        We could not send an automatic confirmation copy to{" "}
                        <strong>{values.email.trim()}</strong>, though your
                        enquiry was received.
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[#77a2e2]/30 pt-5">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleReset}
                >
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Send Another Message</span>
                </Button>
              </div>
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
              {/* Hidden spam trap field (kept out of visual flow & accessibility tree) */}
              <div
                aria-hidden="true"
                className="pointer-events-none fixed -left-[9999px] top-auto h-px w-px overflow-hidden opacity-0"
              >
                <label htmlFor="contact-trap">Leave this field empty</label>
                <input
                  id="contact-trap"
                  name="contactTrap"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={contactTrap}
                  onChange={(e) => setContactTrap(e.target.value)}
                />
              </div>

              <MotionStagger staggerDelay={0.07} className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Full Name */}
                  <MotionStaggerItem direction="fromLeft">
                    <div>
                      <label
                        htmlFor="contact-full-name"
                        className="block text-xs font-semibold uppercase tracking-[0.12em] text-text-primary"
                      >
                        Full Name{" "}
                        <span aria-hidden="true" className="text-[#184385]">
                          *
                        </span>
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
                          errors.fullName
                            ? "contact-full-name-error"
                            : undefined
                        }
                        value={values.fullName}
                        onChange={(e) =>
                          handleChange("fullName", e.target.value)
                        }
                        onBlur={() => handleBlur("fullName")}
                        placeholder="e.g. Ananya Sharma"
                        className={getFieldClasses(Boolean(errors.fullName))}
                      />
                      {errors.fullName ? (
                        <p
                          id="contact-full-name-error"
                          className="mt-1.5 text-xs font-medium text-[#184385]"
                        >
                          {errors.fullName}
                        </p>
                      ) : null}
                    </div>
                  </MotionStaggerItem>

                  {/* Email Address */}
                  <MotionStaggerItem direction="fromLeft">
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-semibold uppercase tracking-[0.12em] text-text-primary"
                      >
                        Email Address{" "}
                        <span aria-hidden="true" className="text-[#184385]">
                          *
                        </span>
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
                          className="mt-1.5 text-xs font-medium text-[#184385]"
                        >
                          {errors.email}
                        </p>
                      ) : null}
                    </div>
                  </MotionStaggerItem>

                  {/* Organisation (optional) */}
                  <MotionStaggerItem direction="fromLeft">
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
                        onChange={(e) =>
                          handleChange("organisation", e.target.value)
                        }
                        onBlur={() => handleBlur("organisation")}
                        placeholder="Institution, NGO, or community group"
                        className={getFieldClasses(false)}
                      />
                    </div>
                  </MotionStaggerItem>

                  {/* Enquiry Category */}
                  <MotionStaggerItem direction="fromLeft">
                    <div>
                      <label
                        htmlFor="contact-category"
                        className="block text-xs font-semibold uppercase tracking-[0.12em] text-text-primary"
                      >
                        Topic{" "}
                        <span aria-hidden="true" className="text-[#184385]">
                          *
                        </span>
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
                        <option value="" className="bg-white text-[#0d2140]">
                          Select a topic...
                        </option>
                        {ENQUIRY_CATEGORIES.map((category) => (
                          <option
                            key={category}
                            value={category}
                            className="bg-white text-[#0d2140]"
                          >
                            {category}
                          </option>
                        ))}
                      </select>
                      {errors.category ? (
                        <p
                          id="contact-category-error"
                          className="mt-1.5 text-xs font-medium text-[#184385]"
                        >
                          {errors.category}
                        </p>
                      ) : null}
                    </div>
                  </MotionStaggerItem>
                </div>

                {/* Subject */}
                <MotionStaggerItem direction="fromLeft">
                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block text-xs font-semibold uppercase tracking-[0.12em] text-text-primary"
                    >
                      Subject{" "}
                      <span aria-hidden="true" className="text-[#184385]">
                        *
                      </span>
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
                        className="mt-1.5 text-xs font-medium text-[#184385]"
                      >
                        {errors.subject}
                      </p>
                    ) : null}
                  </div>
                </MotionStaggerItem>

                {/* Message */}
                <MotionStaggerItem direction="fromLeft">
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <label
                        htmlFor="contact-message"
                        className="block text-xs font-semibold uppercase tracking-[0.12em] text-text-primary"
                      >
                        Message{" "}
                        <span aria-hidden="true" className="text-[#184385]">
                          *
                        </span>
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
                        className="mt-1.5 text-xs font-medium text-[#184385]"
                      >
                        {errors.message}
                      </p>
                    ) : null}
                  </div>
                </MotionStaggerItem>

                {/* Delivery Error State + Preserved Mailto Fallback */}
                {status === "error" && submitError ? (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="rounded-[var(--radius-card)] border border-[#184385]/35 bg-[#edf4fd] p-5"
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle
                        className="mt-0.5 h-5 w-5 shrink-0 text-[#184385]"
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#0d2140]">
                          Message could not be sent automatically
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-[#1a3560] sm:text-sm">
                          {submitError}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-2.5">
                          <a
                            href={buildMailtoHref(values, correspondenceEmail)}
                            className="inline-flex h-10 items-center gap-2 rounded-full bg-[#184385] px-4 text-xs font-semibold text-white shadow-[var(--shadow-soft)] transition-colors hover:bg-[#113368] sm:text-sm"
                          >
                            <Mail className="h-4 w-4" aria-hidden="true" />
                            <span>Open Email App</span>
                          </a>

                          <button
                            type="button"
                            onClick={handleCopyMessage}
                            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-white px-4 text-xs font-medium text-[#0d2140] ring-1 ring-[#77a2e2]/50 transition-colors hover:bg-[#f4f8fe] sm:text-sm"
                          >
                            {copiedMessage ? (
                              <>
                                <Check
                                  className="h-4 w-4 text-[#184385]"
                                  aria-hidden="true"
                                />
                                <span>Copied Full Draft</span>
                              </>
                            ) : (
                              <>
                                <Copy
                                  className="h-4 w-4 text-[#184385]"
                                  aria-hidden="true"
                                />
                                <span>Copy Full Draft</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={handleCopyEmail}
                            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-white px-4 text-xs font-medium text-[#0d2140] ring-1 ring-[#77a2e2]/50 transition-colors hover:bg-[#f4f8fe] sm:text-sm"
                          >
                            {copiedEmail ? (
                              <>
                                <Check
                                  className="h-4 w-4 text-[#184385]"
                                  aria-hidden="true"
                                />
                                <span>Copied Address</span>
                              </>
                            ) : (
                              <>
                                <Copy
                                  className="h-4 w-4 text-[#184385]"
                                  aria-hidden="true"
                                />
                                <span>Copy {correspondenceEmail}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Actions Row */}
                <MotionStaggerItem direction="rise">
                  <div className="flex flex-col items-start justify-between gap-4 border-t border-border-subtle pt-5 sm:flex-row sm:items-center">
                    <p className="text-xs leading-relaxed text-text-subtle">
                      Fields marked <span className="text-[#184385]">*</span> are
                      required.
                    </p>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isSubmitting}
                      aria-busy={isSubmitting}
                      className="group w-full sm:w-auto"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2
                            className="h-4 w-4 animate-spin text-white"
                            aria-hidden="true"
                          />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send
                            className="h-4 w-4 text-white transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </Button>
                  </div>
                </MotionStaggerItem>
              </MotionStagger>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
