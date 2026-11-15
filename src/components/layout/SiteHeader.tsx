"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { SITE_ROUTES } from "@/data/navigation";
import { Container } from "@/components/ui/Container";

export function SiteHeader() {
  const pathname = usePathname();
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

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ease-out ${
        scrolled || mobileOpen
          ? "border-b border-border-warm/90 bg-bg-white/95 shadow-[var(--shadow-header)] backdrop-blur-md"
          : "border-b border-transparent bg-bg-cream/65 backdrop-blur-sm"
      }`}
    >
      <Container size="wide">
        <div className="flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
          {/* Temporary typographic wordmark until an official Trust logo is approved */}
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="group inline-flex flex-col leading-none focus-visible:rounded-md"
          >
            <span className="font-serif text-xl font-semibold tracking-tight text-text-primary transition-colors group-hover:text-brand-forest sm:text-2xl">
              Santosh Arora Trust
            </span>
            <span className="mt-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
              <span
                aria-hidden="true"
                className="inline-block h-px w-4 bg-brand-orange transition-all duration-300 group-hover:w-6"
              />
              Public Charitable Trust
            </span>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex lg:items-center lg:gap-1 xl:gap-1.5"
          >
            {SITE_ROUTES.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-medium transition-colors duration-200 xl:px-3.5 xl:text-sm ${
                    isActive
                      ? "bg-bg-lavender-wash text-brand-forest ring-1 ring-brand-lavender/50"
                      : "text-text-primary/80 hover:bg-bg-white/80 hover:text-brand-forest"
                  }`}
                >
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
                {SITE_ROUTES.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-bg-lavender-wash text-brand-forest ring-1 ring-brand-lavender/45"
                            : "text-text-primary hover:bg-bg-cream-soft hover:text-brand-forest"
                        }`}
                      >
                        <span>{item.label}</span>
                        {isActive ? (
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 rounded-full bg-brand-orange"
                          />
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Container>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
