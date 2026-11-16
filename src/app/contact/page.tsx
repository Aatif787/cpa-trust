import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { ContactHero } from "@/components/contact/ContactHero";
import { OfficialContactPanel } from "@/components/contact/OfficialContactPanel";
import { ContactEnquiryForm } from "@/components/contact/ContactEnquiryForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  path: "/contact",
  title: "Contact Us — New Delhi Enquiries & Collaboration",
  description:
    "Reach Santosh Arora Trust via official correspondence email, phone, or enquiry form for partnerships, community programme questions, and verified Trust governance enquiries.",
  keywords: [
    "Contact Santosh Arora Trust",
    "Charitable Trust in Delhi",
    "Social Welfare Organisation",
  ],
  ogImage: {
    url: "/images/contact/conversation.jpg",
    width: 1280,
    height: 853,
    alt: "Community dialogue and official correspondence — Contact Santosh Arora Trust",
  },
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact Us", path: "/contact" },
        ])}
      />
      <ContactHero />

      <Section
        surface="cream"
        spacing="md"
        ariaLabel="Official contact information and enquiry form"
      >
        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <OfficialContactPanel />
          </div>

          <div className="lg:col-span-7">
            <ContactEnquiryForm />
          </div>
        </div>
      </Section>
    </>
  );
}
