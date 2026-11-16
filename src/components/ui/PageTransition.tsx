"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

const PAGE_EASE = [0.16, 1, 0.3, 1] as const;

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const prefersReduced = useSafeReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial={
        prefersReduced
          ? false
          : {
              opacity: 0.04,
              x: 16,
              y: 16,
              clipPath: "inset(2% 0% 0% 0%)",
            }
      }
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
        clipPath: "inset(0% 0% 0% 0%)",
      }}
      transition={
        prefersReduced
          ? { duration: 0 }
          : { duration: 0.45, ease: PAGE_EASE }
      }
      className="motion-reduce:!transform-none motion-reduce:[clip-path:none!important]"
    >
      {children}
    </motion.div>
  );
}
