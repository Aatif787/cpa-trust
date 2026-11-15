import type { ReactNode } from "react";
import { Eyebrow, type EyebrowTone } from "@/components/ui/Eyebrow";

interface SectionHeadingProps {
  title: string;
  eyebrow?: string;
  eyebrowTone?: EyebrowTone;
  lead?: ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: "display" | "h1" | "h2" | "h3";
  align?: "left" | "center";
  inverse?: boolean;
  className?: string;
}

const HEADING_SIZE_CLASSES: Record<NonNullable<SectionHeadingProps["size"]>, string> = {
  display: "text-display",
  h1: "text-heading-1",
  h2: "text-heading-2",
  h3: "text-heading-3",
};

export function SectionHeading({
  title,
  eyebrow,
  eyebrowTone = "forest",
  lead,
  as = "h2",
  size = "h2",
  align = "left",
  inverse = false,
  className = "",
}: SectionHeadingProps) {
  const HeadingTag = as;
  const alignClasses = align === "center" ? "mx-auto text-center items-center" : "items-start";

  return (
    <div className={`flex max-w-3xl flex-col ${alignClasses} ${className}`}>
      {eyebrow ? (
        <Eyebrow
          tone={eyebrowTone}
          className={
            inverse
              ? "bg-white/12 text-white ring-white/25"
              : undefined
          }
        >
          {eyebrow}
        </Eyebrow>
      ) : null}

      <HeadingTag
        className={`${HEADING_SIZE_CLASSES[size]} ${eyebrow ? "mt-4" : ""} ${
          inverse ? "text-text-inverse" : "text-text-primary"
        }`}
      >
        {title}
      </HeadingTag>

      {lead ? (
        <div
          className={`text-lead mt-4 max-w-2xl ${
            inverse ? "text-white/80" : "text-text-secondary"
          }`}
        >
          {lead}
        </div>
      ) : null}
    </div>
  );
}
