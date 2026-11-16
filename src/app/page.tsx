import type { Metadata } from "next";
import { TrustHomeExperience } from "@/components/home/TrustHomeExperience";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: "/",
  absoluteTitle:
    "Santosh Arora Trust — Charitable Trust in New Delhi for Social Welfare",
  description:
    "Official website of Santosh Arora Trust, a newly registered public charitable trust in Delhi working towards education and literacy, women empowerment, skill development, healthcare and medical relief, and community development.",
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
