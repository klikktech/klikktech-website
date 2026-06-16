export type MetricCardItem = {
  label: string;
  value: string;
  description: string;
  variant?: "dark" | "light";
};

export type SeoStrategyRow = {
  label: string;
  tag: string;
};

export type ServiceOverviewItem = {
  title: string;
  description: string;
};

export type ChatbotFeature = {
  title: string;
  description: string;
};

export type WebAppFeature = {
  title: string;
  description: string;
};

export const servicesHeroContent = {
  label: "Digital Solutions",
  title: "Our Services",
  description:
    "Practical digital solutions engineered for performance, clarity, and measurable business outcomes—from custom web apps to intelligent automation and SEO.",
} as const;

export const servicesBentoContent = {
  webApplications: {
    title: "Custom Web Applications",
    description:
      "Workflow-minded web applications built for usability, maintainability, and long-term scalability across teams and devices.",
    features: [
      {
        title: "Usable Tools",
        description:
          "Interfaces designed around real workflows, not generic templates.",
      },
      {
        title: "Fast & Responsive",
        description:
          "Optimized performance across desktop, tablet, and mobile experiences.",
      },
    ] satisfies WebAppFeature[],
    image: {
      src: "/images/code-screen.svg",
      alt: "Code editor on a development workstation screen",
    },
  },
  metrics: [
    {
      label: "Reliable Performance",
      value: "99.9%",
      description:
        "Production-grade reliability with monitoring, alerting, and proactive maintenance.",
      variant: "dark",
    },
    {
      label: "Delivery Time",
      value: "2-3 weeks",
      description:
        "Typical timeline from discovery and architecture through launch-ready delivery.",
      variant: "light",
    },
  ] satisfies MetricCardItem[],
  chatbots: {
    badge: "Support Automation",
    title: "Intelligent Chatbots",
    description:
      "CRM-integrated support bots that resolve common requests, qualify leads, and route complex issues to the right team.",
    features: [
      {
        title: "24/7 Support",
        description: "Always-on assistance for customers and internal teams.",
      },
      {
        title: "Lead Qualification",
        description: "Structured intake flows that capture intent and context.",
      },
    ] satisfies ChatbotFeature[],
    image: {
      src: "/images/chatbot-abstract.svg",
      alt: "Abstract visualization of connected AI support nodes",
    },
  },
  seo: {
    title: "SEO Strategies",
    description:
      "Technical audits, keyword strategy, and ongoing content updates aligned to business goals.",
    rows: [
      { label: "Keyword Ranking", tag: "Growth Focused" },
      { label: "Local SEO", tag: "Monthly" },
      { label: "Content Updates", tag: "Monthly" },
    ] satisfies SeoStrategyRow[],
  },
  cta: {
    title: "Ready to build something?",
    description:
      "Tell us about your goals and we will recommend the right mix of web, automation, and SEO services.",
    primaryCta: { label: "Get a Free Quote", href: "/contact" },
    secondaryCta: { label: "View Projects", href: "/#projects" },
  },
} as const;

export const servicesOverviewContent = {
  title: "Service Overview",
  items: [
    {
      title: "Web Apps",
      description:
        "React and Next.js applications with Node.js APIs, designed for maintainability and fast iteration.",
    },
    {
      title: "Intelligent Bots",
      description:
        "Support and qualification bots integrated with CRMs, help desks, and internal knowledge bases.",
    },
    {
      title: "Search SEO",
      description:
        "Technical audits, structured content programs, and ongoing optimization for qualified organic growth.",
    },
  ] satisfies ServiceOverviewItem[],
} as const;