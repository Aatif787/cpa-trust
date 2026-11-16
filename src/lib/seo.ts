import type { Metadata } from "next";
import { SANTOSH_ARORA_TRUST, type TrustObjective } from "@/data/trust";

function normalizeSiteUrl(rawUrl?: string): string {
  if (!rawUrl || !rawUrl.trim()) {
    return "https://santosharoratrust.org";
  }

  const trimmed = rawUrl.trim().replace(/\/+$/, "");
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export const HAS_CONFIGURED_SITE_URL = Boolean(
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
);

export const SITE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL
);

export const DEFAULT_OG_IMAGE = "/images/home/children-care.jpg";
export const DEFAULT_OG_IMAGE_ALT =
  "Santosh Arora Trust — Social welfare, education and community care in Delhi";

export const SITE_KEYWORDS = [
  "Santosh Arora Trust",
  "Charitable Trust in Delhi",
  "Social Welfare Organisation",
  "Women Empowerment",
  "Education and Literacy",
  "Skill Development",
  "Healthcare and Medical Relief",
  "Community Development",
  "Charitable Activities",
] as const;

export function absoluteUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export interface PageMetadataOptions {
  path: string;
  title?: string;
  absoluteTitle?: string;
  description: string;
  keywords?: string[];
  ogImage?: {
    url: string;
    width: number;
    height: number;
    alt: string;
  };
  noIndex?: boolean;
}

export function buildPageMetadata({
  path,
  title,
  absoluteTitle,
  description,
  keywords = [],
  ogImage,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const { legalName } = SANTOSH_ARORA_TRUST.registration;
  const resolvedTitle = absoluteTitle
    ? { absolute: absoluteTitle }
    : title ?? legalName;
  const fullOgTitle = absoluteTitle ?? `${title ?? legalName} | ${legalName}`;
  const canonicalUrl = absoluteUrl(path);
  const image = ogImage ?? {
    url: DEFAULT_OG_IMAGE,
    width: 1024,
    height: 1024,
    alt: DEFAULT_OG_IMAGE_ALT,
  };

  return {
    title: resolvedTitle,
    description,
    keywords: Array.from(new Set([...SITE_KEYWORDS, ...keywords])),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noIndex
      ? {
          index: false,
          follow: true,
        }
      : {
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
      siteName: legalName,
      url: canonicalUrl,
      title: fullOgTitle,
      description,
      images: [
        {
          url: absoluteUrl(image.url),
          width: image.width,
          height: image.height,
          alt: image.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullOgTitle,
      description,
      images: [absoluteUrl(image.url)],
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function buildOrganizationJsonLd() {
  const { registration, trustees, deedObjectives } = SANTOSH_ARORA_TRUST;

  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "NGO"],
    "@id": `${SITE_URL}/#organization`,
    name: registration.legalName,
    legalName: registration.legalName,
    url: SITE_URL,
    description:
      "Santosh Arora Trust is a newly registered irrevocable public charitable trust in New Delhi under the Indian Trusts Act, 1882 (Reg. No. 2026/22/IV/1415, NGO DARPAN ID DL/2026/1252835), established for education and literacy, women empowerment, skill development, healthcare and medical relief, social welfare, and community development.",
    email: registration.correspondenceEmail,
    telephone: `+91-${registration.correspondencePhone}`,
    nonprofitStatus: registration.entityType,
    areaServed: {
      "@type": "Country",
      name: registration.charitableAreaOfOperation,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "New Delhi",
      addressRegion: "Delhi",
      addressCountry: "IN",
    },
    identifier: [
      {
        "@type": "PropertyValue",
        name: "Trust Registration Number",
        value: registration.registrationNumber,
      },
      {
        "@type": "PropertyValue",
        name: "NGO DARPAN Unique ID",
        value: registration.darpanId,
      },
    ],
    member: trustees.map((trustee) => ({
      "@type": "Person",
      name: trustee.fullName,
      jobTitle: trustee.deedRole,
    })),
    knowsAbout: deedObjectives.map((obj: TrustObjective) => obj.title),
  };
}

export function buildWebsiteJsonLd() {
  const { legalName } = SANTOSH_ARORA_TRUST.registration;

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: legalName,
    url: SITE_URL,
    inLanguage: "en-IN",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
