import type { Metadata } from "next";
import { PetalyxHomeExperience } from "@/components/home/PetalyxHomeExperience";

export const metadata: Metadata = {
  title: {
    absolute: "Santosh Arora Trust — Building a Better Tomorrow, Together",
  },
  description:
    "Santosh Arora Trust is a new public charitable trust. We want to help people through education, support for women, job skills, healthcare and community care.",
};

export default function HomePage() {
  return <PetalyxHomeExperience />;
}
