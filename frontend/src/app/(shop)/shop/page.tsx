import type { Metadata } from "next";
import { toMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = toMetadata({
  title: "Shop Bags Online in Pakistan",
  description:
    "Shop backpacks, laptop bags, school bags and travel bags online at RizMart. Cash on delivery and nationwide delivery across Pakistan.",
  path: "/shop",
});

export { default } from "@/features/shop/pages/ShopPage";
