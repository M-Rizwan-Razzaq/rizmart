import type { Metadata } from "next";
import { buildSeo, type SeoInput } from "./seo";

/**
 * Converts the app's SeoInput (title/description/path/image/type/noindex/jsonLd)
 * into Next.js App Router route-level Metadata. Server-only (uses `next` types).
 */
export function toMetadata(input: SeoInput = {}): Metadata {
  const seo = buildSeo(input);

  const ogType =
    seo.type === "article" || seo.type === "profile" || seo.type === "book" ? seo.type : "website";

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.url },
    robots: seo.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      siteName: SITE_NAME,
      type: ogType,
      title: seo.title,
      description: seo.description,
      url: seo.url,
      images: [{ url: seo.image }],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [seo.image],
    },
  };
}

const SITE_NAME = "RizMart";

// Route-level metadata for pages that must remain `"use client"` (client-only
// libs/state), so they can't export `metadata` themselves. Each route's server
// `layout.tsx` re-exports the relevant object, keeping the markup inline-free.
export const accountMetadata: Metadata = toMetadata({
  title: "My Account",
  path: "/account",
  noindex: true,
});

export const loginMetadata: Metadata = toMetadata({
  title: "Sign In",
  description:
    "Sign in to your RizMart account to track your bag orders, save favourites and manage your details. Pakistan's premium online bags store.",
  path: "/login",
});

export const registerMetadata: Metadata = toMetadata({
  title: "Create Account",
  description:
    "Join RizMart — Pakistan's premium bags store. Create an account for early access to new bag arrivals, exclusive offers and faster checkout with cash on delivery.",
  path: "/register",
});

export const forgotPasswordMetadata: Metadata = toMetadata({
  title: "Reset Password",
  path: "/forgot-password",
  noindex: true,
});

export const resetPasswordMetadata: Metadata = toMetadata({
  title: "Create New Password",
  path: "/reset-password",
  noindex: true,
});

export const cartMetadata: Metadata = toMetadata({
  title: "Shopping Bag",
  path: "/cart",
  noindex: true,
});

export const checkoutMetadata: Metadata = toMetadata({
  title: "Checkout",
  path: "/checkout",
  noindex: true,
});

export const wishlistMetadata: Metadata = toMetadata({
  title: "Wishlist",
  path: "/wishlist",
  noindex: true,
});

export const orderSuccessMetadata: Metadata = toMetadata({
  title: "Order Confirmed",
  path: "/order-success",
  noindex: true,
});

export const adminMetadata: Metadata = toMetadata({
  title: "Admin Console",
  path: "/admin",
  noindex: true,
});
