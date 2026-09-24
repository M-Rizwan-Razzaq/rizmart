import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

const BASE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL as string | undefined)?.replace(/\/$/, "") ||
  "https://rizmart.store";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

type ProductLite = { slug: string; updatedAt?: string };
type CategoryLite = { _id: string; updatedAt?: string };
type Paginated<T> = { data: T[]; totalPages: number };

const STATIC: Array<{
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
}> = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/shop", priority: 0.9, changeFrequency: "weekly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.5, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/refund", priority: 0.3, changeFrequency: "yearly" },
];

async function fetchApi<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: T };
    return json?.data ?? null;
  } catch {
    return null;
  }
}

async function fetchAllProducts(): Promise<ProductLite[]> {
  const first = await fetchApi<Paginated<ProductLite>>("/products?page=1&limit=100");
  if (!first) return [];
  const all = [...first.data];
  for (let page = 2; page <= first.totalPages; page++) {
    const next = await fetchApi<Paginated<ProductLite>>(`/products?page=${page}&limit=100`);
    if (next) all.push(...next.data);
  }
  return all;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  try {
    const products = await fetchAllProducts();
    for (const product of products) {
      entries.push({
        url: `${BASE_URL}/product/${product.slug}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    const categories = await fetchApi<CategoryLite[]>("/categories");
    for (const category of categories ?? []) {
      entries.push({
        url: `${BASE_URL}/shop?category=${category._id}`,
        lastModified: category.updatedAt ? new Date(category.updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  } catch {
    // Fall back to static entries if the backend is unreachable.
  }

  return entries;
}
