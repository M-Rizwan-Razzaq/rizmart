import type { Metadata } from "next";
import { toMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = toMetadata({
  title: "Our Story — Premium Bags Brand from Pakistan",
  description:
    "Discover RizMart — Pakistan's premium bags brand. Every laptop bag, backpack, travel bag and handbag is designed in-house for durability and style. Based in Karachi, shipping across Pakistan.",
  path: "/about",
});

export { default } from "@/features/shop/pages/AboutPage";
