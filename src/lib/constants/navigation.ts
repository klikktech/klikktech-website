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
  tagline: "Precision Intelligence for the Modern Enterprise.",
  copyright: "© 2026 Klikktek. Practical Digital Solutions for Growing Businesses.",
  contactEmail: "intelligence@klikktek.com",
  contactAddress: "100 Tech Plaza, San Francisco, CA",
} as const;

export const mainNavLinks: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

export const footerColumns: FooterColumn[] = [
  {
    title: "Solutions",
    links: [
      { label: "Web Applications", href: "/services" },
      { label: "Custom Chatbots", href: "/services" },
      { label: "SEO Services", href: "/services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Projects", href: "/projects" },
      { label: "Privacy Policy", href: "#" },
    ],
  },
];

export const footerConnectLinks: FooterLink[] = [
  { label: "Contact Us", href: "/contact" },
];

export const contactFooterColumns: FooterColumn[] = [
  {
    title: "Offerings",
    links: [
      { label: "Services", href: "/services" },
      { label: "Projects", href: "/projects" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "About", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

export const contactFooterTagline =
  "© 2026 Klikktek. Precision Intelligence for the Modern Enterprise." as const;
