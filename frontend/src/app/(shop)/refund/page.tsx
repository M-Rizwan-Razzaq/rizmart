import type { Metadata } from "next";
import { toMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = toMetadata({
  title: "Refund Policy",
  description: "Desi Muse refund and return policy — unworn pieces may be returned within 30 days.",
  path: "/refund",
});

export { default } from "@/features/shop/pages/RefundPage";