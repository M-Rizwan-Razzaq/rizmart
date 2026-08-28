import { BRAND } from "@/lib/constants";

export const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL as string | undefined)?.replace(/\/$/, "") ||
  "https://www.rizmart.store";

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
  const title = input.title
    ? `${input.title} | ${SITE_NAME}`
    : `${SITE_NAME} — Bags Store in Pakistan | Shop Laptop Bags, Backpacks & Travel Bags Online`;
  const description =
    input.description ??
    "RizMart is a Pakistani bags store selling laptop bags, backpacks, school bags, travel bags, handbags and crossbody bags online. Complimentary insured shipping across Pakistan and a lifetime quality promise.";
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
