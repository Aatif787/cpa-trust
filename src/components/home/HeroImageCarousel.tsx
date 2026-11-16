"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

export type HeroSlide = {
  src: string;
  alt: string;
  label: string;
  objectPosition?: string;
};

const INTERVAL_MS = 5200;

interface HeroImageCarouselProps {
  slides: readonly HeroSlide[];
  sizes: string;
  className?: string;
}

export function HeroImageCarousel({
  slides,
  sizes,
  className = "",
}: HeroImageCarouselProps) {
  const prefersReduced = useSafeReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const active = slides[index] ?? slides[0];

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (prefersReduced || paused || count < 2) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [count, paused, prefersReduced]);

  if (!active) return null;

  const marqueeSlides = [...slides, ...slides];

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div
        aria-roledescription="carousel"
        aria-label="Scenes from the causes we care about"
        className="group relative aspect-[4/3] overflow-hidden rounded-[var(--radius-media)] bg-bg-cream-deep shadow-[var(--shadow-soft)]"
      >
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={active.src}
            className="absolute inset-0"
            initial={prefersReduced ? false : { opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReduced ? undefined : { opacity: 0 }}
            transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={active.src}
              alt={active.alt}
              fill
              priority={index === 0}
              sizes={sizes}
              className="object-cover"
              style={{ objectPosition: active.objectPosition ?? "50% 40%" }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-brand-forest/35 via-transparent to-transparent"
            />
          </motion.div>
        </AnimatePresence>

        {!prefersReduced && count > 1 ? (
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 z-10 h-[2px] overflow-hidden bg-white/15"
          >
            <motion.div
              key={`${index}-${paused ? "paused" : "play"}`}
              className="h-full origin-left bg-brand-tomato-soft"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: paused ? 0 : 1 }}
              transition={
                paused
                  ? { duration: 0.2 }
                  : { duration: INTERVAL_MS / 1000, ease: "linear" }
              }
            />
          </div>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 z-10 space-y-3 p-4 sm:p-5">
          <div className="flex items-end justify-between gap-4">
            <p className="max-w-[14rem] font-serif text-lg font-semibold leading-snug text-bg-cream drop-shadow-sm sm:text-xl">
              {active.label}
            </p>

            {count > 1 ? (
              <div className="flex items-center gap-1.5 rounded-full bg-brand-forest/55 px-2.5 py-1.5 backdrop-blur-sm">
                {slides.map((slide, slideIndex) => {
                  const selected = slideIndex === index;
                  return (
                    <button
                      key={slide.src}
                      type="button"
                      aria-label={`Show ${slide.label}`}
                      aria-current={selected ? "true" : undefined}
                      onClick={() => goTo(slideIndex)}
                      className={`h-1.5 rounded-full transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-tomato-soft ${
                        selected
                          ? "w-6 bg-brand-tomato-soft"
                          : "w-1.5 bg-bg-cream/55 hover:bg-bg-cream/85"
                      }`}
                    />
                  );
                })}
              </div>
            ) : null}
          </div>

          {count > 1 ? (
            <div className="overflow-hidden rounded-xl bg-bg-cream/15 py-1.5 ring-1 ring-white/20 backdrop-blur-md">
              <motion.div
                className="flex w-max gap-2 px-2"
                animate={
                  prefersReduced || paused ? { x: 0 } : { x: ["0%", "-50%"] }
                }
                transition={
                  prefersReduced || paused
                    ? { duration: 0.3 }
                    : { duration: 28, ease: "linear", repeat: Infinity }
                }
              >
                {marqueeSlides.map((slide, slideIndex) => (
                  <button
                    key={`${slide.src}-${slideIndex}`}
                    type="button"
                    tabIndex={slideIndex >= count ? -1 : 0}
                    aria-label={
                      slideIndex >= count ? undefined : `Show ${slide.label}`
                    }
                    aria-hidden={slideIndex >= count ? true : undefined}
                    onClick={() => goTo(slideIndex % count)}
                    className={`relative h-11 w-16 shrink-0 overflow-hidden rounded-lg ring-1 transition-all duration-300 ${
                      slideIndex % count === index
                        ? "ring-brand-tomato-soft ring-offset-1 ring-offset-brand-forest/40"
                        : "ring-white/25 hover:ring-white/60"
                    }`}
                  >
                    <Image
                      src={slide.src}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </motion.div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
