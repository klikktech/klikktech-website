export type ServicePreviewItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  variant?: "default" | "dark";
  tags?: string[];
  ctaLabel?: string;
  icon: "web" | "chatbot" | "seo" | "support";
};

export type ProjectPreviewItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  badge: string;
  image: string;
  imageAlt: string;
};

export type TestimonialItem = {
  id: string;
  quote: string;
  name: string;
  role: string;
};

export const homeHeroContent = {
  badge: "Custom Web Development",
  title: "Functional Web Solutions &",
  titleAccent: "Strategic SEO.",
  description:
    "We build fast, reliable web applications and data-driven SEO strategies that help growing businesses rank higher, convert better, and scale with confidence.",
  primaryCta: { label: "Start Your Project", href: "/contact" },
  secondaryCta: { label: "View Our Work", href: "/projects" },
  image: {
    src: "/images/hero-dashboard.svg",
    alt: "Dashboard showing performance analytics on a laptop screen",
  },
  overlayCard: {
    label: "Page Speed",
    title: "Optimized for Fast",
  },
} as const;

export const homeServicesContent = {
  label: "Our Services",
  title: "Build. Rank. Automate.",
  description:
    "From custom web apps to intelligent chatbots and SEO campaigns, we deliver practical digital solutions engineered for performance and measurable growth.",
  items: [
    {
      id: "web-applications",
      title: "Web Applications",
      description:
        "Custom-built applications designed for speed, usability, and long-term scalability across devices and teams.",
      href: "/services",
      tags: ["Fast Performance", "User-Centric", "Scalable"],
      icon: "web",
    },
    {
      id: "custom-chatbots",
      title: "Custom Chatbots",
      description:
        "AI-powered support automation that qualifies leads, resolves common requests, and integrates with your existing tools.",
      href: "/services",
      variant: "dark",
      ctaLabel: "Learn More",
      icon: "chatbot",
    },
    {
      id: "seo-growth",
      title: "SEO & Growth",
      description:
        "Technical SEO, content strategy, and ongoing optimization to improve visibility and drive qualified organic traffic.",
      href: "/services",
      icon: "seo",
    },
    {
      id: "ongoing-support",
      title: "Ongoing Support",
      description:
        "Reliable maintenance, performance monitoring, and iterative improvements to keep your digital products running smoothly.",
      href: "/services",
      icon: "support",
    },
  ] satisfies ServicePreviewItem[],
} as const;

export const homePortfolioContent = {
  label: "Portfolio",
  title: "Selected Projects",
  items: [
    {
      id: "retailstream",
      title: "RetailStream Web Hub",
      description:
        "A unified inventory and analytics dashboard for a multi-location retail operation.",
      href: "/projects",
      badge: "Web App",
      image: "/images/project-dashboard.svg",
      imageAlt: "Dark analytics dashboard interface",
    },
    {
      id: "localreach",
      title: "LocalReach SEO Campaign",
      description:
        "Local SEO strategy and content program that increased qualified search visibility across target markets.",
      href: "/projects",
      badge: "SEO Growth",
      image: "/images/project-map.svg",
      imageAlt: "World map with connected growth nodes",
    },
  ] satisfies ProjectPreviewItem[],
} as const;

export const homeTestimonialsContent = {
  title: "Success Stories",
  description:
    "Teams trust Klikktek to ship reliable web products and SEO programs with precision and accountability.",
  items: [
    {
      id: "testimonial-1",
      quote:
        "Klikktek delivered a fast, polished web app on schedule. Their technical decisions were clear, practical, and built for scale.",
      name: "Sarah Jenkins",
      role: "Operations Director, Northline Retail",
    },
    {
      id: "testimonial-2",
      quote:
        "Our organic traffic improved within months. The SEO roadmap was structured, measurable, and aligned with our business goals.",
      name: "David Park",
      role: "VP of Marketing, LocalReach Co.",
    },
    {
      id: "testimonial-3",
      quote:
        "The support bot reduced repetitive tickets immediately. Integration was smooth and the handoff to our team was seamless.",
      name: "Elena Rodriguez",
      role: "Lead Architect, Meridian Systems",
    },
  ] satisfies TestimonialItem[],
} as const;

export const homeCtaContent = {
  title: "Ready to grow your online presence?",
  description:
    "Contact us today to discuss your next web project or SEO strategy.",
  placeholder: "Enter your email",
  buttonLabel: "Get in Touch",
} as const;
