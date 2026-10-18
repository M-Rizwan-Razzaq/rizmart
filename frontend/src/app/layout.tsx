import type { Metadata, Viewport } from "next";
import "@/styles.css";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import Providers from "./providers";

export const viewport: Viewport = {
  themeColor: "#193B63",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Shop Bags Online in Pakistan | RizMart",
    template: "%s",
  },
  description:
    "Shop backpacks, school bags, laptop bags and travel bags online at RizMart. Browse product details, check current availability and place a cash on delivery order in Pakistan.",
  keywords: [
    "bags store pakistan",
    "buy bags online pakistan",
    "laptop bags pakistan",
    "backpacks online pakistan",
    "travel bags pakistan",
    "school bags pakistan",
    "laptop backpacks pakistan",
    "kids school backpacks pakistan",
    "rizmart",
    "rizmart bags",
    "online bags shopping pakistan",
    "bags cash on delivery pakistan",
  ],
  icons: "/rizmart-icon.svg",
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    title: "Shop Bags Online in Pakistan | RizMart",
    description:
      "Browse school bags, backpacks, laptop bags and travel bags at RizMart. Check product details and availability, then place your order with cash on delivery.",
    url: `${SITE_URL}/`,
    locale: "en_US",
    images: [
      { url: "/og-image.svg", width: 1200, height: 630, alt: "RizMart Bags Store Pakistan" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Bags Online in Pakistan | RizMart",
    description:
      "Browse school bags, backpacks, laptop bags and travel bags at RizMart. Check product details and availability, then place your order with cash on delivery.",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "RizMart",
  alternateName: "RizMart Bags Store",
  url: SITE_URL,
  logo: `${SITE_URL}/rizmart-icon.svg`,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+92-318-6592403",
    contactType: "customer service",
    areaServed: "PK",
  },
  sameAs: [
    "https://www.instagram.com/rizmart.store/",
    "https://www.facebook.com/p/RizMart-61593524831297/",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "RizMart",
  alternateName: "RizMart Bags Pakistan",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/shop?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
