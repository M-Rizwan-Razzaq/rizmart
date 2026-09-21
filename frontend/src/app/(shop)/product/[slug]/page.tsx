import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductPage from "@/features/shop/pages/ProductPage";
import { fetchApiData } from "@/lib/server-api";
import { buildSeo, SITE_URL } from "@/lib/seo";
import { getImageUrl } from "@/lib/constants";
import type { ApiProduct } from "@/store/services/productsApi";

type Props = { params: Promise<{ slug: string }> };

function getProduct(slug: string) {
  return fetchApiData<ApiProduct>(`/products/slug/${slug}`);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  const price = product.discountPrice ?? product.price;
  const seo = buildSeo({
    title: product.name,
    description:
      product.description ||
      `Buy ${product.name} online in Pakistan at RizMart — premium quality bag with cash on delivery, free shipping & 7-day returns. Trusted by customers across Karachi, Lahore & Islamabad.`,
    path: `/product/${product.slug}`,
    image: getImageUrl(product.images[0]),
    type: "product",
  });
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.url },
    robots: { index: true, follow: true },
    openGraph: {
      siteName: "RizMart",
      title: seo.title,
      description: seo.description,
      url: seo.url,
      images: [{ url: seo.image, width: 800, height: 800, alt: product.name }],
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

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return notFound();

  const price = product.discountPrice ?? product.price;
  const image = getImageUrl(product.images[0]);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: [image],
      description: product.description,
      sku: product.sku,
      brand: { "@type": "Brand", name: "RizMart" },
      offers: {
        "@type": "Offer",
        url: `${SITE_URL}/product/${product.slug}`,
        priceCurrency: "PKR",
        price: String(price),
        availability:
          product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      },
      ...(product.reviewCount > 0
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: String(Number(product.averageRating || 0).toFixed(1)),
              reviewCount: product.reviewCount,
              bestRating: "5",
              worstRating: "1",
            },
          }
        : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE_URL}/shop` },
        { "@type": "ListItem", position: 3, name: product.name },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductPage />
    </>
  );
}
