import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { ContactHero } from "@/components/contact/ContactHero";
import { OfficialContactPanel } from "@/components/contact/OfficialContactPanel";
import { ContactEnquiryForm } from "@/components/contact/ContactEnquiryForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Santosh Arora Trust by email or through our message form.",
};

export default function ContactPage() {
  return (
    <>
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
