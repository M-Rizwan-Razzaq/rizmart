"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Link } from "@/lib/router";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, Package, RotateCcw } from "lucide-react";
import { toast } from "sonner";
const heroImg1 = "/herosection1.jpg";
import { ProductCard } from "@/features/shop/components/ProductCard";
import { SectionHeading } from "@/features/shop/components/SectionHeading";
import PageSpinner from "@/components/PageSpinner";
import {
  useGetFeaturedProductsQuery,
  useGetTrendingProductsQuery,
  useGetBestSellersQuery,
  useGetNewArrivalsQuery,
} from "@/store/services/productsApi";
import { useGetCategoriesQuery } from "@/store/services/categoriesApi";
import { useGetBrandSettingsQuery } from "@/store/services/brandApi";
import { useSubscribeNewsletterMutation } from "@/store/services/newsletterApi";
import { DEFAULT_BRAND_FORM } from "@/lib/brand";
import { getImageUrl } from "@/lib/constants";
import type { ApiProduct } from "@/store/services/productsApi";

export default function HomePage({ initialFeatured }: { initialFeatured?: ApiProduct[] }) {
  const { data: fetchedFeatured, isLoading: featuredLoading } = useGetFeaturedProductsQuery();
  const featured = fetchedFeatured ?? initialFeatured ?? [];
  const fl = featuredLoading && initialFeatured === undefined;
  const { data: trending = [], isLoading: tl } = useGetTrendingProductsQuery();
  const { data: bestSellers = [] } = useGetBestSellersQuery();
  const { data: newArrivals = [] } = useGetNewArrivalsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: brand, isLoading: brandLoading } = useGetBrandSettingsQuery();
  const [subscribeNewsletter, { isLoading: subscribing }] = useSubscribeNewsletterMutation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "info" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [heroFailed, setHeroFailed] = useState(false);

  const dynamicHero = getImageUrl(brand?.homeMainImage?.trim() || "");

  useEffect(() => {
    setHeroLoaded(false);
  }, [dynamicHero]);

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();

    const normalized = email.trim().toLowerCase();
    if (!normalized) {
      setStatus({ type: "error", message: "Please enter your email address." });
      return;
    }

    try {
      const result = await subscribeNewsletter({ email: normalized }).unwrap();
      setStatus(
        result.alreadySubscribed
          ? { type: "info", message: "You are already subscribed." }
          : { type: "success", message: "Thanks for subscribing." },
      );
      toast.success(result.alreadySubscribed ? "Already subscribed" : "Subscribed successfully");
      setEmail("");
    } catch {
      setStatus({ type: "error", message: "Subscription failed. Please try again." });
      toast.error("Subscription failed. Please try again.");
    }
  };

  const homeMainImage =
    getImageUrl(brand?.homeMainImage?.trim() || DEFAULT_BRAND_FORM.homeMainImage) || heroImg1;

  const getCategoryImage = (name: string) => {
    const normalized = name.trim().toLowerCase();
    const imagePath = normalized.includes("laptop")
      ? brand?.homeCategoryImageRings
      : normalized.includes("backpack") || normalized.includes("school")
        ? brand?.homeCategoryImageNecklaces
        : normalized.includes("travel")
          ? brand?.homeCategoryImageBraceletes
          : normalized.includes("hand") ||
              normalized.includes("shoulder") ||
              normalized.includes("crossbody")
            ? brand?.homeCategoryImageEarrings
            : "";

    return getImageUrl(imagePath?.trim() || "") || homeMainImage;
  };

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[420px] sm:min-h-[580px] md:min-h-[640px] lg:min-h-[700px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-onyx" />
        {!brandLoading && (
          <img
            src={heroFailed ? heroImg1 : dynamicHero || heroImg1}
            alt="RizMart bags hero image"
            width={1600}
            height={1200}
            onLoad={() => setHeroLoaded(true)}
            onError={() => {
              if (dynamicHero) setHeroFailed(true);
            }}
            className="absolute inset-0 h-full w-full object-cover rounded-[20px] transition-opacity duration-500"
            style={{ opacity: heroLoaded ? 1 : 0 }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-start px-4 sm:px-6 pt-10 sm:pt-14 md:pt-16 pb-12 sm:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-2xl"
          >
            <div className="text-[11px] tracking-[0.3em] uppercase text-gold mb-4">
              Collection · {new Date().getFullYear()}
            </div>
            <h1 className="font-display text-4xl sm:text-6xl md:text-8xl leading-[0.95] mb-4 sm:mb-6">
              Carry More.
              <br />
              Move Better.
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-lg mb-6 sm:mb-8">
              RizMart is Pakistan's destination for premium bags - laptop bags, backpacks, school
              bags, travel bags and crossbody styles designed for work, study and everyday life.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-3 bg-gold-gradient text-onyx px-6 sm:px-8 py-3 sm:py-4 text-xs tracking-[0.25em] uppercase font-medium rounded-[20px]"
              >
                Shop Bags <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-3 border border-border hover:border-gold px-6 sm:px-8 py-3 sm:py-4 text-xs tracking-[0.25em] uppercase transition rounded-[20px]"
              >
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED — put products near the top so social visitors can shop quickly */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-24">
        <SectionHeading eyebrow="Signature" title="Featured Bags" />
        {fl ? (
          <PageSpinner />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
        <div className="mt-8 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 border border-gold px-6 py-3 text-xs tracking-[0.2em] uppercase text-gold"
          >
            Shop all bags <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* USP STRIP */}
      <section className="border-y border-border/60 bg-onyx/40">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 divide-x divide-border/60">
          {[
            { icon: Truck, label: "Insured Shipping" },
            { icon: ShieldCheck, label: "Built to Last" },
            { icon: Package, label: "Smart Compartments" },
            { icon: RotateCcw, label: "30-Day Returns" },
          ].map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-2 sm:gap-3 justify-center py-5 sm:py-6 px-3 sm:px-4 text-center"
            >
              <f.icon className="h-4 w-4 sm:h-5 sm:w-5 text-gold shrink-0" />
              <span className="text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase text-muted-foreground">
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
          <SectionHeading
            eyebrow="The Collection"
            title="Shop by Category"
            description="Curated bags for work, study, travel and everyday carry."
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {categories.slice(0, 4).map((c) => {
              const imgUrl = getCategoryImage(c.name);
              return (
                <Link
                  key={c._id}
                  to={`/shop?category=${c._id}`}
                  className="group relative aspect-[3/4] overflow-hidden rounded-[20px] border border-border/60"
                >
                  <img
                    src={imgUrl}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-[1200ms] rounded-[20px]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = homeMainImage;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <div className="font-display text-xl sm:text-2xl">{c.name}</div>
                    <div className="text-xs text-gold tracking-[0.2em] uppercase mt-1">
                      Explore →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* EDITORIAL */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <div className="text-[11px] tracking-[0.3em] uppercase text-gold mb-4">Craftsmanship</div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl leading-tight mb-6 sm:mb-8">
            "Every bag begins with a carry need and ends up in daily rotation."
          </h2>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-gold hover:text-gold-soft transition text-sm tracking-[0.2em] uppercase"
          >
            Discover our collection <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* TRENDING */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <SectionHeading eyebrow="Loved by You" title="Trending Now" />
        {tl ? (
          <PageSpinner />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {trending.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* BEST SELLERS + NEW ARRIVALS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 grid gap-12">
        <div>
          <SectionHeading eyebrow="Icons" title="Best Sellers" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.slice(0, 4).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
        <div>
          <SectionHeading eyebrow="Fresh" title="New Arrivals" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.slice(0, 4).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-24 text-center">
        <SectionHeading
          eyebrow="Membership"
          title="Join the Circle"
          description="First access to new arrivals, restocks and private offers. No noise, ever."
        />
        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-input border border-border rounded px-4 py-3 focus:outline-none focus:border-gold text-sm"
            placeholder="Your email address"
          />
          <button
            type="submit"
            disabled={subscribing}
            className="bg-gold-gradient text-onyx px-8 py-3 text-xs tracking-[0.25em] uppercase font-medium disabled:opacity-50"
          >
            {subscribing ? "Joining…" : "Subscribe"}
          </button>
        </form>
        {status.type && (
          <p
            className={`mt-3 text-xs ${status.type === "success" ? "text-gold" : status.type === "info" ? "text-muted-foreground" : "text-destructive"}`}
          >
            {status.message}
          </p>
        )}
      </section>
    </>
  );
}
