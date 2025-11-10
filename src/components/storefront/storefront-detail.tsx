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
  const [statusMessage, setStatusMessage] = useState("Choose a pack to get started");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    store.paymentMethods[0] ?? "Visa"
  );
  const [lastPaymentMethod, setLastPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSummary, setOrderSummary] = useState<{
    id: string;
    amount: number;
    currency: string;
  } | null>(null);
  const [currentPhase, setCurrentPhase] = useState<OrderPhase | "idle">("idle");

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
      setStatusMessage("Please enter your player ID before continuing");
      return;
    }
    setIsSubmitting(true);
    setSelectedProduct(product);
    setOrderSummary(null);
    setStatus("processing");
    setStatusMessage("Creating your order...");

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
      setLastPaymentMethod(paymentMethod);
      setOrderSummary({ id: data.orderId, amount: data.amount, currency: data.currency });
      await playbackTimeline(data.timeline);
      if (data.timeline.every((step) => step.phase !== "failed")) {
        setStatusMessage("Payment confirmed. Items will arrive within a few minutes.");
      }
    } catch (error) {
      setStatus("failed");
      setStatusMessage(error instanceof Error ? error.message : "Payment simulation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentPhaseActive =
    currentPhase === "created" || currentPhase === "redirect" || currentPhase === "processing";
  const deliveryPhaseActive = currentPhase === "webhook" || currentPhase === "completed";

  return (
    <div className="space-y-8">
      <div className="rounded-[30px] border border-black/5 bg-gradient-to-br from-white via-[#f7f5ff] to-[#f0fbff] p-8 shadow-[0_40px_90px_rgba(15,23,42,0.15)]">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Official storefront</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-900">{store.displayName}</h1>
            <p className="mt-1 text-sm text-slate-600">{store.gameTitle}</p>
            <p className="mt-3 max-w-2xl text-base text-slate-700">{store.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {store.features.map((feature) => (
                <Badge key={feature} variant="outline" className="border-slate-200 bg-white text-slate-600">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
          <div className="rounded-[24px] border border-black/5 bg-white/90 p-4 shadow-inner">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Accepted payments
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {store.paymentMethods.map((method) => (
                <span
                  key={method}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700"
                >
                  {method}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Secured by App Pay • Orders typically fulfil within minutes.
            </p>
          </div>
        </div>
      </div>

      <section className="rounded-[28px] border border-black/5 bg-white/90 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.07)]">
        <h2 className="text-xl font-semibold text-slate-900">Identify your account</h2>
        <p className="mt-2 text-sm text-slate-600">
          Enter your {store.userIdentifierLabel}; we use it to deliver purchases directly to your in-game inbox.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            placeholder={store.userIdentifierHint}
            className="bg-white"
          />
          <select
            className="rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-inner"
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)}
          >
            {store.paymentMethods.map((method) => (
              <option key={method} value={method} className="bg-white text-slate-900">
                {method}
              </option>
            ))}
          </select>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Not sure where to find it? Open the game → Settings → Account.
        </p>
      </section>

      <section className="space-y-6">
        {Object.entries(productGroups).map(([category, products]) => (
          <div key={category} className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)]">
            <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-500">{category}</p>
                <h3 className="text-2xl font-semibold text-slate-900">Featured bundles</h3>
              </div>
              <p className="text-sm text-slate-500">
                {category.includes("Limited") ? "App Pay exclusive" : "Official direct top-up"}
              </p>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-5"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-semibold text-slate-900">{product.name}</h4>
                      {product.promotion && (
                        <Badge
                          variant={product.promotion.type === "bonus" ? "success" : "warning"}
                          className="bg-white text-slate-700"
                        >
                          {product.promotion.copy}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{product.description}</p>
                    <p className="text-xs text-slate-500">Game ID: {product.gameItemId}</p>
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-semibold text-slate-900">
                        {formatCurrency(product.price, product.currency)}
                      </p>
                      <p className="text-xs text-slate-600">
                        Includes {product.baseAmount} base
                        {product.bonusAmount ? ` + ${product.bonusAmount} bonus` : ""}
                      </p>
                    </div>
                    <Button
                      onClick={() => startPurchase(product)}
                      disabled={isSubmitting}
                      className="bg-slate-900 text-white"
                    >
                      {isSubmitting && selectedProduct?.id === product.id ? "Processing..." : "Buy"}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)]">
        <h3 className="text-xl font-semibold text-slate-900">Order progress</h3>
        <p className="mt-2 text-sm text-slate-600">
          We guide you through payment in under a minute. Each step will turn active once reached.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <StatusCard
            title="Select product"
            active={!!selectedProduct}
            description={selectedProduct ? selectedProduct.name : "Waiting for selection"}
            color="bg-[#f1f5ff]"
          />
          <StatusCard
            title="Pay securely"
            active={paymentPhaseActive && status !== "failed"}
            description={paymentPhaseActive ? statusMessage : "Ready for checkout"}
            color="bg-[#fff3e1]"
          />
          <StatusCard
            title="Delivery"
            active={deliveryPhaseActive && status !== "failed"}
            description={deliveryPhaseActive ? statusMessage : "Pending payment"}
            color="bg-[#e6fff4]"
          />
        </div>
        <p className={`mt-4 text-xs ${status === "failed" ? "text-rose-500" : "text-slate-600"}`}>
          {statusMessage}
        </p>
        {orderSummary && (
          <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Latest order</p>
            <p className="mt-1 font-semibold text-slate-900">{selectedProduct?.name}</p>
            <p className="text-xs text-slate-600">Order ID: {orderSummary.id}</p>
            <p className="text-xs text-slate-600">Payment method: {lastPaymentMethod ?? paymentMethod}</p>
            <p className="text-xs text-slate-600">
              Amount: {formatCurrency(orderSummary.amount, orderSummary.currency)}
            </p>
          </div>
        )}
      </section>

      <section className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)]">
        <h3 className="text-xl font-semibold text-slate-900">Support & legal</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {store.legalLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 hover:border-slate-400"
            >
              {link.label}
              <span>↗</span>
            </a>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          These links fulfil Japan-specific disclosures (Tokusho-hō, Payment Services Act, Terms, Privacy, Cancellation).
        </p>
      </section>
    </div>
  );
}

function StatusCard({
  title,
  description,
  active,
  color,
}: {
  title: string;
  description: string;
  active: boolean;
  color: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-100 px-4 py-3 text-sm ${color} ${
        active ? "shadow-[0_12px_30px_rgba(15,23,42,0.15)]" : "opacity-60"
      }`}
    >
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{title}</p>
      <p className="mt-2 text-sm text-slate-700">{description}</p>
    </div>
  );
}
