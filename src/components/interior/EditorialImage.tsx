"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

interface EditorialImageProps {
  src: string;
  alt: string;
  sizes: string;
  aspect?: "4/3" | "3/2" | "4/5" | "16/9" | "21/9" | "16/10";
  priority?: boolean;
  delay?: number;
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
  delay = 0.05,
  caption,
  tone = "light",
  className = "",
  imageClassName = "",
}: EditorialImageProps) {
  const prefersReduced = useReducedMotion();

  const frame = (
    <div
      className={`group relative overflow-hidden rounded-[var(--radius-media)] shadow-[var(--shadow-soft)] ${
        tone === "dark" ? "bg-white/10" : "bg-bg-cream-deep"
      } ${ASPECT_CLASSES[aspect]}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045] ${imageClassName}`}
      />
    </div>
  );

  return (
    <figure className={`m-0 ${className}`}>
      {prefersReduced ? (
        frame
      ) : (
        <motion.div
          initial={{
            opacity: 0,
            y: 22,
            clipPath: "inset(10% 0% 0% 0% round 1.25rem)",
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            clipPath: "inset(0% 0% 0% 0% round 1.25rem)",
          }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.72, delay, ease: REVEAL_EASE }}
        >
          {frame}
        </motion.div>
      )}
      {caption ? (
        <figcaption
          className={`mt-3 text-xs leading-relaxed sm:text-sm ${
            tone === "dark" ? "text-bg-cream/80" : "text-text-secondary"
          }`}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
