import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { MotionReveal } from "@/components/ui/MotionReveal";

export function ClosingCtaSection() {
  return (
    <Section surface="luminous" spacing="lg">
      <MotionReveal>
        <div className="mx-auto max-w-3xl rounded-[var(--radius-panel)] border border-border-warm/90 bg-bg-white/85 px-6 py-12 text-center shadow-[var(--shadow-elevated)] backdrop-blur-sm sm:px-12 sm:py-16">
          <SectionHeading
            eyebrow="Connect With Us"
            eyebrowTone="lime"
            title="Together, We Can Make a Difference."
            lead="Find out more about why we started and the causes we want to help."
            align="center"
            as="h2"
            size="h1"
          />

          <div className="mt-8 flex justify-center">
            <ButtonLink href="/contact" variant="primary" size="lg">
              <span>Get in Touch</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </MotionReveal>
    </Section>
  );
}
