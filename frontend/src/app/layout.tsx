import type { Metadata, Viewport } from "next";
import "@/styles.css";
import Providers from "./providers";

export const viewport: Viewport = {
  themeColor: "#0c0a09",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rizmart.store"),
  title: "RizMart — Bags Store in Pakistan | Shop Laptop Bags, Backpacks & Travel Bags Online",
  description:
    "RizMart is a Pakistani bags store selling laptop bags, backpacks, school bags, travel bags, handbags and crossbody bags online. Complimentary insured shipping across Pakistan and a lifetime quality promise.",
  icons: "/rizmart-icon.svg",
  alternates: {
    canonical: "https://www.rizmart.store/",
  },
  openGraph: {
    siteName: "RizMart",
    type: "website",
    title: "RizMart — Bags Store in Pakistan | Shop Laptop Bags, Backpacks & Travel Bags Online",
    description:
      "RizMart is a Pakistani bags store selling laptop bags, backpacks, school bags, travel bags, handbags and crossbody bags online. Complimentary insured shipping across Pakistan and a lifetime quality promise.",
    url: "https://www.rizmart.store/",
    locale: "en_US",
    images: ["/og-image.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "RizMart — Bags Store in Pakistan | Shop Laptop Bags, Backpacks & Travel Bags Online",
    description:
      "RizMart is a Pakistani bags store selling laptop bags, backpacks, school bags, travel bags, handbags and crossbody bags online. Complimentary insured shipping across Pakistan and a lifetime quality promise.",
    images: ["/og-image.svg"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "RizMart",
  alternateName: "RizMart",
  url: "https://www.rizmart.store",
  logo: "https://www.rizmart.store/rizmart-icon.svg",
  sameAs: [
    "https://www.instagram.com/rizmart.pk/",
    "https://www.facebook.com/profile.php?id=61591588391481",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
