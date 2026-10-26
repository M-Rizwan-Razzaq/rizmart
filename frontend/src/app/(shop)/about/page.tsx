import type { Metadata } from "next";
import { toMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = toMetadata({
  title: "About RizMart — Bags for School, Work & Travel",
  description:
    "Meet RizMart, an online bags store based in Lahore, Pakistan. Explore backpacks, school bags, laptop bags and travel bags for everyday use.",
  path: "/about",
});

export { default } from "@/features/shop/pages/AboutPage";
