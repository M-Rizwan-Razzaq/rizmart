import type { Metadata } from "next";
import { toMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = toMetadata({
  title: "Our Story",
  description:
    "Discover the RizMart studio — a Pakistani bags brand where every laptop bag, backpack and travel bag is designed in-house to support your daily carry.",
  path: "/about",
});

export { default } from "@/features/shop/pages/AboutPage";
