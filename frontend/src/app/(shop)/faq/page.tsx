import type { Metadata } from "next";
import { toMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = toMetadata({
  title: "FAQ",
  description:
    "Frequently asked questions about buying bags online in Pakistan from RizMart — orders, insured shipping, returns and our lifetime quality promise.",
  path: "/faq",
});

export { default } from "@/features/shop/pages/FaqPage";
