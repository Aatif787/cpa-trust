import { ArrowRight, FileCheck2, ShieldCheck } from "lucide-react";
import { SANTOSH_ARORA_TRUST } from "@/data/trust";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MotionReveal } from "@/components/ui/MotionReveal";

export function GovernanceSection() {
  const { registration, trustees, regulatoryStatus } = SANTOSH_ARORA_TRUST;

  return (
    <Section surface="white" spacing="lg" separatorBottom>
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <MotionReveal>
            <SectionHeading
              eyebrow="How We Are Run"
              eyebrowTone="forest"
              title="Open and Honest From Day One."
              lead="We believe people should be able to check our records. We clearly separate what our Trust Deed says, what we are planning, and what our official registrations are."
              as="h2"
              size="h1"
            />
          </MotionReveal>

          <MotionReveal delay={0.14}>
            <div className="mt-8">
              <ButtonLink href="/governance" variant="secondary" size="lg">
                <span>View Trust Information</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          </MotionReveal>
        </div>

        <div className="lg:col-span-6">
          <MotionReveal delay={0.12}>
            <Card variant="cream" padding="lg">
              <div className="flex items-center gap-3 border-b border-border-warm pb-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-forest text-white">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-eyebrow text-text-subtle">
                    Official Identity
                  </p>
                  <p className="font-serif text-xl font-semibold text-text-primary">
                    {registration.legalName}
                  </p>
                </div>
              </div>

              <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                <div className="rounded-xl bg-bg-white p-4 ring-1 ring-border-warm/80">
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary">
                    Legal Status
                  </dt>
                  <dd className="mt-1.5 font-medium text-text-primary">
                    {registration.entityType}
                  </dd>
                </div>

                <div className="rounded-xl bg-bg-white p-4 ring-1 ring-border-warm/80">
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary">
                    Applicable Law
                  </dt>
                  <dd className="mt-1.5 font-medium text-text-primary">
                    {registration.applicableLaw}
                  </dd>
                </div>

                <div className="rounded-xl bg-bg-white p-4 ring-1 ring-border-warm/80">
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary">
                    Registration Number
                  </dt>
                  <dd className="mt-1.5 font-medium text-text-primary">
                    {registration.registrationNumber}
                  </dd>
                </div>

                <div className="rounded-xl bg-bg-white p-4 ring-1 ring-border-warm/80">
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary">
                    NGO DARPAN ID
                  </dt>
                  <dd className="mt-1.5 font-medium text-text-primary">
                    {registration.darpanId} ({registration.darpanStatus})
                  </dd>
                </div>

                <div className="rounded-xl bg-bg-white p-4 ring-1 ring-border-warm/80 sm:col-span-2">
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary">
                    Trustees ({trustees.length})
                  </dt>
                  <dd className="mt-1.5 font-medium text-text-primary">
                    {trustees
                      .map((t) => `${t.fullName} (${t.deedRole})`)
                      .join(" · ")}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 flex items-start gap-3 rounded-xl bg-bg-lavender-wash/75 p-4 ring-1 ring-brand-lavender/40">
                <FileCheck2
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-lavender-deep"
                  aria-hidden="true"
                />
                <p className="text-xs leading-relaxed text-text-primary">
                  {regulatoryStatus.disclosureNote}
                </p>
              </div>
            </Card>
          </MotionReveal>
        </div>
      </div>
    </Section>
  );
}
