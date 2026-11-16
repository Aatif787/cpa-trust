import Image from "next/image";
import Link from "next/link";
import { SITE_ROUTES } from "@/data/navigation";
import { HOME_FOCUS_AREAS } from "@/data/home";
import { SANTOSH_ARORA_TRUST } from "@/data/trust";
import { Container } from "@/components/ui/Container";
import { ElegantContactDetails } from "@/components/contact/ElegantContactDetails";

export function SiteFooter() {
  const { registration, regulatoryStatus } = SANTOSH_ARORA_TRUST;

  return (
    <footer className="relative bg-bg-white text-text-secondary">
      <div aria-hidden="true" className="separator-editorial" />

      <Container size="wide" className="py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand & Factual Introduction */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Link
              href="/"
              aria-label={registration.legalName}
              className="inline-block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#184385]"
            >
              <Image
                src="/brand/logo.png"
                alt={`${registration.legalName} logo`}
                width={519}
                height={262}
                className="h-16 w-auto sm:h-[4.5rem]"
              />
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-text-secondary">
              A new public charitable trust under{" "}
              {registration.applicableLaw}. We want to support women and help
              with education, health and community care.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#edf4fd] px-3 py-1 text-xs font-medium text-[#0d2140] ring-1 ring-[#77a2e2]/45">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-[#184385]"
              />
              DARPAN ID: {registration.darpanId} ({registration.darpanStatus})
            </p>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2">
            <h2 className="text-eyebrow text-text-primary">Navigation</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {SITE_ROUTES.map((route) => (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    className="text-text-secondary transition-colors hover:text-brand-forest"
                  >
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Focus Area Links */}
          <div className="lg:col-span-3">
            <h2 className="text-eyebrow text-text-primary">Focus Areas</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {HOME_FOCUS_AREAS.map((area) => (
                <li key={area.id}>
                  <Link
                    href={`/focus-areas#${area.id}`}
                    className="text-text-secondary transition-colors hover:text-brand-forest"
                  >
                    {area.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Verified Registration & Public Correspondence Only */}
          <div className="lg:col-span-3">
            <h2 className="text-eyebrow text-text-primary">
              Registration &amp; Contact
            </h2>

            <dl className="mt-4 space-y-2 text-sm leading-relaxed text-text-secondary">
              <div>
                <dt className="inline font-medium text-text-primary">
                  Reg. No.:{" "}
                </dt>
                <dd className="inline">{registration.registrationNumber}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-text-primary">
                  Authority:{" "}
                </dt>
                <dd className="inline">{registration.registeringAuthority}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-text-primary">
                  Jurisdiction:{" "}
                </dt>
                <dd className="inline">{registration.jurisdiction}</dd>
              </div>
            </dl>

            <div className="mt-4">
              <ElegantContactDetails layout="stack" />
            </div>

            <p className="mt-3 text-xs leading-relaxed text-text-subtle">
              See all our official details on{" "}
              <Link
                href="/governance"
                className="font-medium text-brand-forest underline decoration-brand-orange underline-offset-4 hover:text-text-primary"
              >
                Governance &amp; Registration
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-border-subtle pt-6">
          <p className="text-xs leading-relaxed text-text-secondary">
            {regulatoryStatus.disclosureNote}
          </p>
          <div className="mt-4 flex flex-col items-start justify-between gap-2 text-xs text-text-subtle sm:flex-row sm:items-center">
            <p>
              &copy; {new Date().getFullYear()} {registration.legalName}. All
              rights reserved.
            </p>
            <p>
              Our goals are shown separately from work we have actually done.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
