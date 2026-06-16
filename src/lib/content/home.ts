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
  images?: { src: string; alt: string }[];
  upcoming?: boolean;
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
  secondaryCta: { label: "View Our Work", href: "/#projects" },
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
      id: "sigma-wholesale",
      title: "Sigma Wholesale Platform",
      description:
        "A full-stack wholesale platform built for Sigma, comprising a self-service customer portal for bulk ordering and account management, and an internal admin dashboard for inventory, pricing, and order fulfillment.",
      href: "/projects",
      badge: "Web App",
      image: "/images/sigma-wholesale/customer/customer-1.png",
      imageAlt: "Sigma Wholesale platform screenshot",
      images: [
        {
          src: "/images/sigma-wholesale/customer/customer-1.png",
          alt: "Sigma Wholesale — customer portal home screen",
        },
        {
          src: "/images/sigma-wholesale/customer/customer-2.png",
          alt: "Sigma Wholesale — customer portal product catalogue",
        },
        {
          src: "/images/sigma-wholesale/customer/customer-3.png",
          alt: "Sigma Wholesale — customer portal product detail",
        },
        {
          src: "/images/sigma-wholesale/customer/customer-4.png",
          alt: "Sigma Wholesale — customer portal cart and checkout",
        },
        {
          src: "/images/sigma-wholesale/customer/customer-5.png",
          alt: "Sigma Wholesale — customer portal order history",
        },
        {
          src: "/images/sigma-wholesale/customer/customer-6.png",
          alt: "Sigma Wholesale — customer portal account settings",
        },
        {
          src: "/images/sigma-wholesale/customer/customer-7.png",
          alt: "Sigma Wholesale — customer portal invoice view",
        },
        {
          src: "/images/sigma-wholesale/admin/admin-1.png",
          alt: "Sigma Wholesale — admin portal overview dashboard",
        },
        {
          src: "/images/sigma-wholesale/admin/admin-2.png",
          alt: "Sigma Wholesale — admin portal inventory management",
        },
        {
          src: "/images/sigma-wholesale/admin/admin-3.png",
          alt: "Sigma Wholesale — admin portal customer accounts",
        },
        {
          src: "/images/sigma-wholesale/admin/admin-4.png",
          alt: "Sigma Wholesale — admin portal order queue",
        },
        {
          src: "/images/sigma-wholesale/admin/admin-5.png",
          alt: "Sigma Wholesale — admin portal pricing rules",
        },
        {
          src: "/images/sigma-wholesale/admin/admin-6.png",
          alt: "Sigma Wholesale — admin portal reports and analytics",
        },
      ],
    },
    {
      id: "school-portal",
      title: "EduTrack — School Management Portal",
      description:
        "A unified platform for schools to manage student records, attendance, grading, and parent communication. Currently in active development.",
      href: "/contact",
      badge: "Coming Soon",
      image: "",
      imageAlt: "",
      upcoming: true,
    },
  ] satisfies ProjectPreviewItem[],
} as const;

export const homeTestimonialsContent = {
  title: "Success Stories",
  description:
    "Hear directly from the people who worked with Klikktek to bring Sigma Wholesale to life.",
  items: [
    {
      id: "alex-sohani",
      quote:
        "We came to Klikktek with a fragmented operation — spreadsheets everywhere, no central system. They built us a platform that finally brought everything together. The customer portal alone changed how our buyers interact with us daily.",
      name: "Alex Sohani",
      role: "Owner, Sigma Wholesale",
    },
    {
      id: "ankit-sohani",
      quote:
        "What impressed me most was how quickly they understood our wholesale model. The admin dashboard gave us real visibility into inventory and orders for the first time. It's become the backbone of how we run the business.",
      name: "Ankit Sohani",
      role: "Owner, Sigma Wholesale",
    },
    {
      id: "sumanth-sara",
      quote:
        "Day to day, the platform has made my job dramatically easier. Managing customer accounts, tracking orders, updating pricing — things that used to take hours now take minutes. The team was responsive throughout and actually listened to how we work.",
      name: "Sumanth Sara",
      role: "Manager, Sigma Wholesale",
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