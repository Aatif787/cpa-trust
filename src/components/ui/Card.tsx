import type { ReactNode } from "react";

export type CardVariant =
  | "white"
  | "cream"
  | "glass"
  | "sage"
  | "lavender"
  | "orange";

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  interactive?: boolean;
  padding?: "sm" | "md" | "lg";
  className?: string;
}

const VARIANT_CLASSES: Record<CardVariant, string> = {
  white:
    "bg-white/95 border border-white/80 surface-reflective",
  cream:
    "bg-[#edf4fd] border border-white/85 surface-reflective",
  glass:
    "surface-glass border border-white/80",
  sage:
    "bg-[#f4f8fe] border border-white/85 surface-reflective",
  lavender:
    "bg-[#eef4fd] border border-[#77a2e2]/35 surface-reflective",
  orange:
    "bg-[#e6effd] border border-[#77a2e2]/45 surface-reflective",
};

const PADDING_CLASSES: Record<NonNullable<CardProps["padding"]>, string> = {
  sm: "p-5",
  md: "p-6 sm:p-7",
  lg: "p-7 sm:p-9",
};

export function Card({
  children,
  variant = "white",
  interactive = false,
  padding = "md",
  className = "",
}: CardProps) {
  return (
    <article
      className={`rounded-[var(--radius-card)] ${VARIANT_CLASSES[variant]} ${PADDING_CLASSES[padding]} ${
        interactive
          ? "hover-lift hover:-translate-y-0.5 hover:border-brand-forest/35 hover:shadow-[var(--shadow-card-hover)]"
          : ""
      } ${className}`}
    >
      {children}
    </article>
  );
}

export function CardHeader({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`space-y-2 ${className}`}>{children}</div>;
}

export function CardTitle({
  children,
  as = "h3",
  className = "",
}: {
  children: ReactNode;
  as?: "h2" | "h3" | "h4";
  className?: string;
}) {
  const Tag = as;
  return (
    <Tag className={`text-heading-3 text-text-primary ${className}`}>
      {children}
    </Tag>
  );
}

export function CardDescription({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-sm leading-relaxed text-text-secondary ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mt-4 ${className}`}>{children}</div>;
}

export function CardFooter({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mt-6 border-t border-border-subtle pt-4 text-xs text-text-secondary ${className}`}
    >
      {children}
    </div>
  );
}
