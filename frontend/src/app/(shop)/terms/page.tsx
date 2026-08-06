import type { Metadata } from "next";
import { toMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = toMetadata({
  title: "Terms & Conditions",
  description:
    "Desi Muse terms of service — the agreement that governs your use of our store and purchases.",
  path: "/terms",
});

export { default } from "@/features/shop/pages/TermsPage";