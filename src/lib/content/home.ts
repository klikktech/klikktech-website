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
  title: "Digital Tools That Help You",
  titleAccent: "Win More Business.",
  description:
    "Klikktek helps US businesses get more calls and inquiries, collect more 5-star Google reviews, follow up on missed leads instantly, and answer customer questions around the clock — without the agency runaround.",
  primaryCta: { label: "Schedule a Call", href: "/#contact" },
  secondaryCta: { label: "See how it works", href: "/#how-it-works" },
} as const;

export const homeServicesContent = {
  label: "Solutions",
  title: "How we help your business grow",
  description:
    "Four focused services you can mix and match — each built to bring in more leads, save your team time, and strengthen your reputation online.",
  items: [
    {
      id: "web-applications",
      title: "Websites & Business Tools",
      description:
        "A professional site that loads fast, works on every phone, and turns visitors into calls and inquiries — built around how you actually sell.",
      icon: "web",
      tags: ["More leads", "Mobile-ready", "Google-friendly"],
      href: "/#contact",
    },
    {
      id: "google-reviews",
      title: "Google Reviews Program",
      description:
        "More Google reviews, less chasing. We set up simple follow-ups so happy customers leave feedback and new buyers trust you faster.",
      icon: "reviews",
      tags: ["Stronger reputation", "Local visibility", "Less manual work"],
      href: "/#contact",
    },
    {
      id: "lead-recovery",
      title: "Never Miss a Lead",
      description:
        "When you miss a call, we text the customer back immediately so you don't lose the job to a competitor while interest is still high.",
      icon: "seo",
      tags: ["Instant follow-up", "More booked jobs", "Works 24/7"],
      href: "/#contact",
    },
    {
      id: "ai-chatbot",
      title: "24/7 Customer Answers",
      description:
        "Answer common questions instantly, capture contact details, and loop in your team when it matters — so you're not stuck on the phone all day.",
      icon: "chatbot",
      tags: ["Fewer repeat questions", "Works with your tools", "Always on"],
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
      title: "Free Strategy Call",
      description:
        "We learn how your business works, what you want to grow, and what success looks like — then give you a clear plan and timeline.",
    },
    {
      id: "build",
      step: "02",
      duration: "7–10 days",
      title: "We Build & Launch",
      description:
        "You see progress along the way. We handle design, setup, and testing so everything works smoothly before go-live.",
    },
    {
      id: "onboarding",
      step: "03",
      duration: "25 mins",
      title: "Go Live With Confidence",
      description:
        "We launch together, train your team, and set up ongoing support so you feel confident running everything from day one.",
    },
  ] satisfies ProcessStepItem[],
} as const;

export const homePortfolioContent = {
  label: "Portfolio",
  title: "Businesses We've Helped",
  items: [
    {
      id: "sigma-wholesale",
      title: "Sigma Wholesale",
      description:
        "Sigma needed one system for bulk orders, customer accounts, and day-to-day operations — instead of spreadsheets and phone tag. We built an online ordering experience for their buyers and a back-office hub their team runs the business from.",
      href: "/#contact",
      badge: "Wholesale",
      image: "/images/sigma-wholesale/customer/customer-1.png",
      imageAlt: "Sigma Wholesale platform screenshot",
      images: [
        {
          src: "/images/sigma-wholesale/customer/customer-1.png",
          alt: "Sigma Wholesale — customer ordering home screen",
        },
        {
          src: "/images/sigma-wholesale/customer/customer-2.png",
          alt: "Sigma Wholesale — product catalogue",
        },
        {
          src: "/images/sigma-wholesale/customer/customer-3.png",
          alt: "Sigma Wholesale — product detail page",
        },
        {
          src: "/images/sigma-wholesale/customer/customer-4.png",
          alt: "Sigma Wholesale — cart and checkout",
        },
        {
          src: "/images/sigma-wholesale/customer/customer-5.png",
          alt: "Sigma Wholesale — order history",
        },
        {
          src: "/images/sigma-wholesale/customer/customer-6.png",
          alt: "Sigma Wholesale — account settings",
        },
        {
          src: "/images/sigma-wholesale/customer/customer-7.png",
          alt: "Sigma Wholesale — invoice view",
        },
        {
          src: "/images/sigma-wholesale/admin/admin-2.png",
          alt: "Sigma Wholesale — inventory management",
        },
        {
          src: "/images/sigma-wholesale/admin/admin-3.png",
          alt: "Sigma Wholesale — customer accounts",
        },
        {
          src: "/images/sigma-wholesale/admin/admin-4.png",
          alt: "Sigma Wholesale — order queue",
        },
        {
          src: "/images/sigma-wholesale/admin/admin-5.png",
          alt: "Sigma Wholesale — pricing management",
        },
        {
          src: "/images/sigma-wholesale/admin/admin-6.png",
          alt: "Sigma Wholesale — reports and analytics",
        },
      ],
    },
    {
      id: "school-portal",
      title: "EduTrack — School Management",
      description:
        "Helping schools manage students, attendance, grades, and parent updates in one place — currently in active development.",
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
    "Real feedback from business owners and managers who partnered with Klikktek to simplify operations and grow revenue.",
  items: [
    {
      id: "alex-sohani",
      quote:
        "We came to Klikktek with a fragmented operation — spreadsheets everywhere, no central system. They built us a platform that finally brought everything together. Our buyers can place orders online now, and that alone changed how we do business every day.",
      name: "Alex Sohani",
      role: "Owner, Sigma Wholesale",
    },
    {
      id: "ankit-sohani",
      quote:
        "What impressed me most was how quickly they understood our wholesale model. For the first time we had real visibility into inventory and orders. It's become the backbone of how we run the business.",
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
