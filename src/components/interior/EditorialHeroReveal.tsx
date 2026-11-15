"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

const HERO_EASE = [0.22, 1, 0.36, 1] as const;

export function EditorialHeroReveal({
  children,
  delay = 0,
  yOffset = 16,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  yOffset?: number;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.62, delay, ease: HERO_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
