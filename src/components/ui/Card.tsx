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
    "bg-bg-white border border-border-warm/80 surface-reflective",
  cream:
    "bg-bg-cream-soft border border-border-warm surface-reflective",
  glass:
    "surface-glass border border-white/70",
  sage:
    "bg-bg-sage-wash border border-brand-lime/35 surface-reflective",
  lavender:
    "bg-bg-lavender-wash border border-brand-lavender/45 surface-reflective",
  orange:
    "bg-bg-orange-wash border border-brand-orange/40 surface-reflective",
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
