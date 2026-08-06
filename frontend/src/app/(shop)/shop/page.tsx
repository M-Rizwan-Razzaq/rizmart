import type { Metadata } from "next";
import { toMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = toMetadata({
  title: "Shop Jewellery Online in Pakistan",
  description:
    "Browse and buy jewellery online in Pakistan — gold, silver and rose-gold rings, necklaces, bracelets and watches by Desi Muse. Insured delivery to Karachi, Lahore, Islamabad and all of Pakistan.",
  path: "/shop",
});

export { default } from "@/features/shop/pages/ShopPage";