import type { Metadata } from "next";
import { Cormorant_Garamond, Inter_Tight, Plus_Jakarta_Sans } from "next/font/google";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { PageTransition } from "@/components/ui/PageTransition";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Santosh Arora Trust",
    template: "%s | Santosh Arora Trust",
  },
  description:
    "Official website of Santosh Arora Trust, a newly registered public charitable trust.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${cormorant.variable} ${interTight.variable}`}>
      <body className="flex min-h-screen flex-col bg-bg-cream text-text-primary">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-forest focus:shadow-[var(--shadow-elevated)]"
        >
          Skip to main content
        </a>
        <MotionProvider>
          <SiteHeader />
          <main id="main-content" className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
