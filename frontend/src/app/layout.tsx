import type { Metadata, Viewport } from "next";
import "@/styles.css";
import Providers from "./providers";

export const viewport: Viewport = {
  themeColor: "#0c0a09",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.desimuse.store"),
  title: "Desi Muse — Jewellery Store in Pakistan | Buy Gold & Silver Jewellery Online",
  description:
    "Desi Muse is a Pakistani jewellery store selling fine gold, silver and rose-gold rings, necklaces, bracelets and watches online. Complimentary insured shipping across Pakistan and a lifetime craftsmanship warranty.",
  icons: "/DesiMuseIcon.png",
  alternates: {
    canonical: "https://www.desimuse.store/",
  },
  openGraph: {
    siteName: "Desi Muse",
    type: "website",
    title: "Desi Muse — Jewellery Store in Pakistan | Buy Gold & Silver Jewellery Online",
    description:
      "Desi Muse is a Pakistani jewellery store selling fine gold, silver and rose-gold rings, necklaces, bracelets and watches online. Complimentary insured shipping across Pakistan and a lifetime craftsmanship warranty.",
    url: "https://www.desimuse.store/",
    locale: "en_US",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Desi Muse — Jewellery Store in Pakistan | Buy Gold & Silver Jewellery Online",
    description:
      "Desi Muse is a Pakistani jewellery store selling fine gold, silver and rose-gold rings, necklaces, bracelets and watches online. Complimentary insured shipping across Pakistan and a lifetime craftsmanship warranty.",
    images: ["/og-image.png"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Desi Muse",
  alternateName: "DesiMuse",
  url: "https://www.desimuse.store",
  logo: "https://www.desimuse.store/og-image.png",
  sameAs: [
    "https://www.instagram.com/desimuse.pk/",
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
