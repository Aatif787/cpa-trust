import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { MotionReveal } from "@/components/ui/MotionReveal";

export function VisionSection() {
  return (
    <Section
      surface="forest"
      spacing="lg"
      className="overflow-hidden"
      ariaLabel="Vision"
    >
      {/* Subtle, controlled lavender and warm orange atmospheric accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 65% at 15% 20%, rgba(185, 165, 210, 0.16) 0%, rgba(185, 165, 210, 0) 70%), radial-gradient(45% 55% at 88% 82%, rgba(241, 154, 85, 0.14) 0%, rgba(241, 154, 85, 0) 72%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <MotionReveal>
          <span className="text-eyebrow inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-white ring-1 ring-white/20">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-brand-lavender"
            />
            Vision
          </span>
        </MotionReveal>

        <MotionReveal delay={0.1}>
          <h2 className="text-heading-1 mt-6 text-white">
            A Better Future for Everyone.
          </h2>
        </MotionReveal>

        <MotionReveal delay={0.18}>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-bg-cream/90 sm:text-lg">
            We dream of communities where everyone gets a fair chance in life,
            where children get a good education, women feel confident and
            strong, families stay healthy, and people look after each other.
          </p>
        </MotionReveal>

        <MotionReveal delay={0.26}>
          <div className="mt-9 flex justify-center">
            <Link
              href="/impact"
              className="group inline-flex items-center gap-2 rounded-full bg-white/12 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/25 transition-all duration-250 hover:bg-white/20 hover:ring-brand-orange/60"
            >
              <span>Read More</span>
              <ArrowRight
                className="h-4 w-4 text-brand-orange transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </MotionReveal>
      </div>
    </Section>
  );
}
