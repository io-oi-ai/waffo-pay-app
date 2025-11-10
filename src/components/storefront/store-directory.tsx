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

const pastelCards = [
  {
    background: "linear-gradient(180deg,#EAF2FF 0%,#FFFFFF 100%)",
    shadow: "0 25px 60px rgba(77,109,255,0.18)",
    accent: "#24307a",
  },
  {
    background: "linear-gradient(180deg,#FFF5DA 0%,#FFFFFF 100%)",
    shadow: "0 25px 60px rgba(255,179,0,0.2)",
    accent: "#9a5b00",
  },
  {
    background: "linear-gradient(180deg,#FDE7F3 0%,#FFFFFF 100%)",
    shadow: "0 25px 60px rgba(240,117,182,0.2)",
    accent: "#8a2c5c",
  },
  {
    background: "linear-gradient(180deg,#E2FFF6 0%,#FFFFFF 100%)",
    shadow: "0 25px 60px rgba(72,194,159,0.2)",
    accent: "#0f6c57",
  },
  {
    background: "linear-gradient(180deg,#F7E7FF 0%,#FFFFFF 100%)",
    shadow: "0 25px 60px rgba(166,110,255,0.2)",
    accent: "#5a2ca0",
  },
  {
    background: "linear-gradient(180deg,#FFEFE4 0%,#FFFFFF 100%)",
    shadow: "0 25px 60px rgba(245,144,96,0.25)",
    accent: "#8a391d",
  },
];

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
    <div className="space-y-8">
      <div className="rounded-[28px] border border-black/5 bg-white/70 p-6 shadow-[0_40px_100px_rgba(15,23,42,0.12)] backdrop-blur-lg">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-brand-500/80">Shop direct</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              Choose an official publisher store
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Every listing is curated with bonus currency or limited bundles. Search for a game and filter by payment method or App Pay exclusives.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Input
              placeholder="Search store or game (e.g. A3!)"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="bg-white"
            />
            <select
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-inner sm:w-56"
              value={payment ?? ""}
              onChange={(event) =>
                setPayment(event.target.value ? (event.target.value as PaymentMethod) : null)
              }
            >
              <option value="">Payment method</option>
              {"Visa Mastercard PayPay Line Pay Konbini".split(" ").map((method) => (
                <option key={method} value={method} className="bg-white text-slate-900">
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
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredStores.map((store, index) => {
          const theme = pastelCards[index % pastelCards.length];
          return (
            <Link key={store.slug} href={`/stores/${store.slug}`}>
              <article
                className="group flex h-full flex-col overflow-hidden rounded-[30px] border border-transparent px-0 pb-0"
                style={{ backgroundImage: theme.background, boxShadow: theme.shadow }}
              >
                <div className="relative h-48 overflow-hidden">
                  <div
                    className="absolute inset-0 transition duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: `linear-gradient(140deg, rgba(255,255,255,0.1), rgba(0,0,0,0.2)), url(${store.heroImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      mixBlendMode: "multiply",
                    }}
                  />
                  <div className="relative flex h-full flex-col justify-between p-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-12 w-12 rounded-2xl border border-white/40"
                        style={{
                          backgroundImage: `url(${store.logo})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      <div>
                        <p className="text-xs text-white/80">{store.companyName}</p>
                        <p className="text-lg font-semibold text-white">{store.displayName}</p>
                      </div>
                    </div>
                    <div>
                      <Badge variant="outline" className="border-white/60 text-white">
                        {store.tagline}
                      </Badge>
                      <p className="mt-2 text-xl font-semibold text-white">
                        {store.highlightSlogan}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-5">
                  <p className="text-sm text-slate-700">{store.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {store.features.map((feature) => (
                      <Badge
                        key={feature}
                        variant="outline"
                        className="border-slate-200 bg-white/70 text-slate-600"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    {store.paymentMethods.slice(0, 5).map((method) => (
                      <span key={method} className="rounded-full border border-slate-200 px-3 py-1">
                        {method}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/80 px-4 py-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">From</p>
                      <p className="text-lg font-semibold text-slate-900">
                        {formatCurrency(
                          Math.min(...store.products.map((product) => product.price)),
                          "JPY"
                        )}
                      </p>
                    </div>
                    <Button variant="primary" size="sm" className="bg-slate-900 text-white shadow-lg">
                      Shop now
                    </Button>
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
        {!filteredStores.length && (
          <div className="rounded-3xl border border-dashed border-black/10 bg-white p-10 text-center text-slate-500">
            No stores match the current filters. Try adjusting your search.
          </div>
        )}
      </div>
    </div>
  );
}
