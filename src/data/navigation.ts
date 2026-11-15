export interface NavItem {
  label: string;
  href: string;
  description: string;
}

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
