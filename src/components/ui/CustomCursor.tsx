"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!finePointer || reducedMotion) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let visible = false;
    let mode: "default" | "interactive" | "media" | "explore" = "default";
    let rafId = 0;

    const applyMode = (nextMode: typeof mode) => {
      if (mode === nextMode) return;
      mode = nextMode;
      ring.dataset.mode = nextMode;
      dot.dataset.mode = nextMode;
      if (visible) {
        dot.style.opacity =
          nextMode === "media" || nextMode === "explore" ? "0" : "1";
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!visible) {
        visible = true;
        ringX = mouseX;
        ringY = mouseY;
        ring.style.opacity = "1";
        dot.style.opacity =
          mode === "media" || mode === "explore" ? "0" : "1";
      }

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

      const target = e.target as HTMLElement | null;
      if (target) {
        if (target.closest("[data-cursor='explore']")) {
          applyMode("explore");
        } else if (target.closest("[data-cursor='media']")) {
          applyMode("media");
        } else if (
          target.closest(
            "a, button, [role='button'], summary, input, textarea, select, label"
          )
        ) {
          applyMode("interactive");
        } else {
          applyMode("default");
        }
      }
    };

    const onMouseLeave = () => {
      visible = false;
      ring.style.opacity = "0";
      dot.style.opacity = "0";
    };

    const render = () => {
      rafId = window.requestAnimationFrame(render);
      if (!visible) return;
      ringX += (mouseX - ringX) * 0.13;
      ringY += (mouseY - ringY) * 0.13;
      ring.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0) translate(-50%, -50%)`;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    rafId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        data-mode="default"
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-9 w-9 items-center justify-center rounded-full border-2 border-[#0d2140]/60 bg-white/25 opacity-0 backdrop-blur-[2px] transition-[width,height,border-color,background-color,opacity] duration-200 ease-out will-change-transform lg:flex [&[data-mode='interactive']]:h-13 [&[data-mode='interactive']]:w-13 [&[data-mode='interactive']]:border-[#184385] [&[data-mode='interactive']]:bg-[#edf4fd]/40 [&[data-mode='media']]:h-16 [&[data-mode='media']]:w-16 [&[data-mode='media']]:border-white [&[data-mode='media']]:bg-[#0d2140]/85 [&[data-mode='explore']]:h-18 [&[data-mode='explore']]:w-18 [&[data-mode='explore']]:border-[#8FAF83] [&[data-mode='explore']]:bg-[#344C3B]/92 motion-reduce:!hidden"
        style={{
          boxShadow: "0 0 0 1.5px rgba(255, 255, 255, 0.78)",
        }}
      >
        <span className="cursor-view-label hidden text-[10px] font-bold tracking-[0.18em] text-white [[data-mode='media']>&]:inline">
          VIEW
        </span>
        <span className="cursor-explore-label hidden text-[9.5px] font-bold tracking-[0.16em] text-[#F5F0E6] [[data-mode='explore']>&]:inline">
          EXPLORE
        </span>
      </div>
      <div
        ref={dotRef}
        aria-hidden="true"
        data-mode="default"
        className="pointer-events-none fixed left-0 top-0 z-[91] hidden h-2 w-2 rounded-full bg-[#184385] opacity-0 ring-2 ring-white/90 transition-[opacity,transform,background-color] duration-150 ease-out will-change-transform lg:block [&[data-mode='interactive']]:scale-125 [&[data-mode='interactive']]:bg-[#77a2e2] [&[data-mode='media']]:opacity-0 [&[data-mode='explore']]:opacity-0 motion-reduce:!hidden"
      />
    </>
  );
}
