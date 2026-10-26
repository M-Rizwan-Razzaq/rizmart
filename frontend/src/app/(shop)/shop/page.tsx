import type { Metadata } from "next";
import { toMetadata } from "@/lib/seo-metadata";
import { fetchApiData } from "@/lib/server-api";
import type { ApiCategory } from "@/store/services/categoriesApi";

const defaultMetadata: Metadata = toMetadata({
  title: "Buy Backpacks, School & Travel Bags Online",
  description:
    "Browse backpacks, school bags, laptop bags and travel bags at RizMart in Pakistan. Compare current prices, product details and availability before ordering with cash on delivery.",
  path: "/shop",
});

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const categoryId = params.category;
  if (typeof categoryId !== "string") return defaultMetadata;

  const category = await fetchApiData<ApiCategory>(`/categories/${encodeURIComponent(categoryId)}`);
  if (!category?.isActive) return defaultMetadata;

  return toMetadata({
    title: `${category.name} Online in Pakistan`,
    description: `Shop ${category.name.toLowerCase()} online in Pakistan with RizMart. Compare current prices, product details and availability, then order with cash on delivery.`,
    path: `/shop?category=${encodeURIComponent(category._id)}`,
  });
}

export { default } from "@/features/shop/pages/ShopPage";
