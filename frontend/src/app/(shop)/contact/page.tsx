import type { Metadata } from "next";
import { toMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = toMetadata({
  title: "Contact Us",
  description:
    "Contact the RizMart bags store in Pakistan — questions about orders, custom bags and our lifetime quality promise.",
  path: "/contact",
});

export { default } from "@/features/shop/pages/ContactPage";
