export type HeroFeatureItem = {
  id: string;
  title: string;
  description: string;
  icon: "web" | "reviews" | "chatbot" | "seo";
  tags?: string[];
  href: string;
};

export type ProcessStepItem = {
  id: string;
  step: string;
  duration: string;
  title: string;
  description: string;
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
  badge: "Digital Growth Partner",
  title: "Custom Web Solutions That",
  titleAccent: "Drive Real Growth.",
  description:
    "Klikktek helps US businesses launch faster websites, earn more Google reviews, recover missed leads, and automate support with practical AI — without the agency runaround.",
  primaryCta: { label: "Schedule a Call", href: "/#contact" },
  secondaryCta: { label: "See how it works", href: "/#how-it-works" },
} as const;

export const homeServicesContent = {
  label: "Capabilities",
  title: "What we build for your business",
  description:
    "Four focused offerings you can mix and match — each designed to generate leads, save time, and strengthen your online reputation.",
  items: [
    {
      id: "web-applications",
      title: "Custom Web Applications",
      description:
        "Fast, mobile-ready sites and portals tailored to how your team sells, supports customers, and reports performance.",
      icon: "web",
      tags: ["Next.js", "Performance", "SEO-ready"],
      href: "/#contact",
    },
    {
      id: "google-reviews",
      title: "Google Reviews Program",
      description:
        "Automated review requests, monitoring, and response workflows that improve trust and local search visibility.",
      icon: "reviews",
      tags: ["Reputation", "Local SEO", "Automation"],
      href: "/#contact",
    },
    {
      id: "lead-recovery",
      title: "Lead Recovery Automation",
      description:
        "Instant follow-up when calls are missed so prospects get a text back while interest is still high.",
      icon: "seo",
      tags: ["SMS", "Lead capture", "24/7"],
      href: "/#contact",
    },
    {
      id: "ai-chatbot",
      title: "AI Support Chatbots",
      description:
        "On-brand chat experiences that answer common questions, qualify leads, and hand off to your team when needed.",
      icon: "chatbot",
      tags: ["AI", "CRM-ready", "Always on"],
      href: "/#contact",
    },
  ] satisfies HeroFeatureItem[],
} as const;

export const homeHowItWorksContent = {
  label: "Our Process",
  title: "A clear path from first call to launch.",
  steps: [
    {
      id: "discovery",
      step: "01",
      duration: "20 mins",
      title: "Kickoff Session",
      description:
        "We map your goals, audience, and existing tools in a structured working session — then outline a realistic delivery plan.",
    },
    {
      id: "build",
      step: "02",
      duration: "7–10 days",
      title: "Design, Build & QA",
      description:
        "We design, develop, and test your site and automations in focused sprints with review checkpoints before launch.",
    },
    {
      id: "onboarding",
      step: "03",
      duration: "25 mins",
      title: "Launch & Enablement",
      description:
        "We go live together, train your team, and set up support so you are confident operating everything on day one.",
    },
  ] satisfies ProcessStepItem[],
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
      href: "/#contact",
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
      href: "/#contact",
      badge: "Coming Soon",
      image: "",
      imageAlt: "",
      upcoming: true,
    },
  ] satisfies ProjectPreviewItem[],
} as const;

export const homeTestimonialsContent = {
  label: "Reviews",
  title: "What Our Clients Say",
  description:
    "Real feedback from businesses that partnered with Klikktek to grow their online presence.",
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
