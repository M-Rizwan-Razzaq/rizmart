import type { Metadata } from "next";
import { toMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = toMetadata({
  title: "Contact Us",
  description:
    "Contact the Desi Muse jewellery store in Pakistan — questions about orders, custom gold and silver commissions and our lifetime craftsmanship warranty.",
  path: "/contact",
});

export { default } from "@/features/shop/pages/ContactPage";