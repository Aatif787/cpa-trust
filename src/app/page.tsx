import type { Metadata } from "next";
import { TrustHomeExperience } from "@/components/home/TrustHomeExperience";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: "/",
  absoluteTitle:
    "Santosh Arora Trust — Charitable Trust in New Delhi for Social Welfare",
  description:
    "Santosh Arora Trust is a registered public charitable trust in New Delhi for women empowerment, education, skill development, and healthcare relief.",
  keywords: [
    "Santosh Arora Trust",
    "Charitable Trust in Delhi",
    "Social Welfare Organisation",
    "Women Empowerment",
    "Education and Literacy",
    "Skill Development",
    "Healthcare and Medical Relief",
    "Community Development",
    "Charitable Activities",
  ],
  ogImage: {
    url: "/images/home/children-care.jpg",
    width: 1024,
    height: 1024,
    alt: "Smiling Indian children cradled in caring hands representing Santosh Arora Trust social welfare mission",
  },
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Home", path: "/" }])} />
      <TrustHomeExperience />
    </>
  );
}
