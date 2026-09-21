import type { Metadata } from "next";
import { toMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = toMetadata({
  title: "FAQ — Buying Bags Online in Pakistan",
  description:
    "Frequently asked questions about buying bags online in Pakistan from RizMart — cash on delivery, free shipping, 7-day returns, laptop bags, backpacks, travel bags and our quality guarantee.",
  path: "/faq",
});

export { default } from "@/features/shop/pages/FaqPage";
