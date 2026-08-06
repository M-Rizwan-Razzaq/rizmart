import type { Metadata } from "next";
import { toMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = toMetadata({
  title: "Privacy Policy",
  description: "How Desi Muse collects, uses and protects your personal information.",
  path: "/privacy",
});

export { default } from "@/features/shop/pages/PrivacyPage";