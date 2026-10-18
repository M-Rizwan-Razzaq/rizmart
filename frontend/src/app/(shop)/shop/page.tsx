import type { Metadata } from "next";
import { toMetadata } from "@/lib/seo-metadata";
import { fetchApiData } from "@/lib/server-api";
import type { ApiCategory } from "@/store/services/categoriesApi";

const defaultMetadata: Metadata = toMetadata({
  title: "Shop Bags Online in Pakistan",
  description:
    "Shop backpacks, laptop bags, school bags and travel bags online at RizMart. Check product details, current availability and cash on delivery at checkout.",
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
    title: `Buy ${category.name} Online in Pakistan`,
    description: `Browse ${category.name.toLowerCase()} at RizMart. Compare current prices, check product details and availability, and order with cash on delivery.`,
    path: `/shop?category=${encodeURIComponent(category._id)}`,
  });
}

export { default } from "@/features/shop/pages/ShopPage";
