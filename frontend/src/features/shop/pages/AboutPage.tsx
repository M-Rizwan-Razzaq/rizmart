"use client";

import { ArrowRight, MapPin, PackageCheck, Truck } from "lucide-react";
import { Link } from "@/lib/router";
import { DEFAULT_BRAND_FORM, getBrandAddress } from "@/lib/brand";
import { DEFAULT_SITE_CONTENT } from "@/lib/siteContent";
import { useGetBrandSettingsQuery } from "@/store/services/brandApi";
import { useGetContentQuery } from "@/store/services/siteContentApi";

const aboutImageFallback = "/about-backpack-premium.jpg";

const highlights = [
  {
    icon: PackageCheck,
    title: "A bag for your day",
    description: "Browse school, laptop, backpack and travel styles in one place.",
  },
  {
    icon: Truck,
    title: "Delivery made simple",
    description: "Free shipping is available on orders over PKR 500.",
  },
  {
    icon: MapPin,
    title: "Rooted in Pakistan",
    description: "RizMart is based in Wapda Town, Lahore and serves shoppers online.",
  },
];

export default function AboutPage() {
  const { data: brand } = useGetBrandSettingsQuery();
  const { data: content } = useGetContentQuery("about");
  const appName = brand?.appName?.trim() || DEFAULT_BRAND_FORM.appName;
  const atelier = getBrandAddress(brand?.atelier);
  const aboutImage = aboutImageFallback;
  const page = content ?? DEFAULT_SITE_CONTENT.about;
  const renderedHtml = page.contentHtml.replace(/Desi Muse/g, appName);

  return (
    <main className="bg-card text-foreground">
      <section className="overflow-hidden border-b border-border bg-secondary">
        <div className="mx-auto grid max-w-7xl items-center gap-9 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-2 lg:gap-16 lg:py-20">
          <div className="max-w-xl">
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-gold-dark">
              <span className="h-px w-7 bg-gold" /> The {appName} story
            </p>
            <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-primary sm:text-5xl lg:text-6xl">
              {page.title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              From school mornings and campus days to office commutes and weekend trips, RizMart
              brings school bags, backpacks, laptop bags and travel bags together in one place.
              Explore the details on each product and find a bag that fits your everyday plans.
            </p>
            <Link
              to="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
            >
              Explore the collection <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {atelier}
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div className="absolute -right-3 -top-3 h-full w-full rounded-2xl border border-gold/50 sm:-right-4 sm:-top-4" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-card shadow-xl ring-1 ring-primary/10">
              <img
                src={aboutImage}
                alt={`${appName} bags and backpacks`}
                className="h-full w-full object-cover object-[center_42%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/55 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-primary-foreground sm:bottom-7 sm:left-7 sm:right-7">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-soft">
                    Carry it your way
                  </p>
                  <p className="mt-1 max-w-[24rem] font-display text-lg font-bold leading-snug text-primary-foreground sm:text-2xl">
                    Made for everyday journeys.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16 lg:py-20">
        <article className="max-w-3xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-gold-dark">
            What we’re about
          </p>
          <div
            className="space-y-5 text-[15px] leading-7 text-muted-foreground sm:text-base
              [&_h2]:mb-3 [&_h2]:mt-9 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-primary
              [&_h3]:mb-2 [&_h3]:mt-7 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-primary
              [&_p]:mb-5 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6
              [&_a]:font-semibold [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-gold-dark"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        </article>

        <aside className="h-fit rounded-2xl border border-border bg-secondary p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-dark">
            The essentials
          </p>
          <div className="mt-4 divide-y divide-border">
            {highlights.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gold/35 bg-card text-gold-dark">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-primary">{title}</h2>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/contact"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary transition hover:text-gold-dark"
          >
            Get in touch <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </section>

      <section className="border-t border-border bg-primary">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:py-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-soft">
              Find your next everyday bag
            </p>
            <p className="mt-2 font-display text-2xl font-bold text-primary-foreground sm:text-3xl">
              See what fits your journey.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-3 text-sm font-bold text-primary transition hover:bg-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            Shop bags <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
