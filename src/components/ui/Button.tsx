import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Magnetic } from "@/components/ui/MotionReveal";

export type ButtonVariant = "primary" | "accent" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] transition-all duration-250 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b488c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#77a2e2] disabled:pointer-events-none disabled:opacity-55 active:scale-[0.98] cursor-pointer select-none";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-[#184385] text-white shadow-[var(--shadow-soft)] hover:bg-[#113368] hover:shadow-[var(--shadow-elevated)] active:translate-y-px",
  accent:
    "bg-white text-[#0d2140] ring-1 ring-white/80 shadow-[var(--shadow-soft)] hover:bg-[#edf4fd] hover:shadow-[var(--shadow-elevated)] active:translate-y-px",
  secondary:
    "bg-white/90 text-[#0d2140] ring-1 ring-white/75 shadow-[var(--shadow-soft)] hover:bg-white active:translate-y-px",
  ghost:
    "bg-transparent text-[#0d2140] hover:bg-white/40 hover:text-[#0d2140]",
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
    <Magnetic>
      <button
        type={type}
        className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    </Magnetic>
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
    <Magnetic>
      <Link
        href={href}
        className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
        {...props}
      >
        {children}
      </Link>
    </Magnetic>
  );
}
