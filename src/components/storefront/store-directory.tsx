"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PaymentMethod, Storefront } from "@/lib/types";
import { paymentFilters } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";

interface StoreDirectoryProps {
  stores: Storefront[];
}

export function StoreDirectory({ stores }: StoreDirectoryProps) {
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentMethod | null>(null);

  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const matchesQuery = query
        ? [store.displayName, store.gameTitle, store.summary]
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase())
        : true;

      const matchesTag = tagFilter
        ? tagFilter === "exclusive"
          ? !!store.filters.exclusive
          : tagFilter === "bonus10"
          ? (store.filters.minBonusPercent || 0) >= 10
          : tagFilter === "paypay"
          ? store.paymentMethods.includes("PayPay")
          : true
        : true;

      const matchesPayment = payment ? store.paymentMethods.includes(payment) : true;

      return matchesQuery && matchesTag && matchesPayment;
    });
  }, [stores, query, tagFilter, payment]);

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-surface-900/90 via-surface-900/50 to-black/50 p-6 shadow-[0_45px_120px_rgba(4,8,20,0.7)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-brand-200/80">Shop direct</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">
              Choose an official publisher store
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-white/75">
              All payment routes are secured by App Pay. Pick your favorite game, check which local wallets it supports,
              and grab bonus bundles before they vanish.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Input
              placeholder="Search store or game (e.g. A3!)"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="bg-white/10"
            />
            <select
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white sm:w-56"
              value={payment ?? ""}
              onChange={(event) =>
                setPayment(event.target.value ? (event.target.value as PaymentMethod) : null)
              }
            >
              <option value="">Payment method</option>
              {"Visa Mastercard PayPay Line Pay Konbini".split(" ").map((method) => (
                <option key={method} value={method} className="bg-surface-900 text-black">
                  {method}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {paymentFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setTagFilter((prev) => (prev === filter.value ? null : filter.value))}
              className={`rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                tagFilter === filter.value
                  ? "bg-white text-black shadow-lg"
                  : "bg-white/10 text-white/70"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredStores.map((store) => (
          <Link key={store.slug} href={`/stores/${store.slug}`}>
            <article className="group flex h-full flex-col overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-white/10 via-surface-900/40 to-black/70 p-0 shadow-[0_30px_70px_rgba(5,10,30,0.6)] transition hover:-translate-y-1 hover:border-brand-300/70">
              <div className="relative h-48 overflow-hidden">
                <div
                  className="absolute inset-0 transition duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `linear-gradient(120deg, rgba(3,4,12,0.5), rgba(3,4,12,0.8)), url(${store.heroImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="relative flex h-full flex-col justify-between p-5 text-left">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-12 w-12 rounded-2xl border border-white/25"
                      style={{
                        backgroundImage: `url(${store.logo})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div>
                      <p className="text-xs text-white/60">{store.companyName}</p>
                      <p className="text-lg font-semibold text-white">{store.displayName}</p>
                    </div>
                  </div>
                  <div>
                    <Badge variant="outline" className="border-white/40 text-white">
                      {store.tagline}
                    </Badge>
                    <p className="mt-2 text-xl font-semibold text-white">{store.highlightSlogan}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-4 p-5">
                <p className="text-sm text-white/75">{store.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {store.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="border-white/20 text-white/80">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-white/70">
                  {store.paymentMethods.slice(0, 5).map((method) => (
                    <span key={method} className="rounded-full border border-white/15 px-3 py-1">
                      {method}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">From</p>
                    <p className="text-lg font-semibold text-white">
                      {formatCurrency(
                        Math.min(...store.products.map((product) => product.price)),
                        "JPY"
                      )}
                    </p>
                  </div>
                  <Button variant="primary" size="sm" className="px-4">
                    Shop now
                  </Button>
                </div>
              </div>
            </article>
          </Link>
        ))}
        {!filteredStores.length && (
          <div className="rounded-3xl border border-dashed border-white/10 p-10 text-center text-white/60">
            No stores match the current filters. Try adjusting your search.
          </div>
        )}
      </div>
    </div>
  );
}
