/**
 * Shared contact enquiry types, validation rules, and plain-text mailto helpers.
 * Used identically by ContactEnquiryForm (client) and POST /api/contact (server).
 */

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

export interface NormalizedEnquiryPayload {
  fullName: string;
  email: string;
  organisation: string;
  category: EnquiryCategory;
  subject: string;
  message: string;
}

export type EnquiryFieldName = keyof EnquiryFormValues;
export type EnquiryFieldErrors = Partial<Record<EnquiryFieldName, string>>;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const INITIAL_ENQUIRY_VALUES: EnquiryFormValues = {
  fullName: "",
  email: "",
  organisation: "",
  category: "",
  subject: "",
  message: "",
};

export function isValidEnquiryCategory(
  value: string
): value is EnquiryCategory {
  return (ENQUIRY_CATEGORIES as readonly string[]).includes(value);
}

/**
 * Validates all enquiry fields using the established Trust contact rules.
 */
export function validateEnquiry(values: EnquiryFormValues): EnquiryFieldErrors {
  const errors: EnquiryFieldErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Please enter your full name.";
  } else if (values.fullName.trim().length < 2) {
    errors.fullName = "Full name should be at least 2 characters.";
  }

  if (!values.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email =
      "Please enter a valid email address (e.g. name@example.org).";
  }

  if (!values.category || !isValidEnquiryCategory(values.category)) {
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

/**
 * Safely coerces an arbitrary JSON request object into EnquiryFormValues.
 */
export function extractEnquirySubmission(raw: unknown): {
  values: EnquiryFormValues;
  honeypot: string;
} | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return null;
  }

  const record = raw as Record<string, unknown>;
  const readStr = (key: string): string =>
    typeof record[key] === "string" ? record[key] : "";

  return {
    values: {
      fullName: readStr("fullName"),
      email: readStr("email"),
      organisation: readStr("organisation"),
      category: readStr("category") as EnquiryFormValues["category"],
      subject: readStr("subject"),
      message: readStr("message"),
    },
    honeypot: readStr("contactTrap"),
  };
}

export function normalizeEnquiryValues(
  values: EnquiryFormValues
): NormalizedEnquiryPayload {
  const category = isValidEnquiryCategory(values.category)
    ? values.category
    : "General Enquiry";

  return {
    fullName: values.fullName.trim(),
    email: values.email.trim(),
    organisation: values.organisation.trim(),
    category,
    subject: values.subject.trim(),
    message: values.message.trim(),
  };
}

export function buildFormattedBody(values: EnquiryFormValues): string {
  return [
    `Name: ${values.fullName.trim()}`,
    values.organisation.trim()
      ? `Organisation: ${values.organisation.trim()}`
      : null,
    `Category: ${values.category || "General Enquiry"}`,
    `Reply Email: ${values.email.trim()}`,
    "",
    values.message.trim(),
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}

export function buildMailtoHref(
  values: EnquiryFormValues,
  recipient: string
): string {
  const subjectPrefix = values.category ? `[${values.category}] ` : "";
  const subject = encodeURIComponent(
    `${subjectPrefix}${values.subject.trim()}`
  );
  return `mailto:${recipient}?subject=${subject}&body=${encodeURIComponent(
    buildFormattedBody(values)
  )}`;
}
