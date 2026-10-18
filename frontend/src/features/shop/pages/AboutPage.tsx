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
    <main className="bg-white text-[#263445]">
      <section className="overflow-hidden border-b border-[#E6E8EC] bg-[#FAF9F6]">
        <div className="mx-auto grid max-w-7xl items-center gap-9 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-2 lg:gap-16 lg:py-20">
          <div className="max-w-xl">
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#A66D15]">
              <span className="h-px w-7 bg-[#E3A34D]" /> The {appName} story
            </p>
            <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-[#193B63] sm:text-5xl lg:text-6xl">
              {page.title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#627184] sm:text-lg sm:leading-8">
              From school mornings and campus days to office commutes and weekend trips, RizMart
              brings school bags, backpacks, laptop bags and travel bags together in one place.
              Explore the details on each product and find a bag that fits your everyday plans.
            </p>
            <Link
              to="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#193B63] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#132D4C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3A34D] focus-visible:ring-offset-2"
            >
              Explore the collection <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-[#627184]">
              {atelier}
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div className="absolute -right-3 -top-3 h-full w-full rounded-2xl border border-[#E3A34D]/50 sm:-right-4 sm:-top-4" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-[#193B63]/10">
              <img
                src={aboutImage}
                alt={`${appName} bags and backpacks`}
                className="h-full w-full object-cover object-[center_42%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#132D4C]/55 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white sm:bottom-7 sm:left-7 sm:right-7">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F3C582]">
                    Carry it your way
                  </p>
                  <p className="mt-1 max-w-[24rem] font-display text-lg font-bold leading-snug text-white sm:text-2xl">
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
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#A66D15]">
            What we’re about
          </p>
          <div
            className="space-y-5 text-[15px] leading-7 text-[#627184] sm:text-base
              [&_h2]:mb-3 [&_h2]:mt-9 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-[#193B63]
              [&_h3]:mb-2 [&_h3]:mt-7 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#193B63]
              [&_p]:mb-5 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6
              [&_a]:font-semibold [&_a]:text-[#193B63] [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-[#A66D15]"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        </article>

        <aside className="h-fit rounded-2xl border border-[#E6E8EC] bg-[#FAF9F6] p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#A66D15]">
            The essentials
          </p>
          <div className="mt-4 divide-y divide-[#E6E8EC]">
            {highlights.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E3A34D]/35 bg-white text-[#A66D15]">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-[#193B63]">{title}</h2>
                  <p className="mt-1 text-xs leading-5 text-[#627184]">{description}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/contact"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#193B63] transition hover:text-[#A66D15]"
          >
            Get in touch <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </section>

      <section className="border-t border-[#E6E8EC] bg-[#193B63]">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:py-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F3C582]">
              Find your next everyday bag
            </p>
            <p className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
              See what fits your journey.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-lg bg-[#E3A34D] px-5 py-3 text-sm font-bold text-[#193B63] transition hover:bg-[#F3C582] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#193B63]"
          >
            Shop bags <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
