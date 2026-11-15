import type { ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { EyebrowTone } from "@/components/ui/Eyebrow";

interface PageScaffoldProps {
  eyebrow: string;
  title: string;
  lead: string;
  accent?: "lime" | "orange" | "lavender";
  children?: ReactNode;
}

const ACCENT_TO_TONE: Record<
  NonNullable<PageScaffoldProps["accent"]>,
  EyebrowTone
> = {
  lime: "lime",
  orange: "orange",
  lavender: "lavender",
};

export function PageScaffold({
  eyebrow,
  title,
  lead,
  accent = "lavender",
  children,
}: PageScaffoldProps) {
  return (
    <div>
      <Section surface="luminous" spacing="md" separatorBottom>
        <SectionHeading
          eyebrow={eyebrow}
          eyebrowTone={ACCENT_TO_TONE[accent]}
          title={title}
          lead={lead}
          as="h1"
          size="h1"
        />
      </Section>

      {children ? (
        <Section surface="cream" spacing="md">
          {children}
        </Section>
      ) : null}
    </div>
  );
}
