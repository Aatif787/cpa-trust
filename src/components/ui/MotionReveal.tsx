"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

const EDITORIAL_EASE = [0.16, 1, 0.3, 1] as const;

export type RevealVariant =
  | "rise"
  | "bottomMask"
  | "fromLeft"
  | "fromRight"
  | "eyebrow"
  | "softScale"
  | "slideLeft"
  | "slideRight";

export type StaggerItemDirection = "rise" | "fromLeft" | "fromRight" | "softScale";

export function useViewportFlags() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return { isMobile };
}

/**
 * Shared hysteresis viewport controller.
 * - Triggers `visible` as soon as meaningful height enters the viewport.
 * - Resets to `hidden` ONLY after the entire element has completely left the viewport,
 *   preventing flicker or disappearing while still readable, and replaying on every revisit.
 */
export function useReplayInView(
  ref: React.RefObject<HTMLElement | null>,
  replay: boolean,
  initialVisible = false
) {
  const prefersReduced = useSafeReducedMotion();
  const [visible, setVisible] = useState(initialVisible);
  const visibleRef = useRef(initialVisible);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReduced) {
      visibleRef.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target !== el) continue;
          const vh = window.innerHeight || 900;
          const rect = entry.boundingClientRect;
          const visiblePx = Math.max(
            0,
            Math.min(rect.bottom, vh) - Math.max(rect.top, 0)
          );

          if (replay && !entry.isIntersecting && visiblePx === 0) {
            if (visibleRef.current) {
              visibleRef.current = false;
              setVisible(false);
            }
            return;
          }

          if (
            entry.isIntersecting &&
            (visiblePx >= 44 || entry.intersectionRatio >= 0.08)
          ) {
            if (!visibleRef.current) {
              visibleRef.current = true;
              setVisible(true);
            }
          }
        }
      },
      { threshold: [0, 0.05, 0.12] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, replay, prefersReduced]);

  return { isVisible: prefersReduced ? true : visible, prefersReduced };
}

interface MotionRevealProps {
  children: ReactNode;
  delay?: number;
  yOffset?: number;
  variant?: RevealVariant;
  replay?: boolean;
  className?: string;
}

export function MotionReveal({
  children,
  delay = 0,
  yOffset,
  variant = "rise",
  replay = true,
  className = "",
}: MotionRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useViewportFlags();
  const { isVisible, prefersReduced } = useReplayInView(containerRef, replay);

  const dx = isMobile ? 28 : 64;
  const dy = yOffset ?? (isMobile ? 22 : 44);
  const eyebrowDx = isMobile ? 24 : 56;

  const hiddenState = (() => {
    switch (variant) {
      case "fromLeft":
      case "slideRight":
        return { opacity: 0, x: -dx, y: 0, scale: 1 };
      case "fromRight":
      case "slideLeft":
        return { opacity: 0, x: dx, y: 0, scale: 1 };
      case "bottomMask":
        return {
          opacity: 0,
          x: 0,
          y: isMobile ? 24 : 46,
          scale: 1,
          clipPath: "inset(100% 0% 0% 0%)",
        };
      case "eyebrow":
        return {
          opacity: 0,
          x: -eyebrowDx,
          y: 0,
          scale: 1,
          clipPath: "inset(0% 100% 0% 0%)",
        };
      case "softScale":
        return { opacity: 0, x: 0, y: isMobile ? 18 : 36, scale: 0.93 };
      case "rise":
      default:
        return { opacity: 0, x: 0, y: dy, scale: 1 };
    }
  })();

  const visibleState =
    variant === "bottomMask" || variant === "eyebrow"
      ? { opacity: 1, x: 0, y: 0, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }
      : { opacity: 1, x: 0, y: 0, scale: 1 };

  return (
    <div ref={containerRef} className={className}>
      <motion.div
        initial={hiddenState}
        animate={isVisible ? visibleState : hiddenState}
        transition={
          prefersReduced
            ? { duration: 0 }
            : isVisible
              ? { duration: 0.8, delay, ease: EDITORIAL_EASE }
              : { duration: 0 }
        }
        className="will-change-transform motion-reduce:!transform-none motion-reduce:!opacity-100 motion-reduce:[clip-path:none!important]"
      >
        {children}
      </motion.div>
    </div>
  );
}

export function TextReveal({
  children,
  delay = 0,
  replay = true,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  replay?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { isVisible, prefersReduced } = useReplayInView(ref, replay);

  const hidden = { opacity: 0, y: "100%", clipPath: "inset(100% 0% 0% 0%)" };
  const visible = { opacity: 1, y: "0%", clipPath: "inset(0% 0% 0% 0%)" };

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={hidden}
        animate={isVisible ? visible : hidden}
        transition={
          prefersReduced
            ? { duration: 0 }
            : isVisible
              ? { duration: 0.85, delay, ease: EDITORIAL_EASE }
              : { duration: 0 }
        }
        className="will-change-transform motion-reduce:!transform-none motion-reduce:!opacity-100 motion-reduce:[clip-path:none!important]"
      >
        {children}
      </motion.div>
    </div>
  );
}

export function MotionStagger({
  children,
  className = "",
  staggerDelay = 0.09,
  replay = true,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  replay?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isVisible, prefersReduced } = useReplayInView(containerRef, replay);

  return (
    <motion.div
      ref={containerRef}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: prefersReduced ? 0 : staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MotionStaggerItem({
  children,
  direction = "rise",
  className = "",
}: {
  children: ReactNode;
  direction?: StaggerItemDirection;
  className?: string;
}) {
  const prefersReduced = useSafeReducedMotion();
  const { isMobile } = useViewportFlags();

  const dx = isMobile ? 24 : 52;
  const dy = isMobile ? 20 : 38;

  const hidden = (() => {
    switch (direction) {
      case "fromLeft":
        return { opacity: 0, x: -dx, y: 0, scale: 1, transition: { duration: 0 } };
      case "fromRight":
        return { opacity: 0, x: dx, y: 0, scale: 1, transition: { duration: 0 } };
      case "softScale":
        return { opacity: 0, x: 0, y: dy, scale: 0.94, transition: { duration: 0 } };
      case "rise":
      default:
        return { opacity: 0, x: 0, y: dy, scale: 0.98, transition: { duration: 0 } };
    }
  })();

  return (
    <motion.div
      variants={{
        hidden,
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          transition: prefersReduced
            ? { duration: 0 }
            : { duration: 0.72, ease: EDITORIAL_EASE },
        },
      }}
      className={`motion-reduce:!transform-none motion-reduce:!opacity-100 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function SectionDividerReveal({
  replay = true,
  className = "",
}: {
  replay?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { isVisible, prefersReduced } = useReplayInView(ref, replay);

  return (
    <div ref={ref} aria-hidden="true">
      <motion.div
        initial={{ scaleX: 0, opacity: 0.25 }}
        animate={isVisible ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0.25 }}
        transition={
          prefersReduced
            ? { duration: 0 }
            : isVisible
              ? { duration: 0.95, ease: EDITORIAL_EASE }
              : { duration: 0 }
        }
        style={{ transformOrigin: "0% 50%" }}
        className={`separator-editorial will-change-transform motion-reduce:!transform-none ${className}`}
      />
    </div>
  );
}

export function ParallaxMedia({
  children,
  offset = 26,
  className = "",
}: {
  children: ReactNode;
  offset?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { isMobile } = useViewportFlags();
  const effectiveOffset = isMobile ? Math.round(offset * 0.3) : offset;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [effectiveOffset, -effectiveOffset]
  );

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{ y }}
        className="will-change-transform motion-reduce:!transform-none"
      >
        {children}
      </motion.div>
    </div>
  );
}

export function Magnetic({
  children,
  strength = 0.38,
  maxOffset = 14,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  maxOffset?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 240, damping: 18, mass: 0.45 });
  const y = useSpring(rawY, { stiffness: 240, damping: 18, mass: 0.45 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!finePointer || reduced) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
      const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
      rawX.set(Math.max(-maxOffset, Math.min(maxOffset, dx)));
      rawY.set(Math.max(-maxOffset, Math.min(maxOffset, dy)));
    };

    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [rawX, rawY, strength, maxOffset]);

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={`inline-flex will-change-transform motion-reduce:!transform-none ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function ScrollProgressBar({ className = "" }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className={`pointer-events-none h-[2.5px] w-full bg-gradient-to-r from-[#b9a5d2] via-[#344c3b] to-[#8faf83] will-change-transform motion-reduce:hidden ${className}`}
    />
  );
}
