import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  Building2,
  Landmark,
  Mail,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SANTOSH_ARORA_TRUST } from "@/data/trust";

export function OfficialContactPanel() {
  const { registration } = SANTOSH_ARORA_TRUST;

  return (
    <aside
      id="official-contact"
      aria-labelledby="official-contact-heading"
      className="space-y-6"
    >
      {/* Primary Deep Forest Green Contact Anchor Card */}
      <div className="rounded-[var(--radius-panel)] bg-brand-forest p-6 text-text-inverse shadow-[var(--shadow-elevated)] sm:p-8">
        <span className="text-eyebrow inline-flex items-center gap-2 rounded-full bg-white/12 px-3.5 py-1.5 text-white ring-1 ring-white/20">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-brand-orange"
          />
          Official Details
        </span>

        <h2
          id="official-contact-heading"
          className="text-heading-2 mt-5 text-white"
        >
          {registration.legalName}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-bg-cream/85">
          {registration.entityType} · Governed by {registration.applicableLaw}
        </p>

        <dl className="mt-7 space-y-5 border-t border-white/15 pt-6 text-sm">
          {/* Verified Correspondence Email */}
          <div className="flex items-start gap-3.5">
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/12 text-brand-orange ring-1 ring-white/20">
              <Mail className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-bg-cream/75">
                Official Email
              </dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${registration.correspondenceEmail}`}
                  className="break-all font-medium text-white underline decoration-brand-lime underline-offset-4 transition-colors hover:text-brand-orange"
                >
                  {registration.correspondenceEmail}
                </a>
              </dd>
              <p className="mt-1 text-xs text-bg-cream/70">
                This is the email listed for us on NGO DARPAN.
              </p>
            </div>
          </div>

          {/* Verified Registration & DARPAN */}
          <div className="flex items-start gap-3.5">
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/12 text-brand-lavender ring-1 ring-white/20">
              <Landmark className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-bg-cream/75">
                Registration Details
              </dt>
              <dd className="mt-1 font-medium text-white">
                Reg. No. {registration.registrationNumber}
              </dd>
              <dd className="text-xs text-bg-cream/80">
                NGO DARPAN ID: {registration.darpanId} ({registration.darpanStatus})
              </dd>
            </div>
          </div>

          {/* Registering Authority & Jurisdiction */}
          <div className="flex items-start gap-3.5">
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/12 text-brand-lime ring-1 ring-white/20">
              <MapPin className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-bg-cream/75">
                Location &amp; Registration Office
              </dt>
              <dd className="mt-1 font-medium text-white">
                {registration.jurisdiction}
              </dd>
              <dd className="text-xs text-bg-cream/80">
                {registration.registeringAuthority}
              </dd>
            </div>
          </div>
        </dl>
      </div>

      {/* Office Address & Privacy Transparency Card */}
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
            Office Address &amp; Phone
          </CardTitle>
          <CardDescription>
            We only share details from our official documents. We do not share
            trustees&apos; personal phone numbers or home addresses.
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

          <div className="flex items-start gap-2.5 rounded-xl bg-bg-sage-wash p-3.5 ring-1 ring-brand-lime/35">
            <ShieldCheck
              className="mt-0.5 h-4 w-4 shrink-0 text-brand-forest"
              aria-hidden="true"
            />
            <p className="text-xs leading-relaxed text-text-primary/90">
              <strong>Phone Numbers:</strong> We do not have a public phone
              number or office hours yet. Trustees&apos; personal numbers are
              kept private.
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
    </aside>
  );
}
