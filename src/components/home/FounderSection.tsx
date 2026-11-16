"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { MotionReveal } from "@/components/ui/MotionReveal";
import "./founder-section.css";

export function FounderSection() {
  const stageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--fx", `${(x * 7).toFixed(2)}deg`);
    el.style.setProperty("--fy", `${(-y * 6).toFixed(2)}deg`);
  };

  const handleMouseLeave = () => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty("--fx", "0deg");
    el.style.setProperty("--fy", "0deg");
  };

  return (
    <section
      id="founder"
      aria-labelledby="founder-heading"
      className="founder-section"
    >
      <div className="founder-container">
        <div className="founder-grid">
          <MotionReveal variant="fromLeft" className="founder-visual">
            <div
              ref={stageRef}
              className="founder-stage"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="founder-orbit" aria-hidden="true" />
              <div className="founder-prism founder-prism-a" aria-hidden="true" />
              <div className="founder-prism founder-prism-b" aria-hidden="true" />

              <div className="founder-ring">
                <div className="founder-mat">
                  <span
                    className="founder-corner founder-corner-tl"
                    aria-hidden="true"
                  />
                  <span
                    className="founder-corner founder-corner-tr"
                    aria-hidden="true"
                  />
                  <span
                    className="founder-corner founder-corner-bl"
                    aria-hidden="true"
                  />
                  <span
                    className="founder-corner founder-corner-br"
                    aria-hidden="true"
                  />

                  <div className="founder-photo-wrap">
                    <Image
                      src="/images/home/hero.jpeg"
                      alt="Portrait of Smt. Santosh Arora, Founder of Santosh Arora Trust"
                      fill
                      quality={90}
                      sizes="(max-width: 768px) 92vw, 390px"
                      className="founder-photo"
                    />
                  </div>
                </div>
              </div>

              <div className="founder-plaque">
                <div>
                  <div className="founder-plaque-name">Smt. Santosh Arora</div>
                  <div className="founder-plaque-role">
                    Founder &amp; Guiding Inspiration
                  </div>
                </div>
                <span className="founder-seal">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Santosh Arora Trust
                </span>
              </div>
            </div>
          </MotionReveal>

          <div className="founder-copy">
            <MotionReveal variant="eyebrow">
              <span className="founder-eyebrow">Founder&apos;s Vision</span>
            </MotionReveal>

            <MotionReveal variant="bottomMask" delay={0.05}>
              <h2 id="founder-heading" className="founder-heading">
                The quiet conviction behind every act of service.
              </h2>
            </MotionReveal>

            <MotionReveal variant="fromRight" delay={0.1}>
              <p className="founder-sub">
                Honouring Smt. Santosh Arora — Founder of Santosh Arora Trust
              </p>
            </MotionReveal>

            <MotionReveal variant="fromLeft" delay={0.14}>
              <div className="founder-prose">
                <p>
                  Santosh Arora Trust carries the name, warmth, and enduring
                  humanitarian values of its founder,{" "}
                  <strong>Smt. Santosh Arora</strong>. Established as an
                  irrevocable public charitable trust dedicated to real social
                  upliftment, the trust translates quiet compassion into
                  lasting, structured community support.
                </p>
                <p>
                  Guided by her belief that lasting change begins with dignity
                  and self-reliance, the trust directs its charitable objects
                  toward empowering women, keeping girls and underserved
                  students in school, building practical vocational livelihoods,
                  expanding medical relief, and caring for vulnerable families
                  and our shared environment — openly and without distinction of
                  caste, creed, religion, or background.
                </p>
              </div>
            </MotionReveal>

            <MotionReveal variant="fromRight" delay={0.18}>
              <blockquote className="founder-quote">
                &ldquo;True welfare is measured not in passing gestures, but in
                giving every woman, child, and family the learning, health, and
                dignity to stand strong in their own right.&rdquo;
              </blockquote>
            </MotionReveal>

            <MotionReveal variant="fromLeft" delay={0.22}>
              <div className="founder-pillars">
                <span className="founder-pillar">
                  <span className="founder-pillar-dot" aria-hidden="true" />
                  Education &amp; Women&apos;s Dignity
                </span>
                <span className="founder-pillar">
                  <span className="founder-pillar-dot" aria-hidden="true" />
                  Health &amp; Compassionate Care
                </span>
                <span className="founder-pillar">
                  <span className="founder-pillar-dot" aria-hidden="true" />
                  Irrevocable Public Service
                </span>
              </div>
            </MotionReveal>

            <MotionReveal variant="fromRight" delay={0.26}>
              <div className="founder-actions">
                <Link href="/about" className="founder-btn-primary">
                  Read About the Trust{" "}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="/governance" className="founder-btn-ghost">
                  Trust Deed &amp; Governance
                </Link>
              </div>
            </MotionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
