"use client";

import Image from "next/image";
import { ArrowDownRight, Mail, Phone, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { EditorialHeroReveal } from "@/components/interior/EditorialHeroReveal";
import { LiquidReveal } from "@/components/ui/LiquidReveal";
import { ElegantContactDetails } from "@/components/contact/ElegantContactDetails";
import { SANTOSH_ARORA_TRUST } from "@/data/trust";

export function ContactHero() {
  const { registration } = SANTOSH_ARORA_TRUST;

  return (
    <section
      aria-labelledby="contact-hero-heading"
      className="relative overflow-hidden surface-luminous"
    >
      <Container size="standard" className="py-14 sm:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Editorial Intro */}
          <div className="lg:col-span-6">
            <EditorialHeroReveal variant="eyebrow">
              <Eyebrow tone="orange">Contact Us</Eyebrow>
            </EditorialHeroReveal>

            <EditorialHeroReveal variant="bottomMask" delay={0.08}>
              <h1
                id="contact-hero-heading"
                className="text-display mt-5 text-text-primary"
              >
                Let&apos;s Start a{" "}
                <em className="font-medium italic text-brand-forest">
                  Conversation.
                </em>
              </h1>
            </EditorialHeroReveal>

            <EditorialHeroReveal variant="fromLeft" delay={0.16}>
              <p className="text-lead mt-5 max-w-xl">
                Have a question about who we are, what we do or what we are
                planning? We would love to hear from you.
              </p>
            </EditorialHeroReveal>

            <EditorialHeroReveal variant="fromLeft" delay={0.24}>
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <a
                  href="#enquiry-form"
                  className="group inline-flex h-11 items-center gap-2 rounded-full bg-[#184385] px-6 text-sm font-medium text-white shadow-[var(--shadow-soft)] transition-all duration-250 hover:bg-[#113368] hover:shadow-[var(--shadow-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#184385] focus-visible:ring-offset-2 focus-visible:ring-offset-[#77a2e2]"
                >
                  <span>Write to Us</span>
                  <ArrowDownRight
                    className="h-4 w-4 text-white transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>

                <a
                  href={`mailto:${registration.correspondenceEmail}`}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-white/90 px-5 text-sm font-medium text-[#0d2140] ring-1 ring-white backdrop-blur-md shadow-[var(--shadow-soft)] transition-all duration-250 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#184385] focus-visible:ring-offset-2 focus-visible:ring-offset-[#77a2e2]"
                >
                  <Mail className="h-4 w-4 text-[#184385]" aria-hidden="true" />
                  <span>Email Us</span>
                </a>

                <a
                  href={`tel:+91${registration.correspondencePhone}`}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-white/90 px-5 text-sm font-medium text-[#0d2140] ring-1 ring-white backdrop-blur-md shadow-[var(--shadow-soft)] transition-all duration-250 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#184385] focus-visible:ring-offset-2 focus-visible:ring-offset-[#77a2e2]"
                >
                  <Phone className="h-4 w-4 text-[#184385]" aria-hidden="true" />
                  <span>Call Us</span>
                </a>
              </div>
            </EditorialHeroReveal>

            <EditorialHeroReveal variant="rise" delay={0.32}>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border-warm/80 pt-5 text-xs text-text-subtle">
                <span className="inline-flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-brand-lime"
                  />
                  {registration.entityType}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck
                    className="h-3.5 w-3.5 text-brand-forest"
                    aria-hidden="true"
                  />
                  DARPAN ID: {registration.darpanId} ({registration.darpanStatus})
                </span>
              </div>
            </EditorialHeroReveal>
          </div>

          {/* Right Forest-Anchored Documentary Composition */}
          <EditorialHeroReveal variant="fromRight" delay={0.14} className="lg:col-span-6">
            <div className="relative rounded-[var(--radius-panel)] bg-white/18 p-3 ring-1 ring-white/45 backdrop-blur-md shadow-[var(--shadow-elevated)] sm:p-4">
              {/* Subtle ambient spruce & tomato corner glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-2 -z-10 rounded-[2rem] opacity-75 blur-xl"
                style={{
                  background:
                    "radial-gradient(50% 50% at 85% 15%, rgba(255, 255, 255, 0.12), transparent 70%), radial-gradient(45% 45% at 15% 85%, rgba(255, 255, 255, 0.08), transparent 70%)",
                }}
              />

              <div
                className="group relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-[#2b589d]"
              >
                <LiquidReveal priority duration={1.35} replay>
                  <Image
                    src="/images/contact/conversation.jpg"
                    alt="Two community collaborators engaged in a warm conversation over a notebook at a wooden table surrounded by bookshelves"
                    fill
                    priority
                    fetchPriority="high"
                    quality={100}
                    sizes="(max-width: 1024px) 100vw, 48vw"
                    className="object-cover object-[42%_38%] transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                  />
                </LiquidReveal>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d2140]/65 via-transparent to-transparent"
                />
              </div>

              <ElegantContactDetails className="mt-3" />
            </div>
          </EditorialHeroReveal>
        </div>
      </Container>

      <div aria-hidden="true" className="separator-editorial" />
    </section>
  );
}
