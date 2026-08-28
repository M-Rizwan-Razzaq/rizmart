import type { MetadataRoute } from "next";

const BASE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL as string | undefined)?.replace(/\/$/, "") ||
  "https://www.rizmart.store";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/account",
          "/cart",
          "/checkout",
          "/wishlist",
          "/order-success",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}