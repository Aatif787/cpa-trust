import type { ReactNode } from "react";
import { Container, type ContainerSize } from "@/components/ui/Container";

export type SectionSurface =
  | "white"
  | "cream"
  | "luminous"
  | "sage"
  | "lavender"
  | "forest";

export type SectionSpacing = "none" | "sm" | "md" | "lg";

interface SectionProps {
  children: ReactNode;
  id?: string;
  surface?: SectionSurface;
  spacing?: SectionSpacing;
  containerSize?: ContainerSize;
  contained?: boolean;
  separatorTop?: boolean;
  separatorBottom?: boolean;
  className?: string;
  ariaLabel?: string;
}

const SURFACE_CLASSES: Record<SectionSurface, string> = {
  white: "bg-bg-white text-text-primary",
  cream: "bg-bg-cream text-text-primary",
  luminous: "surface-luminous text-text-primary",
  sage: "bg-bg-sage-wash text-text-primary",
  lavender: "bg-bg-lavender-wash text-text-primary",
  forest: "bg-brand-forest text-text-inverse",
};

const SPACING_CLASSES: Record<SectionSpacing, string> = {
  none: "",
  sm: "py-10 sm:py-14 lg:py-16",
  md: "py-14 sm:py-20 lg:py-24",
  lg: "py-20 sm:py-28 lg:py-32",
};

export function Section({
  children,
  id,
  surface = "cream",
  spacing = "md",
  containerSize = "standard",
  contained = true,
  separatorTop = false,
  separatorBottom = false,
  className = "",
  ariaLabel,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={`relative ${SURFACE_CLASSES[surface]} ${SPACING_CLASSES[spacing]} ${className}`}
    >
      {separatorTop ? (
        <div aria-hidden="true" className="separator-editorial absolute inset-x-0 top-0" />
      ) : null}

      {contained ? <Container size={containerSize}>{children}</Container> : children}

      {separatorBottom ? (
        <div aria-hidden="true" className="separator-editorial absolute inset-x-0 bottom-0" />
      ) : null}
    </section>
  );
}
