import type { ReactNode } from "react";

export type ContainerSize = "reading" | "standard" | "wide";

interface ContainerProps {
  children: ReactNode;
  size?: ContainerSize;
  className?: string;
}

const SIZE_CLASSES: Record<ContainerSize, string> = {
  reading: "max-w-[var(--container-reading)]",
  standard: "max-w-[var(--container-standard)]",
  wide: "max-w-[var(--container-wide)]",
};

export function Container({
  children,
  size = "standard",
  className = "",
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full px-4 xs:px-5 sm:px-8 lg:px-10 2xl:px-12 ${SIZE_CLASSES[size]} ${className}`}
    >
      {children}
    </div>
  );
}
