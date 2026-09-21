import type { Metadata } from "next";
import { toMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = toMetadata({
  title: "Shop Bags Online in Pakistan — Laptop Bags, Backpacks, Travel Bags",
  description:
    "Buy bags online in Pakistan from RizMart's largest collection — laptop bags, backpacks, school bags, travel bags, handbags, tote bags & crossbody bags. Cash on delivery. Free shipping to Karachi, Lahore, Islamabad & all of Pakistan.",
  path: "/shop",
});

export { default } from "@/features/shop/pages/ShopPage";
