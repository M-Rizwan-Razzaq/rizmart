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
  const title = input.title
    ? `${input.title} | ${SITE_NAME} Pakistan`
    : "Shop Bags Online in Pakistan | RizMart Pakistan";
  const description =
    input.description ??
    "Shop backpacks, school bags, laptop bags and travel bags online at RizMart. Browse product details, check current availability and place a cash on delivery order.";
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
