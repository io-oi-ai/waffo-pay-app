export type PaymentMethod =
  | "Visa"
  | "Mastercard"
  | "JCB"
  | "AMEX"
  | "PayPay"
  | "Line Pay"
  | "Apple Pay"
  | "Google Pay"
  | "Konbini";

export interface LegalLink {
  label: string;
  url: string;
}

export interface Promotion {
  type: "bonus" | "discount";
  value: number;
  copy: string;
  badge?: string;
  highlight?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  baseAmount: number;
  bonusAmount?: number;
  description?: string;
  icon?: string;
  gameItemId: string;
  limited?: boolean;
  subscription?: boolean;
  promotion?: Promotion;
}

export interface Storefront {
  slug: string;
  displayName: string;
  gameTitle: string;
  logo: string;
  heroImage: string;
  tagline: string;
  highlightSlogan: string;
  summary: string;
  companyName: string;
  contactEmail: string;
  supportChannel: string;
  storefrontUrl: string;
  primaryColor: string;
  paymentMethods: PaymentMethod[];
  features: string[];
  userIdentifierLabel: string;
  userIdentifierHint: string;
  legalLinks: LegalLink[];
  products: Product[];
  filters: {
    categoryTags: string[];
    minBonusPercent?: number;
    exclusive?: boolean;
  };
}

export interface MerchantWebhookConfig {
  url: string;
  secret: string;
  userIdField: string;
  retries: number;
  lastLatencyMs: number;
  reliability: number;
  lastDeliveryAt: string;
}

export interface SettlementProfile {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch: string;
  currency: string;
  payoutSchedule: string;
  status: "pending" | "verified";
}

export interface MerchantWorkspace {
  store: Storefront;
  webhook: MerchantWebhookConfig;
  settlement: SettlementProfile;
  lastPublish: string;
}

export type OrderPhase =
  | "created"
  | "redirect"
  | "processing"
  | "webhook"
  | "completed"
  | "failed";

export interface MockOrderTimelineEntry {
  phase: OrderPhase;
  message: string;
  delayMs: number;
  meta?: Record<string, string | number>;
}

export interface MockOrderResponse {
  orderId: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  store: {
    slug: string;
    name: string;
  };
  product: {
    id: string;
    name: string;
  };
  userId: string;
  timeline: MockOrderTimelineEntry[];
  paymentUrl: string;
  webhookPayload: {
    endpoint: string;
    body: {
      orderId: string;
      platformOrderId: string;
      userId: string;
      productId: string;
      amount: number;
      currency: string;
      status: "paid" | "failed";
      signature: string;
    };
  };
}
