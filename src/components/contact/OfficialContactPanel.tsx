import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  Building2,
  Landmark,
  MapPin,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { ElegantContactDetails } from "@/components/contact/ElegantContactDetails";
import { SANTOSH_ARORA_TRUST } from "@/data/trust";

export function OfficialContactPanel() {
  const { registration } = SANTOSH_ARORA_TRUST;

  return (
    <aside
      id="official-contact"
      aria-labelledby="official-contact-heading"
      className="space-y-6"
    >
      {/* Primary Cerulean Anchor Card */}
      <MotionReveal variant="fromRight">
        <div className="rounded-[var(--radius-panel)] bg-gradient-to-br from-[#2a579c] via-[#3f6fba] to-[#5687d4] p-6 text-white ring-1 ring-white/45 shadow-[var(--shadow-elevated)] sm:p-8">
        <span className="text-eyebrow inline-flex items-center gap-2 rounded-full bg-white/12 px-3.5 py-1.5 text-white ring-1 ring-white/20">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-white"
          />
          Official Details
        </span>

        <h2
          id="official-contact-heading"
          className="text-heading-2 mt-5 text-white"
        >
          {registration.legalName}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/80">
          {registration.entityType} · Governed by {registration.applicableLaw}
        </p>

        <div className="mt-7 border-t border-white/15 pt-6">
          <ElegantContactDetails tone="forest" />
          <p className="mt-3 text-xs text-white/65">
            Email listed on NGO DARPAN · Phone for trust enquiries
          </p>
        </div>

        <dl className="mt-6 space-y-5 text-sm">
          {/* Verified Registration & DARPAN */}
          <div className="flex items-start gap-3.5">
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/12 text-white ring-1 ring-white/20">
              <Landmark className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
                Registration Details
              </dt>
              <dd className="mt-1 font-medium text-white">
                Reg. No. {registration.registrationNumber}
              </dd>
              <dd className="text-xs text-white/75">
                NGO DARPAN ID: {registration.darpanId} ({registration.darpanStatus})
              </dd>
            </div>
          </div>

          {/* Registering Authority & Jurisdiction */}
          <div className="flex items-start gap-3.5">
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/12 text-white ring-1 ring-white/20">
              <MapPin className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
                Location &amp; Registration Office
              </dt>
              <dd className="mt-1 font-medium text-white">
                {registration.jurisdiction}
              </dd>
              <dd className="text-xs text-white/75">
                {registration.registeringAuthority}
              </dd>
            </div>
          </div>
        </dl>
        </div>
      </MotionReveal>

      {/* Office Address & Privacy Transparency Card */}
      <MotionReveal variant="fromRight" delay={0.1}>
        <Card variant="white" padding="md">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <Building2
              className="h-4 w-4 text-brand-lavender-deep"
              aria-hidden="true"
            />
            <Eyebrow tone="lavender" withDot={false}>
              Address &amp; Privacy
            </Eyebrow>
          </div>
          <CardTitle as="h3" className="pt-1 text-xl">
            Office Address
          </CardTitle>
          <CardDescription>
            We only share details from our official documents. We do not share
            trustees&apos; home addresses.
          </CardDescription>
        </CardHeader>

        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-2.5 rounded-xl bg-bg-orange-wash p-3.5 ring-1 ring-brand-orange/35">
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-text-primary"
              aria-hidden="true"
            />
            <p className="text-xs leading-relaxed text-text-primary/90">
              <strong>Office Address:</strong> Our address is written slightly
              differently in the Trust Deed, the e-Stamp paper and on DARPAN. We
              will share the full street address once the trustees confirm the
              correct wording.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-4 border-t border-border-subtle pt-4 text-xs font-semibold">
          <Link
            href="/governance"
            className="inline-flex items-center gap-1 text-brand-forest transition-colors hover:text-text-primary"
          >
            <span>How We Are Run</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <Link
            href="/focus-areas"
            className="inline-flex items-center gap-1 text-brand-lavender-deep transition-colors hover:text-text-primary"
          >
            <span>Our Goals</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
        </Card>
      </MotionReveal>
    </aside>
  );
}
