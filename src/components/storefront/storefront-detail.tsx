"use client";

import { useMemo, useState } from "react";
import {
  Storefront,
  Product,
  PaymentMethod,
  MockOrderResponse,
  MockOrderTimelineEntry,
  OrderPhase,
} from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { wait } from "@/lib/utils";

interface StorefrontDetailProps {
  store: Storefront;
}

export function StorefrontDetail({ store }: StorefrontDetailProps) {
  const [userId, setUserId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");
  const [statusMessage, setStatusMessage] = useState("No order started yet");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    store.paymentMethods[0] ?? "Visa"
  );
  const [lastPaymentMethod, setLastPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<OrderPhase | "idle">("idle");
  const [orderSummary, setOrderSummary] = useState<{
    orderId: string;
    amount: number;
    currency: string;
  } | null>(null);

  const productGroups = useMemo(() => {
    return store.products.reduce<Record<string, Product[]>>((groups, product) => {
      if (!groups[product.category]) {
        groups[product.category] = [];
      }
      groups[product.category].push(product);
      return groups;
    }, {});
  }, [store.products]);

  const playbackTimeline = async (entries: MockOrderTimelineEntry[]) => {
    for (const entry of entries) {
      setCurrentPhase(entry.phase);
      setStatusMessage(entry.message);
      if (entry.phase === "completed") {
        setStatus("success");
      } else if (entry.phase === "failed") {
        setStatus("failed");
        break;
      } else {
        setStatus("processing");
      }
      if (entry.delayMs) {
        await wait(entry.delayMs);
      }
    }
  };

  const startPurchase = async (product: Product) => {
    if (!userId.trim()) {
      setStatusMessage("Please enter a valid player ID");
      return;
    }
    setIsSubmitting(true);
    setSelectedProduct(product);
    setOrderSummary(null);
    setOrderId(null);
    setLastPaymentMethod(null);
    setStatus("processing");
    setStatusMessage("Creating order...");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeSlug: store.slug,
          productId: product.id,
          userId,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Payment simulation failed, please try again");
      }

      const data = (await response.json()) as MockOrderResponse;
      setOrderId(data.orderId);
      setLastPaymentMethod(paymentMethod);
      setOrderSummary({
        orderId: data.orderId,
        amount: data.amount,
        currency: data.currency,
      });
      await playbackTimeline(data.timeline);
      if (data.timeline.every((step) => step.phase !== "failed")) {
        setStatusMessage("Payment confirmed. Items will arrive in a few minutes.");
      }
    } catch (error) {
      setStatus("failed");
      setStatusMessage(error instanceof Error ? error.message : "Payment simulation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentPhaseActive =
    currentPhase === "created" ||
    currentPhase === "redirect" ||
    currentPhase === "processing";
  const deliveryPhaseActive = currentPhase === "webhook" || currentPhase === "completed";

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-300/80">Official storefront</p>
            <h1 className="mt-3 text-4xl font-semibold">{store.displayName}</h1>
            <p className="mt-1 text-sm text-white/70">{store.gameTitle}</p>
            <p className="mt-3 max-w-2xl text-white/80">{store.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {store.features.map((feature) => (
                <Badge key={feature} variant="outline">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/60">Accepted payments</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {store.paymentMethods.map((method) => (
                <span
                  key={method}
                  className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/75"
                >
                  {method}
                </span>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-white/10 bg-surface-900/60 p-3 text-xs text-white/70">
              <p>Secure checkout handled by App Pay.</p>
              <p>Orders are usually delivered within minutes.</p>
            </div>
          </div>
        </div>
      </div>

      <section id="identity" className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Identify your account</h2>
        <p className="mt-2 text-sm text-white/70">
          Enter your {store.userIdentifierLabel}. We use it to deliver purchases directly to your in-game inbox after payment.
        </p>
        <div className="mt-4 max-w-xl">
          <Input
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            placeholder={store.userIdentifierHint}
          />
        </div>
        <p className="mt-2 text-xs text-white/50">
          Not sure where to find it? Open the game and navigate to “Settings → Account”.
        </p>
        <div className="mt-4 max-w-xs">
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
            Payment method
          </label>
          <select
            className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white"
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)}
          >
            {store.paymentMethods.map((method) => (
              <option key={method} value={method} className="bg-surface-900 text-black">
                {method}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-white/50">
            You can switch methods anytime before confirming the order.
          </p>
        </div>
      </section>

      <section id="products" className="space-y-6">
        {Object.entries(productGroups).map(([category, products]) => (
          <div key={category} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-2 border-b border-white/10 pb-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-brand-200/80">{category}</p>
                <h3 className="text-2xl font-semibold">Featured offers</h3>
              </div>
              <p className="text-sm text-white/60">
                {category.includes("Limited") ? "App Pay exclusive" : "Official direct top-up"}
              </p>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="flex flex-col justify-between rounded-2xl border border-white/10 bg-surface-900/60 p-5"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-semibold">{product.name}</h4>
                      {product.promotion && (
                        <Badge variant={product.promotion.type === "bonus" ? "success" : "warning"}>
                          {product.promotion.copy}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-white/70">{product.description}</p>
                    <p className="text-xs text-white/50">Game ID: {product.gameItemId}</p>
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-semibold">
                        {formatCurrency(product.price, product.currency)}
                      </p>
                      <p className="text-xs text-white/60">
                        Includes {product.baseAmount} base
                        {product.bonusAmount ? ` + ${product.bonusAmount} bonus` : ""}
                      </p>
                    </div>
                    <Button onClick={() => startPurchase(product)} disabled={isSubmitting}>
                      {isSubmitting && selectedProduct?.id === product.id ? "Processing..." : "Buy"}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section id="status" className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-xl font-semibold">Order progress</h3>
        <p className="mt-2 text-sm text-white/70">
          Checkout usually finishes in under a minute. Follow the steps below to stay informed.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <StatusCard
            title="Select product"
            active={!!selectedProduct}
            description={selectedProduct ? selectedProduct.name : "Waiting for selection"}
          />
          <StatusCard
            title="Pay securely"
            active={paymentPhaseActive && status !== "failed"}
            description={paymentPhaseActive ? statusMessage : "Ready for checkout"}
          />
          <StatusCard
            title="Delivery"
            active={deliveryPhaseActive && status !== "failed"}
            description={deliveryPhaseActive ? statusMessage : "Pending payment"}
          />
        </div>
        <p className={`mt-4 text-xs ${status === "failed" ? "text-warning" : "text-white/60"}`}>
          {statusMessage}
        </p>
        {orderId && orderSummary && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-surface-900/60 p-4 text-sm text-white/80">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Latest order</p>
            <p className="mt-1 font-semibold">{selectedProduct?.name}</p>
            <p className="text-xs text-white/60">Order ID: {orderSummary.orderId}</p>
            <p className="text-xs text-white/60">Payment method: {lastPaymentMethod ?? paymentMethod}</p>
            <p className="text-xs text-white/60">
              Amount: {formatCurrency(orderSummary.amount, orderSummary.currency)}
            </p>
            <p className="mt-2 text-xs text-white/60">
              A confirmation email will arrive shortly along with your items.
            </p>
          </div>
        )}
      </section>

      <section id="legal" className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-xl font-semibold">Support & legal</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {store.legalLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-surface-900/60 px-4 py-3 text-sm text-white/80 hover:border-brand-400/50"
            >
              {link.label}
              <span>↗</span>
            </a>
          ))}
        </div>
        <p className="mt-4 text-xs text-white/60">
          These links cover legal disclosures, payment services requirements, terms, privacy, and cancellation policies for the publisher.
        </p>
      </section>
    </div>
  );
}

function StatusCard({
  title,
  description,
  active,
}: {
  title: string;
  description: string;
  active: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        active ? "border-brand-400/60 bg-brand-500/10" : "border-white/10 bg-white/5"
      }`}
    >
      <p className="text-xs uppercase tracking-[0.3em] text-white/60">{title}</p>
      <p className="mt-2 text-sm text-white/80">{description}</p>
    </div>
  );
}
