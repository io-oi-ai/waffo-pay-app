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
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "success" | "failed">("idle");
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);
  const [idError, setIdError] = useState<string | null>(null);

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

  const openCheckout = (product: Product) => {
    if (!userId.trim()) {
      setIdError("Please enter your player ID first");
      return;
    }
    setIdError(null);
    setPendingProduct(product);
    setShowCheckout(true);
    setCheckoutStatus("idle");
  };

  const startPurchase = async () => {
    if (!pendingProduct) return;
    const product = pendingProduct;
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
      setCheckoutStatus("success");
      await playbackTimeline(data.timeline);
      if (data.timeline.every((step) => step.phase !== "failed")) {
        setStatusMessage("Payment confirmed. Items will arrive within a few minutes.");
        setTimeout(() => setShowCheckout(false), 800);
      }
    } catch (error) {
      setStatus("failed");
      setStatusMessage(error instanceof Error ? error.message : "Payment simulation failed");
      setCheckoutStatus("failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentPhaseActive =
    currentPhase === "created" || currentPhase === "redirect" || currentPhase === "processing";
  const deliveryPhaseActive = currentPhase === "webhook" || currentPhase === "completed";

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#141a38] via-[#0b112a] to-[#070b1c] p-8 shadow-[0_60px_150px_rgba(0,0,0,0.55)]">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Official storefront</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">{store.displayName}</h1>
            <p className="mt-1 text-sm text-white/70">{store.gameTitle}</p>
            <p className="mt-3 max-w-2xl text-base text-white/80">{store.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {store.features.map((feature) => (
                <Badge key={feature} variant="outline" className="border-white/20 bg-white/10 text-white/80">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
          <div className="rounded-[24px] border border-white/15 bg-white/5 p-4 shadow-inner">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
              Accepted payments
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {store.paymentMethods.map((method) => (
                <span
                  key={method}
                  className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80"
                >
                  {method}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs text-white/60">
              Secured by App Pay • Most orders fulfil within a couple of minutes.
            </p>
          </div>
        </div>
      </div>

      <section className="rounded-[28px] border border-white/10 bg-[#0b1225] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
        <h2 className="text-xl font-semibold text-white">Identify your account</h2>
        <p className="mt-2 text-sm text-white/70">
          Enter your {store.userIdentifierLabel}; we’ll deliver directly to your in-game inbox once payment clears.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            placeholder={store.userIdentifierHint}
            className="border-white/20 bg-white/5 text-white placeholder:text-white/40"
            aria-invalid={Boolean(idError)}
          />
          <select
            className="rounded-2xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white"
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)}
          >
            {store.paymentMethods.map((method) => (
              <option key={method} value={method} className="bg-[#050912] text-white">
                {method}
              </option>
            ))}
          </select>
        </div>
        <p className="mt-2 text-xs text-white/50">
          Can’t find it? Open the game → Settings → Account and copy the ID here.
        </p>
        {idError && <p className="mt-2 text-xs text-rose-300">{idError}</p>}
      </section>

      <section className="space-y-6">
        {Object.entries(productGroups).map(([category, products]) => (
          <div key={category} className="rounded-[28px] border border-white/8 bg-[#070c1a] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.4)]">
            <div className="flex flex-col gap-2 border-b border-white/5 pb-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">{category}</p>
                <h3 className="text-2xl font-semibold text-white">Featured bundles</h3>
              </div>
              <p className="text-sm text-white/50">
                {category.includes("Limited") ? "App Pay exclusive" : "Official direct top-up"}
              </p>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-semibold text-white">{product.name}</h4>
                      {product.promotion && (
                        <Badge
                          variant={product.promotion.type === "bonus" ? "success" : "warning"}
                          className="bg-white/10 text-white"
                        >
                          {product.promotion.copy}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-white/70">{product.description}</p>
                    <p className="text-xs text-white/50">Game ID: {product.gameItemId}</p>
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-semibold text-white">
                        {formatCurrency(product.price, product.currency)}
                      </p>
                      <p className="text-xs text-white/60">
                        Includes {product.baseAmount} base
                        {product.bonusAmount ? ` + ${product.bonusAmount} bonus` : ""}
                      </p>
                    </div>
                    <Button
                      onClick={() => openCheckout(product)}
                      disabled={isSubmitting && selectedProduct?.id === product.id}
                      className="bg-white text-[#070b1d]"
                    >
                      Buy now
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-[28px] border border-white/10 bg-[#070c1a] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.4)]">
        <h3 className="text-xl font-semibold text-white">Order progress</h3>
        <p className="mt-2 text-sm text-white/70">
          The entire flow takes under a minute. Each step glows the moment it completes.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <StatusCard
            title="Select product"
            active={!!selectedProduct}
            description={selectedProduct ? selectedProduct.name : "Waiting for selection"}
            color="#3b1f5d, #1e1034"
          />
          <StatusCard
            title="Pay securely"
            active={paymentPhaseActive && status !== "failed"}
            description={paymentPhaseActive ? statusMessage : "Ready for checkout"}
            color="#3b2f5d, #1d1235"
          />
          <StatusCard
            title="Delivery"
            active={deliveryPhaseActive && status !== "failed"}
            description={deliveryPhaseActive ? statusMessage : "Pending payment"}
            color="#1f3b5d, #0f2037"
          />
        </div>
        <p className={`mt-4 text-xs ${status === "failed" ? "text-rose-400" : "text-white/70"}`}>
          {statusMessage}
        </p>
        {orderSummary && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Latest order</p>
            <p className="mt-1 font-semibold text-white">{selectedProduct?.name}</p>
            <p className="text-xs text-white/60">Order ID: {orderSummary.id}</p>
            <p className="text-xs text-white/60">Payment method: {lastPaymentMethod ?? paymentMethod}</p>
            <p className="text-xs text-white/60">
              Amount: {formatCurrency(orderSummary.amount, orderSummary.currency)}
            </p>
          </div>
        )}
      </section>

      <section className="rounded-[28px] border border-white/10 bg-[#070c1a] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.4)]">
        <h3 className="text-xl font-semibold text-white">Support & legal</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {store.legalLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/80 hover:border-white/40"
            >
              {link.label}
              <span>↗</span>
            </a>
          ))}
        </div>
        <p className="mt-4 text-xs text-white/50">
          These links satisfy Japanese Tokusho-hō, Payment Services Act, Terms, Privacy, and Cancellation policies.
        </p>
      </section>
      {showCheckout && pendingProduct && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/70 px-4 py-10">
          <div className="w-full max-w-lg rounded-[28px] border border-white/10 bg-[#050812] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-white">Confirm purchase</h4>
              <button
                className="text-white/60 hover:text-white"
                onClick={() => {
                  setShowCheckout(false);
                  setCheckoutStatus("idle");
                }}
              >
                ✕
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-white/80">
              <p className="text-base text-white">{pendingProduct.name}</p>
              <p>Payment method: {paymentMethod}</p>
              <p>Player ID: {userId}</p>
              <p className="text-xl font-semibold text-white">
                {formatCurrency(pendingProduct.price, pendingProduct.currency)}
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <Button onClick={startPurchase} disabled={isSubmitting} className="bg-white text-[#070b1d]">
                {isSubmitting ? "Processing..." : "Confirm and pay"}
              </Button>
              <button
                className="text-xs text-white/50 hover:text-white"
                onClick={() => {
                  setShowCheckout(false);
                  setCheckoutStatus("idle");
                  setPendingProduct(null);
                }}
              >
                Cancel
              </button>
            </div>
            {checkoutStatus === "success" && (
              <div className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                Payment confirmed. Redirecting back to storefront…
              </div>
            )}
            {checkoutStatus === "failed" && (
              <div className="mt-4 rounded-2xl border border-rose-400/40 bg-rose-500/10 p-4 text-sm text-rose-200">
                Payment failed. Please retry or switch payment method.
              </div>
            )}
          </div>
        </div>
      )}
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
      className={`rounded-2xl border border-white/10 px-4 py-3 text-sm text-white ${
        active ? "shadow-[0_15px_40px_rgba(0,0,0,0.45)]" : "opacity-60"
      }`}
      style={{ backgroundImage: `linear-gradient(135deg, ${color})` }}
    >
      <p className="text-xs uppercase tracking-[0.3em] text-white/70">{title}</p>
      <p className="mt-2 text-sm">{description}</p>
    </div>
  );
}
