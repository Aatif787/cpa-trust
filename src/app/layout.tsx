import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import localFont from "next/font/local";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { PageTransition } from "@/components/ui/PageTransition";
import { JsonLd } from "@/components/seo/JsonLd";
import { SANTOSH_ARORA_TRUST } from "@/data/trust";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  SITE_KEYWORDS,
  SITE_URL,
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
} from "@/lib/seo";
import "./globals.css";

const authorFont = localFont({
  src: [
    { path: "../../public/font/Author-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/font/Author-Italic.otf", weight: "400", style: "italic" },
    { path: "../../public/font/Author-Medium.otf", weight: "500", style: "normal" },
    { path: "../../public/font/Author-MediumItalic.otf", weight: "500", style: "italic" },
    { path: "../../public/font/Author-Semibold.otf", weight: "600", style: "normal" },
    { path: "../../public/font/Author-SemiboldItalic.otf", weight: "600", style: "italic" },
    { path: "../../public/font/Author-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-author",
  display: "swap",
});

const heroDisplayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: "normal",
  variable: "--font-hero-display",
  display: "swap",
});

const TRUST_NAME = SANTOSH_ARORA_TRUST.registration.legalName;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TRUST_NAME,
    template: `%s | ${TRUST_NAME}`,
  },
  description:
    "Official website of Santosh Arora Trust, a newly registered public charitable trust in New Delhi working towards education, women empowerment, skill development, healthcare relief, and community welfare.",
  keywords: [...SITE_KEYWORDS],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: TRUST_NAME,
    title: TRUST_NAME,
    description:
      "Official website of Santosh Arora Trust, a newly registered public charitable trust in New Delhi.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1024,
        height: 1024,
        alt: DEFAULT_OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TRUST_NAME,
    description:
      "Official website of Santosh Arora Trust, a newly registered public charitable trust in New Delhi.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${authorFont.variable} ${heroDisplayFont.variable}`}>
      <body className="flex min-h-screen flex-col bg-bg-cream text-text-primary">
        <JsonLd data={[buildOrganizationJsonLd(), buildWebsiteJsonLd()]} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#0d2140] focus:shadow-[var(--shadow-elevated)]"
        >
          Skip to main content
        </a>
        <MotionProvider>
          <CustomCursor />
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
