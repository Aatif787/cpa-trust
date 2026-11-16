"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { HEADER_NAV_ITEMS } from "@/data/navigation";
import { Container } from "@/components/ui/Container";
import { ScrollProgressBar } from "@/components/ui/MotionReveal";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

export function SiteHeader() {
  const pathname = usePathname();
  const prefersReduced = useSafeReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleBreakpointChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setMobileOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleBreakpointChange);
    return () => mediaQuery.removeEventListener("change", handleBreakpointChange);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ease-out ${
        scrolled || mobileOpen
          ? "border-b border-[#d9e7fb] bg-white"
          : "border-b border-white/80 bg-white/95"
      }`}
    >
      <Container size="wide">
        <div className="flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="group inline-flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#184385]"
          >
            <Image
              src="/brand/logo.png"
              alt="Santosh Arora Trust"
              width={519}
              height={262}
              priority
              className="h-12 w-auto shrink-0 transition-transform duration-300 group-hover:scale-[1.03] sm:h-14"
            />
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex lg:items-center lg:gap-0.5 xl:gap-1.5"
          >
            {HEADER_NAV_ITEMS.map((item) => {
              const isActive = !item.external && (
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`)
              );

              const linkClass = `group relative whitespace-nowrap rounded-full px-2.5 py-2 text-[13px] font-medium transition-colors duration-200 xl:px-3.5 xl:text-sm ${
                isActive
                  ? "text-[#0d2140]"
                  : "text-text-primary/80 hover:bg-[#edf4fd]/70 hover:text-[#0d2140]"
              }`;

              if (item.external) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-3 bottom-1 h-[1.5px] origin-left scale-x-0 rounded-full bg-[#184385]/70 transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:hidden"
                    />
                    {item.label}
                  </a>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={linkClass}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active-pill"
                      aria-hidden="true"
                      transition={
                        prefersReduced
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 420, damping: 34 }
                      }
                      className="absolute inset-0 -z-10 rounded-full bg-[#edf4fd] ring-1 ring-[#77a2e2]/55"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-3 bottom-1 h-[1.5px] origin-left scale-x-0 rounded-full bg-[#184385]/70 transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:hidden"
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-warm bg-bg-white text-text-primary transition-colors hover:border-brand-forest/40 hover:bg-bg-sage-wash lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      <AnimatePresence initial={false}>
        {mobileOpen ? (
          <motion.nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border-warm bg-bg-white lg:hidden"
          >
            <Container className="py-4">
              <ul className="flex flex-col gap-1.5">
                {HEADER_NAV_ITEMS.map((item) => {
                  const isActive = !item.external && (
                    item.href === "/"
                      ? pathname === "/"
                      : pathname === item.href || pathname.startsWith(`${item.href}/`)
                  );
                  const mobileClass = `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-bg-lavender-wash text-brand-forest ring-1 ring-brand-lavender/45"
                      : "text-text-primary hover:bg-bg-cream-soft hover:text-brand-forest"
                  }`;

                  return (
                    <li key={item.href}>
                      {item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setMobileOpen(false)}
                          className={mobileClass}
                        >
                          <span>{item.label}</span>
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          aria-current={isActive ? "page" : undefined}
                          onClick={() => setMobileOpen(false)}
                          className={mobileClass}
                        >
                          <span>{item.label}</span>
                          {isActive ? (
                            <span
                              aria-hidden="true"
                              className="h-1.5 w-1.5 rounded-full bg-brand-orange"
                            />
                          ) : null}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Container>
          </motion.nav>
        ) : null}
      </AnimatePresence>

      <ScrollProgressBar />
    </header>
  );
}
