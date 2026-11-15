"use client";

import Image from "next/image";
import { ArrowDownRight, Mail, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SANTOSH_ARORA_TRUST } from "@/data/trust";

const EASE = [0.22, 1, 0.36, 1] as const;

export function ContactHero() {
  const prefersReduced = useReducedMotion();
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
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <Eyebrow tone="orange">Contact Us</Eyebrow>
            </motion.div>

            <motion.h1
              id="contact-hero-heading"
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
              className="text-display mt-5 text-text-primary"
            >
              Let&apos;s Start a{" "}
              <em className="font-medium italic text-brand-forest">
                Conversation.
              </em>
            </motion.h1>

            <motion.p
              initial={prefersReduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16, ease: EASE }}
              className="text-lead mt-5 max-w-xl"
            >
              Have a question about who we are, what we do or what we are
              planning? We would love to hear from you.
            </motion.p>

            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24, ease: EASE }}
              className="mt-8 flex flex-wrap items-center gap-3.5"
            >
              <a
                href="#enquiry-form"
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-brand-forest px-6 text-sm font-medium text-text-inverse shadow-[var(--shadow-soft)] transition-all duration-250 hover:bg-[#1a312c] hover:shadow-[var(--shadow-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lavender-deep focus-visible:ring-offset-2 focus-visible:ring-offset-bg-cream"
              >
                <span>Write to Us</span>
                <ArrowDownRight
                  className="h-4 w-4 text-brand-tomato-soft transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              </a>

              <a
                href={`mailto:${registration.correspondenceEmail}`}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-bg-white px-5 text-sm font-medium text-brand-forest ring-1 ring-border-forest shadow-[var(--shadow-soft)] transition-all duration-250 hover:bg-bg-sage-wash focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lavender-deep focus-visible:ring-offset-2 focus-visible:ring-offset-bg-cream"
              >
                <Mail className="h-4 w-4 text-brand-lavender-deep" aria-hidden="true" />
                <span>Email Us</span>
              </a>
            </motion.div>

            <motion.div
              initial={prefersReduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.32, ease: EASE }}
              className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border-warm/80 pt-5 text-xs text-text-subtle"
            >
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
            </motion.div>
          </div>

          {/* Right Forest-Anchored Documentary Composition */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.14, ease: EASE }}
            className="lg:col-span-6"
          >
            <div className="relative rounded-[var(--radius-panel)] bg-brand-forest p-3 shadow-[var(--shadow-elevated)] sm:p-4">
              {/* Subtle ambient spruce & tomato corner glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-2 -z-10 rounded-[2rem] opacity-75 blur-xl"
                style={{
                  background:
                    "radial-gradient(50% 50% at 85% 15%, rgba(124, 154, 142, 0.35), transparent 70%), radial-gradient(45% 45% at 15% 85%, rgba(131, 54, 51, 0.22), transparent 70%)",
                }}
              />

              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-brand-forest">
                <Image
                  src="/images/contact/conversation.jpg"
                  alt="Two community collaborators engaged in a warm conversation over a notebook at a wooden table surrounded by bookshelves"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover object-[42%_38%]"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#172c27]/55 via-transparent to-transparent"
                />
              </div>

              <div className="mt-3 flex flex-col justify-between gap-3 rounded-[var(--radius-card)] bg-bg-cream-soft px-4 py-3.5 text-text-primary sm:flex-row sm:items-center sm:px-5">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-text-subtle">
                    Official Email (NGO DARPAN)
                  </p>
                  <a
                    href={`mailto:${registration.correspondenceEmail}`}
                    className="mt-0.5 block truncate font-serif text-lg font-semibold text-brand-forest underline decoration-brand-lime underline-offset-4 transition-colors hover:text-text-primary"
                  >
                    {registration.correspondenceEmail}
                  </a>
                </div>
                <span className="inline-flex shrink-0 items-center self-start rounded-full bg-bg-lavender-wash px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-lavender-deep ring-1 ring-brand-lavender/45 sm:self-center">
                  West Delhi · India
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>

      <div aria-hidden="true" className="separator-editorial" />
    </section>
  );
}
