import type { Metadata } from "next";
import { toMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = toMetadata({
  title: "Our Story",
  description:
    "Discover the Desi Muse atelier — a Pakistani fine jewellery house where every ring, necklace and bracelet is designed in-house and finished by hand to last a lifetime.",
  path: "/about",
});

export { default } from "@/features/shop/pages/AboutPage";