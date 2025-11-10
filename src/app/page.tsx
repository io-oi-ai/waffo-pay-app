import { StoreDirectory } from "@/components/storefront/store-directory";
import { getStorefronts } from "@/lib/mock-data";

export default function HomePage() {
  const stores = getStorefronts();

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12">
      <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-r from-[#131735] via-[#080b1f] to-[#050812] p-10 shadow-[0_60px_140px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 blur-3xl md:block" style={{ background: "radial-gradient(circle at 30% 40%, rgba(56,189,248,0.45), transparent 50%)" }} />
        <div className="relative z-10 max-w-3xl text-left">
          <p className="text-xs uppercase tracking-[0.45em] text-white/60">App Pay Platform</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-5xl">
            Official storefronts with bonuses, limited packs, and local payments
          </h1>
          <p className="mt-3 text-base text-white/75">
            All offers come straight from publishers. Enjoy PayPay / Konbini / card routes, webhook-fast fulfilment, and transparent pricing.
          </p>
        </div>
      </section>
      <StoreDirectory stores={stores} />
    </main>
  );
}
