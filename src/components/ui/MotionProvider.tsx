"use client";

import { useEffect, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import Lenis from "lenis";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

export function MotionProvider({ children }: { children: ReactNode }) {
  const prefersReduced = useSafeReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
      anchors: true,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };
    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [prefersReduced]);

  return (
    <MotionConfig reducedMotion={prefersReduced ? "always" : "never"}>
      {children}
    </MotionConfig>
  );
}
