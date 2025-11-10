import { notFound } from "next/navigation";
import { StorefrontDetail } from "@/components/storefront/storefront-detail";
import { getStorefrontBySlug, getStorefronts } from "@/lib/mock-data";

export async function generateStaticParams() {
  return getStorefronts().map((store) => ({ slug: store.slug }));
}

export default async function StorefrontPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = getStorefrontBySlug(slug);

  if (!store) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl space-y-10 px-4 py-12">
      <StorefrontDetail store={store} />
    </main>
  );
}
