import type { ReactNode } from "react";

export type EyebrowTone = "forest" | "lime" | "orange" | "lavender" | "neutral";

interface EyebrowProps {
  children: ReactNode;
  tone?: EyebrowTone;
  withDot?: boolean;
  className?: string;
}

const TONE_CLASSES: Record<EyebrowTone, string> = {
  forest: "bg-brand-forest/10 text-brand-forest ring-brand-forest/20",
  lime: "bg-bg-sage-wash text-brand-forest ring-brand-lime/45",
  orange: "bg-bg-orange-wash text-text-primary ring-brand-orange/45",
  lavender: "bg-bg-lavender-wash text-brand-lavender-deep ring-brand-lavender/45",
  neutral: "bg-bg-cream text-text-subtle ring-border-warm",
};

const DOT_CLASSES: Record<EyebrowTone, string> = {
  forest: "bg-brand-forest",
  lime: "bg-brand-lime",
  orange: "bg-brand-orange",
  lavender: "bg-brand-lavender-deep",
  neutral: "bg-text-secondary",
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
