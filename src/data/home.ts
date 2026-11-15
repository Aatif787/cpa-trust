import { SANTOSH_ARORA_TRUST } from "@/data/trust";

export interface HomeFocusArea {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  accentTone: "lavender" | "lime" | "orange";
}

export interface HomeInitiativeTrack {
  id: string;
  number: string;
  title: string;
  summary: string;
  statusLabel: string;
}

export const HOME_FOCUS_AREAS: readonly HomeFocusArea[] = [
  {
    id: "women-empowerment",
    title: "Women Empowerment",
    description:
      "Helping women grow in education, income and legal rights, with counselling, legal help and safe support when they need it.",
    imageSrc: "/images/home/focus-women.jpg",
    imageAlt:
      "Woman artisan weaving brightly coloured threads on a traditional handloom",
    accentTone: "lavender",
  },
  {
    id: "education-literacy",
    title: "Education & Literacy",
    description:
      "Scholarships, books, uniforms and libraries for girls and students who need help to keep studying.",
    imageSrc: "/images/home/focus-education.jpg",
    imageAlt:
      "Students reading and studying together at shared tables in a public library",
    accentTone: "lime",
  },
  {
    id: "skill-development",
    title: "Skill Development",
    description:
      "Job skills, money skills and help starting small businesses, including through self-help groups.",
    imageSrc: "/images/home/focus-skills.jpg",
    imageAlt:
      "Close-up of a tailor guiding striped fabric carefully under a sewing machine needle",
    accentTone: "orange",
  },
  {
    id: "healthcare-medical-relief",
    title: "Healthcare & Medical Relief",
    description:
      "Medical help, health awareness, good nutrition, care for mothers and children, mental health and yoga.",
    imageSrc: "/images/home/focus-healthcare.jpg",
    imageAlt: "Physician in a clinic consultation room reviewing notes at her desk",
    accentTone: "lavender",
  },
  {
    id: "social-welfare-relief",
    title: "Social Welfare & Relief",
    description:
      "Care for widows, older people, children and people with disabilities, plus legal help and disaster relief.",
    imageSrc: "/images/home/focus-welfare.jpg",
    imageAlt:
      "Community members sharing a warm meal seated together in a communal hall",
    accentTone: "orange",
  },
  {
    id: "environment-community-development",
    title: "Environment & Sanitation",
    description:
      "Planting trees, keeping neighbourhoods clean and improving sanitation.",
    imageSrc: "/images/home/focus-environment.jpg",
    imageAlt:
      "Community planters carrying bundles of young tree saplings along a woodland trail",
    accentTone: "lime",
  },
] as const;

export const HOME_PLANNED_INITIATIVES: readonly HomeInitiativeTrack[] =
  SANTOSH_ARORA_TRUST.plannedInitiatives.map((item) => ({
    id: item.id,
    number: item.number,
    title: item.title,
    summary: item.summary,
    statusLabel: "In Planning",
  }));
