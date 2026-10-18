import type { Metadata } from "next";
import { toMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = toMetadata({
  title: "Refund Policy",
  description:
    "Read RizMart's refund and return policy, including eligibility and how to contact us about an order.",
  path: "/refund",
});

export { default } from "@/features/shop/pages/RefundPage";
