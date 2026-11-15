/**
 * Single source of truth for verified Santosh Arora Trust records.
 *
 * Source documents inspected directly (full text and scanned pages):
 * 1. public/brand/Darpan_ABPTS9120D_registration_.pdf (2 pages, generated 28-10-2026)
 * 2. public/brand/Santosh Arora Trust_Deed & Certificate_Duly True Copy Signed.pdf (24 pages)
 *
 * Strict editorial & legal rules enforced by this file:
 * - Zero personal sensitive details (no Aadhaar, PAN, DOB, personal residential
 *   addresses, personal mobile numbers, personal emails, or bank account numbers).
 * - Disputed or inconsistent fields across documents are recorded with exact page
 *   references in `verificationConflicts` and kept null in public display fields
 *   until formally clarified.
 * - Stated Trust Deed objectives, planned future initiatives, and conducted
 *   activities (currently none) are strictly separated.
 * - No tax exemption (12A / 80G) or FCRA approval is claimed without certificates.
 */

export type ActivityClassification =
  | "deed_objective"
  | "planned_initiative"
  | "conducted_activity";

export interface SourceCitation {
  document: "DARPAN" | "TRUST_DEED";
  page: string;
  excerpt: string;
}

export interface DocumentConflict {
  field: string;
  summary: string;
  status: "requires_confirmation";
  publicDisplayPolicy: string;
  references: readonly SourceCitation[];
}

export interface TrustRegistrationRecord {
  legalName: string;
  entityType: string;
  registrationStatus: "newly_registered";
  isIrrevocable: boolean;
  /** Published only when undisputed across documents. */
  registrationNumber: string;
  bookNumber: string;
  volumeNumber: string;
  pageRange: string;
  proofingNumber: string;
  registeringAuthority: string;
  applicableLaw: string;
  jurisdiction: string;
  charitableAreaOfOperation: string;
  darpanId: string;
  darpanStatus: "Active";
  darpanPrimarySector: string;
  darpanSecondarySector: string;
  correspondenceEmail: string;
  /** Kept null until exact registration date discrepancy (12 Oct vs 13 Oct vs 28 Oct 2026) is clarified. */
  registrationDate: string | null;
  /** Kept null until exact canonical street address formatting across Deed p. 5, e-Stamp p. 1 & DARPAN p. 1 is confirmed. */
  registeredOfficeAddress: string | null;
  /** Kept null for public display until Rs. 11,000 corpus vs Rs. 0 consideration / Schedule wording is clarified. */
  initialCorpusNote: string | null;
  documentsVerifiedInRepo: boolean;
}

export interface TrusteeRecord {
  fullName: string;
  deedRole: string;
  darpanDesignation: string;
  summary: string;
}

export interface TrustObjective {
  id: string;
  clauseRef: string;
  groupAnchor: string;
  title: string;
  summary: string;
  classification: "deed_objective";
  sourcePage: string;
}

export interface GovernanceProvision {
  id: string;
  clauseRef: string;
  category:
    | "board"
    | "meetings"
    | "financial"
    | "accountability"
    | "continuity";
  title: string;
  summary: string;
  sourcePage: string;
}

export interface PlannedInitiative {
  id: string;
  number: string;
  title: string;
  alignedObjectives: readonly string[];
  summary: string;
  classification: "planned_initiative";
  status: "planning";
}

export interface PlannedDirection {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  alignedObjectives: readonly string[];
  intendedForms: readonly string[];
  summary: string;
  status: "planned";
}

export interface RegulatoryApprovalStatus {
  has12A: boolean;
  has80G: boolean;
  hasFCRA: boolean;
  darpanFcraStatus: "NO";
  documentedEvidenceAttached: boolean;
  fcraClauseNote: string;
  disclosureNote: string;
}

export interface TrustProfile {
  registration: TrustRegistrationRecord;
  preamblePurpose: string;
  intendedBeneficiaryScope: string;
  objectProvisos: readonly string[];
  trustees: readonly TrusteeRecord[];
  trusteeGovernanceSummary: {
    minimumTrustees: number;
    maximumTrustees: number;
    currentCount: number;
    vacancyFillDays: number;
    newTrusteeVotingRule: string;
    removalVotingRule: string;
    chairpersonProvision: string;
  };
  deedObjectives: readonly TrustObjective[];
  governanceProvisions: readonly GovernanceProvision[];
  plannedInitiatives: readonly PlannedInitiative[];
  plannedDirections: readonly PlannedDirection[];
  conductedActivities: readonly never[];
  regulatoryStatus: RegulatoryApprovalStatus;
  verificationConflicts: readonly DocumentConflict[];
}

export const SANTOSH_ARORA_TRUST: TrustProfile = {
  registration: {
    legalName: "Santosh Arora Trust",
    entityType: "Irrevocable Public Charitable Trust",
    registrationStatus: "newly_registered",
    isIrrevocable: true,
    registrationNumber: "2026/22/IV/1415",
    bookNumber: "IV",
    volumeNumber: "15475",
    pageRange: "127 to 150",
    proofingNumber: "2026/22/15392",
    registeringAuthority:
      "Office of the Sub-Registrar, Patel Nagar, New Delhi",
    applicableLaw: "The Indian Trusts Act, 1882",
    jurisdiction: "West Delhi / New Delhi, India",
    charitableAreaOfOperation: "India",
    darpanId: "DL/2026/1252835",
    darpanStatus: "Active",
    darpanPrimarySector: "Women's Development & Empowerment",
    darpanSecondarySector: "Education & Literacy",
    correspondenceEmail: "santosharorafoundation@gmail.com",
    registrationDate: null,
    registeredOfficeAddress: null,
    initialCorpusNote: null,
    documentsVerifiedInRepo: true,
  },

  preamblePurpose:
    "Santosh Arora Trust was set up only for charity, not to make a profit. Its main aim is to support women and help the wider public.",

  intendedBeneficiaryScope:
    "We want to help people across India, especially women, children, young people, older people, people with disabilities and families with low incomes. Everyone is welcome, whatever their religion, caste or beliefs.",

  objectProvisos: [
    "The trust will not run a business or charge fees for services. The only exception is small work that directly supports its charity goals, and that work must have its own separate accounts.",
    "All of the trust's money and property will be used only for charity, and only in India.",
  ],

  trustees: [
    {
      fullName: "Karun Arora",
      deedRole: "Settlor & First Trustee",
      darpanDesignation: "President (Registered Chief Functionary)",
      summary:
        "Founder of the trust and one of its first trustees. Listed as President on NGO DARPAN.",
    },
    {
      fullName: "Ridhima Arora",
      deedRole: "First Trustee",
      darpanDesignation: "Trustee",
      summary:
        "One of the first trustees. Helps guide how the trust is run and how its work is planned.",
    },
    {
      fullName: "Vansh Arora",
      deedRole: "First Trustee",
      darpanDesignation: "Trustee",
      summary:
        "One of the first trustees. Helps with the trust's day-to-day running and planning.",
    },
    {
      fullName: "Manan Arora",
      deedRole: "First Trustee",
      darpanDesignation: "Trustee",
      summary:
        "One of the first trustees. Takes part in board decisions and keeps an eye on the trust's work.",
    },
  ],

  trusteeGovernanceSummary: {
    minimumTrustees: 3,
    maximumTrustees: 7,
    currentCount: 4,
    vacancyFillDays: 90,
    newTrusteeVotingRule: "All current trustees must agree.",
    removalVotingRule: "Two-thirds of all current trustees must agree.",
    chairpersonProvision:
      "The trustees can choose one of themselves as Chairperson to handle day-to-day work (Clause 5(e)).",
  },

  deedObjectives: [
    {
      id: "women-empowerment-and-protection",
      clauseRef: "Clause 4(a)",
      groupAnchor: "women-empowerment",
      title: "Women's Empowerment and Protection",
      summary:
        "Help women, especially from poor families, gain education, income and legal rights. Stand against unfair treatment, violence, abuse and trafficking. Support women in trouble with counselling, legal help, shelter and care.",
      classification: "deed_objective",
      sourcePage: "Trust Deed PDF p. 5 (::3::)",
    },
    {
      id: "skill-development-and-livelihood",
      clauseRef: "Clause 4(b)",
      groupAnchor: "skill-development",
      title: "Skills and Jobs",
      summary:
        "Teach practical work skills, money management and how to start a small business. Help women and low-income families earn a living, including through self-help groups.",
      classification: "deed_objective",
      sourcePage: "Trust Deed PDF p. 5 (::3::)",
    },
    {
      id: "education-and-literacy",
      clauseRef: "Clause 4(c)",
      groupAnchor: "education-literacy",
      title: "Education and Literacy",
      summary:
        "Help girls and students from poor families keep studying, with scholarships, books, uniforms and other support. Support schools, training centres and libraries.",
      classification: "deed_objective",
      sourcePage: "Trust Deed PDF p. 7 (::4::)",
    },
    {
      id: "medical-relief-and-public-health",
      clauseRef: "Clause 4(d)",
      groupAnchor: "healthcare-medical-relief",
      title: "Healthcare and Public Health",
      summary:
        "Give medical help and promote good health: nutrition, clean surroundings, care for mothers and children, and mental health. This includes health camps, awareness drives, help to quit addiction and support for free clinics.",
      classification: "deed_objective",
      sourcePage: "Trust Deed PDF p. 7 (::4::)",
    },
    {
      id: "relief-of-poor-and-distressed",
      clauseRef: "Clause 4(e)",
      groupAnchor: "social-welfare-relief",
      title: "Help for People in Need",
      summary:
        "Give care and support to poor and vulnerable people, including widows, older people, children in need and people with disabilities.",
      classification: "deed_objective",
      sourcePage: "Trust Deed PDF p. 7 (::4::)",
    },
    {
      id: "legal-literacy-and-aid",
      clauseRef: "Clause 4(f)",
      groupAnchor: "social-welfare-relief",
      title: "Legal Awareness and Help",
      summary:
        "Help people understand their legal rights and the government benefits they can claim. Help poor people get free or low-cost legal support.",
      classification: "deed_objective",
      sourcePage: "Trust Deed PDF p. 7 (::4::)",
    },
    {
      id: "disaster-relief",
      clauseRef: "Clause 4(g)",
      groupAnchor: "social-welfare-relief",
      title: "Disaster Relief",
      summary:
        "Give quick help and support to people and communities hit by natural disasters or other emergencies.",
      classification: "deed_objective",
      sourcePage: "Trust Deed PDF p. 7 (::4::)",
    },
    {
      id: "environment-conservation",
      clauseRef: "Clause 4(h)",
      groupAnchor: "environment-community-development",
      title: "Environment and Cleanliness",
      summary:
        "Protect the environment by planting trees, keeping neighbourhoods clean and improving sanitation.",
      classification: "deed_objective",
      sourcePage: "Trust Deed PDF p. 7 (::4::)",
    },
    {
      id: "yoga-and-wellness",
      clauseRef: "Clause 4(i)",
      groupAnchor: "healthcare-medical-relief",
      title: "Yoga, Fitness and Self-Defence",
      summary:
        "Encourage yoga, exercise and self-defence training, especially for women, young people and children.",
      classification: "deed_objective",
      sourcePage: "Trust Deed PDF p. 7 (::4::)",
    },
    {
      id: "incidental-awareness-and-research",
      clauseRef: "Clause 4(j)",
      groupAnchor: "education-literacy",
      title: "Awareness Programmes, Surveys and Research",
      summary:
        "Run awareness programmes, surveys, research and non-profit publications that support the trust's charity goals.",
      classification: "deed_objective",
      sourcePage: "Trust Deed PDF p. 7 (::4::)",
    },
  ],

  governanceProvisions: [
    {
      id: "board-composition",
      clauseRef: "Clause 5(a)–(e)",
      category: "board",
      title: "Number of Trustees",
      summary:
        "The trust must always have between 3 and 7 trustees. If there are fewer than 3, the others must add a new trustee within 90 days. Adding a trustee needs everyone to agree. Removing one needs two-thirds to agree.",
      sourcePage: "Trust Deed PDF p. 9 (::5::)",
    },
    {
      id: "collective-decisions-and-quorum",
      clauseRef: "Clause 6(a)–(c)",
      category: "meetings",
      title: "How Decisions Are Made",
      summary:
        "Trustees make decisions together. A decision needs at least two-thirds of the trustees at the meeting to agree. At least 2 trustees, or one-third of the board (whichever is more), must be present. Written decisions shared by post or email also need two-thirds of all trustees to agree.",
      sourcePage: "Trust Deed PDF p. 9 & 11 (::5::–::6::)",
    },
    {
      id: "meeting-frequency-and-notice",
      clauseRef: "Clause 6(d)–(f)",
      category: "meetings",
      title: "Meetings",
      summary:
        "The trustees must meet at least once a year, with at least 7 days' notice in writing or by email. In urgent cases, the Chairperson or any two trustees can call a meeting with 24 hours' notice, and the reason is written in the minutes.",
      sourcePage: "Trust Deed PDF p. 11 (::6::)",
    },
    {
      id: "no-private-benefit",
      clauseRef: "Clause 8(a)–(e)",
      category: "accountability",
      title: "No Personal Profit",
      summary:
        "All of the trust's money and property must be used only for its charity goals. The founder, trustees, their relatives and large donors cannot receive any profit or bonus. They can only be paid back for real costs they spent on trust work.",
      sourcePage: "Trust Deed PDF p. 13 (::7::)",
    },
    {
      id: "delegation-safeguards",
      clauseRef: "Clause 9(f), 9(o)",
      category: "accountability",
      title: "Limits on Handing Over Work",
      summary:
        "The trustees can set up committees for everyday tasks. But they cannot hand over the most important decisions: how money is invested, selling property, and how income is spent (Clause 9(o)).",
      sourcePage: "Trust Deed PDF p. 15 & 17 (::8::–::9::)",
    },
    {
      id: "accounts-banking-and-audit",
      clauseRef: "Clauses 7(v), 10, 11, 13(a)–(c)",
      category: "financial",
      title: "Accounts and Yearly Audit",
      summary:
        "The trust's year runs from 1 April to 31 March. It keeps correct records of all money coming in and going out, in the trust's own name. Money is kept in recognised banks and invested only in ways allowed by tax law. Accounts are checked by an auditor every year, and the reports go to the trustees within six months of the year ending.",
      sourcePage: "Trust Deed PDF p. 11, 17 & 19 (::6::, ::9::, ::10::)",
    },
    {
      id: "irrevocability-and-dissolution",
      clauseRef: "Clauses 13(d), 14, 15",
      category: "continuity",
      title: "If the Trust Ever Closes",
      summary:
        "The trust cannot be cancelled or taken back (Clause 14). If it ever closes, anything left must go only to another registered charity with similar goals.",
      sourcePage: "Trust Deed PDF p. 19 (::10::)",
    },
  ],

  plannedInitiatives: [
    {
      id: "women-empowerment-and-livelihood-planning",
      number: "01",
      title: "Support for Women and Their Income",
      alignedObjectives: ["Clause 4(a)", "Clause 4(b)"],
      summary:
        "Planning programmes on women's rights, counselling support, self-help groups, money skills and job-skill workshops.",
      classification: "planned_initiative",
      status: "planning",
    },
    {
      id: "education-and-literacy-planning",
      number: "02",
      title: "Education and Student Support",
      alignedObjectives: ["Clause 4(c)", "Clause 4(j)"],
      summary:
        "Planning help with reading and writing, books and uniforms, libraries, and scholarship advice for students who need it.",
      classification: "planned_initiative",
      status: "planning",
    },
    {
      id: "preventive-health-and-wellness-planning",
      number: "03",
      title: "Health, Nutrition and Wellness",
      alignedObjectives: ["Clause 4(d)", "Clause 4(i)"],
      summary:
        "Planning health awareness talks, good food for mothers and children, free health check-up camps and fitness programmes for young people.",
      classification: "planned_initiative",
      status: "planning",
    },
    {
      id: "welfare-legal-and-environment-planning",
      number: "04",
      title: "Welfare, Legal Help and Environment",
      alignedObjectives: [
        "Clause 4(e)",
        "Clause 4(f)",
        "Clause 4(g)",
        "Clause 4(h)",
      ],
      summary:
        "Planning support for older people, widows and families in need, along with legal rights awareness and local clean-up drives.",
      classification: "planned_initiative",
      status: "planning",
    },
  ],

  plannedDirections: [
    {
      id: "planned-education-learning",
      number: "01",
      title: "Education & Learning Support",
      subtitle: "Planned under Clause 4(c) & Clause 4(j)",
      alignedObjectives: ["Clause 4(c)", "Clause 4(j)"],
      intendedForms: [
        "Books, school uniforms and study materials",
        "Scholarships for girls and students who need help",
        "Local libraries, reading help and surveys on education needs",
      ],
      summary:
        "To help girls and students from low-income families keep learning, with study support and local reading programmes.",
      status: "planned",
    },
    {
      id: "planned-womens-empowerment",
      number: "02",
      title: "Women's Empowerment",
      subtitle: "Planned under Clause 4(a) · our main area on DARPAN",
      alignedObjectives: ["Clause 4(a)"],
      intendedForms: [
        "Teaching women about their legal, education and social rights",
        "Counselling, legal help and other support",
        "Safety and support for women in trouble",
      ],
      summary:
        "Supporting women is our main goal. We want to help women live with respect, stay safe from abuse and unfair treatment, and find people who can support them.",
      status: "planned",
    },
    {
      id: "planned-vocational-livelihood",
      number: "03",
      title: "Job Skills & Income",
      subtitle: "Planned under Clause 4(b)",
      alignedObjectives: ["Clause 4(b)"],
      intendedForms: [
        "Hands-on job skill workshops",
        "Basic money skills and help starting a small business",
        "Setting up self-help groups for women and low-income families",
      ],
      summary:
        "To help young people, women and families in need learn skills that help them earn a steady income.",
      status: "planned",
    },
    {
      id: "planned-healthcare-awareness",
      number: "04",
      title: "Healthcare Awareness",
      subtitle: "Planned under Clause 4(d) & Clause 4(i)",
      alignedObjectives: ["Clause 4(d)", "Clause 4(i)"],
      intendedForms: [
        "Talks on staying healthy, good food, mothers' health and mental health",
        "Health camps and help to quit addiction",
        "Yoga, exercise and self-defence classes for women and young people",
      ],
      summary:
        "To teach people how to stay healthy, eat well and keep clean surroundings, working with trained doctors and health workers.",
      status: "planned",
    },
    {
      id: "planned-community-welfare",
      number: "05",
      title: "Community Welfare",
      subtitle: "Planned under Clause 4(e), 4(f) & 4(g)",
      alignedObjectives: ["Clause 4(e)", "Clause 4(f)", "Clause 4(g)"],
      intendedForms: [
        "Care for widows, older people, children and people with disabilities",
        "Classes on legal rights and government benefits",
        "Being ready to help during disasters and emergencies",
      ],
      summary:
        "To support people going through hard times, help them understand their legal rights, and help during emergencies.",
      status: "planned",
    },
    {
      id: "planned-environmental-initiatives",
      number: "06",
      title: "Environment",
      subtitle: "Planned under Clause 4(h)",
      alignedObjectives: ["Clause 4(h)"],
      intendedForms: [
        "Tree-planting drives",
        "Clean-up drives and awareness about cleanliness",
        "Getting neighbours to look after their surroundings together",
      ],
      summary:
        "To encourage cleaner, greener neighbourhoods and get people involved in caring for their surroundings.",
      status: "planned",
    },
  ],

  conductedActivities: [],

  regulatoryStatus: {
    has12A: false,
    has80G: false,
    hasFCRA: false,
    darpanFcraStatus: "NO",
    documentedEvidenceAttached: false,
    fcraClauseNote:
      "The trust cannot accept money from outside India unless it first gets permission under the FCRA law of 2010 (Clause 7(i) of the Trust Deed). NGO DARPAN lists FCRA as 'NO'.",
    disclosureNote:
      "Santosh Arora Trust is a new public charitable trust registered on NGO DARPAN (DL/2026/1252835). It cannot accept foreign donations (FCRA: NO). It does not claim 12A or 80G tax benefits, because it does not have those certificates yet.",
  },

  verificationConflicts: [
    {
      field: "Registration date",
      summary:
        "Three dates appear across the registration record and Trust Deed PDF: deed execution/presentation and DARPAN NPO registration state 12-Oct-2026, the Section 60 Registration Certificate records 13-Oct-2026, and the DARPAN header displays 28-Oct-2026 (matching DARPAN printout generation).",
      status: "requires_confirmation",
      publicDisplayPolicy:
        "Our documents show more than one date. We will show it once the trustees confirm which date is the official one.",
      references: [
        {
          document: "TRUST_DEED",
          page: "PDF p. 1, 3, 4, 6",
          excerpt:
            "e-Stamp issued 12-Oct-2026; Deed executed 12th day of October 2026; presented at Sub-Registrar office on 12-10-2026.",
        },
        {
          document: "TRUST_DEED",
          page: "PDF p. 24 (Certificate Section 60)",
          excerpt:
            "Registration No: 2026/22/IV/1415 in Book No: IV, Volume No: 15475, Page No. 127 to 150 on this date 13-Oct-2026 day Tuesday.",
        },
        {
          document: "DARPAN",
          page: "PDF p. 1",
          excerpt:
            "Header bar: 'Registration Date: 28-10-2026' (also 'Generated on: 28-10-2026'); NPO Details section: 'Date of Registration: 12-10-2026'.",
        },
      ],
    },
    {
      field: "Exact office address wording",
      summary:
        "All records point to the same premises at 2A/8A, Third Floor, Municipal No. 63, Rama Road, Najafgarh Road Industrial Area, New Delhi - 110015, but exact wording, locality tags, and spelling vary across three locations (including a 'MINICIPAL' typo in Deed Clause 2, landmark 'NEAR ANDAZ BANQUET' in Deed Clause 2, and 'Patel Nagar' in DARPAN).",
      status: "requires_confirmation",
      publicDisplayPolicy:
        "The address is written slightly differently in each document. Until the trustees confirm the correct wording, we only show the area (West Delhi / New Delhi, India).",
      references: [
        {
          document: "TRUST_DEED",
          page: "PDF p. 1 (e-Stamp Property Description)",
          excerpt:
            "SANTOSH ARORA TRUST, AT 2A/8A, THIRD FLOOR, MUNICIPAL NO. 63, RAMA ROAD, NAJAFGARH ROAD INDUSTRIAL AREA, NEW DELHI-110015",
        },
        {
          document: "TRUST_DEED",
          page: "PDF p. 5 (::3:: Clause 2)",
          excerpt:
            "HOUSE NO. 2A/8A, THIRD FLOOR, MINICIPAL NO. 63, RAMA ROAD, NAJAFGARH ROAD INDUSTRIAL AREA, NEAR ANDAZ BANQUET, NEW DELHI, DELHI-110015",
        },
        {
          document: "DARPAN",
          page: "PDF p. 1 (NPO Address)",
          excerpt:
            "2A/8A, Third Floor, Municipal No 63, Rama Road, Najafgarh Road Industrial Area, New Delhi, Patel Nagar - 110015 (District: WEST (Delhi))",
        },
      ],
    },
    {
      field: "Starting fund amount",
      summary:
        "Clause 1 and the Schedule specify an initial Trust/Corpus Fund settlement of Rs. 11,000/-, whereas registration summary metadata records Consideration Value as Rs. 0/-, and the Schedule preamble contains a boilerplate reference to 'immovable properties' without listing any immovable asset.",
      status: "requires_confirmation",
      publicDisplayPolicy:
        "We are not showing the starting fund amount until the trustees confirm the correct figure.",
      references: [
        {
          document: "TRUST_DEED",
          page: "PDF p. 1 (e-Stamp) & p. 4 (Deed Related Details)",
          excerpt: "Consideration Price / Consideration Value: Rs 0/- (Zero).",
        },
        {
          document: "TRUST_DEED",
          page: "PDF p. 3 (::2:: Clause 1)",
          excerpt:
            "Settlor hereby irrevocably transfers, conveys and assigns unto the Trustees an amount of Rs. 11,000/- (Rupees Eleven Thousand Only).",
        },
        {
          document: "TRUST_DEED",
          page: "PDF p. 21 (::12:: Schedule)",
          excerpt:
            "Refers to 'other than the Trust Fund and the immovable properties, donated by the SETTLOR, as described in the Schedule below' followed only by: 'Contribution to the Corpus Fund of the Trust of Rs. 11,000/- (Rupees Eleven Thousand only).'",
        },
      ],
    },
    {
      field: "Head of trust title and email",
      summary:
        "The Trust Deed defines 'Settlor' and 'Trustees' and provides for appointing a 'Chairperson' by resolution (Clause 5(e)), whereas DARPAN designates Karun Arora as 'President' and lists 'santosharorafoundation@gmail.com' (using 'foundation' rather than 'trust').",
      status: "requires_confirmation",
      publicDisplayPolicy:
        "We show both the Trust Deed role and the DARPAN title. We also show the official email listed on DARPAN until any new trust email is confirmed.",
      references: [
        {
          document: "TRUST_DEED",
          page: "PDF p. 6 & p. 9 (::5:: Clause 5(e))",
          excerpt:
            "Registration Summary lists Karun Arora as Author and Vansh/Manan/Ridhima as Trustees; Clause 5(e) authorizes appointing one Trustee as Chairperson by resolution.",
        },
        {
          document: "DARPAN",
          page: "PDF p. 1",
          excerpt:
            "Registered Chief Functionary Designation: President (Karun Arora); NPO Contact Email: santosharorafoundation@gmail.com.",
        },
      ],
    },
  ],
};
