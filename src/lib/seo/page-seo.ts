/** On-page SEO definitions — titles, descriptions, and keyword targets per route. */

export const homePageSeo = {
  path: "/",
  title: "Klikktek | Custom Web Development & SEO Agency USA",
  description:
    "Klikktek builds fast custom web apps, AI chatbots, and data-driven SEO strategies for US businesses. Get measurable growth, higher rankings, and more qualified leads.",
  primaryKeyword: "custom web development agency USA",
  secondaryKeywords: [
    "SEO agency for small business",
    "Next.js development company",
    "AI chatbot development services",
  ],
  semanticKeywords: [
    "technical SEO audit",
    "web application development",
    "organic traffic growth",
    "lead generation website",
    "San Francisco digital agency",
  ],
} as const;

export const siteFaqs = [
  {
    question: "What services does Klikktek offer?",
    answer:
      "Klikktek provides custom web application development (React/Next.js), AI chatbot development with CRM integration, technical and local SEO, and ongoing website maintenance for growing US businesses.",
  },
  {
    question: "Who does Klikktek work with?",
    answer:
      "We partner with US-based small and mid-size businesses, retail operators, SaaS teams, and marketing departments that need reliable web products and measurable organic growth.",
  },
  {
    question: "How long does a typical web project take?",
    answer:
      "Most custom web application projects run 8–12 weeks from discovery through launch, depending on scope, integrations, and content readiness.",
  },
  {
    question: "Do you offer SEO without web development?",
    answer:
      "Yes. We offer standalone technical SEO audits, keyword strategy, local SEO programs, and ongoing content optimization for existing websites.",
  },
  {
    question: "How quickly will you respond to a project inquiry?",
    answer:
      "We respond to new project inquiries within one US business day with next steps, timeline guidance, and availability.",
  },
] as const;
