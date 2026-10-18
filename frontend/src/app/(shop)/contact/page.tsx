import type { Metadata } from "next";
import { toMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = toMetadata({
  title: "Contact RizMart — Pakistan's Online Bags Store",
  description:
    "Contact RizMart with questions about bags, product details, an existing order, shipping charges or the return policy.",
  path: "/contact",
});

export { default } from "@/features/shop/pages/ContactPage";
