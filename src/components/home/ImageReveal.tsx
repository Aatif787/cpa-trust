"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

interface ImageRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function ImageReveal({
  children,
  delay = 0.05,
  className = "",
}: ImageRevealProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, clipPath: "inset(8% 0% 0% 0% round 1.25rem)" }}
      whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0% round 1.25rem)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.72, delay, ease: REVEAL_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
