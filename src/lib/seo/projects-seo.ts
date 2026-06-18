/** Portfolio/project SEO definitions — ready for /projects/[slug] routes. */

export type ProjectSeoEntry = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  image: string;
  imageAlt: string;
  datePublished: string;
  caseStudySections: {
    challenge: string;
    solution: string;
    results: string;
    technologies: string[];
  };
};

export const projectsSeoCatalog: ProjectSeoEntry[] = [
  {
    slug: "ecommerce-inventory-dashboard",
    title: "E-commerce Inventory Dashboard",
    metaTitle:
      "E-commerce Inventory Dashboard Case Study | Klikktek Web Development",
    metaDescription:
      "How Klikktek built a centralized inventory dashboard for a multi-location retailer—+45% organic traffic, 98/100 Lighthouse score, and real-time stock visibility.",
    primaryKeyword: "e-commerce inventory dashboard development",
    secondaryKeywords: [
      "retail inventory management software",
      "multi-location inventory system",
      "Next.js retail dashboard",
    ],
    image: "/images/server-room.svg",
    imageAlt: "Server infrastructure supporting a retail inventory platform",
    datePublished: "2024-11-01",
    caseStudySections: {
      challenge:
        "A multi-location retailer relied on fragmented spreadsheets for inventory tracking, causing stockouts, delayed reporting, and poor search visibility for product pages.",
      solution:
        "Klikktek delivered a React/Next.js dashboard with Node.js APIs, unified stock alerts, role-based reporting, and technical SEO improvements across category and product templates.",
      results:
        "+45% organic traffic in six months, 98/100 Lighthouse performance score, and a single source of truth for inventory across all locations.",
      technologies: ["React", "Next.js", "Node.js", "Technical SEO"],
    },
  },
  {
    slug: "retailstream-web-hub",
    title: "RetailStream Web Hub",
    metaTitle: "RetailStream Web Hub Case Study | Custom Web App Development",
    metaDescription:
      "Unified analytics and inventory hub for a US retail chain—built for speed, scalability, and actionable reporting across locations.",
    primaryKeyword: "retail analytics web application",
    secondaryKeywords: [
      "retail operations dashboard",
      "custom business intelligence web app",
    ],
    image: "/images/project-dashboard.svg",
    imageAlt: "Analytics dashboard for multi-location retail operations",
    datePublished: "2024-08-15",
    caseStudySections: {
      challenge:
        "Operations teams lacked a consolidated view of sales, inventory, and performance metrics across stores.",
      solution:
        "A custom web hub with real-time dashboards, exportable reports, and mobile-responsive workflows for store managers and HQ teams.",
      results:
        "Faster decision-making, reduced manual reporting time, and improved cross-location visibility.",
      technologies: ["React", "Next.js", "API Integration", "UI/UX Design"],
    },
  },
  {
    slug: "localreach-seo-campaign",
    title: "LocalReach SEO Campaign",
    metaTitle: "Local SEO Case Study | LocalReach Organic Growth Campaign",
    metaDescription:
      "Local SEO strategy and content program that increased qualified search visibility across target US markets for a growing regional brand.",
    primaryKeyword: "local SEO case study USA",
    secondaryKeywords: [
      "local search optimization services",
      "regional SEO content strategy",
    ],
    image: "/images/project-map.svg",
    imageAlt: "Map showing local SEO growth across US target markets",
    datePublished: "2024-06-01",
    caseStudySections: {
      challenge:
        "A regional brand had inconsistent NAP data, thin location pages, and low visibility in competitive local SERPs.",
      solution:
        "Technical SEO audit, Google Business Profile optimization, citation cleanup, location landing pages, and a monthly content program.",
      results:
        "Increased qualified local organic traffic and improved map pack visibility in priority markets.",
      technologies: ["Technical SEO", "Local SEO", "Content Strategy"],
    },
  },
  {
    slug: "project-nexus-support-bot",
    title: "Project Nexus: Customer Support Bot for Retail",
    metaTitle: "Retail AI Chatbot Case Study | Project Nexus Support Bot",
    metaDescription:
      "AI-powered retail support bot integrating with inventory and order systems—resolving common inquiries and qualifying leads 24/7.",
    primaryKeyword: "retail customer support chatbot",
    secondaryKeywords: [
      "AI chatbot for e-commerce",
      "CRM integrated support automation",
    ],
    image: "/images/chatbot-abstract.svg",
    imageAlt: "AI support bot network for retail customer service",
    datePublished: "2025-03-01",
    caseStudySections: {
      challenge:
        "Retail support teams faced high ticket volume for order status, returns, and product availability questions.",
      solution:
        "An AI chatbot with CRM integration, inventory lookups, multilingual support, and seamless human handoff for complex cases.",
      results:
        "Reduced repetitive support tickets, faster response times, and improved lead qualification during peak seasons.",
      technologies: ["AI Chatbots", "CRM Integration", "E-commerce APIs"],
    },
  },
];

export function getProjectBySlug(slug: string): ProjectSeoEntry | undefined {
  return projectsSeoCatalog.find((project) => project.slug === slug);
}
