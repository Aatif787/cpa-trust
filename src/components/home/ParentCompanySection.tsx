"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Magnetic } from "@/components/ui/MotionReveal";

const PARENT_COMPANY_URL = "https://cparora.vercel.app/";
const CINEMATIC_EASE = [0.16, 1, 0.3, 1] as const;

type Phase = "hidden" | "visible";

export function ParentCompanySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const phaseRef = useRef<Phase>("hidden");
  const [phase, setPhase] = useState<Phase>("hidden");
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  // Subtle pointer-driven ambient + layer parallax (desktop fine-pointer only)
  const rawPointerX = useMotionValue(0);
  const rawPointerY = useMotionValue(0);
  const pointerX = useSpring(rawPointerX, { stiffness: 120, damping: 24, mass: 0.6 });
  const pointerY = useSpring(rawPointerY, { stiffness: 120, damping: 24, mass: 0.6 });

  useEffect(() => {
    const mobileMq = window.matchMedia("(max-width: 767px)");
    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateEnv = () => {
      setIsMobile(mobileMq.matches);
      setPrefersReduced(reducedMq.matches);
      if (reducedMq.matches) {
        phaseRef.current = "visible";
        setPhase("visible");
      }
    };

    updateEnv();
    mobileMq.addEventListener("change", updateEnv);
    reducedMq.addEventListener("change", updateEnv);

    const el = sectionRef.current;
    if (!el || reducedMq.matches) {
      return () => {
        mobileMq.removeEventListener("change", updateEnv);
        reducedMq.removeEventListener("change", updateEnv);
      };
    }

    // Shared parent viewport controller: triggers full choreographed entrance
    // on every entry and resets only after the entire section leaves the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target !== el) continue;
          const vh = window.innerHeight || 900;
          const rect = entry.boundingClientRect;
          const visiblePx = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));

          if (!entry.isIntersecting && visiblePx === 0) {
            if (phaseRef.current !== "hidden") {
              phaseRef.current = "hidden";
              setPhase("hidden");
            }
            return;
          }

          if (
            entry.isIntersecting &&
            (visiblePx >= 85 || entry.intersectionRatio >= 0.12)
          ) {
            if (phaseRef.current !== "visible") {
              phaseRef.current = "visible";
              setPhase("visible");
            }
          }
        }
      },
      { threshold: [0, 0.05, 0.12, 0.25] }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      mobileMq.removeEventListener("change", updateEnv);
      reducedMq.removeEventListener("change", updateEnv);
    };
  }, []);

  const handleVisualPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReduced || isMobile || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    rawPointerX.set(nx * 14);
    rawPointerY.set(ny * 10);
  };

  const handleVisualPointerLeave = () => {
    rawPointerX.set(0);
    rawPointerY.set(0);
  };

  const activePhase: Phase = prefersReduced ? "visible" : phase;
  const resetTransition = { duration: 0 };

  // Step 1: Decorative layered lavender + lime backdrop panel (500–700ms)
  const backdropVariants = {
    hidden: { opacity: 0, scale: 0.93, x: isMobile ? 0 : 28, transition: resetTransition },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: prefersReduced
        ? { duration: 0 }
        : { duration: 0.62, delay: 0, ease: CINEMATIC_EASE },
    },
  };

  // Step 2: Main infrastructure photo enters from right, starts scaled up, bottom-to-top mask (1100–1400ms)
  const mainImageVariants = {
    hidden: {
      opacity: 0,
      x: isMobile ? 34 : 92,
      scale: 1.09,
      clipPath: "inset(100% 0% 0% 0% round 1.75rem)",
      transition: resetTransition,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      clipPath: "inset(0% 0% 0% 0% round 1.75rem)",
      transition: prefersReduced
        ? { duration: 0 }
        : { duration: 1.25, delay: 0.1, ease: CINEMATIC_EASE },
    },
  };

  // Step 3: Supporting airport photo enters from left / lower-left with horizontal reveal (900–1200ms)
  const secondaryImageVariants = {
    hidden: {
      opacity: 0,
      x: isMobile ? -20 : -76,
      y: isMobile ? 28 : 16,
      scale: 0.96,
      clipPath: "inset(0% 100% 0% 0% round 1.25rem)",
      transition: resetTransition,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      clipPath: "inset(0% 0% 0% 0% round 1.25rem)",
      transition: prefersReduced
        ? { duration: 0 }
        : { duration: 1.05, delay: 0.24, ease: CINEMATIC_EASE },
    },
  };

  // Step 4: Eyebrow enters from left (~70px on desktop)
  const eyebrowVariants = {
    hidden: { opacity: 0, x: isMobile ? -26 : -70, transition: resetTransition },
    visible: {
      opacity: 1,
      x: 0,
      transition: prefersReduced
        ? { duration: 0 }
        : { duration: 0.72, delay: 0.3, ease: CINEMATIC_EASE },
    },
  };

  // Step 5: Company name enters from right with horizontal motion + subtle scale
  const companyNameVariants = {
    hidden: { opacity: 0, x: isMobile ? 24 : 64, scale: 0.94, transition: resetTransition },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: prefersReduced
        ? { duration: 0 }
        : { duration: 0.8, delay: 0.42, ease: CINEMATIC_EASE },
    },
  };

  // Step 6: Main heading lines reveal left-to-right via clip + horizontal glide staggered 130ms
  const headingLineVariants = (lineIndex: number) => ({
    hidden: {
      opacity: 0,
      x: isMobile ? -22 : -56,
      clipPath: "inset(0% 100% 0% 0%)",
      transition: resetTransition,
    },
    visible: {
      opacity: 1,
      x: 0,
      clipPath: "inset(0% 0% 0% 0%)",
      transition: prefersReduced
        ? { duration: 0 }
        : { duration: 0.82, delay: 0.54 + lineIndex * 0.13, ease: CINEMATIC_EASE },
    },
  });

  // Step 7: Description enters from left with subtle vertical lift
  const descriptionVariants = {
    hidden: { opacity: 0, x: isMobile ? -18 : -44, y: isMobile ? 14 : 22, transition: resetTransition },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: prefersReduced
        ? { duration: 0 }
        : { duration: 0.78, delay: 0.78, ease: CINEMATIC_EASE },
    },
  };

  // Step 8: CTA enters from right + arrow animates separately
  const ctaVariants = {
    hidden: { opacity: 0, x: isMobile ? 24 : 68, transition: resetTransition },
    visible: {
      opacity: 1,
      x: 0,
      transition: prefersReduced
        ? { duration: 0 }
        : { duration: 0.72, delay: 0.92, ease: CINEMATIC_EASE },
    },
  };

  const ctaArrowVariants = {
    hidden: { opacity: 0, x: -16, transition: resetTransition },
    visible: {
      opacity: 1,
      x: 0,
      transition: prefersReduced
        ? { duration: 0 }
        : { duration: 0.5, delay: 1.08, ease: CINEMATIC_EASE },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="parent-company"
      data-animation-phase={activePhase}
      aria-labelledby="home-parent-company-heading"
      className="relative scroll-mt-24 overflow-x-clip border-y border-[#8FAF83]/25 bg-[#344C3B] py-20 text-[#F5F0E6] sm:py-28 lg:py-32"
    >
      {/* Subtle section-wide ambient lavender & lime backdrop lighting */}
      <motion.div
        aria-hidden="true"
        initial="hidden"
        animate={activePhase}
        variants={backdropVariants}
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="absolute -right-24 -top-24 h-[34rem] w-[34rem] rounded-full opacity-55 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(185,165,210,0.28) 0%, rgba(129,112,159,0.14) 48%, rgba(52,76,59,0) 76%)",
          }}
        />
        <div
          className="absolute -bottom-24 -left-16 h-[30rem] w-[30rem] rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(143,175,131,0.24) 0%, rgba(241,154,85,0.09) 50%, rgba(52,76,59,0) 78%)",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#B9A5D2]/45 to-transparent" />
      </motion.div>

      <Container size="wide" className="relative z-10">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* LEFT / VISUAL STAGE (~58% width on desktop): Asymmetric Dual-Image Composition */}
          <div
            onPointerMove={handleVisualPointerMove}
            onPointerLeave={handleVisualPointerLeave}
            className="group/visual relative lg:col-span-7"
          >
            {/* Decorative layered Lavender & Lime architectural backing shape */}
            <motion.div
              aria-hidden="true"
              initial="hidden"
              animate={activePhase}
              variants={backdropVariants}
              style={{ x: pointerX, y: pointerY }}
              className="pointer-events-none absolute -right-4 -top-5 bottom-12 left-8 rounded-[2rem] border border-[#B9A5D2]/30 bg-gradient-to-br from-[#B9A5D2]/22 via-[#81709F]/16 to-[#8FAF83]/22 transition-transform duration-700 ease-out group-hover/visual:translate-x-2 group-hover/visual:-translate-y-1.5 sm:-right-6 sm:-top-7 sm:left-12"
            />

            {/* Main Large Infrastructure Image (Enters from Right + Scaled + Bottom-to-Top Reveal) */}
            <motion.div
              data-anim="main-image"
              initial="hidden"
              animate={activePhase}
              variants={mainImageVariants}
              className="relative z-10 sm:ml-6"
            >
              <a
                href={PARENT_COMPANY_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="explore"
                aria-label="Explore C P Arora Private Limited infrastructure works on its official website (opens in a new tab)"
                className="relative block aspect-[16/10] w-full overflow-hidden rounded-[1.75rem] border border-[#8FAF83]/40 bg-[#25382B] shadow-[0_28px_64px_-16px_rgba(12,24,16,0.52)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F0E6] focus-visible:ring-offset-4 focus-visible:ring-offset-[#344C3B]"
              >
                <Image
                  src="/images/home/cparora-infrastructure.jpg"
                  alt="C P Arora Private Limited paving and highway engineering crew laying road infrastructure at sunset"
                  width={1600}
                  height={900}
                  quality={90}
                  sizes="(max-width: 1024px) 100vw, 820px"
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/visual:scale-[1.06] motion-reduce:transform-none"
                />

                {/* Soft atmospheric gradient for badge legibility */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1E2E23]/70 via-transparent to-[#1E2E23]/25"
                />

                {/* Diagonal Light Sweep crossing on hover */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-1000 ease-out group-hover/visual:translate-x-[330%] group-hover/visual:opacity-100 motion-reduce:hidden"
                />

                <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full border border-[#F5F0E6]/25 bg-[#344C3B]/80 px-3.5 py-1.5 backdrop-blur-md">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#F19A55]" />
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#FFFFFF]">
                    Highways &amp; Expressways
                  </span>
                </div>
              </a>
            </motion.div>

            {/* Secondary Supporting Airport Infrastructure Image (Overlaps Left + Enters from Left) */}
            <motion.div
              data-anim="secondary-image"
              initial="hidden"
              animate={activePhase}
              variants={secondaryImageVariants}
              className="relative z-20 -mt-12 w-[78%] transition-transform duration-700 ease-out group-hover/visual:-translate-y-2 group-hover/visual:translate-x-2 sm:-mt-20 sm:w-[58%] lg:-ml-4 lg:-mt-24 lg:w-[54%]"
            >
              <a
                href={PARENT_COMPANY_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="explore"
                aria-label="C P Arora airport infrastructure heritage — Visit official website (opens in a new tab)"
                className="block overflow-hidden rounded-[1.25rem] border-2 border-[#F5F0E6] bg-[#25382B] p-1.5 shadow-[0_24px_54px_-12px_rgba(10,20,14,0.58)] ring-1 ring-[#8FAF83]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F0E6]"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[0.95rem]">
                  <Image
                    src="/images/home/cparora-airport-infrastructure.jpg"
                    alt="C P Arora Private Limited airport apron and runway infrastructure maintenance at dusk"
                    width={1200}
                    height={800}
                    quality={88}
                    sizes="(max-width: 768px) 75vw, 440px"
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover/visual:scale-[1.04]"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1E2E23]/65 via-transparent to-transparent"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 bg-[#F5F0E6] px-3.5 py-2.5 text-[#344C3B]">
                  <span className="flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.16em]">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#81709F]" />
                    Airside &amp; Urban Works
                  </span>
                  <span className="text-[0.6875rem] font-semibold text-[#81709F]">
                    5 Decades
                  </span>
                </div>
              </a>
            </motion.div>
          </div>

          {/* RIGHT / NARRATIVE COMPOSITION (~42% width on desktop): Choreographed Directional Text */}
          <div className="lg:col-span-5 lg:pl-4">
            {/* 4. Eyebrow Label — enters from LEFT (~70px) */}
            <motion.div
              data-anim="eyebrow"
              initial="hidden"
              animate={activePhase}
              variants={eyebrowVariants}
            >
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[#8FAF83]/45 bg-[#FFFFFF]/[0.07] px-4 py-1.5 backdrop-blur-sm">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#F19A55]" />
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#F5F0E6]">
                  OUR PARENT COMPANY
                </span>
              </div>
            </motion.div>

            {/* 5. Company Name — enters from RIGHT with scale transition */}
            <motion.div
              data-anim="company-name"
              initial="hidden"
              animate={activePhase}
              variants={companyNameVariants}
              className="mt-5"
            >
              <p className="text-base font-semibold uppercase tracking-[0.18em] text-[#8FAF83] sm:text-[1.0625rem]">
                C P Arora Private Limited
              </p>
            </motion.div>

            {/* 6. Main Heading — line-by-line clipped left-to-right staggered reveal */}
            <h2
              id="home-parent-company-heading"
              className="mt-4 font-display text-[2.2rem] leading-[1.06] tracking-tight text-[#FFFFFF] sm:text-5xl lg:text-[3.15rem]"
            >
              <span className="block overflow-hidden">
                <motion.span
                  data-anim="heading-line-1"
                  initial="hidden"
                  animate={activePhase}
                  variants={headingLineVariants(0)}
                  className="block will-change-transform"
                >
                  Building the
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  data-anim="heading-line-2"
                  initial="hidden"
                  animate={activePhase}
                  variants={headingLineVariants(1)}
                  className="block text-[#F5F0E6] will-change-transform"
                >
                  Foundations of Progress.
                </motion.span>
              </span>
            </h2>

            {/* 7. Description — enters from LEFT with subtle vertical movement */}
            <motion.div
              data-anim="description"
              initial="hidden"
              animate={activePhase}
              variants={descriptionVariants}
              className="mt-6 space-y-5"
            >
              <p className="text-base leading-[1.75] text-[#F5F0E6]/92 sm:text-lg">
                C P Arora Private Limited brings five decades of experience in
                infrastructure development, with a presence across highways,
                airport pavements and urban roads across India.
              </p>

              <div className="border-l-2 border-[#B9A5D2]/65 pl-4">
                <p className="text-sm leading-relaxed text-[#F5F0E6]/80">
                  While C P Arora Private Limited advances civil infrastructure
                  nationally,{" "}
                  <span className="font-semibold text-[#FFFFFF]">
                    Santosh Arora Trust
                  </span>{" "}
                  operates independently as a registered public charitable trust
                  dedicated solely to education, women&apos;s empowerment,
                  healthcare and community welfare.
                </p>
              </div>
            </motion.div>

            {/* 8. Prominent External CTA — enters from RIGHT with separately animated arrow */}
            <motion.div
              data-anim="cta"
              initial="hidden"
              animate={activePhase}
              variants={ctaVariants}
              className="mt-8 border-t border-[#8FAF83]/25 pt-7"
            >
              <p className="text-sm leading-relaxed text-[#F5F0E6]/85">
                Explore the organisation, its work and its wider capabilities
                through its official website.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-5">
                <Magnetic strength={0.22}>
                  <a
                    href={PARENT_COMPANY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="explore"
                    aria-label="Explore C P Arora Private Limited — Visit official website (opens in a new tab)"
                    className="group/cta relative inline-flex items-center gap-3 rounded-full border border-[#F5F0E6] bg-[#F5F0E6] px-6 py-3.5 text-sm font-semibold tracking-wide text-[#344C3B] shadow-[0_14px_34px_-10px_rgba(12,24,16,0.45)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#F19A55] hover:bg-[#FFFFFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F0E6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#344C3B]"
                  >
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 rounded-full bg-[#F19A55] transition-transform duration-300 group-hover/cta:scale-125"
                    />
                    <span>Explore C P Arora</span>
                    <motion.span
                      data-anim="cta-arrow"
                      initial="hidden"
                      animate={activePhase}
                      variants={ctaArrowVariants}
                      aria-hidden="true"
                      className="inline-flex items-center"
                    >
                      <ExternalLink className="h-4 w-4 text-[#344C3B] transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-1.5" />
                    </motion.span>
                  </a>
                </Magnetic>

                <a
                  href={PARENT_COMPANY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="explore"
                  aria-label="Visit Official Website of C P Arora Private Limited (opens in a new tab)"
                  className="group/link inline-flex items-center gap-1.5 border-b border-[#8FAF83]/60 pb-1 text-sm font-semibold text-[#FFFFFF] transition-colors duration-200 hover:border-[#F19A55] hover:text-[#F5F0E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F0E6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#344C3B]"
                >
                  <span>Visit Official Website</span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4 text-[#8FAF83] transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-1 group-hover/link:text-[#F19A55]"
                  />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
