import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "accent" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] transition-all duration-250 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lavender-deep focus-visible:ring-offset-2 focus-visible:ring-offset-bg-cream disabled:pointer-events-none disabled:opacity-55 cursor-pointer select-none";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-forest text-text-inverse shadow-[var(--shadow-soft)] hover:bg-[#1a312c] hover:shadow-[var(--shadow-elevated)] active:translate-y-px",
  accent:
    "bg-brand-orange text-text-inverse shadow-[var(--shadow-soft)] hover:bg-[#6b2a27] hover:shadow-[var(--shadow-elevated)] active:translate-y-px",
  secondary:
    "bg-bg-white text-brand-forest ring-1 ring-border-forest shadow-[var(--shadow-soft)] hover:bg-bg-sage-wash hover:ring-brand-forest/45 active:translate-y-px",
  ghost:
    "bg-transparent text-brand-forest hover:bg-bg-sage-wash/80 hover:text-text-primary",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs sm:text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-7 text-sm sm:text-base",
};

interface SharedProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
}

export type ButtonProps = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export type ButtonLinkProps = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
  };

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
