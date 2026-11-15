/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Compass, FileCheck2, ShieldCheck } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { HOME_FOCUS_AREAS, HOME_PLANNED_INITIATIVES } from "@/data/home";
import { SANTOSH_ARORA_TRUST } from "@/data/trust";
import "./home-petalyx.css";

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261021_093331_5998f443-1b9c-4b62-820c-8219c73c72c4.mp4";
const HERO_POSTER =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261021_093215_b7826239-e451-4e15-b42b-d6bcf9497a32.png";
const CLOUD_A =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261021_093216_44218665-b15e-4566-a2d4-2676ab03609d.png";
const CLOUD_B =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261021_093215_0f37c0c3-f82c-485b-87dd-5a35b75a8782.png";
const TREE =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261021_093215_95f11900-c4a0-49ad-bb2d-bb927dd594ee.png";
const NIGHT =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261021_093217_cc690198-ad8c-4127-8734-8485bd878351.png";

const GLASS_POSITIONS: ReadonlyArray<readonly [number, number]> = [
  [3, 64],
  [3, 71],
  [6.5, 71],
  [10, 71],
  [3, 78],
  [-1, 70],
  [45.5, 76],
  [49, 80],
  [49, 76],
  [52.5, 76],
  [86, 58],
  [86, 67],
  [82, 76],
  [89.5, 76],
  [86, 84],
];

const TRUST_CARDS = [
  {
    label: "Board of Trustees",
    to: 4,
    sub: "Registered Deed Members",
  },
  {
    label: "Deed Objectives",
    to: 10,
    sub: "Clause 4(a) – (j) Mandate",
  },
  {
    label: "Charitable Focus Areas",
    to: 6,
    sub: "Core Welfare Pillars",
  },
  {
    label: "Conducted Activities",
    to: 0,
    sub: "Newly Registered · DARPAN Verified",
  },
] as const;

const PROCESS_PANELS = [
  {
    num: "1",
    numClass: "ptx-num-1",
    title: "Trust Deed & Purpose",
    body: "Santosh Arora Trust was set up only for charity, not to make a profit. Guided by Clause 4, our main aim is to support women and help communities through education, healthcare and welfare.",
    href: "/about",
    linkLabel: "Read About the Trust",
    cloud: CLOUD_B,
  },
  {
    num: "2",
    numClass: "ptx-num-2",
    title: "Careful First Programmes",
    body: "We are a new trust taking time to plan our first learning, women's empowerment, skill development and health awareness programmes responsibly before starting ground work.",
    href: "/initiatives",
    linkLabel: "See All Our Plans",
    cloud: CLOUD_A,
  },
  {
    num: "3",
    numClass: "ptx-num-3",
    title: "Open & Audited Stewardship",
    body: "Registered under The Indian Trusts Act, 1882 (Reg. No. 2026/22/IV/1415) with active NGO DARPAN status (DL/2026/1252835) and annual CA-audited public records.",
    href: "/governance",
    linkLabel: "View Trust Information",
    cloud: CLOUD_B,
  },
] as const;

function seededValue(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function buildSquareCoords(count: number, offset: number) {
  return Array.from({ length: count }, (_, i) => {
    const col = Math.floor(seededValue(i + offset) * 30);
    const row = Math.floor(seededValue(i * 3 + offset + 11) * 6);
    const dur = (2.2 + seededValue(i + offset + 7) * 2.4).toFixed(2);
    const del = (seededValue(i + offset + 23) * 3.6).toFixed(2);
    return {
      key: `${offset}-${i}`,
      left: `${col * 48 - 10}px`,
      top: `${row * 48 + 6}px`,
      dur: `${dur}s`,
      del: `${del}s`,
    };
  });
}

const STATS_SQUARES = buildSquareCoords(22, 101);
const CTA_SQUARES = buildSquareCoords(16, 409);

const PETAL_ITEMS = Array.from({ length: 18 }, (_, i) => ({
  key: i,
  left: `${(seededValue(i + 17) * 100).toFixed(2)}%`,
  dx: `${Math.round((seededValue(i + 53) - 0.5) * 160)}px`,
  duration: `${(9 + seededValue(i + 89) * 9).toFixed(2)}s`,
  delay: `-${(seededValue(i + 131) * 15).toFixed(2)}s`,
  scale: (0.6 + seededValue(i + 197) * 0.8).toFixed(2),
}));

function SplitText({
  text,
  accent,
  wordClass = "ptx-w",
}: {
  text: string;
  accent?: string;
  wordClass?: string;
}) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, idx) => (
        <span key={`${word}-${idx}`}>
          <span className={wordClass}>{word}</span>
          {idx < words.length - 1 || accent ? " " : null}
        </span>
      ))}
      {accent ? (
        <em>
          {accent.split(" ").map((word, idx, arr) => (
            <span key={`em-${word}-${idx}`}>
              <span className={wordClass}>{word}</span>
              {idx < arr.length - 1 ? " " : null}
            </span>
          ))}
        </em>
      ) : null}
    </>
  );
}

export function PetalyxHomeExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const treeRef = useRef<HTMLImageElement>(null);
  const loopRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const ctaImgRef = useRef<HTMLImageElement>(null);
  const ctaCardRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(HTMLElement | null)[]>([]);

  const [activePanel, setActivePanel] = useState(0);

  const { registration, trustees, regulatoryStatus } = SANTOSH_ARORA_TRUST;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = rootRef.current;
    const appEl = appRef.current;
    const backdropEl = backdropRef.current;
    const heroEl = heroSectionRef.current;
    const videoEl = heroVideoRef.current;
    if (!root || !appEl) return;

    const setCounters = (progress: number) => {
      TRUST_CARDS.forEach((card, idx) => {
        const el = counterRefs.current[idx];
        if (!el) return;
        const val = Math.round(card.to * progress);
        el.textContent = String(val);
      });
    };

    if (reduce) {
      appEl.classList.remove("is-intro");
      if (backdropEl) backdropEl.remove();
      setCounters(1);
      return;
    }

    // Pause hero 1080p video decoding when hero leaves viewport
    let videoObserver: IntersectionObserver | null = null;
    if (heroEl && videoEl && typeof IntersectionObserver !== "undefined") {
      videoObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          if (entry.isIntersecting) {
            if (videoEl.paused) {
              void videoEl.play().catch(() => undefined);
            }
          } else if (!videoEl.paused) {
            videoEl.pause();
          }
        },
        { threshold: 0.02 },
      );
      videoObserver.observe(heroEl);
    }

    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(500, 33);

    const ctx = gsap.context(() => {
      const setupScroll = () => {
        // Hero GPU-composited parallax
        const heroParTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        if (heroTitleRef.current) {
          heroParTl.to(
            heroTitleRef.current,
            { yPercent: -48, force3D: true, ease: "none" },
            0,
          );
        }
        heroParTl.to(
          ".ptx-hero-media",
          { yPercent: 8, force3D: true, ease: "none" },
          0,
        );
        gsap.utils.toArray<HTMLElement>(".ptx-hero [data-par]").forEach((el) => {
          const par = Number(el.dataset.par || "0");
          heroParTl.to(el, { y: par * 2, force3D: true, ease: "none" }, 0);
        });

        // Generic reveal items (transform + opacity only)
        gsap.utils.toArray<HTMLElement>(".ptx-reveal").forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 14,
            duration: 0.65,
            force3D: true,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 86%",
              once: true,
            },
          });
        });

        // Compositor-only word reveals in scroll sections
        gsap.utils.toArray<HTMLElement>(".ptx-scroll-split").forEach((el) => {
          const words = el.querySelectorAll(".ptx-w");
          gsap.from(words, {
            opacity: 0,
            y: 18,
            duration: 0.68,
            stagger: 0.045,
            force3D: true,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 84%",
              once: true,
            },
          });
        });

        // Stats pin + cherry tree rise + counter scrub
        const mm = gsap.matchMedia();

        mm.add("(min-width: 901px)", () => {
          gsap.from(".ptx-card", {
            y: 34,
            opacity: 0,
            duration: 0.7,
            stagger: 0.06,
            force3D: true,
            ease: "power3.out",
            scrollTrigger: {
              trigger: "#stats",
              start: "top 75%",
              once: true,
            },
          });

          const proxy = { p: 0 };
          const statsTl = gsap.timeline({
            scrollTrigger: {
              trigger: "#stats",
              start: "top top",
              end: "+=115%",
              pin: true,
              anticipatePin: 1,
              scrub: 0.45,
            },
          });
          statsTl.to(
            proxy,
            {
              p: 1,
              ease: "none",
              onUpdate: () => setCounters(proxy.p),
            },
            0,
          );
          if (treeRef.current) {
            statsTl.fromTo(
              treeRef.current,
              { yPercent: 75, force3D: true },
              { yPercent: 6, force3D: true, ease: "none" },
              0,
            );
          }
        });

        mm.add("(max-width: 900px)", () => {
          gsap.from(".ptx-card", {
            y: 26,
            opacity: 0,
            duration: 0.65,
            stagger: 0.06,
            force3D: true,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".ptx-cards",
              start: "top 85%",
              once: true,
            },
          });

          const proxy = { p: 0 };
          gsap.to(proxy, {
            p: 1,
            duration: 1.4,
            ease: "power2.out",
            onUpdate: () => setCounters(proxy.p),
            scrollTrigger: {
              trigger: ".ptx-cards",
              start: "top 82%",
              once: true,
            },
          });

          if (treeRef.current) {
            gsap.fromTo(
              treeRef.current,
              { yPercent: 38, force3D: true },
              {
                yPercent: 0,
                force3D: true,
                ease: "none",
                scrollTrigger: {
                  trigger: "#stats",
                  start: "top bottom",
                  end: "bottom bottom",
                  scrub: true,
                },
              },
            );
          }
        });

        mm.add("(min-width: 761px)", () => {
          gsap.from(".ptx-panel-in", {
            y: 90,
            opacity: 0,
            duration: 0.85,
            stagger: 0.09,
            force3D: true,
            ease: "power3.out",
            scrollTrigger: {
              trigger: "#loop",
              start: "top 68%",
              once: true,
            },
          });
          gsap.to(".ptx-loop-cloud", {
            x: 60,
            force3D: true,
            ease: "none",
            scrollTrigger: {
              trigger: "#loop",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });

        mm.add("(max-width: 760px)", () => {
          gsap.utils.toArray<HTMLElement>(".ptx-panel").forEach((panel) => {
            gsap.from(panel.children, {
              y: 32,
              opacity: 0,
              duration: 0.7,
              stagger: 0.08,
              force3D: true,
              ease: "power3.out",
              scrollTrigger: {
                trigger: panel,
                start: "top 86%",
                once: true,
              },
            });
          });
        });

        // Directory cards reveal
        gsap.from(".ptx-focus-tile", {
          y: 22,
          opacity: 0,
          duration: 0.65,
          stagger: 0.06,
          force3D: true,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".ptx-focus-grid",
            start: "top 84%",
            once: true,
          },
        });

        // Night valley CTA parallax & frosted card rise (no animated filter over backdrop-filter)
        if (ctaImgRef.current && ctaRef.current) {
          gsap.fromTo(
            ctaImgRef.current,
            { yPercent: -12, force3D: true },
            {
              yPercent: 0,
              force3D: true,
              ease: "none",
              scrollTrigger: {
                trigger: ctaRef.current,
                start: "top bottom",
                end: "bottom bottom",
                scrub: true,
              },
            },
          );
        }
        if (ctaCardRef.current && ctaRef.current) {
          gsap.from(ctaCardRef.current, {
            y: 52,
            scale: 0.96,
            opacity: 0,
            duration: 0.85,
            force3D: true,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 72%",
              once: true,
            },
          });
        }

        ScrollTrigger.refresh();
      };

      // Fast, butter-smooth intro zoom out without heavy scroll lock
      setCounters(0);
      const heroWords = root.querySelectorAll(".ptx-hero-title .ptx-w");
      gsap.set(heroWords, { opacity: 0, y: 18, force3D: true });

      const introTl = gsap.timeline({
        delay: 0.08,
        onComplete: () => {
          appEl.classList.remove("is-intro");
          if (backdropEl) backdropEl.remove();
          gsap.set(appEl, {
            clearProps: "transform,borderRadius,boxShadow,willChange",
          });
          setupScroll();
        },
      });

      introTl
        .fromTo(
          appEl,
          { scale: 0.9, borderRadius: 28, force3D: true },
          {
            scale: 1,
            borderRadius: 0,
            duration: 0.95,
            force3D: true,
            ease: "expo.out",
          },
        )
        .to(
          heroWords,
          {
            opacity: 1,
            y: 0,
            duration: 0.72,
            stagger: 0.045,
            force3D: true,
            ease: "power3.out",
          },
          "-=0.55",
        )
        .from(
          ".ptx-cloud-l",
          {
            x: -90,
            opacity: 0,
            duration: 1,
            force3D: true,
            ease: "power3.out",
          },
          0.18,
        )
        .from(
          ".ptx-cloud-r",
          {
            x: 90,
            opacity: 0,
            duration: 1,
            force3D: true,
            ease: "power3.out",
          },
          0.18,
        )
        .from(
          ".ptx-hero-glass .ptx-glass",
          {
            opacity: 0,
            scale: 0.72,
            duration: 0.5,
            stagger: { each: 0.035, from: "random" },
            force3D: true,
            ease: "back.out(1.7)",
          },
          "-=0.7",
        );
    }, root);

    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("load", handleLoad);
      if (videoObserver) videoObserver.disconnect();
      ctx.revert();
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={rootRef} className="ptx-home">
      <div
        ref={backdropRef}
        aria-hidden="true"
        className="ptx-backdrop"
        style={{ backgroundImage: `url("${HERO_POSTER}")` }}
      />

      <div id="ptx-app" ref={appRef} className="is-intro">
        {/* 1. CHERRY BLOSSOM WATERCOLOR HERO WITH EXISTING TRUST COPY */}
        <section
          id="hero"
          ref={heroSectionRef}
          aria-label="Introduction to Santosh Arora Trust"
          className="ptx-hero"
        >
          <div className="ptx-cloud ptx-cloud-l" data-par="-60">
            <img className="ptx-drift-a" src={CLOUD_A} alt="" />
          </div>
          <div className="ptx-cloud ptx-cloud-r" data-par="-90">
            <img className="ptx-drift-b" src={CLOUD_B} alt="" />
          </div>

          <div className="ptx-hero-copy">
            <span className="ptx-pill">Santosh Arora Trust</span>
            <h1 id="heroTitle" ref={heroTitleRef} className="ptx-hero-title">
              <SplitText text="Building a Better" />
              <br />
              <SplitText text="Tomorrow," accent="Together." />
            </h1>
            <p className="ptx-hero-sub">
              We want to help people live better lives through education,
              support for women, healthcare and community care.
            </p>
            <div className="ptx-hero-actions">
              <Link href="/about" className="ptx-btn">
                <span>About Us</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/focus-areas" className="ptx-btn-ghost">
                See What We Focus On
              </Link>
            </div>
          </div>

          <div className="ptx-hero-media">
            <video
              id="heroVideo"
              ref={heroVideoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={HERO_POSTER}
              src={HERO_VIDEO}
            />
          </div>

          <div id="heroGlass" className="ptx-hero-glass" aria-hidden="true">
            {GLASS_POSITIONS.map(([x, y], index) => {
              const isCenter = x > 40 && x < 60;
              return (
                <div
                  key={`glass-${index}`}
                  className={`ptx-glass ${index % 2 === 1 ? "ptx-glass-odd" : ""}`}
                  style={
                    {
                      left: `${x}%`,
                      top: `${y}%`,
                      width: isCenter
                        ? "clamp(28px, 3.4vw, 44px)"
                        : "clamp(36px, 5.4vw, 74px)",
                      aspectRatio: "1",
                      "--dur": `${(2.2 + (index % 4) * 0.65).toFixed(2)}s`,
                      "--del": `${((index % 5) * 0.55).toFixed(2)}s`,
                    } as React.CSSProperties
                  }
                />
              );
            })}
          </div>
        </section>

        {/* 2. PINNED WHO WE ARE & CHERRY TREE SECTION */}
        <section
          id="stats"
          ref={statsRef}
          aria-label="Who We Are"
          className="ptx-stats"
        >
          <div className="ptx-sq-field" aria-hidden="true">
            {STATS_SQUARES.map((sq) => (
              <div
                key={sq.key}
                className="ptx-grid-sq"
                style={
                  {
                    left: sq.left,
                    top: sq.top,
                    "--dur": sq.dur,
                    "--del": sq.del,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>

          <div className="ptx-tree-wrap">
            <img
              id="tree"
              ref={treeRef}
              className="ptx-tree"
              src={TREE}
              alt="Watercolour cherry blossom trees"
            />
          </div>

          <div className="ptx-stats-inner">
            <span className="ptx-pill ptx-reveal">Who We Are</span>
            <h2 className="ptx-h2 ptx-scroll-split">
              <SplitText text="Every Life Deserves" />
              <br />
              <SplitText text="an Opportunity." />
            </h2>
            <p className="ptx-stats-lead ptx-reveal">
              Santosh Arora Trust is a new public charitable trust planning
              carefully around the charitable goals recorded in our Trust Deed.{" "}
              <Link
                href="/about"
                className="font-semibold text-[#4d6a10] underline underline-offset-4"
              >
                Read About the Trust
              </Link>
            </p>

            <div className="ptx-cards">
              {TRUST_CARDS.map((card, index) => (
                <div key={card.label} className="ptx-card">
                  <span className="ptx-card-label">{card.label}</span>
                  <b
                    ref={(el) => {
                      counterRefs.current[index] = el;
                    }}
                  >
                    {card.to}
                  </b>
                  <span className="ptx-card-sub">{card.sub}</span>
                </div>
              ))}
            </div>

            <div className="ptx-cards-shadow" aria-hidden="true" />

            <div className="ptx-band-wrap">
              <div id="band" className="ptx-band" aria-hidden="true" />
              <div className="ptx-logos" aria-label="Charitable focus links">
                {HOME_FOCUS_AREAS.map((area) => (
                  <Link
                    key={area.id}
                    href={`/focus-areas#${area.id}`}
                    className="ptx-logo-link"
                  >
                    {area.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. INTERACTIVE 3-PANEL HORIZON ACCORDION (TRUST WORKFLOW) */}
        <section
          id="loop"
          ref={loopRef}
          aria-label="How the Trust Works"
          className="ptx-loop"
        >
          <div className="ptx-loop-cloud" data-par="-50" aria-hidden="true">
            <img className="ptx-drift-a" src={CLOUD_A} alt="" />
            <div
              className="ptx-glass"
              style={
                {
                  left: "6%",
                  top: "30%",
                  width: "15%",
                  aspectRatio: "1",
                  "--dur": "3.2s",
                } as React.CSSProperties
              }
            />
            <div
              className="ptx-glass"
              style={
                {
                  left: "23%",
                  top: "58%",
                  width: "13%",
                  aspectRatio: "1",
                  "--dur": "2.6s",
                  "--del": "0.8s",
                } as React.CSSProperties
              }
            />
            <div
              className="ptx-glass"
              style={
                {
                  left: "38%",
                  top: "24%",
                  width: "13%",
                  aspectRatio: "1",
                  "--dur": "3.5s",
                  "--del": "1.2s",
                } as React.CSSProperties
              }
            />
          </div>

          <div className="ptx-loop-head">
            <span className="ptx-pill ptx-reveal">Vision &amp; Foundation</span>
            <h2 className="ptx-h2 ptx-scroll-split">
              <SplitText text="From Plans" />
              <br />
              <SplitText text="to Community Care." />
            </h2>
          </div>

          <div id="track" className="ptx-track">
            {PROCESS_PANELS.map((panel, index) => {
              const isActive = activePanel === index;
              return (
                <div
                  key={panel.num}
                  tabIndex={0}
                  role="button"
                  aria-label={`Step ${panel.num}: ${panel.title}`}
                  aria-expanded={isActive}
                  onMouseEnter={() => setActivePanel(index)}
                  onFocus={() => setActivePanel(index)}
                  onClick={() => setActivePanel(index)}
                  className={`ptx-panel ${isActive ? "is-active" : ""}`}
                >
                  <div className="ptx-panel-in">
                    <span className={`ptx-num ${panel.numClass}`}>
                      {panel.num}
                    </span>
                    <div className="ptx-step">
                      <img
                        className="ptx-mini-cloud"
                        src={panel.cloud}
                        alt=""
                        aria-hidden="true"
                      />
                      <h3>{panel.title}</h3>
                      <p>{panel.body}</p>
                      <Link href={panel.href} className="ptx-step-link">
                        <span>{panel.linkLabel}</span>
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. SIX FOCUS AREAS, PLANNED INITIATIVES & GOVERNANCE DIRECTORY */}
        <section
          aria-label="What We Focus On and Official Records"
          className="ptx-directory"
        >
          <div className="ptx-dir-wrap">
            <div className="ptx-dir-head">
              <div>
                <span className="ptx-pill ptx-reveal">What We Focus On</span>
                <h2 className="ptx-h2 ptx-h2-left ptx-scroll-split mt-3">
                  <SplitText text="Working Together for Lasting Change." />
                </h2>
              </div>
              <Link href="/focus-areas" className="ptx-btn-ghost">
                <span>See All Areas</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="ptx-focus-grid">
              {HOME_FOCUS_AREAS.map((area, index) => (
                <Link
                  key={area.id}
                  href={`/focus-areas#${area.id}`}
                  className="ptx-focus-tile group"
                >
                  <div className="ptx-focus-media">
                    <Image
                      src={area.imageSrc}
                      alt={area.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="ptx-focus-body">
                    <div>
                      <span className="ptx-pill">
                        {String(index + 1).padStart(2, "0")} · Focus Area
                      </span>
                    </div>
                    <h3>{area.title}</h3>
                    <p>{area.description}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="ptx-records-split">
              <div>
                <span className="ptx-pill">Our Plans</span>
                <h3 className="mt-3 text-2xl font-medium tracking-tight text-[#121410]">
                  From Plans to Action
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#3d4336]">
                  We are taking time to plan our first programmes well before
                  starting work on the ground.
                </p>

                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#eef0ea] bg-[#f8faf3] p-3.5 text-xs leading-relaxed text-[#3d4336]">
                  <Compass
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#4d6a10]"
                    aria-hidden="true"
                  />
                  <span>
                    <strong className="font-semibold text-[#121410]">
                      Please note:
                    </strong>{" "}
                    These are plans for future work. We have not run these
                    programmes yet.
                  </span>
                </div>

                <div className="ptx-plan-grid">
                  {HOME_PLANNED_INITIATIVES.map((item) => (
                    <div key={item.id} className="ptx-plan-card">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-[#4d6a10]">
                          {item.number}
                        </span>
                        <span className="ptx-pill">{item.statusLabel}</span>
                      </div>
                      <h4 className="mt-2.5 text-sm font-semibold text-[#121410]">
                        {item.title}
                      </h4>
                      <p className="mt-1.5 text-xs leading-relaxed text-[#3d4336]">
                        {item.summary}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <Link href="/initiatives" className="ptx-btn-ghost">
                    <span>See All Our Plans</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <div className="ptx-ledger-card">
                <div className="flex items-center gap-3 border-b border-[#e5eadc] pb-4">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#4d6a10] text-white">
                    <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4d6a10]">
                      Official Identity
                    </p>
                    <p className="text-lg font-semibold text-[#121410]">
                      {registration.legalName}
                    </p>
                  </div>
                </div>

                <dl className="ptx-ledger-grid text-xs">
                  <div className="ptx-ledger-cell">
                    <dt className="font-semibold uppercase tracking-[0.1em] text-[#4d6a10]">
                      Legal Status
                    </dt>
                    <dd className="mt-1 font-medium text-[#121410]">
                      {registration.entityType}
                    </dd>
                  </div>
                  <div className="ptx-ledger-cell">
                    <dt className="font-semibold uppercase tracking-[0.1em] text-[#4d6a10]">
                      Applicable Law
                    </dt>
                    <dd className="mt-1 font-medium text-[#121410]">
                      {registration.applicableLaw}
                    </dd>
                  </div>
                  <div className="ptx-ledger-cell">
                    <dt className="font-semibold uppercase tracking-[0.1em] text-[#4d6a10]">
                      Registration Number
                    </dt>
                    <dd className="mt-1 font-medium text-[#121410]">
                      {registration.registrationNumber}
                    </dd>
                  </div>
                  <div className="ptx-ledger-cell">
                    <dt className="font-semibold uppercase tracking-[0.1em] text-[#4d6a10]">
                      NGO DARPAN ID
                    </dt>
                    <dd className="mt-1 font-medium text-[#121410]">
                      {registration.darpanId} ({registration.darpanStatus})
                    </dd>
                  </div>
                  <div className="ptx-ledger-cell sm:col-span-2">
                    <dt className="font-semibold uppercase tracking-[0.1em] text-[#4d6a10]">
                      Trustees ({trustees.length})
                    </dt>
                    <dd className="mt-1 font-medium text-[#121410]">
                      {trustees
                        .map((t) => `${t.fullName} (${t.deedRole})`)
                        .join(" · ")}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#eef0ea] bg-white p-3.5 text-xs leading-relaxed text-[#3d4336]">
                  <FileCheck2
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#4d6a10]"
                    aria-hidden="true"
                  />
                  <p>{regulatoryStatus.disclosureNote}</p>
                </div>

                <div className="mt-5">
                  <Link href="/governance" className="ptx-btn">
                    <span>View Trust Information</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. MOONLIT CHERRY BLOSSOM VALLEY CLOSING CTA WITH FALLING PETALS */}
        <section
          id="cta"
          ref={ctaRef}
          aria-label="Connect With Us"
          className="ptx-cta"
        >
          <div className="ptx-sq-field" aria-hidden="true">
            {CTA_SQUARES.map((sq) => (
              <div
                key={sq.key}
                className="ptx-grid-sq"
                style={
                  {
                    left: sq.left,
                    top: sq.top,
                    "--dur": sq.dur,
                    "--del": sq.del,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>

          <div className="ptx-cta-img">
            <img
              id="ctaImg"
              ref={ctaImgRef}
              src={NIGHT}
              alt="Moonlit cherry blossom valley"
            />
          </div>

          <div id="petals" className="ptx-petals" aria-hidden="true">
            {PETAL_ITEMS.map((petal) => (
              <span
                key={petal.key}
                className="ptx-petal"
                style={
                  {
                    left: petal.left,
                    animationDuration: petal.duration,
                    animationDelay: petal.delay,
                    "--dx": petal.dx,
                    "--ps": petal.scale,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>

          <div id="ctaCard" ref={ctaCardRef} className="ptx-cta-card">
            <span className="ptx-pill">Connect With Us</span>
            <h2
              className="ptx-h2 ptx-scroll-split"
              style={{
                margin: "16px 0 12px",
                fontSize: "clamp(24px, 2.8vw, 38px)",
              }}
            >
              <SplitText text="Together, We Can Make" />
              <br />
              <SplitText text="a Difference." />
            </h2>
            <p className="ptx-cta-sub">
              Find out more about why we started and the causes we want to help.
            </p>
            <Link href="/contact" className="ptx-btn">
              <span>Get in Touch</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
