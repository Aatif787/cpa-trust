import { Mail, Phone } from "lucide-react";
import { SANTOSH_ARORA_TRUST } from "@/data/trust";

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone;
}

type ElegantContactDetailsProps = {
  tone?: "cream" | "forest";
  /** split = side-by-side on wide screens; stack = always one column (footer / narrow) */
  layout?: "split" | "stack";
  className?: string;
};

export function ElegantContactDetails({
  tone = "cream",
  layout = "split",
  className = "",
}: ElegantContactDetailsProps) {
  const { correspondenceEmail, correspondencePhone } =
    SANTOSH_ARORA_TRUST.registration;
  const isForest = tone === "forest";
  const isStack = layout === "stack";

  return (
    <div
      className={`grid gap-px overflow-hidden rounded-2xl ${
        isForest
          ? "bg-white/25 ring-1 ring-white/30"
          : "bg-[#77a2e2]/25 ring-1 ring-[#77a2e2]/35 shadow-[var(--shadow-soft)]"
      } ${isStack ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-[1.45fr_1fr]"} ${className}`}
    >
      <a
        href={`mailto:${correspondenceEmail}`}
        className={`group flex min-h-[48px] min-w-0 items-center gap-3 px-4 py-3.5 transition-colors ${
          isForest
            ? "bg-white/12 hover:bg-white/20"
            : "bg-[#f4f8fe] hover:bg-white"
        }`}
      >
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ring-1 ${
            isForest
              ? "bg-white/15 text-white ring-white/35"
              : "bg-white text-[#184385] ring-[#77a2e2]/35"
          }`}
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span
            className={`block text-[10px] font-semibold uppercase tracking-[0.18em] ${
              isForest ? "text-white/80" : "text-[#4b6a99]"
            }`}
          >
            Email
          </span>
          <span
            className={`mt-0.5 block break-all font-serif text-[0.875rem] font-semibold leading-snug transition-colors sm:text-[0.92rem] ${
              isForest
                ? "text-white group-hover:text-white/85"
                : "text-[#0d2140] group-hover:text-[#184385]"
            }`}
          >
            {correspondenceEmail}
          </span>
        </span>
      </a>

      <a
        href={`tel:+91${correspondencePhone}`}
        className={`group flex min-h-[48px] min-w-0 items-center gap-3 px-4 py-3.5 transition-colors ${
          isForest
            ? "bg-white/12 hover:bg-white/20"
            : "bg-[#f4f8fe] hover:bg-white"
        }`}
      >
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ring-1 ${
            isForest
              ? "bg-white/15 text-white ring-white/35"
              : "bg-white text-[#184385] ring-[#77a2e2]/35"
          }`}
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span
            className={`block text-[10px] font-semibold uppercase tracking-[0.18em] ${
              isForest ? "text-white/75" : "text-[#4b6a99]"
            }`}
          >
            Phone
          </span>
          <span
            className={`mt-0.5 block whitespace-nowrap font-serif text-[1.05rem] font-semibold tracking-wide transition-colors ${
              isForest
                ? "text-white group-hover:text-white/85"
                : "text-[#0d2140] group-hover:text-[#184385]"
            }`}
          >
            {formatPhone(correspondencePhone)}
          </span>
        </span>
      </a>
    </div>
  );
}
