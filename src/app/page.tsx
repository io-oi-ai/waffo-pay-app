import { StoreDirectory } from "@/components/storefront/store-directory";
import { getStorefronts } from "@/lib/mock-data";

export default function HomePage() {
  const stores = getStorefronts();

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12">
      <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-brand-500/30 via-brand-500/10 to-surface-900/60 p-10 text-center shadow-floating">
        <p className="text-xs uppercase tracking-[0.4em] text-white/70">Official App Pay Stores</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-white">
          Discover exclusive top-up deals directly from your favorite games
        </h1>
        <p className="mx-auto mt-3 max-w-3xl text-base text-white/80">
          Every store is operated by the publisher with secure payments, bonus currency, and local wallets such as PayPay, Line Pay, and Konbini.
        </p>
      </section>
      <StoreDirectory stores={stores} />
    </main>
  );
}
