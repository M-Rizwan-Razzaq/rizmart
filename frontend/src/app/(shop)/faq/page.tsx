import type { Metadata } from "next";
import { toMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = toMetadata({
  title: "FAQ — Buying Bags Online in Pakistan",
  description:
    "Answers to common questions about RizMart orders, cash on delivery, shipping charges, product details and returns.",
  path: "/faq",
});

export { default } from "@/features/shop/pages/FaqPage";
