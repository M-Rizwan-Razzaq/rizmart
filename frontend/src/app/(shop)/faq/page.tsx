import type { Metadata } from "next";
import { toMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = toMetadata({
  title: "FAQ",
  description:
    "Frequently asked questions about buying jewellery online in Pakistan from Desi Muse — orders, insured shipping, returns and our lifetime craftsmanship warranty.",
  path: "/faq",
});

export { default } from "@/features/shop/pages/FaqPage";