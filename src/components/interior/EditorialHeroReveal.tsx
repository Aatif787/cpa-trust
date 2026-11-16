"use client";

import { useRef, type ReactNode } from "react";
import { motion } from "motion/react";
import {
  useReplayInView,
  useViewportFlags,
  type RevealVariant,
} from "@/components/ui/MotionReveal";

const HERO_EASE = [0.16, 1, 0.3, 1] as const;

export function EditorialHeroReveal({
  children,
  delay = 0,
  yOffset,
  variant = "bottomMask",
  replay = false,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  yOffset?: number;
  variant?: Extract<RevealVariant, "bottomMask" | "fromLeft" | "fromRight" | "eyebrow" | "rise">;
  replay?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { isMobile } = useViewportFlags();
  // Start visible on mount so above-the-fold hero content never slices or stays dim on load
  const { isVisible, prefersReduced } = useReplayInView(ref, replay, true);

  const dx = isMobile ? 20 : 40;
  const dy = yOffset ?? (isMobile ? 16 : 24);
  const clampedDelay = Math.min(delay, 0.16);

  const hidden = (() => {
    switch (variant) {
      case "fromLeft":
        return { opacity: 0, x: -dx, y: 0 };
      case "fromRight":
        return { opacity: 0, x: dx, y: 0 };
      case "eyebrow":
        return { opacity: 0, x: -(isMobile ? 16 : 28), y: 0 };
      case "rise":
      case "bottomMask":
      default:
        return { opacity: 0, x: 0, y: dy };
    }
  })();

  const visible = { opacity: 1, x: 0, y: 0 };

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={hidden}
        animate={isVisible ? visible : hidden}
        transition={
          prefersReduced
            ? { duration: 0 }
            : isVisible
              ? { duration: 0.55, delay: clampedDelay, ease: HERO_EASE }
              : { duration: 0 }
        }
        className="will-change-transform motion-reduce:!transform-none motion-reduce:!opacity-100"
      >
        {children}
      </motion.div>
    </div>
  );
}
