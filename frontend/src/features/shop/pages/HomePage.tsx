"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Link } from "@/lib/router";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, Package, RotateCcw, CheckCircle2 } from "lucide-react";
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
    setHeroFailed(false);
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
          : { type: "success", message: "Thank you for subscribing to RizMart." },
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

  const getCategoryFallbackImage = (name: string) => {
    const normalized = name.trim().toLowerCase();
    if (normalized.includes("laptop")) return "/category-laptop-bags.jpg";
    if (
      normalized.includes("hand") ||
      normalized.includes("purse") ||
      normalized.includes("shoulder") ||
      normalized.includes("crossbody")
    ) {
      return "/category-hand-bags.jpg";
    }
    if (
      normalized.includes("travel") ||
      normalized.includes("duffel") ||
      normalized.includes("weekender") ||
      normalized.includes("suitcase")
    ) {
      return "/category-travel-bags.jpg";
    }
    return "/category-backpacks.jpg";
  };

  const getCategoryImage = (name: string, categoryImage?: string) => {
    const normalized = name.trim().toLowerCase();
    const imagePath = normalized.includes("laptop")
      ? brand?.homeCategoryImageRings
      : normalized.includes("backpack") ||
          normalized.includes("school") ||
          normalized.includes("kid")
        ? brand?.homeCategoryImageNecklaces
        : normalized.includes("travel") ||
            normalized.includes("duffel") ||
            normalized.includes("weekender")
          ? brand?.homeCategoryImageBraceletes
          : normalized.includes("hand") ||
              normalized.includes("purse") ||
              normalized.includes("shoulder") ||
              normalized.includes("crossbody")
            ? brand?.homeCategoryImageEarrings
            : "";

    return (
      getImageUrl(categoryImage?.trim() || "") ||
      getImageUrl(imagePath?.trim() || "") ||
      getCategoryFallbackImage(name)
    );
  };

  return (
    <div className="bg-white">
      {/* HERO SECTION — Clean, bright, trust-building */}
      <section className="relative bg-[#FAF9F6] border-b border-[#E6E8EC] overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Hero Copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E6E8EC] text-[#193B63] text-xs font-bold tracking-wider uppercase shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#E3A34D]" />
                Pakistan's Bag & Backpack Store
              </div>

              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#193B63] leading-[1.08] tracking-tight">
                Carry Your World <br className="hidden sm:inline" />
                in Comfort & Style.
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-[#627184] leading-relaxed max-w-xl">
                Browse school backpacks, laptop bags, and travel bags for everyday carry. Check each
                product page for its available details and current stock.
              </p>

              {/* Trust bullets */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs text-[#263445] font-semibold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#E3A34D] shrink-0" />
                  <span>Product details listed where available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#E3A34D] shrink-0" />
                  <span>Cash on Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#E3A34D] shrink-0" />
                  <Link to="/refund" className="hover:text-[#193B63] underline underline-offset-2">
                    Review our return policy
                  </Link>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3.5 pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2 bg-[#193B63] hover:bg-[#132D4C] active:bg-[#0E223B] text-white px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FAF9F6] text-[#193B63] border border-[#E6E8EC] hover:border-[#193B63]/40 px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg shadow-xs transition-all"
                >
                  Our Story
                </Link>
              </div>
            </motion.div>

            {/* Hero Image Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative aspect-[4/3] sm:aspect-[5/4] rounded-2xl overflow-hidden border border-[#E6E8EC] bg-white shadow-xl">
                {!brandLoading && (
                  <img
                    src={heroFailed ? heroImg1 : dynamicHero || heroImg1}
                    alt="RizMart bags and backpacks collection"
                    width={1200}
                    height={960}
                    onLoad={() => setHeroLoaded(true)}
                    onError={() => {
                      if (dynamicHero) setHeroFailed(true);
                    }}
                    className="w-full h-full object-cover transition-opacity duration-500"
                    style={{ opacity: heroLoaded ? 1 : 0 }}
                  />
                )}
                {/* Visual badge on hero image */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md border border-[#E6E8EC] rounded-xl p-3 shadow-md">
                  <div className="text-xs font-bold text-[#193B63]">School & Laptop Bags</div>
                  <div className="text-[11px] text-[#627184]">Cash on delivery available</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION STRIP */}
      <section className="bg-white border-b border-[#E6E8EC]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#E6E8EC]">
            {[
              { icon: Truck, title: "Shipping", subtitle: "Free over PKR 500" },
              {
                icon: ShieldCheck,
                title: "Cash on Delivery",
                subtitle: "Pay the courier on arrival",
              },
              {
                icon: Package,
                title: "Product Details",
                subtitle: "See available specs on each item",
              },
              { icon: RotateCcw, title: "Returns", subtitle: "Check policy and eligibility" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3.5 py-5 sm:py-6 px-3 sm:px-4">
                <div className="h-10 w-10 rounded-lg bg-[#FAF9F6] border border-[#E6E8EC] flex items-center justify-center shrink-0 text-[#193B63]">
                  <f.icon className="h-5 w-5 text-[#193B63]" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-[#193B63] uppercase tracking-wide">
                    {f.title}
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#627184]">{f.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED BAGS — Top priority so visitors can immediately see and buy bags */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <SectionHeading
          eyebrow="Popular Picks"
          title="Featured Bags & Backpacks"
          description="Handpicked customer favorites — from vibrant school bags to sleek laptop carry-alls."
        />
        {fl ? (
          <PageSpinner minH="30vh" />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-white text-[#193B63] border border-[#193B63] hover:bg-[#FAF9F6] px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-xs"
          >
            <span>View All Bags ({featured.length}+ Items)</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* CATEGORIES SECTION — Clear visual entry points */}
      {categories.length > 0 && (
        <section className="bg-[#FAF9F6] border-y border-[#E6E8EC] py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Find Your Style"
              title="Shop by Bag Category"
              description="Designed specifically for school, university, office commutes, and weekend travel."
            />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {categories.slice(0, 4).map((c) => {
                const fallbackImgUrl = getCategoryFallbackImage(c.name);
                const imgUrl = getCategoryImage(c.name, c.image);
                return (
                  <Link
                    key={c._id}
                    to={`/shop?category=${c._id}`}
                    className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-[#E6E8EC] bg-white shadow-xs hover:shadow-lg transition-all"
                  >
                    <img
                      src={imgUrl}
                      alt={c.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        const image = e.currentTarget;
                        if (!image.src.endsWith(fallbackImgUrl)) image.src = fallbackImgUrl;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#102B4B]/95 via-[#193B63]/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-white">
                      <div
                        className="font-display max-w-full break-words text-lg leading-tight font-bold drop-shadow-sm sm:text-xl"
                        style={{ color: "#FFFFFF" }}
                      >
                        {c.name}
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#F3C582] drop-shadow-sm transition-transform group-hover:translate-x-1">
                        <span>Explore Collection</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* TRENDING NOW */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <SectionHeading
          eyebrow="Trending in Pakistan"
          title="Trending Backpacks"
          description="Most visited and purchased items across all cities this week."
        />
        {tl ? (
          <PageSpinner minH="30vh" />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {trending.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* BEST SELLERS & NEW ARRIVALS SPLIT */}
      <section className="bg-[#FAF9F6] border-t border-[#E6E8EC] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-12 sm:space-y-16">
          {bestSellers.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-xs font-bold text-[#E3A34D] uppercase tracking-wider">
                    Top Rated
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#193B63]">
                    Best Sellers
                  </h3>
                </div>
                <Link
                  to="/shop"
                  className="text-xs font-bold uppercase tracking-wider text-[#193B63] hover:text-[#E3A34D] flex items-center gap-1"
                >
                  See all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6">
                {bestSellers.slice(0, 4).map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </div>
          )}

          {newArrivals.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-xs font-bold text-[#E3A34D] uppercase tracking-wider">
                    Just Landed
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#193B63]">
                    New Arrivals
                  </h3>
                </div>
                <Link
                  to="/shop"
                  className="text-xs font-bold uppercase tracking-wider text-[#193B63] hover:text-[#E3A34D] flex items-center gap-1"
                >
                  See all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6">
                {newArrivals.slice(0, 4).map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* NEWSLETTER SECTION — Clean & non-intrusive */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16 text-center">
        <div className="bg-[#FAF9F6] border border-[#E6E8EC] rounded-2xl p-6 sm:p-10">
          <SectionHeading
            eyebrow="RizMart VIP Club"
            title="Get RizMart Updates"
            description="Subscribe for updates about products, new arrivals and store offers."
          />
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto"
          >
            <label htmlFor="home-newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="home-newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white border border-[#E6E8EC] rounded-lg px-4 py-3 focus:outline-none focus:border-[#193B63] text-sm text-[#263445] shadow-xs"
              placeholder="Enter your email address"
            />
            <button
              type="submit"
              disabled={subscribing}
              className="bg-[#193B63] hover:bg-[#132D4C] text-white px-6 py-3 text-xs tracking-wider uppercase font-bold rounded-lg disabled:opacity-50 transition-colors shadow-sm"
            >
              {subscribing ? "Subscribing…" : "Get Discount"}
            </button>
          </form>
          {status.type && (
            <p
              className={`mt-3 text-xs ${
                status.type === "success"
                  ? "text-[#193B63] font-semibold"
                  : status.type === "info"
                    ? "text-[#627184]"
                    : "text-red-500 font-semibold"
              }`}
            >
              {status.message}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
