"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { LiquidReveal } from "@/components/ui/LiquidReveal";
import { useReplayInView, useViewportFlags } from "@/components/ui/MotionReveal";

const IMAGE_EASE = [0.16, 1, 0.3, 1] as const;

export type EditorialImageDirection =
  | "liquidBottom"
  | "fromLeft"
  | "fromRight"
  | "scaleMask";

interface EditorialImageProps {
  src: string;
  alt: string;
  sizes: string;
  aspect?: "4/3" | "3/2" | "4/5" | "16/9" | "21/9" | "16/10";
  priority?: boolean;
  delay?: number;
  direction?: EditorialImageDirection;
  replay?: boolean;
  caption?: string;
  tone?: "light" | "dark";
  className?: string;
  imageClassName?: string;
}

const ASPECT_CLASSES: Record<
  NonNullable<EditorialImageProps["aspect"]>,
  string
> = {
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "4/5": "aspect-[4/5]",
  "16/9": "aspect-video",
  "16/10": "aspect-[16/10]",
  "21/9": "aspect-[21/9]",
};

export function EditorialImage({
  src,
  alt,
  sizes,
  aspect = "4/3",
  priority = false,
  delay = 0.06,
  direction = "liquidBottom",
  replay = true,
  caption,
  tone = "light",
  className = "",
  imageClassName = "",
}: EditorialImageProps) {
  const effectiveReplay = replay && !priority;
  const frameRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useViewportFlags();
  const { isVisible, prefersReduced } = useReplayInView(
    frameRef,
    effectiveReplay,
    priority
  );

  const dx = isMobile ? 26 : 68;

  const img = (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      fetchPriority={priority ? "high" : undefined}
      quality={priority ? 100 : 90}
      sizes={sizes}
      className={`object-cover transition-transform duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.09] motion-reduce:transform-none ${imageClassName}`}
    />
  );

  const maskHidden = (() => {
    switch (direction) {
      case "fromLeft":
        return {
          opacity: 0,
          x: -dx,
          scale: 1.07,
          clipPath: "inset(0% 100% 0% 0%)",
        };
      case "fromRight":
        return {
          opacity: 0,
          x: dx,
          scale: 1.07,
          clipPath: "inset(0% 0% 0% 100%)",
        };
      case "scaleMask":
        return {
          opacity: 0,
          x: 0,
          scale: 1.09,
          clipPath: "inset(100% 0% 0% 0%)",
        };
      default:
        return { opacity: 1, x: 0, scale: 1, clipPath: "inset(0% 0% 0% 0%)" };
    }
  })();

  const maskVisible = {
    opacity: 1,
    x: 0,
    scale: 1,
    clipPath: "inset(0% 0% 0% 0%)",
  };

  return (
    <figure className={`m-0 ${className}`}>
      <div
        ref={frameRef}
        className={`group relative overflow-hidden rounded-[var(--radius-media)] border border-white/80 ${
          tone === "dark" ? "bg-white/10" : "bg-bg-cream-deep"
        } ${ASPECT_CLASSES[aspect]}`}
      >
        {direction === "liquidBottom" ? (
          <LiquidReveal
            delay={delay}
            duration={priority ? 0.78 : 0.95}
            replay={effectiveReplay}
            priority={priority}
          >
            {img}
          </LiquidReveal>
        ) : (
          <motion.div
            initial={maskHidden}
            animate={isVisible ? maskVisible : maskHidden}
            transition={
              prefersReduced
                ? { duration: 0 }
                : isVisible
                  ? { duration: priority ? 0.68 : 0.85, delay, ease: IMAGE_EASE }
                  : { duration: 0 }
            }
            className="relative h-full w-full will-change-transform motion-reduce:!transform-none motion-reduce:!opacity-100 motion-reduce:[clip-path:none!important]"
          >
            {img}
          </motion.div>
        )}

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-16deg] bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[120%] motion-reduce:hidden"
        />
      </div>

      {caption ? (
        <figcaption
          className={`mt-3 text-xs leading-relaxed sm:text-sm ${
            tone === "dark" ? "text-white/75" : "text-text-secondary"
          }`}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
