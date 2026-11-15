import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, Compass, Sparkles } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { EditorialImage } from "@/components/interior/EditorialImage";
import { EditorialHeroReveal } from "@/components/interior/EditorialHeroReveal";
import { SANTOSH_ARORA_TRUST, type TrustObjective } from "@/data/trust";

export const metadata: Metadata = {
  title: "Focus Areas",
  description:
    "The six areas Santosh Arora Trust wants to support, covering the ten goals in our Trust Deed.",
};

const ANCHOR_NAV = [
  { id: "women-empowerment", num: "01", label: "Women Empowerment" },
  { id: "education-literacy", num: "02", label: "Education & Literacy" },
  { id: "skill-development", num: "03", label: "Skill Development" },
  { id: "healthcare-medical-relief", num: "04", label: "Healthcare & Wellness" },
  { id: "social-welfare-relief", num: "05", label: "Social Welfare & Relief" },
  {
    id: "environment-community-development",
    num: "06",
    label: "Environment & Community",
  },
] as const;

function getClauses(anchor: string): readonly TrustObjective[] {
  return SANTOSH_ARORA_TRUST.deedObjectives.filter(
    (obj) => obj.groupAnchor === anchor
  );
}

export default function FocusAreasPage() {
  const { registration, intendedBeneficiaryScope, objectProvisos } =
    SANTOSH_ARORA_TRUST;

  const womenClauses = getClauses("women-empowerment");
  const eduClauses = getClauses("education-literacy");
  const skillClauses = getClauses("skill-development");
  const healthClauses = getClauses("healthcare-medical-relief");
  const welfareClauses = getClauses("social-welfare-relief");
  const envClauses = getClauses("environment-community-development");

  return (
    <>
      {/* 1. Luminous Editorial Hero + Anchor Navigation Strip */}
      <section
        aria-labelledby="focus-hero-heading"
        className="relative overflow-hidden surface-luminous"
      >
        <div className="mx-auto max-w-[var(--container-standard)] px-5 pb-12 pt-14 sm:px-8 sm:pb-16 sm:pt-20 lg:px-10 lg:pt-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <EditorialHeroReveal>
                <Eyebrow tone="lime">Focus Areas</Eyebrow>
              </EditorialHeroReveal>
              <EditorialHeroReveal delay={0.08}>
                <h1
                  id="focus-hero-heading"
                  className="text-display mt-5 text-text-primary"
                >
                  Six Areas,{" "}
                  <em className="font-medium italic text-brand-lavender-deep">
                    Ten Charity Goals.
                  </em>
                </h1>
              </EditorialHeroReveal>
              <EditorialHeroReveal delay={0.16}>
                <p className="text-lead mt-5 max-w-2xl">
                  Our Trust Deed (Clause 4) lists ten charity goals, from (a) to
                  (j). Below we explain each one simply. These are the causes we
                  were set up to support, not work we have already done.
                </p>
              </EditorialHeroReveal>
            </div>

            <EditorialHeroReveal delay={0.2} className="lg:col-span-4">
              <div className="border-l-2 border-brand-forest pl-5">
                <p className="text-eyebrow text-brand-forest">
                  Our Areas on NGO DARPAN
                </p>
                <p className="mt-2 text-sm font-semibold text-text-primary">
                  Main: {registration.darpanPrimarySector}
                </p>
                <p className="mt-1 text-sm text-text-secondary">
                  Second: {registration.darpanSecondarySector}
                </p>
                <p className="mt-2 text-xs text-text-subtle">
                  Who we want to help: {intendedBeneficiaryScope}
                </p>
              </div>
            </EditorialHeroReveal>
          </div>

          {/* Direct Smooth Anchor Jump Links matching Homepage Mosaic */}
          <EditorialHeroReveal delay={0.26}>
            <nav
              aria-label="Focus areas quick navigation"
              className="mt-10 flex flex-wrap gap-2.5 border-t border-border-warm pt-6"
            >
              {ANCHOR_NAV.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border-warm bg-bg-white/90 px-4 py-2 text-xs font-medium text-text-primary shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-px hover:border-brand-forest hover:bg-bg-sage-wash focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lavender-deep sm:text-sm"
                >
                  <span className="font-serif italic text-brand-lavender-deep">
                    {item.num}
                  </span>
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
          </EditorialHeroReveal>
        </div>
        <div aria-hidden="true" className="separator-editorial" />
      </section>

      {/* SECTION 01: Women Empowerment — Immersive Deep Forest Green Spread */}
      <section
        id="women-empowerment"
        aria-labelledby="women-empowerment-heading"
        className="relative scroll-mt-24 overflow-hidden bg-brand-forest py-16 text-text-inverse sm:scroll-mt-28 sm:py-24"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 60% at 85% 20%, rgba(185, 165, 210, 0.16), transparent 68%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-[var(--container-standard)] px-5 sm:px-8 lg:px-10">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <EditorialImage
                src="/images/home/focus-women.jpg"
                alt="Woman artisan weaving brightly coloured threads on a traditional handloom"
                aspect="4/5"
                tone="dark"
                sizes="(max-width: 1024px) 100vw, 40vw"
                imageClassName="object-[50%_28%]"
              />
            </div>

            <div className="space-y-6 lg:col-span-7">
              <MotionReveal>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-serif text-4xl font-medium italic text-brand-lavender">
                    01
                  </span>
                  <span className="text-eyebrow rounded-full bg-white/12 px-3.5 py-1 text-white ring-1 ring-white/25">
                    Clause 4(a) · Our Main Goal
                  </span>
                </div>
                <h2
                  id="women-empowerment-heading"
                  className="text-heading-1 mt-4 text-white"
                >
                  Women Empowerment
                </h2>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-orange">
                  Goal in our Trust Deed &amp; main area on DARPAN · No work completed yet
                </p>
              </MotionReveal>

              {womenClauses.map((clause) => (
                <MotionReveal key={clause.id} delay={0.1}>
                  <div className="border-t border-white/15 pt-5">
                    <h3 className="font-serif text-2xl font-semibold text-white">
                      {clause.title}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-bg-cream/90 sm:text-lg">
                      {clause.summary}
                    </p>
                    <p className="mt-3 text-xs text-bg-cream/65">
                      Source: {clause.sourcePage}
                    </p>
                  </div>
                </MotionReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 02: Education & Literacy — Asymmetric Overlap Plate on White */}
      <Section
        id="education-literacy"
        surface="white"
        spacing="lg"
        separatorBottom
        className="scroll-mt-24 sm:scroll-mt-28"
        ariaLabel="Education and Literacy"
      >
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="order-2 space-y-6 lg:order-1 lg:col-span-6">
            <MotionReveal>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-serif text-4xl font-medium italic text-brand-forest">
                  02
                </span>
                <Eyebrow tone="lime" withDot={false}>
                  Clauses 4(c) &amp; 4(j) · Second area on DARPAN
                </Eyebrow>
              </div>
              <h2 className="text-heading-1 mt-4 text-text-primary">
                Education &amp; Literacy
              </h2>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-subtle">
                Goal in our Trust Deed · Still being planned
              </p>
            </MotionReveal>

            <div className="divide-y divide-border-subtle border-y border-border-subtle">
              {eduClauses.map((clause, idx) => (
                <MotionReveal key={clause.id} delay={idx * 0.08}>
                  <div className="py-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-forest">
                        {clause.clauseRef}
                      </span>
                      <span className="text-xs text-text-subtle">
                        {clause.sourcePage}
                      </span>
                    </div>
                    <h3 className="mt-1.5 font-serif text-2xl font-semibold text-text-primary">
                      {clause.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary sm:text-base">
                      {clause.summary}
                    </p>
                  </div>
                </MotionReveal>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-6">
            <EditorialImage
              src="/images/home/focus-education.jpg"
              alt="Students reading and studying together at shared tables in a public library"
              aspect="16/10"
              sizes="(max-width: 1024px) 100vw, 48vw"
              caption="Libraries, scholarships, books and uniforms for girls and students who need help."
            />
          </div>
        </div>
      </Section>

      {/* SECTION 03: Skill Development — Warm Cream Split Feature */}
      <Section
        id="skill-development"
        surface="cream"
        spacing="lg"
        separatorBottom
        className="scroll-mt-24 sm:scroll-mt-28"
        ariaLabel="Skill Development"
      >
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <EditorialImage
              src="/images/home/focus-skills.jpg"
              alt="Close-up of a tailor guiding striped fabric carefully under a sewing machine needle"
              aspect="3/2"
              sizes="(max-width: 1024px) 100vw, 48vw"
            />
          </div>

          <div className="space-y-5 lg:col-span-6">
            <MotionReveal>
              <div className="flex items-center gap-3">
                <span className="font-serif text-4xl font-medium italic text-text-primary">
                  03
                </span>
                <Eyebrow tone="orange" withDot={false}>
                  Clause 4(b)
                </Eyebrow>
              </div>
              <h2 className="text-heading-1 mt-4 text-text-primary">
                Skill Development
              </h2>
              <div
                aria-hidden="true"
                className="mt-4 h-0.5 w-16 bg-brand-orange"
              />
            </MotionReveal>

            {skillClauses.map((clause) => (
              <MotionReveal key={clause.id} delay={0.1}>
                <h3 className="font-serif text-2xl font-semibold text-text-primary">
                  {clause.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-text-secondary sm:text-lg">
                  {clause.summary}
                </p>
                <p className="mt-4 text-xs uppercase tracking-[0.14em] text-text-subtle">
                  Source: {clause.sourcePage} · Goal only, not yet started
                </p>
              </MotionReveal>
            ))}
          </div>
        </div>
      </Section>

      {/* SECTION 04: Healthcare & Medical Relief — Lavender Editorial Triptych */}
      <Section
        id="healthcare-medical-relief"
        surface="lavender"
        spacing="lg"
        separatorBottom
        className="scroll-mt-24 sm:scroll-mt-28"
        ariaLabel="Healthcare and Medical Relief"
      >
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <EditorialImage
              src="/images/home/focus-healthcare.jpg"
              alt="Physician in a clinic consultation room reviewing medical notes at her desk"
              aspect="4/5"
              sizes="(max-width: 1024px) 100vw, 32vw"
              imageClassName="object-[52%_30%]"
            />
          </div>

          <div className="space-y-8 lg:col-span-8">
            <MotionReveal>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-serif text-4xl font-medium italic text-brand-lavender-deep">
                  04
                </span>
                <Eyebrow tone="lavender" withDot={false}>
                  Clauses 4(d) &amp; 4(i)
                </Eyebrow>
              </div>
              <h2 className="text-heading-1 mt-4 text-text-primary">
                Healthcare &amp; Medical Relief
              </h2>
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-text-secondary">
                Health care, good food, care for mothers and mental health,
                along with exercise, yoga and self-defence.
              </p>
            </MotionReveal>

            <div className="grid gap-6 sm:grid-cols-2">
              {healthClauses.map((clause, idx) => (
                <MotionReveal key={clause.id} delay={0.08 + idx * 0.08}>
                  <div className="h-full rounded-[var(--radius-card)] border border-brand-lavender/45 bg-bg-white p-6 shadow-[var(--shadow-soft)]">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-lavender-deep">
                      {clause.clauseRef}
                    </span>
                    <h3 className="mt-2 font-serif text-2xl font-semibold text-text-primary">
                      {clause.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-[15px]">
                      {clause.summary}
                    </p>
                    <p className="mt-4 text-xs text-text-subtle">
                      {clause.sourcePage}
                    </p>
                  </div>
                </MotionReveal>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* SECTION 05: Social Welfare & Relief — Wide Banner + 3-Column Hairline Grid on White */}
      <Section
        id="social-welfare-relief"
        surface="white"
        spacing="lg"
        separatorBottom
        className="scroll-mt-24 sm:scroll-mt-28"
        ariaLabel="Social Welfare and Relief"
      >
        <div className="space-y-10">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <MotionReveal className="lg:col-span-6">
              <div className="flex items-center gap-3">
                <span className="font-serif text-4xl font-medium italic text-text-primary">
                  05
                </span>
                <Eyebrow tone="orange" withDot={false}>
                  Clauses 4(e), 4(f) &amp; 4(g)
                </Eyebrow>
              </div>
              <h2 className="text-heading-1 mt-4 text-text-primary">
                Social Welfare &amp; Relief
              </h2>
            </MotionReveal>
            <MotionReveal delay={0.1} className="lg:col-span-6">
              <p className="text-lead">
                Three goals from our Trust Deed: caring for people in need,
                helping people know their legal rights and get free or low-cost
                legal help, and helping during disasters.
              </p>
            </MotionReveal>
          </div>

          <EditorialImage
            src="/images/home/focus-welfare.jpg"
            alt="Community members sharing a warm meal seated together in a communal hall"
            aspect="21/9"
            sizes="100vw"
            imageClassName="object-[50%_55%]"
          />

          <div className="grid gap-8 border-t border-border-warm pt-8 md:grid-cols-3">
            {welfareClauses.map((clause, idx) => (
              <MotionReveal key={clause.id} delay={idx * 0.08}>
                <div className="border-t-2 border-brand-orange pt-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-text-subtle">
                    {clause.clauseRef} · {clause.sourcePage}
                  </span>
                  <h3 className="mt-2 font-serif text-2xl font-semibold text-text-primary">
                    {clause.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-text-secondary sm:text-[15px]">
                    {clause.summary}
                  </p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </Section>

      {/* SECTION 06: Environment & Community Development — Grounded Sage Spread */}
      <Section
        id="environment-community-development"
        surface="sage"
        spacing="lg"
        className="scroll-mt-24 sm:scroll-mt-28"
        ariaLabel="Environment and Community Development"
      >
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <EditorialImage
              src="/images/home/focus-environment.jpg"
              alt="Community planters carrying bundles of young tree saplings along a woodland trail"
              aspect="4/3"
              sizes="(max-width: 1024px) 100vw, 48vw"
            />
          </div>

          <div className="space-y-6 lg:col-span-6">
            <MotionReveal>
              <div className="flex items-center gap-3">
                <span className="font-serif text-4xl font-medium italic text-brand-forest">
                  06
                </span>
                <Eyebrow tone="forest" withDot={false}>
                  Clause 4(h)
                </Eyebrow>
              </div>
              <h2 className="text-heading-1 mt-4 text-text-primary">
                Environment &amp; Community Development
              </h2>
            </MotionReveal>

            {envClauses.map((clause) => (
              <MotionReveal key={clause.id} delay={0.08}>
                <h3 className="font-serif text-2xl font-semibold text-text-primary">
                  {clause.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-text-secondary sm:text-lg">
                  {clause.summary}
                </p>
                <p className="mt-3 text-xs text-text-subtle">
                  Source: {clause.sourcePage} · Caring for nature and keeping neighbourhoods clean.
                </p>
              </MotionReveal>
            ))}

            {/* Constitutional Conditions & Next Step Links */}
            <MotionReveal delay={0.14}>
              <div className="border-t border-brand-forest/20 pt-6">
                <p className="text-eyebrow text-brand-forest">
                  Important Rules
                </p>
                <ul className="mt-3 space-y-2 text-xs leading-relaxed text-text-primary/85 sm:text-sm">
                  {objectProvisos.map((proviso, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <Sparkles
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-forest"
                        aria-hidden="true"
                      />
                      <span>{proviso}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-wrap gap-3">
                  <ButtonLink href="/initiatives" variant="primary" size="md">
                    <Compass className="h-4 w-4" aria-hidden="true" />
                    <span>See Our Plans</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </ButtonLink>
                  <ButtonLink href="/impact" variant="secondary" size="md">
                    <span>Vision</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </ButtonLink>
                </div>
              </div>
            </MotionReveal>
          </div>
        </div>
      </Section>
    </>
  );
}
