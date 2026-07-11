export type NavLink = {
  label: string;
  href: string;
};

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

export const siteConfig = {
  name: "Klikktek",
  logo: {
    src: "/images/klikktek-logo-horizontal.svg",
    alt: "KlikkTek",
    width: 1024,
    height: 175,
  },
  tagline: "Custom web solutions that drive real growth.",
  copyright: "© 2026 Klikktek. Practical Digital Solutions for Growing Businesses.",
  contactEmail: "intelligence@klikktek.com",
} as const;

export const mainNavLinks: NavLink[] = [
  { label: "What We Do", href: "/#services" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Projects", href: "/#projects" },
  { label: "Reviews", href: "/#reviews" },
];

export const footerColumns: FooterColumn[] = [
  {
    title: "Solutions",
    links: [
      { label: "Web Applications", href: "/#services" },
      { label: "Google Reviews", href: "/#services" },
      { label: "Lead Recovery", href: "/#services" },
      { label: "AI Chatbots", href: "/#services" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Projects", href: "/#projects" },
      { label: "Reviews", href: "/#reviews" },
      { label: "Book a Call", href: "/#contact" },
    ],
  },
];

export const footerCtaContent = {
  eyebrow: "Get started",
  title: "Ready to talk through your project?",
  description:
    "Pick a time on the calendar and we'll map out the fastest path to launch.",
  buttonLabel: "Schedule a Call",
  buttonHref: "/#contact",
} as const;
