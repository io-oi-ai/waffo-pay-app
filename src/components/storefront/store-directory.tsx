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

const cardThemes = [
  {
    bg: "linear-gradient(140deg, rgba(47,64,150,0.95), rgba(12,17,52,0.95))",
    glow: "0 35px 120px rgba(91,109,255,0.35)",
    border: "rgba(117,138,255,0.7)",
  },
  {
    bg: "linear-gradient(140deg, rgba(70,15,65,0.95), rgba(12,10,32,0.95))",
    glow: "0 35px 120px rgba(255,106,189,0.35)",
    border: "rgba(255,152,215,0.6)",
  },
  {
    bg: "linear-gradient(140deg, rgba(18,79,86,0.95), rgba(7,26,33,0.95))",
    glow: "0 35px 120px rgba(35,211,238,0.35)",
    border: "rgba(104,229,255,0.6)",
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
      <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#161a3a] via-[#0c1126] to-[#060914] p-6 shadow-[0_60px_160px_rgba(0,0,0,0.65)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">App Pay curated stores</p>
            <h2 className="mt-2 text-4xl font-semibold text-white">
              Official top-up channels · Bonus packs · Local wallets
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-white/70">
              Search your title, compare exclusive incentives, and filter by wallets such as Visa, PayPay, Konbini, or
              Line Pay.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Input
              placeholder="Search store or game (e.g. A3!)"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="border-white/20 bg-white/5 text-white placeholder:text-white/50"
            />
            <select
              className="w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white sm:w-56"
              value={payment ?? ""}
              onChange={(event) =>
                setPayment(event.target.value ? (event.target.value as PaymentMethod) : null)
              }
            >
              <option value="">Payment method</option>
              {"Visa Mastercard PayPay Line Pay Konbini".split(" ").map((method) => (
                <option key={method} value={method} className="bg-[#0e1227] text-white">
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
                  ? "bg-white text-[#070b1d] shadow-lg"
                  : "bg-white/10 text-white/70"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredStores.map((store, index) => {
          const theme = cardThemes[index % cardThemes.length];
          return (
            <Link key={store.slug} href={`/stores/${store.slug}`}>
              <article
                className="group flex h-full flex-col overflow-hidden rounded-[30px] border backdrop-blur-3xl"
                style={{ backgroundImage: theme.bg, boxShadow: theme.glow, borderColor: theme.border }}
              >
                <div className="relative h-48 overflow-hidden">
                  <div
                    className="absolute inset-0 transition duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: `linear-gradient(130deg, rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${store.heroImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="relative flex h-full flex-col justify-between p-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-12 w-12 rounded-2xl border border-white/60"
                        style={{
                          backgroundImage: `url(${store.logo})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      <div>
                        <p className="text-xs text-white/70">{store.companyName}</p>
                        <p className="text-lg font-semibold text-white">{store.displayName}</p>
                      </div>
                    </div>
                    <div>
                      <Badge variant="outline" className="border-white/60 text-white">
                        {store.tagline}
                      </Badge>
                      <p className="mt-2 text-xl font-semibold text-white">{store.highlightSlogan}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-5 text-white">
                  <p className="text-sm text-white/75">{store.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {store.features.map((feature) => (
                      <Badge key={feature} variant="outline" className="border-white/20 bg-white/10 text-white/80">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-white/70">
                    {store.paymentMethods.slice(0, 5).map((method) => (
                      <span key={method} className="rounded-full border border-white/20 px-3 py-1">
                        {method}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/60">From</p>
                      <p className="text-lg font-semibold text-white">
                        {formatCurrency(
                          Math.min(...store.products.map((product) => product.price)),
                          "JPY"
                        )}
                      </p>
                    </div>
                    <Button variant="primary" size="sm" className="bg-white text-[#070b1d] shadow-lg">
                      Shop now
                    </Button>
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
        {!filteredStores.length && (
          <div className="rounded-3xl border border-dashed border-white/10 bg-[#0d1224] p-10 text-center text-white/60">
            No stores match the current filters. Try adjusting your search.
          </div>
        )}
      </div>
    </div>
  );
}
