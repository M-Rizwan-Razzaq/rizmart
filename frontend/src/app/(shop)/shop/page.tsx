import type { Metadata } from "next";
import { toMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = toMetadata({
  title: "Shop Bags Online in Pakistan",
  description:
    "Browse and buy bags online in Pakistan — laptop bags, backpacks, school bags, travel bags, handbags and crossbody bags by RizMart. Insured delivery to Karachi, Lahore, Islamabad and all of Pakistan.",
  path: "/shop",
});

export { default } from "@/features/shop/pages/ShopPage";
