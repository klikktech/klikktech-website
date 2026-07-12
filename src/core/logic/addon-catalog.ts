// Local copy of retail-software's core/logic/addons.ts, plus pricing (this
// repo is the source of truth for billing). Keep addon keys/labels in sync
// manually — no shared package between the two repos.
//
// TODO: placeholder pricing — replace with real one-time prices before launch.
export const ADDON_KEYS = ["wishlist", "sale_popup", "whatsapp", "faqs"] as const;
export type AddonKey = (typeof ADDON_KEYS)[number];

interface AddonDefinition {
  label: string;
  description: string;
  priceCents: number;
  currency: string;
}

export const ADDON_CATALOG: Record<AddonKey, AddonDefinition> = {
  wishlist: {
    label: "Wishlist",
    description: "Customers can save products to a wishlist.",
    priceCents: 4900,
    currency: "USD",
  },
  sale_popup: {
    label: "Sale popup",
    description: "Entry popup highlighting on-sale products.",
    priceCents: 2900,
    currency: "USD",
  },
  whatsapp: {
    label: "WhatsApp chat",
    description: "Floating WhatsApp button using the store's contact phone.",
    priceCents: 1900,
    currency: "USD",
  },
  faqs: {
    label: "FAQs page",
    description: "A storefront FAQ page.",
    priceCents: 1900,
    currency: "USD",
  },
};
