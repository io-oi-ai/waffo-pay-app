import { MerchantWorkspace, Storefront } from "./types";

export const storefronts: Storefront[] = [
  {
    slug: "a3-official",
    displayName: "A3! Official Store",
    gameTitle: "A3! (Act! Addict! Actors!)",
    logo:
      "https://images.ctfassets.net/o8h5c4rqlsvy/1Hms63/015f-logo/a3-logo.png",
    heroImage:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80",
    tagline: "Summer Troupe Anniversary",
    highlightSlogan: "Extra diamonds + App Pay exclusives",
    summary:
      "Official top-up channel operated by Liber Entertainment. Enjoy 20% bonus diamonds, commemorative bundles, and PayPay-ready checkout for fans in Japan.",
    companyName: "Liber Entertainment Inc.",
    contactEmail: "support@a3-app.jp",
    supportChannel: "Discord & in-app ticket",
    storefrontUrl: "https://pay.waffo.jp/store/a3-official",
    primaryColor: "#ff6699",
    paymentMethods: ["Visa", "Mastercard", "JCB", "PayPay", "Apple Pay"],
    features: ["App Pay exclusive", "Webhook under 2s", "Instant PayPay cashback"],
    userIdentifierLabel: "Game ID",
    userIdentifierHint: "Example: A3-7821-9933",
    legalLinks: [
      { label: "Legal disclosure", url: "https://a3.jp/legal/act" },
      { label: "Payment services act", url: "https://a3.jp/legal/payment" },
      { label: "Terms of service", url: "https://a3.jp/terms" },
      { label: "Privacy policy", url: "https://a3.jp/privacy" },
      { label: "Cancellation & refund", url: "https://a3.jp/cancel" },
    ],
    products: [
      {
        id: "pack-limited-01",
        name: "Full Bloom Celebration Pack",
        category: "Limited pack",
        price: 10000,
        currency: "JPY",
        baseAmount: 820,
        bonusAmount: 120,
        description: "Anniversary art + 820 diamonds with 120 bonus",
        icon: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400",
        gameItemId: "A3_PACK_LIMITED",
        limited: true,
        promotion: {
          type: "bonus",
          value: 18,
          copy: "18% better than in-game",
          badge: "Limited",
          highlight: "App Pay exclusive pack!!",
        },
      },
      {
        id: "pack-regular-02",
        name: "Diamond 720",
        category: "Standard top-up",
        price: 8000,
        currency: "JPY",
        baseAmount: 720,
        bonusAmount: 60,
        description: "Regular charge with +60 bonus",
        icon: "https://images.unsplash.com/photo-1523978591478-c753949ff840?w=400",
        gameItemId: "A3_DIA_720",
        promotion: {
          type: "bonus",
          value: 9,
          copy: "9% bonus",
        },
      },
      {
        id: "pack-mini-03",
        name: "Starter Pack",
        category: "Special bundle",
        price: 3000,
        currency: "JPY",
        baseAmount: 250,
        bonusAmount: 30,
        description: "Beginner items plus 30 bonus diamonds",
        icon: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400",
        gameItemId: "A3_STARTER",
        promotion: {
          type: "bonus",
          value: 12,
          copy: "12% bonus",
        },
      },
    ],
    filters: {
      categoryTags: ["App Pay exclusive", "Bonus >10%"],
      minBonusPercent: 10,
      exclusive: true,
    },
  },
  {
    slug: "stella-stage",
    displayName: "Stella Stage Exchange",
    gameTitle: "Stella Stage Online",
    logo:
      "https://images.ctfassets.net/o8h5c4rqlsvy/2Logo/stella-stage.svg",
    heroImage:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80",
    tagline: "Galaxy Expedition Season 2",
    highlightSlogan: "Crystals 10% cheaper than in-game",
    summary:
      "Seasonal battle pass, subscription perks, and flexible Line Pay installments for commanders gearing up for the new expedition.",
    companyName: "Stella Interactive Limited",
    contactEmail: "ops@stella-stage.com",
    supportChannel: "Slack Connect",
    storefrontUrl: "https://pay.waffo.jp/store/stella-stage",
    primaryColor: "#7c5dff",
    paymentMethods: ["Visa", "Mastercard", "AMEX", "Line Pay", "Konbini"],
    features: ["Subscription ready", "Automatic webhook retries", "Installment support"],
    userIdentifierLabel: "Pilot ID",
    userIdentifierHint: "ST-8891-XXXX",
    legalLinks: [
      { label: "Legal disclosure", url: "https://stella-stage.com/legal/tokusho" },
      { label: "Payment services act", url: "https://stella-stage.com/legal/fund" },
      { label: "Terms of service", url: "https://stella-stage.com/terms" },
      { label: "Privacy policy", url: "https://stella-stage.com/privacy" },
      { label: "Cancellation", url: "https://stella-stage.com/cancel" },
    ],
    products: [
      {
        id: "stella-season",
        name: "Season Flight Pass",
        category: "Limited pack",
        price: 12000,
        currency: "JPY",
        baseAmount: 1,
        description: "12 weeks of elite missions + bonus drops",
        gameItemId: "ST_PASS_LUX",
        subscription: true,
        promotion: {
          type: "bonus",
          value: 25,
          copy: "25% faster progress",
          badge: "Season",
        },
      },
      {
        id: "stella-crystal",
        name: "Crystal 1500",
        category: "Standard top-up",
        price: 10000,
        currency: "JPY",
        baseAmount: 1500,
        promotion: {
          type: "discount",
          value: 10,
          copy: "10% OFF",
          highlight: "Cheaper than in-game",
        },
        description: "Large update launch discount",
        gameItemId: "ST_CRYS_1500",
      },
      {
        id: "stella-kit",
        name: "Mechanic Kit",
        category: "Supply",
        price: 4500,
        currency: "JPY",
        baseAmount: 340,
        bonusAmount: 40,
        description: "Weekly materials + 40 crystals",
        gameItemId: "ST_SUPPORT",
      },
    ],
    filters: {
      categoryTags: ["App Pay exclusive", "Subscription"],
      minBonusPercent: 5,
    },
  },
  {
    slug: "mirage-saga",
    displayName: "Mirage Saga Lab",
    gameTitle: "Mirage Saga Reversal",
    logo:
      "https://images.ctfassets.net/o8h5c4rqlsvy/3Logo/mirage.svg",
    heroImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    tagline: "Deep Realm Update",
    highlightSlogan: "App Pay limited gear bundles",
    summary:
      "Optimized for local wallets in Japan: 99.99% of orders ship within 3 seconds post-payment with resilient webhook retries.",
    companyName: "Mirage Digital GK",
    contactEmail: "merchant@mirage.io",
    supportChannel: "Email + PagerDuty",
    storefrontUrl: "https://pay.waffo.jp/store/mirage-saga",
    primaryColor: "#11b0a5",
    paymentMethods: ["Visa", "Mastercard", "PayPay", "Google Pay", "Konbini"],
    features: ["5x webhook retries", "PayPay accepted", "15% better than game"],
    userIdentifierLabel: "User Code",
    userIdentifierHint: "MG-XXXX-00",
    legalLinks: [
      { label: "Legal disclosure", url: "https://mirage.io/tokusho" },
      { label: "Payment services act", url: "https://mirage.io/fund" },
      { label: "Terms of service", url: "https://mirage.io/terms" },
      { label: "Privacy policy", url: "https://mirage.io/privacy" },
      { label: "Return policy", url: "https://mirage.io/cancel" },
    ],
    products: [
      {
        id: "mirage-bundle-top",
        name: "Deep Gear Advance",
        category: "Limited pack",
        price: 14000,
        currency: "JPY",
        baseAmount: 1600,
        bonusAmount: 300,
        gameItemId: "MG_ADV_PACK",
        description: "Gear upgrade mats + 15% crystal boost",
        promotion: {
          type: "bonus",
          value: 15,
          copy: "15% bonus",
          highlight: "Eligible for PayPay cashback",
        },
      },
      {
        id: "mirage-monthly",
        name: "Monthly Supply Plan",
        category: "Subscription",
        price: 3200,
        currency: "JPY",
        baseAmount: 1,
        subscription: true,
        description: "30-day plan with +60 crystals per day",
        gameItemId: "MG_MONTHLY",
      },
      {
        id: "mirage-core",
        name: "Core Charge 980",
        category: "Standard top-up",
        price: 9800,
        currency: "JPY",
        baseAmount: 980,
        bonusAmount: 80,
        description: "8% more crystals via App Pay",
        gameItemId: "MG_CORE_980",
        promotion: {
          type: "bonus",
          value: 8,
          copy: "8% bonus",
        },
      },
    ],
    filters: {
      categoryTags: ["PayPay supported", "Webhook 99.99"],
      minBonusPercent: 8,
    },
  },
];

export const merchantWorkspace: MerchantWorkspace = {
  store: storefronts[0],
  webhook: {
    url: "https://hooks.a3-app.jp/v1/order",
    secret: "whsec_live_x2vy-merchant",
    userIdField: "gameId",
    retries: 3,
    lastLatencyMs: 1480,
    reliability: 99.995,
    lastDeliveryAt: new Date().toISOString(),
  },
  settlement: {
    bankName: "MUFG Bank",
    accountName: "Liber Entertainment",
    accountNumber: "1234567",
    branch: "Shibuya Central",
    currency: "JPY",
    payoutSchedule: "T+5 rolling",
    status: "verified",
  },
  lastPublish: "2025-11-08T15:30:00+09:00",
};

export const paymentFilters = [
  { label: "App Pay exclusive", value: "exclusive" },
  { label: "Bonus > 10%", value: "bonus10" },
  { label: "PayPay supported", value: "paypay" },
];

export function getStorefronts(): Storefront[] {
  return storefronts;
}

export function getStorefrontBySlug(slug: string): Storefront | undefined {
  return storefronts.find((store) => store.slug === slug);
}
