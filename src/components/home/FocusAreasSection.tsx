import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { HOME_FOCUS_AREAS, type HomeFocusArea } from "@/data/home";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { ImageReveal } from "@/components/home/ImageReveal";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

function getArea(id: string): { area: HomeFocusArea; number: string } {
  const index = HOME_FOCUS_AREAS.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error(`Unknown focus area: ${id}`);
  }
  return { area: HOME_FOCUS_AREAS[index], number: String(index + 1).padStart(2, "0") };
}

const TILE_FOCUS_RING =
  "has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-brand-lavender-deep has-[a:focus-visible]:ring-offset-4 has-[a:focus-visible]:ring-offset-bg-white";

function TileImage({
  area,
  sizes,
  className = "",
  imageClassName = "",
}: {
  area: HomeFocusArea;
  sizes: string;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-bg-cream-deep ${className}`}>
      <Image
        src={area.imageSrc}
        alt={area.imageAlt}
        fill
        sizes={sizes}
        className={`object-cover transition-transform duration-[1100ms] ${EASE} group-hover:scale-[1.06] ${imageClassName}`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-[transform,opacity] duration-[1200ms] ${EASE} group-hover:translate-x-[520%] group-hover:opacity-100`}
      />
    </div>
  );
}

function TileTitle({
  area,
  className = "",
  children,
}: {
  area: HomeFocusArea;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <h3 className={className}>
      <Link
        href={`/focus-areas#${area.id}`}
        className={`inline-block transition-transform duration-500 ${EASE} after:absolute after:inset-0 after:z-10 after:content-[''] focus-visible:outline-none group-hover:translate-x-1`}
      >
        {children ?? area.title}
      </Link>
    </h3>
  );
}

function Numeral({ value, className = "" }: { value: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${className}`}
    >
      {value}
    </span>
  );
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <ArrowUpRight
      aria-hidden="true"
      className={`h-4 w-4 transition-transform duration-300 ${EASE} group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${className}`}
    />
  );
}

function WomenFeature() {
  const { area, number } = getArea("women-empowerment");
  return (
    <article
      className={`group relative isolate flex h-full min-h-[30rem] flex-col justify-between overflow-hidden rounded-[var(--radius-panel)] bg-brand-forest md:min-h-[26rem] lg:min-h-[44rem] ${TILE_FOCUS_RING}`}
    >
      <ImageReveal className="absolute inset-0 -z-10">
        <TileImage
          area={area}
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="h-full w-full"
          imageClassName="object-[50%_28%]"
        />
      </ImageReveal>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-[#1f2e24]/90 via-[#1f2e24]/35 to-transparent transition-opacity duration-700 group-hover:opacity-90"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-[#1f2e24]/45 to-transparent"
      />

      <div className="flex items-center gap-3 p-6 sm:p-8">
        <Numeral value={number} className="text-white" />
        <span aria-hidden="true" className="h-px w-10 bg-brand-lavender" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85">
          Featured objective
        </span>
      </div>

      <div className="flex items-end justify-between gap-6 p-6 sm:p-8 lg:p-10">
        <div className="max-w-lg">
          <TileTitle area={area} className="text-display text-white">
            Women
            <br />
            <em className="font-medium italic text-brand-lavender">Empowerment</em>
          </TileTitle>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/85 sm:text-base">
            {area.description}
          </p>
        </div>
        <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-orange text-text-primary transition-transform duration-500 group-hover:rotate-45 sm:inline-flex">
          <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
        </span>
      </div>
    </article>
  );
}

function EducationPlate() {
  const { area, number } = getArea("education-literacy");
  return (
    <article className={`group relative rounded-[var(--radius-media)] ${TILE_FOCUS_RING}`}>
      <ImageReveal delay={0.1}>
        <TileImage
          area={area}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 42vw"
          className="aspect-[3/2] rounded-[var(--radius-media)]"
        />
      </ImageReveal>
      <div className="relative -mt-16 ml-5 rounded-[var(--radius-card)] border border-border-warm bg-bg-white p-6 shadow-[var(--shadow-elevated)] sm:ml-10 sm:p-7">
        <div className="flex items-center justify-between">
          <Numeral value={number} className="text-lime-700" />
          <Arrow className="text-lime-700" />
        </div>
        <TileTitle area={area} className="text-heading-2 mt-3 text-text-primary" />
        <p className="mt-2.5 text-sm leading-relaxed text-text-secondary">
          {area.description}
        </p>
      </div>
    </article>
  );
}

function SkillsPanel() {
  const { area, number } = getArea("skill-development");
  return (
    <article
      className={`group relative flex h-full overflow-hidden rounded-[var(--radius-panel)] bg-brand-forest text-white ${TILE_FOCUS_RING}`}
    >
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
        <Numeral value={number} className="text-brand-orange" />
        <div className="mt-10">
          <TileTitle area={area} className="text-heading-2 text-white" />
          <p className="mt-3 text-sm leading-relaxed text-bg-cream/80">{area.description}</p>
          <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-orange">
            <span
              aria-hidden="true"
              className="h-px w-6 bg-brand-orange transition-all duration-500 group-hover:w-10"
            />
            Explore
          </span>
        </div>
      </div>
      <TileImage
        area={area}
        sizes="(max-width: 768px) 40vw, 18vw"
        className="w-[38%] shrink-0"
        imageClassName="object-[40%_50%]"
      />
    </article>
  );
}

function HealthcareColumn() {
  const { area, number } = getArea("healthcare-medical-relief");
  return (
    <article
      className={`group relative rounded-[var(--radius-panel)] bg-bg-lavender-wash p-3 sm:p-4 ${TILE_FOCUS_RING}`}
    >
      <ImageReveal delay={0.08}>
        <TileImage
          area={area}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 32vw"
          className="aspect-[4/5] rounded-[var(--radius-card)]"
          imageClassName="object-[52%_30%]"
        />
      </ImageReveal>
      <div className="px-3 pb-4 pt-6 sm:px-4">
        <span
          aria-hidden="true"
          className="font-serif text-5xl font-medium italic leading-none text-brand-lavender-deep"
        >
          {number}
        </span>
        <TileTitle area={area} className="text-heading-3 mt-3 text-text-primary" />
        <p className="mt-2 text-sm leading-relaxed text-ink-700">{area.description}</p>
      </div>
    </article>
  );
}

function WelfarePanel() {
  const { area, number } = getArea("social-welfare-relief");
  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-panel)] bg-brand-orange lg:h-auto ${TILE_FOCUS_RING}`}
    >
      <div className="p-6 sm:p-8 lg:p-9">
        <div className="flex items-center justify-between">
          <Numeral value={number} className="text-text-primary" />
          <Arrow className="text-text-primary" />
        </div>
        <TileTitle area={area} className="text-heading-1 mt-6 max-w-sm text-text-primary">
          Social Welfare <span className="font-medium italic">&amp; Relief</span>
        </TileTitle>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-text-primary/80 sm:text-[15px]">
          {area.description}
        </p>
      </div>
      <TileImage
        area={area}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
        className="aspect-[16/10] md:aspect-auto md:min-h-56 md:flex-1 lg:aspect-[16/10] lg:min-h-0 lg:flex-none"
        imageClassName="object-[50%_60%]"
      />
    </article>
  );
}

function EnvironmentPanel() {
  const { area, number } = getArea("environment-community-development");
  return (
    <article
      className={`group relative grid overflow-hidden rounded-[var(--radius-panel)] bg-brand-lime md:grid-cols-2 lg:grid-cols-1 ${TILE_FOCUS_RING}`}
    >
      <TileImage
        area={area}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 24vw"
        className="aspect-[4/3] md:aspect-auto md:min-h-[17rem] lg:aspect-square lg:min-h-0"
        imageClassName="object-[40%_45%]"
      />
      <div className="flex flex-col p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <Numeral value={number} className="text-text-primary" />
          <Arrow className="text-text-primary" />
        </div>
        <TileTitle
          area={area}
          className="text-heading-3 md:text-heading-2 lg:text-heading-3 mt-4 text-text-primary"
        />
        <p className="mt-2.5 text-sm leading-relaxed text-text-primary/80">{area.description}</p>
      </div>
    </article>
  );
}

export function FocusAreasSection() {
  return (
    <Section surface="white" spacing="lg" separatorBottom ariaLabel="Trust Deed focus areas">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
        <MotionReveal className="lg:col-span-7">
          <Eyebrow tone="lavender">Focus Areas</Eyebrow>
          <h2 className="text-heading-1 mt-5 max-w-2xl text-text-primary">
            Many causes,{" "}
            <em className="font-medium italic text-brand-lavender-deep">one purpose</em>.
          </h2>
        </MotionReveal>
        <MotionReveal delay={0.1} className="lg:col-span-5">
          <p className="text-lead">
            These six areas cover the ten goals written in our Trust Deed.
            They are the causes we were set up to support, not work we have
            already done.
          </p>
          <Link
            href="/focus-areas"
            className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-forest"
          >
            <span className="border-b border-brand-lime pb-0.5 transition-colors group-hover:border-brand-orange">
              See all ten goals
            </span>
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 text-brand-orange transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </MotionReveal>
      </div>

      <ol className="mt-14 grid list-none gap-6 md:grid-cols-6 lg:mt-16 lg:grid-cols-12 lg:gap-7">
        <li className="md:col-span-6 lg:col-span-7 lg:row-span-2">
          <MotionReveal className="h-full">
            <WomenFeature />
          </MotionReveal>
        </li>
        <li className="md:col-span-3 lg:col-span-5">
          <MotionReveal delay={0.08}>
            <EducationPlate />
          </MotionReveal>
        </li>
        <li className="md:col-span-3 lg:col-span-5">
          <MotionReveal delay={0.14} className="h-full">
            <SkillsPanel />
          </MotionReveal>
        </li>
        <li className="ml-10 md:col-span-3 md:ml-0 lg:col-span-4 lg:self-end">
          <MotionReveal delay={0.06}>
            <HealthcareColumn />
          </MotionReveal>
        </li>
        <li className="md:col-span-3 lg:col-span-5 lg:self-start">
          <MotionReveal delay={0.12} className="h-full">
            <WelfarePanel />
          </MotionReveal>
        </li>
        <li className="mr-10 md:col-span-6 md:mr-0 lg:col-span-3 lg:self-end">
          <MotionReveal delay={0.18}>
            <EnvironmentPanel />
          </MotionReveal>
        </li>
      </ol>
    </Section>
  );
}
