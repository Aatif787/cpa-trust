import type { ReactNode } from "react";

export type EyebrowTone = "forest" | "lime" | "orange" | "lavender" | "neutral";

interface EyebrowProps {
  children: ReactNode;
  tone?: EyebrowTone;
  withDot?: boolean;
  className?: string;
}

const TONE_CLASSES: Record<EyebrowTone, string> = {
  forest: "bg-white/88 text-[#0d2140] ring-white/90 shadow-xs",
  lime: "bg-[#edf4fd] text-[#0d2140] ring-white/90",
  orange: "bg-white/90 text-[#184385] ring-[#77a2e2]/45",
  lavender: "bg-white/92 text-[#1b488c] ring-[#77a2e2]/40",
  neutral: "bg-[#edf4fd] text-[#24477d] ring-white/80",
};

const DOT_CLASSES: Record<EyebrowTone, string> = {
  forest: "bg-[#2457a6]",
  lime: "bg-[#77a2e2]",
  orange: "bg-[#184385]",
  lavender: "bg-[#4f81d1]",
  neutral: "bg-[#24477d]",
};

export function Eyebrow({
  children,
  tone = "forest",
  withDot = true,
  className = "",
}: EyebrowProps) {
  return (
    <span
      className={`text-eyebrow inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 ring-1 ${TONE_CLASSES[tone]} ${className}`}
    >
      {withDot ? (
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 rounded-full ${DOT_CLASSES[tone]}`}
        />
      ) : null}
      <span>{children}</span>
    </span>
  );
}
