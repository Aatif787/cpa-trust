"use client";

import { useEffect, useState } from "react";

/**
 * SSR- and hydration-safe reduced-motion hook.
 * Always returns false during SSR and initial client hydration so server/client
 * markup and inline styles match identically, then syncs after mount.
 */
export function useSafeReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return prefersReduced;
}
