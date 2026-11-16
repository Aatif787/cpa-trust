import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: "/404",
  title: "Page Not Found",
  description:
    "The page you requested could not be found on the Santosh Arora Trust website.",
  noIndex: true,
});

export default function NotFound() {
  return (
    <section
      aria-labelledby="not-found-heading"
      className="min-h-[75vh] bg-[#77a2e2] py-20 text-white sm:py-28"
    >
      <Container className="max-w-4xl space-y-8">
        <div className="space-y-4">
          <span className="text-eyebrow inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-white ring-1 ring-white/30">
            404 — Page Not Found
          </span>
          <h1 id="not-found-heading" className="text-display text-white">
            This page is not available.
          </h1>
          <p className="text-lead max-w-xl text-white/90">
            The address you followed does not match an active page on the
            Santosh Arora Trust website.
          </p>
        </div>

        <div className="rounded-[var(--radius-panel)] bg-white p-8 text-text-primary sm:p-10 space-y-6">
          <Eyebrow tone="lime">Helpful Links</Eyebrow>
          <h2 className="text-heading-2 text-[#0d2140]">
            Explore Santosh Arora Trust
          </h2>
          <p className="text-body text-text-secondary">
            Use the links below to return to the home page, review our charitable
            focus areas, inspect official Trust governance details, or get in
            touch.
          </p>
          <nav
            aria-label="Fallback navigation"
            className="flex flex-wrap gap-3 pt-2"
          >
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-[#184385] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0d2140]"
            >
              Return Home
            </Link>
            <Link
              href="/focus-areas"
              className="inline-flex items-center justify-center rounded-full border border-[#d6e0f0] bg-white px-6 py-3 text-sm font-semibold text-[#0d2140] transition-colors hover:bg-[#edf4fd]"
            >
              Focus Areas
            </Link>
            <Link
              href="/governance"
              className="inline-flex items-center justify-center rounded-full border border-[#d6e0f0] bg-white px-6 py-3 text-sm font-semibold text-[#0d2140] transition-colors hover:bg-[#edf4fd]"
            >
              Governance &amp; Registration
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-[#d6e0f0] bg-white px-6 py-3 text-sm font-semibold text-[#0d2140] transition-colors hover:bg-[#edf4fd]"
            >
              Contact Us
            </Link>
          </nav>
        </div>
      </Container>
    </section>
  );
}
