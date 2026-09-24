import type { Metadata } from "next";
import { toMetadata } from "@/lib/seo-metadata";
import HomePage from "@/features/shop/pages/HomePage";
import { fetchApiData } from "@/lib/server-api";
import type { ApiProduct } from "@/store/services/productsApi";

export const metadata: Metadata = toMetadata({ path: "/" });

export default async function Page() {
  // Render products into the initial HTML so Facebook's in-app browser can
  // show the catalog even before client-side API requests/hydration complete.
  const featured = await fetchApiData<ApiProduct[]>("/products/featured");
  return <HomePage initialFeatured={featured ?? undefined} />;
}
