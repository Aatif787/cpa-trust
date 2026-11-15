import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { ImageReveal } from "@/components/home/ImageReveal";

export function IntroductionSection() {
  return (
    <Section surface="cream" spacing="lg" separatorBottom>
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6">
          <MotionReveal>
            <SectionHeading
              eyebrow="Who We Are"
              eyebrowTone="lime"
              title="Every Life Deserves an Opportunity."
              as="h2"
              size="h1"
            />
          </MotionReveal>

          <MotionReveal delay={0.1}>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-text-secondary sm:text-[17px]">
              <p>
                Santosh Arora Trust is a new public charitable trust. We believe
                that real change starts when every person is treated with
                respect and gets a fair chance to learn, stay healthy and do
                well in life.
              </p>
              <p>
                We are just getting started. We are planning carefully, being
                open about how we work, and following the goals set out in our
                Trust Deed.
              </p>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.18}>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-forest transition-colors hover:text-text-primary"
              >
                <span className="border-b border-brand-lime pb-0.5 transition-colors group-hover:border-brand-orange">
                  Read About the Trust
                </span>
                <ArrowRight
                  className="h-4 w-4 text-brand-orange transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </MotionReveal>
        </div>

        <div className="lg:col-span-6">
          <ImageReveal delay={0.12}>
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-brand-lime/20 via-brand-lavender/15 to-brand-orange/15 blur-xl"
              />
              <MediaFrame
                src="/images/home/intro.jpg"
                alt="A parent holding an open storybook while reading closely with a young child at a wooden table"
                aspect="4/3"
                sizes="(max-width: 1024px) 100vw, 48vw"
                caption="Learning together and supporting families are at the heart of what we do."
              />
            </div>
          </ImageReveal>
        </div>
      </div>
    </Section>
  );
}
