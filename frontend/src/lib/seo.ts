import { BRAND } from "@/lib/constants";

export const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL as string | undefined)?.replace(/\/$/, "") ||
  "https://rizmart.store";

export const SITE_NAME = BRAND;

export const DEFAULT_IMAGE = `${SITE_URL}/og-image.svg`;

export type SeoJsonLd = Record<string, unknown>;

type SeoInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: string;
  noindex?: boolean;
  jsonLd?: SeoJsonLd[];
};

export type { SeoInput };

export function buildSeo(input: SeoInput = {}) {
  const path = input.path ?? "/";
  const url = `${SITE_URL}${path}`;
  const suppliedTitle = input.title?.trim();
  const title = suppliedTitle
    ? /\brizmart\b/i.test(suppliedTitle)
      ? suppliedTitle
      : `${suppliedTitle} | ${SITE_NAME}`
    : "Shop Bags Online in Pakistan | RizMart";
  const description =
    input.description ??
    "Shop backpacks, school bags, laptop bags and travel bags online in Pakistan. Compare product details and availability, then order from RizMart with cash on delivery.";
  const image = input.image || DEFAULT_IMAGE;

  return {
    title,
    description,
    url,
    image,
    type: input.type ?? "website",
    noindex: input.noindex ?? false,
    jsonLd: input.jsonLd ?? [],
  };
}

export function toPlainSeoText(value: string): string {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncateSeoDescription(value: string, maxLength = 160): string {
  if (value.length <= maxLength) return value;
  const shortened = value.slice(0, maxLength - 1);
  const wordBoundary = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, wordBoundary > 0 ? wordBoundary : shortened.length).trimEnd()}…`;
}
