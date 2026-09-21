import type { Metadata, Viewport } from "next";
import "@/styles.css";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import Providers from "./providers";

export const viewport: Viewport = {
  themeColor: "#1e130d",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "RizMart — #1 Bags Store in Pakistan | Buy Laptop Bags, Backpacks & Travel Bags Online",
    template: "%s | RizMart Pakistan",
  },
  description:
    "Shop premium bags online in Pakistan at RizMart. Largest collection of laptop bags, backpacks, school bags, travel bags, handbags, tote bags & crossbody bags. Cash on delivery, free shipping, 7-day returns. Serving Karachi, Lahore, Islamabad & all of Pakistan.",
  keywords: [
    "bags store pakistan",
    "buy bags online pakistan",
    "laptop bags pakistan",
    "backpacks online pakistan",
    "travel bags pakistan",
    "school bags pakistan",
    "handbags online pakistan",
    "tote bags pakistan",
    "crossbody bags pakistan",
    "shoulder bags pakistan",
    "women bags pakistan",
    "men bags pakistan",
    "bags karachi",
    "bags lahore",
    "bags islamabad",
    "premium bags pakistan",
    "leather bags pakistan",
    "rizmart",
    "rizmart bags",
    "online bags shopping pakistan",
    "cheap bags pakistan",
    "branded bags pakistan",
    "bags cash on delivery pakistan",
  ],
  icons: "/rizmart-icon.svg",
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    title: "RizMart — #1 Bags Store in Pakistan | Buy Laptop Bags, Backpacks & Travel Bags Online",
    description:
      "Shop premium bags online in Pakistan at RizMart. Laptop bags, backpacks, school bags, travel bags, handbags, tote bags & crossbody bags. Cash on delivery & free shipping.",
    url: `${SITE_URL}/`,
    locale: "en_US",
    images: [
      { url: "/og-image.svg", width: 1200, height: 630, alt: "RizMart Bags Store Pakistan" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RizMart — #1 Bags Store in Pakistan | Buy Laptop Bags, Backpacks & Travel Bags Online",
    description:
      "Shop premium bags online in Pakistan at RizMart. Laptop bags, backpacks, school bags, travel bags, handbags & crossbody bags. Cash on delivery & free shipping.",
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
    availableLanguage: ["English", "Urdu"],
  },
  sameAs: [
    "https://www.instagram.com/rizmart.store/",
    "https://www.facebook.com/p/RizMart-61593524831297/",
  ],
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "RizMart",
  description:
    "Premium bags store in Pakistan selling laptop bags, backpacks, school bags, travel bags, handbags, tote bags and crossbody bags online with free shipping across Pakistan.",
  url: SITE_URL,
  logo: `${SITE_URL}/rizmart-icon.svg`,
  image: `${SITE_URL}/og-image.svg`,
  telephone: "+92-318-6592403",
  email: "rizmart.pk@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Karachi",
    addressCountry: "PK",
  },
  areaServed: {
    "@type": "Country",
    name: "Pakistan",
  },
  priceRange: "PKR",
  currenciesAccepted: "PKR",
  paymentAccepted: "Cash on Delivery, Credit Card, Debit Card",
  hasMap: "https://www.google.com/maps/search/Karachi+Pakistan",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
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
