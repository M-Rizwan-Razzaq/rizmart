import { BRAND } from "@/lib/constants";

export const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL as string | undefined)?.replace(/\/$/, "") ||
  "https://www.desimuse.store";

export const SITE_NAME = BRAND;

export const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

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
    : `${SITE_NAME} — Jewellery Store in Pakistan | Buy Gold & Silver Jewellery Online`;
  const description =
    input.description ??
    "Desi Muse is a Pakistani jewellery store selling fine gold, silver and rose-gold rings, necklaces, bracelets and watches online. Complimentary insured shipping across Pakistan and a lifetime craftsmanship warranty.";
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
