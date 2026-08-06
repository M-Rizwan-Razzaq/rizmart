import type { Metadata } from "next";
import { toMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = toMetadata({ path: "/" });

export { default } from "@/features/shop/pages/HomePage";