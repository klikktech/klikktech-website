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

export const servicesPageSeo = {
  path: "/services",
  title: "Web Development, Chatbots & SEO Services",
  description:
    "Explore Klikktek services: custom React/Next.js web apps, CRM-integrated AI chatbots, technical SEO, local SEO, and ongoing website support for US companies.",
  primaryKeyword: "web development and SEO services",
  secondaryKeywords: [
    "custom web application development",
    "business chatbot development",
    "technical SEO services USA",
  ],
  semanticKeywords: [
    "React Next.js agency",
    "local SEO for businesses",
    "website maintenance support",
    "conversion-focused web design",
  ],
} as const;

export const projectsPageSeo = {
  path: "/projects",
  title: "Web Development & SEO Portfolio | Case Studies",
  description:
    "See how Klikktek delivers results: inventory dashboards, e-commerce platforms, local SEO campaigns, and AI support bots for US retail and SaaS clients.",
  primaryKeyword: "web development portfolio case studies",
  secondaryKeywords: [
    "SEO case study examples",
    "custom web app portfolio",
    "chatbot development projects",
  ],
  semanticKeywords: [
    "e-commerce dashboard development",
    "local SEO results",
    "retail technology solutions",
    "B2B software case study",
  ],
} as const;

export const contactPageSeo = {
  path: "/contact",
  title: "Contact Us | Start Your Web or SEO Project",
  description:
    "Request a free consultation with Klikktek. Tell us about your web app, chatbot, or SEO goals and get a response within one business day.",
  primaryKeyword: "hire web development agency USA",
  secondaryKeywords: [
    "SEO consultation free quote",
    "custom software development inquiry",
    "chatbot development quote",
  ],
  semanticKeywords: [
    "web project estimate",
    "digital agency contact",
    "B2B web development partner",
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
