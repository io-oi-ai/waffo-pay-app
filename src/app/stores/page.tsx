import { getStorefronts } from "@/lib/mock-data";
import { StoreDirectory } from "@/components/storefront/store-directory";

export default function StoresPage() {
  const stores = getStorefronts();

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-4 py-12">
      <StoreDirectory stores={stores} />
    </main>
  );
}
