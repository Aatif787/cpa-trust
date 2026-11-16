export interface NavItem {
  label: string;
  href: string;
  description: string;
  external?: boolean;
}

/**
 * Canonical app routes indexed in sitemap.xml and footer navigation.
 */
export const SITE_ROUTES: readonly NavItem[] = [
  {
    label: "Home",
    href: "/",
    description: "An introduction to Santosh Arora Trust.",
  },
  {
    label: "About",
    href: "/about",
    description: "Why the trust was set up and who runs it.",
  },
  {
    label: "Focus Areas",
    href: "/focus-areas",
    description: "The causes the trust was set up to support.",
  },
  {
    label: "Initiatives",
    href: "/initiatives",
    description: "Work we are planning to start.",
  },
  {
    label: "Governance",
    href: "/governance",
    description: "Registration details and how the trust is run.",
  },
  {
    label: "Vision",
    href: "/impact",
    description: "The future we hope to help build.",
  },
  {
    label: "Contact",
    href: "/contact",
    description: "How to get in touch with us.",
  },
] as const;

/**
 * Top navigation items (includes Parent Company external link right before Contact).
 */
export const HEADER_NAV_ITEMS: readonly NavItem[] = [
  ...SITE_ROUTES.slice(0, -1),
  {
    label: "Parent Company",
    href: "https://cparora.vercel.app/",
    description: "C P Arora Private Limited — official website.",
    external: true,
  },
  SITE_ROUTES[SITE_ROUTES.length - 1],
] as const;
