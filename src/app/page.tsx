import { StoreDirectory } from "@/components/storefront/store-directory";
import { getStorefronts } from "@/lib/mock-data";

const heroHighlights = [
  {
    title: "Anime collab drops",
    copy: "Limited manga frames, autograph assets, and neon UI",
  },
  {
    title: "Wallets players love",
    copy: "Visa / Mastercard / PayPay / Konbini / Line Pay",
  },
  {
    title: "< 60s fulfilment",
    copy: "Webhook 99.99% + realtime order tracing",
  },
];

export default function HomePage() {
  const stores = getStorefronts();

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12">
      <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-r from-[#21264f] via-[#0c0f24] to-[#05070f] p-10 shadow-[0_60px_140px_rgba(0,0,0,0.55)]">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 blur-3xl md:block" style={{ background: "radial-gradient(circle at 40% 35%, rgba(56,189,248,0.55), transparent 55%)" }} />
        <div className="relative z-10 grid gap-8 md:grid-cols-[1.4fr_0.8fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-white/60">App Pay universe</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-5xl">
              游戏 & 漫画官方直充商城<br />Bonus packs + 本地支付一次搞定
            </h1>
            <p className="mt-3 text-base text-white/75">
              精选发行商实时接入，带来角色主题礼包、PayPay / Konbini / Line Pay 等钱包，以及 60 秒内完成的安全发货流程。
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {heroHighlights.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/15 bg-white/5 p-4 text-left text-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
              >
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-xs text-white/70">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <StoreDirectory stores={stores} />
    </main>
  );
}
