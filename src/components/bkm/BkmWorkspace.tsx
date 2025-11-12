"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { merchantWorkspace } from "@/lib/mock-data";
import { MerchantWorkspace, Product } from "@/lib/types";
import { formatBonus, formatCurrency } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/common/section-header";

interface ProductDraft extends Partial<Product> {
  price?: number;
}

const initialWorkspace: MerchantWorkspace = JSON.parse(
  JSON.stringify(merchantWorkspace)
);

export function BkmWorkspace() {
  const [workspace, setWorkspace] = useState<MerchantWorkspace>(initialWorkspace);
  const [productDraft, setProductDraft] = useState<ProductDraft>({
    category: "Limited pack",
    currency: "JPY",
  });

  const autoCopy = useMemo(() => {
    const copy = workspace.store.products
      .filter((product) => product.promotion)
      .map((product) => `${product.name}: ${product.promotion?.copy}`)
      .slice(0, 3)
      .join(" / ");
    return copy || "Better value than in-game purchases!!";
  }, [workspace.store.products]);

  const bonusAverage = useMemo(() => {
    const bonuses = workspace.store.products
      .map((p) => formatBonus(p.baseAmount, p.bonusAmount))
      .filter(Boolean) as number[];
    if (!bonuses.length) return 0;
    return Math.round(
      bonuses.reduce((acc, value) => acc + value, 0) / bonuses.length
    );
  }, [workspace.store.products]);

  const handleStoreField = <K extends keyof MerchantWorkspace["store"]>(
    field: K,
    value: MerchantWorkspace["store"][K]
  ) => {
    setWorkspace((prev) => ({
      ...prev,
      store: {
        ...prev.store,
        [field]: value,
      },
    }));
  };

  const handleWebhookField = <K extends keyof MerchantWorkspace["webhook"]>(
    field: K,
    value: MerchantWorkspace["webhook"][K]
  ) => {
    setWorkspace((prev) => ({
      ...prev,
      webhook: {
        ...prev.webhook,
        [field]: value,
      },
    }));
  };

  const handleSettlementField = <K extends keyof MerchantWorkspace["settlement"]>(
    field: K,
    value: MerchantWorkspace["settlement"][K]
  ) => {
    setWorkspace((prev) => ({
      ...prev,
      settlement: {
        ...prev.settlement,
        [field]: value,
      },
    }));
  };

  const handleDraftChange = <K extends keyof ProductDraft>(
    field: K,
    value: ProductDraft[K]
  ) => {
    setProductDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addProduct = () => {
    if (!productDraft.name || !productDraft.price || !productDraft.gameItemId) {
      return;
    }
    const newProduct: Product = {
      id: `draft-${Date.now()}`,
      name: productDraft.name,
      category: productDraft.category || "Standard top-up",
      price: Number(productDraft.price),
      currency: productDraft.currency || "JPY",
      baseAmount: Number(productDraft.baseAmount) || 0,
      bonusAmount: Number(productDraft.bonusAmount) || 0,
      description: productDraft.description,
      icon: productDraft.icon,
      gameItemId: productDraft.gameItemId,
      limited: productDraft.limited,
      subscription: productDraft.subscription,
      promotion: productDraft.promotion,
    };

    setWorkspace((prev) => ({
      ...prev,
      store: {
        ...prev.store,
        products: [newProduct, ...prev.store.products],
      },
    }));
    setProductDraft({ category: productDraft.category, currency: productDraft.currency });
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-300/80">
            Merchant Console
          </p>
          <h1 className="mt-3 text-3xl font-semibold">
            Workspace · {workspace.store.displayName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/70">
            Configure storefront basics, SKUs, promotions, fulfilment, and compliance from a single place. Preview the consumer experience and publish to App Pay when ready.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/stores"
            className="inline-flex h-11 items-center rounded-full border border-white/15 px-5 text-sm text-white hover:bg-white/10"
          >
            View consumer storefront
          </Link>
          <Button>Publish to production</Button>
        </div>
      </header>

      <section>
        <SectionHeader
          title="Account pulse"
          description="Key metrics over the last 24h. Finish the onboarding steps to go live."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Metric label="GMV today" value={formatCurrency(1280000)} trend="▲ 12% vs yesterday" />
          <Metric label="Average bonus" value={`${bonusAverage || 0}%`} highlight="Across live SKUs" />
          <Metric
            label="Webhook P95"
            value={`${workspace.webhook.lastLatencyMs} ms`}
            highlight={`Success rate ${workspace.webhook.reliability}%`}
          />
          <Metric
            label="Payout status"
            value={workspace.settlement.status === "verified" ? "Verified" : "Pending"}
            highlight={`${workspace.settlement.bankName} · ${workspace.settlement.payoutSchedule}`}
          />
        </div>
      </section>

      <section>
        <SectionHeader
          title="Step 1 · Payout & billing"
          description="Tell us where to send your revenue. Settlements stay on hold until this section is verified."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Payout account</CardTitle>
            </CardHeader>
            <CardContent className="gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Bank</Label>
                  <Input
                    value={workspace.settlement.bankName}
                    onChange={(event) => handleSettlementField("bankName", event.target.value)}
                  />
                </div>
                <div>
                  <Label>Branch</Label>
                  <Input
                    value={workspace.settlement.branch}
                    onChange={(event) => handleSettlementField("branch", event.target.value)}
                  />
                </div>
                <div>
                  <Label>Account name</Label>
                  <Input
                    value={workspace.settlement.accountName}
                    onChange={(event) => handleSettlementField("accountName", event.target.value)}
                  />
                </div>
                <div>
                  <Label>Account number</Label>
                  <Input
                    value={workspace.settlement.accountNumber}
                    onChange={(event) => handleSettlementField("accountNumber", event.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>Payout schedule</Label>
                <Input
                  value={workspace.settlement.payoutSchedule}
                  onChange={(event) => handleSettlementField("payoutSchedule", event.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 text-sm text-white/70">
                <Badge variant="success">{workspace.settlement.status === "verified" ? "Verified" : "Pending"}</Badge>
                <span>Funds remit to {workspace.settlement.bankName}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5">
            <CardHeader>
              <CardTitle>Onboarding checklist</CardTitle>
            </CardHeader>
            <CardContent className="gap-3 text-sm text-white/70">
              <p>1. Add payout account & sign the merchant agreement.</p>
              <p>2. Upload store profile, hero art, and legal links.</p>
              <p>3. Draft SKUs and promos, then preview the storefront.</p>
              <p>4. Drop your webhook so orders deliver instantly.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="store-info">
        <SectionHeader
          title="Step 2 · Store profile"
          description="Control the visual identity, company profile, and customer support touchpoints."
          action={<span className="text-xs text-white/50">Storefront URL: {workspace.store.storefrontUrl}</span>}
        />
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card>
            <CardContent className="gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Store name</Label>
                  <Input
                    value={workspace.store.displayName}
                    onChange={(event) => handleStoreField("displayName", event.target.value)}
                  />
                </div>
                <div>
                  <Label>Company name</Label>
                  <Input
                    value={workspace.store.companyName}
                    onChange={(event) => handleStoreField("companyName", event.target.value)}
                  />
                </div>
                <div>
                  <Label>Logo URL</Label>
                  <Input
                    value={workspace.store.logo}
                    onChange={(event) => handleStoreField("logo", event.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label>Hero banner URL</Label>
                  <Input
                    value={workspace.store.heroImage}
                    onChange={(event) => handleStoreField("heroImage", event.target.value)}
                  />
                </div>
                <div>
                  <Label>Tagline</Label>
                  <Input
                    value={workspace.store.tagline}
                    onChange={(event) => handleStoreField("tagline", event.target.value)}
                  />
                </div>
                <div>
                  <Label>Support channel</Label>
                  <Input
                    value={workspace.store.supportChannel}
                    onChange={(event) => handleStoreField("supportChannel", event.target.value)}
                  />
                </div>
                <div>
                  <Label>Support email</Label>
                  <Input
                    type="email"
                    value={workspace.store.contactEmail}
                    onChange={(event) => handleStoreField("contactEmail", event.target.value)}
                  />
                </div>
                <div>
                  <Label>Slogan / highlight</Label>
                  <Input
                    value={workspace.store.highlightSlogan}
                    onChange={(event) => handleStoreField("highlightSlogan", event.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>Store description</Label>
                <Textarea
                  rows={4}
                  value={workspace.store.summary}
                  onChange={(event) => handleStoreField("summary", event.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-white/10 to-white/5">
            <CardHeader>
              <CardTitle>Storefront preview</CardTitle>
            </CardHeader>
            <CardContent className="gap-4">
              <div
                className="relative h-40 w-full overflow-hidden rounded-2xl border border-white/15"
                style={{
                  backgroundImage: `linear-gradient(120deg, rgba(4,5,10,0.6), rgba(4,5,10,0.2)), url(${workspace.store.heroImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 flex flex-col justify-between p-4">
                  <Badge>{workspace.store.tagline}</Badge>
                  <p className="text-xl font-semibold">
                    {workspace.store.highlightSlogan}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <div
                    className="h-10 w-10 rounded-2xl"
                    style={{
                      backgroundImage: `url(${workspace.store.logo})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div>
                    <p className="font-semibold">{workspace.store.displayName}</p>
                    <p className="text-xs text-white/60">{workspace.store.companyName}</p>
                  </div>
                </div>
                <p className="text-xs text-white/60">Auto messaging</p>
                <p className="text-sm leading-relaxed">{autoCopy}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="products">
        <SectionHeader
          title="Step 3 · Products & bundles"
          description="Manage all web-exclusive SKUs including limited packs, standard top-ups, and subscriptions."
          action={<span className="text-xs text-white/60">{workspace.store.products.length} SKUs</span>}
        />
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Live catalog</CardTitle>
            </CardHeader>
            <CardContent className="gap-4">
              {workspace.store.products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center"
                >
                  <div className="flex flex-1 items-center gap-4">
                    <div
                      className="h-14 w-14 rounded-2xl border border-white/10"
                      style={{
                        backgroundImage: product.icon
                          ? `url(${product.icon})`
                          : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-xs text-white/60">{product.category}</p>
                      <p className="text-xs text-white/50">Game item ID: {product.gameItemId}</p>
                    </div>
                  </div>
                  <div className="flex flex-col text-right">
                    <p className="text-lg font-semibold">
                      {formatCurrency(product.price, product.currency)}
                    </p>
                    {product.bonusAmount ? (
                      <p className="text-xs text-success">
                        Bonus {product.bonusAmount} ({formatBonus(product.baseAmount, product.bonusAmount)}%)
                      </p>
                    ) : (
                      <p className="text-xs text-white/60">Standard price</p>
                    )}
                    {product.promotion && (
                      <Badge className="mt-2" variant="outline">
                        {product.promotion.copy}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Add new SKU</CardTitle>
            </CardHeader>
            <CardContent className="gap-4">
              <div className="grid gap-4">
                <div>
                  <Label>Product name</Label>
                  <Input
                    value={productDraft.name || ""}
                    onChange={(event) => handleDraftChange("name", event.target.value)}
                    placeholder="Full Bloom Pack"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price (JPY)</Label>
                    <Input
                      type="number"
                      value={productDraft.price || ""}
                      onChange={(event) => handleDraftChange("price", Number(event.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Base amount</Label>
                    <Input
                      type="number"
                      value={productDraft.baseAmount || ""}
                      onChange={(event) => handleDraftChange("baseAmount", Number(event.target.value))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Bonus amount (optional)</Label>
                    <Input
                      type="number"
                      value={productDraft.bonusAmount || ""}
                      onChange={(event) => handleDraftChange("bonusAmount", Number(event.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Input
                      value={productDraft.category || ""}
                      onChange={(event) => handleDraftChange("category", event.target.value)}
                      placeholder="Limited pack"
                    />
                  </div>
                </div>
                <div>
                  <Label>In-game item ID</Label>
                  <Input
                    value={productDraft.gameItemId || ""}
                    onChange={(event) => handleDraftChange("gameItemId", event.target.value)}
                    placeholder="A3_PACK_LIMITED"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    rows={3}
                    value={productDraft.description || ""}
                    onChange={(event) => handleDraftChange("description", event.target.value)}
                  />
                </div>
              </div>
              <Button onClick={addProduct}>Add to draft</Button>
              <p className="text-xs text-white/50">
                Draft SKUs sync to the preview instantly and can be shipped via API once published.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="promotion">
        <SectionHeader
          title="Promo badges"
          description="Set bonus or discount rules, generate auto-copy, and highlight App Pay exclusives."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Bonus & discount strategy
                <span className="ml-3 text-sm font-normal text-white/60">
                  Avg. bonus {bonusAverage}%
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="gap-6">
              <div className="space-y-2">
                <Label>Auto copy preview</Label>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                  {autoCopy}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Promo tags</Label>
                <div className="flex flex-wrap gap-2">
                  {workspace.store.filters.categoryTags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <PromoStat label="App Pay exclusive" value="4 SKUs" />
                <PromoStat label=">10% bonus" value="2 SKUs" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Badge & CTA</CardTitle>
            </CardHeader>
            <CardContent className="gap-4">
              <div>
                <Label>Hero badge copy</Label>
                <Input
                  value={workspace.store.highlightSlogan}
                  onChange={(event) => handleStoreField("highlightSlogan", event.target.value)}
                />
              </div>
              <div>
                <Label>CTA snippet</Label>
                <Textarea
                  rows={3}
                  placeholder="Better value than in-game purchases!!"
                  value={autoCopy}
                  disabled
                />
              </div>
              <p className="text-xs text-white/50">
                Once published, the consumer list automatically surfaces this copy and adds a “PayPay supported” badge when applicable.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="webhook">
        <SectionHeader
          title="Step 4 · Fulfilment & webhooks"
          description="Drop your webhook URL and signing key so we can send orders the moment payments clear."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Webhook configuration</CardTitle>
            </CardHeader>
            <CardContent className="gap-4">
              <div>
                <Label>Webhook URL</Label>
                <Input
                  value={workspace.webhook.url}
                  onChange={(event) => handleWebhookField("url", event.target.value)}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Signing secret</Label>
                  <Input
                    value={workspace.webhook.secret}
                    onChange={(event) => handleWebhookField("secret", event.target.value)}
                  />
                </div>
                <div>
                  <Label>Retry attempts</Label>
                  <Input
                    type="number"
                    value={workspace.webhook.retries}
                    onChange={(event) => handleWebhookField("retries", Number(event.target.value))}
                  />
                </div>
              </div>
              <div>
                <Label>User ID field</Label>
                <Input
                  value={workspace.webhook.userIdField}
                  onChange={(event) => handleWebhookField("userIdField", event.target.value)}
                  placeholder="gameId"
                />
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                <p>Success rate: {workspace.webhook.reliability}%</p>
                <p>P95 latency: {workspace.webhook.lastLatencyMs} ms</p>
                <p>Last delivery: {new Date(workspace.webhook.lastDeliveryAt).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5">
            <CardHeader>
              <CardTitle>Security notes</CardTitle>
            </CardHeader>
            <CardContent className="gap-3 text-sm text-white/70">
              <p>• Use HTTPS endpoints and rotate secrets when you rotate signing keys.</p>
              <p>• We retry failed webhooks based on your configured policy (default 0s / 10s / 60s / 5m).</p>
              <p>• Expose a `/status` endpoint so we can monitor availability.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="legal">
        <SectionHeader
          title="Legal & support links"
          description="Paste the required disclosures and we will render them on every storefront."
        />
        <Card>
          <CardContent className="gap-4">
            {workspace.store.legalLinks.map((link, index) => (
              <div key={link.label} className="grid gap-4 md:grid-cols-[200px_1fr]">
                <div>
                  <Label>{link.label}</Label>
                </div>
                <Input
                  value={link.url}
                  onChange={(event) => {
                    const nextLinks = [...workspace.store.legalLinks];
                    nextLinks[index] = { ...link, url: event.target.value };
                    handleStoreField("legalLinks", nextLinks);
                  }}
                />
              </div>
            ))}
            <p className="text-xs text-white/50">
              The consumer storefront footer follows this order to satisfy Japanese e-commerce regulations.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Metric({ label, value, highlight, trend }: { label: string; value: string; highlight?: string; trend?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.3em] text-white/60">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {trend && <p className="text-xs text-success mt-1">{trend}</p>}
      {highlight && <p className="text-xs text-white/60 mt-1">{highlight}</p>}
    </div>
  );
}

function PromoStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-surface-900/60 p-4 text-sm">
      <p className="text-white/60">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}
