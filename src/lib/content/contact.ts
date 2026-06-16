export const contactHeroContent = {
  title: "Let's Build Your Next Web Project",
  description:
    "Connect with our engineering team to architect your next breakthrough.",
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