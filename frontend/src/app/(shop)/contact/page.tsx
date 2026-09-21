import type { Metadata } from "next";
import { toMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = toMetadata({
  title: "Contact RizMart — Pakistan's Online Bags Store",
  description:
    "Get in touch with RizMart Pakistan's bags store. Questions about laptop bags, backpacks, travel bags, orders, cash on delivery, or our 7-day return policy? We're here to help.",
  path: "/contact",
});

export { default } from "@/features/shop/pages/ContactPage";
