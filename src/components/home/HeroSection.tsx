"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

const HERO_EASE = [0.22, 1, 0.36, 1] as const;

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  return (
    <section
      ref={sectionRef}
      aria-label="Introduction to Santosh Arora Trust"
      className="relative overflow-hidden bg-brand-forest text-text-inverse"
    >
      {/* Background documentary photograph with restrained reveal and parallax */}
      <motion.div
        aria-hidden="true"
        style={prefersReduced ? undefined : { y: parallaxY }}
        initial={prefersReduced ? false : { opacity: 0.72, scale: 1.045 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.95, ease: HERO_EASE }}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src="/images/home/hero.jpg"
          alt="Students and a mentor gathered closely around an open book in warm natural classroom light"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_38%] sm:object-[60%_35%]"
        />
      </motion.div>

      {/* Multi-tone cinematic overlay: Deep Forest Green + Lavender + subtle Warm Orange */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(52, 76, 59, 0.92) 0%, rgba(52, 76, 59, 0.76) 44%, rgba(52, 76, 59, 0.34) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(58% 65% at 88% 18%, rgba(185, 165, 210, 0.28) 0%, rgba(185, 165, 210, 0) 68%), radial-gradient(45% 50% at 68% 84%, rgba(241, 154, 85, 0.16) 0%, rgba(241, 154, 85, 0) 70%), linear-gradient(180deg, rgba(52, 76, 59, 0.15) 0%, rgba(52, 76, 59, 0.58) 100%)",
        }}
      />

      <Container size="wide" className="relative z-10">
        <div className="flex min-h-[33rem] flex-col justify-end py-14 sm:min-h-[39rem] sm:py-20 lg:min-h-[43rem] lg:justify-center lg:py-24 xl:min-h-[46rem]">
          <div className="max-w-2xl">
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: HERO_EASE }}
            >
              <span className="text-eyebrow inline-flex items-center gap-2.5 rounded-full bg-white/12 px-4 py-1.5 text-white ring-1 ring-white/25 backdrop-blur-sm">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-brand-orange"
                />
                Santosh Arora Trust
              </span>
            </motion.div>

            <motion.h1
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.18, ease: HERO_EASE }}
              className="text-display mt-6 text-white"
            >
              Building a Better Tomorrow, Together.
            </motion.h1>

            <motion.p
              initial={prefersReduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: HERO_EASE }}
              className="mt-5 max-w-xl text-base leading-relaxed text-bg-cream/95 sm:text-lg"
            >
              We want to help people live better lives through education,
              support for women, healthcare and community care.
            </motion.p>

            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.42, ease: HERO_EASE }}
              className="mt-8 flex flex-col gap-3 xs:flex-row xs:flex-wrap xs:items-center sm:gap-4"
            >
              <ButtonLink
                href="/about"
                variant="accent"
                size="lg"
                className="w-full xs:w-auto"
              >
                <span>About Us</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>

              <ButtonLink
                href="/focus-areas"
                variant="secondary"
                size="lg"
                className="w-full bg-white/14 text-white ring-white/35 backdrop-blur-sm hover:bg-white/22 hover:text-white hover:ring-white/55 xs:w-auto"
              >
                See What We Focus On
              </ButtonLink>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
