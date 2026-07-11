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
  tagline: "Practical digital tools that help your business grow.",
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
      { label: "Websites & Tools", href: "/#services" },
      { label: "Google Reviews", href: "/#services" },
      { label: "Lead Recovery", href: "/#services" },
      { label: "Customer Chat", href: "/#services" },
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
  title: "Ready to grow your business online?",
  description:
    "Book a free call and we'll walk through what's working today, where you're losing leads, and the fastest path forward.",
  buttonLabel: "Schedule a Call",
  buttonHref: "/#contact",
} as const;
