export type CompactTestimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
};

export const contactHeroContent = {
  title: "Let's Build Your Next Web Project",
  description:
    "Connect with our engineering team to architect your next breakthrough.",
} as const;

export const contactSocialProofContent = {
  featured: {
    badge: "Case Study: Fintech Scale",
    quote:
      "Klikktek's precision approach reduced our deployment latency by 40%. Their technical decision-making is rooted in pure engineering excellence.",
    name: "Marcus Chen",
    role: "CTO, Meridian Systems",
  },
  satisfaction: {
    value: "98% Satisfaction",
    description:
      "Our AI-driven feedback loop ensures that technical requirements are met with 100% precision in 48 hours or less.",
  },
  testimonials: [
    {
      id: "elena",
      quote:
        "Clear architecture, disciplined delivery, and a team that understands enterprise constraints.",
      name: "Elena Rodriguez",
      role: "Lead Architect",
    },
    {
      id: "david",
      quote:
        "They translated complex requirements into a maintainable platform our team could extend confidently.",
      name: "David Park",
      role: "VP of Engineering",
    },
    {
      id: "sarah",
      quote:
        "Professional, responsive, and focused on outcomes—not buzzwords or unnecessary complexity.",
      name: "Sarah Jenkins",
      role: "Operations Director",
    },
  ] satisfies CompactTestimonial[],
} as const;

export const contactInquiryContent = {
  title: "Direct Inquiry Protocol",
  description:
    "Submit your project details and our team will respond within one business day with next steps and availability.",
  serviceOptions: [
    { label: "Web Applications", value: "web-applications" },
    { label: "Custom Chatbots", value: "custom-chatbots" },
    { label: "SEO Strategies", value: "seo-strategies" },
    { label: "Ongoing Support", value: "ongoing-support" },
  ],
  submitLabel: "Submit Inquiry",
} as const;