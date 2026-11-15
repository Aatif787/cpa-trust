import { ArrowRight, Compass } from "lucide-react";
import { HOME_PLANNED_INITIATIVES } from "@/data/home";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  MotionReveal,
  MotionStagger,
  MotionStaggerItem,
} from "@/components/ui/MotionReveal";

export function PlannedInitiativesSection() {
  return (
    <Section surface="cream" spacing="lg" separatorBottom>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <MotionReveal>
            <SectionHeading
              eyebrow="Our Plans"
              eyebrowTone="orange"
              title="From Plans to Action."
              lead="We are a new trust, so we are taking time to plan our first programmes well before we start work on the ground."
              as="h2"
              size="h1"
            />
          </MotionReveal>

          <MotionReveal delay={0.12}>
            <div className="mt-6 rounded-2xl border border-border-warm bg-bg-white p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-bg-sage-wash text-brand-forest">
                  <Compass className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="text-xs leading-relaxed text-text-secondary sm:text-sm">
                  <strong className="font-semibold text-text-primary">
                    Please note:
                  </strong>{" "}
                  These are plans for future work. We have not run these
                  programmes yet.
                </p>
              </div>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.2}>
            <div className="mt-8">
              <ButtonLink href="/initiatives" variant="primary" size="lg">
                <span>See All Our Plans</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          </MotionReveal>
        </div>

        <div className="lg:col-span-7">
          <MotionStagger className="grid gap-5 sm:grid-cols-2">
            {HOME_PLANNED_INITIATIVES.map((item) => (
              <MotionStaggerItem key={item.id}>
                <Card variant="white" interactive className="flex h-full flex-col">
                  <CardHeader className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-serif text-2xl font-semibold text-brand-lavender-deep">
                        {item.number}
                      </span>
                      <span className="rounded-full bg-bg-orange-wash px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-primary ring-1 ring-brand-orange/40">
                        {item.statusLabel}
                      </span>
                    </div>
                    <CardTitle className="pt-2">{item.title}</CardTitle>
                    <CardDescription>{item.summary}</CardDescription>
                  </CardHeader>
                </Card>
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        </div>
      </div>
    </Section>
  );
}
