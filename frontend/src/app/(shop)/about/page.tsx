import type { Metadata } from "next";
import { toMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = toMetadata({
  title: "Our Story — Premium Bags Brand from Pakistan",
  description:
    "Learn about RizMart and browse our current collection of backpacks, school bags, laptop bags and travel bags.",
  path: "/about",
});

export { default } from "@/features/shop/pages/AboutPage";
