export type ProjectMetric = {
  label: string;
  value: string;
  description: string;
  variant: "dark" | "light" | "muted";
  icon?: "zap";
};

export const projectsHeroContent = {
  title: "Our Portfolio",
  description:
    "Selected projects that demonstrate our approach to reliable web applications, measurable SEO growth, and intelligent automation.",
} as const;

export const successStoryContent = {
  sectionTitle: "Success Stories",
  status: "completed" as const,
  caseStudy: {
    badge: "Web Application",
    title: "E-commerce Inventory Dashboard",
    description:
      "A centralized inventory and analytics platform for a multi-location retailer, replacing fragmented spreadsheets with a single source of truth for stock levels, alerts, and reporting.",
    image: {
      src: "/images/server-room.svg",
      alt: "Modern server room infrastructure supporting a retail platform",
    },
    tags: ["React / Next.js", "Node.js API", "UI/UX Design"],
  },
  metrics: [
    {
      label: "Client Impact",
      value: "+45%",
      description: "Increase in organic search traffic within six months of launch.",
      variant: "dark",
    },
    {
      label: "Page Speed",
      value: "98/100",
      description: "Lighthouse performance score across core product pages.",
      variant: "muted",
      icon: "zap",
    },
  ] satisfies ProjectMetric[],
} as const;

export const innovationContent = {
  sectionTitle: "Innovation in Progress",
  status: "ongoing" as const,
  project: {
    badge: "Chatbot Development",
    title: "Project Nexus: Customer Support Bot for Retail",
    description:
      "An AI-powered support bot designed to resolve common retail inquiries, qualify leads, and integrate with inventory and order systems in real time.",
    progress: 72,
    milestone:
      "Phase 3: Integration with E-commerce Inventory & Multi-language Support",
    cta: { label: "View Case Study", href: "/contact" },
    image: {
      src: "/images/chatbot-abstract.svg",
      alt: "Abstract visualization of AI support network connections",
    },
    overlay: {
      text: "Next Milestone: Beta launch with early access retail partners.",
    },
  },
} as const;
