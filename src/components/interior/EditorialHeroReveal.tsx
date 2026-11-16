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
  replay = true,
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
  // Start visible on mount so hero animates immediately, then replays on full exit & re-entry
  const { isVisible, prefersReduced } = useReplayInView(ref, replay, true);

  const dx = isMobile ? 26 : 64;
  const dy = yOffset ?? (isMobile ? 22 : 44);

  const hidden = (() => {
    switch (variant) {
      case "fromLeft":
        return { opacity: 0, x: -dx, y: 0 };
      case "fromRight":
        return { opacity: 0, x: dx, y: 0 };
      case "eyebrow":
        return {
          opacity: 0,
          x: -(isMobile ? 22 : 52),
          y: 0,
          clipPath: "inset(0% 100% 0% 0%)",
        };
      case "rise":
        return { opacity: 0, x: 0, y: dy };
      case "bottomMask":
      default:
        return {
          opacity: 0,
          x: 0,
          y: dy,
          clipPath: "inset(100% 0% 0% 0%)",
        };
    }
  })();

  const visible =
    variant === "bottomMask" || variant === "eyebrow"
      ? { opacity: 1, x: 0, y: 0, clipPath: "inset(0% 0% 0% 0%)" }
      : { opacity: 1, x: 0, y: 0 };

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={hidden}
        animate={isVisible ? visible : hidden}
        transition={
          prefersReduced
            ? { duration: 0 }
            : isVisible
              ? { duration: 0.78, delay, ease: HERO_EASE }
              : { duration: 0 }
        }
        className="will-change-transform motion-reduce:!transform-none motion-reduce:!opacity-100 motion-reduce:[clip-path:none!important]"
      >
        {children}
      </motion.div>
    </div>
  );
}
