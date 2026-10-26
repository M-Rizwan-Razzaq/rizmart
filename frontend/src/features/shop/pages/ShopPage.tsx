"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "@/lib/router";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { ProductCard } from "@/features/shop/components/ProductCard";
import PageSpinner from "@/components/PageSpinner";
import { formatPrice } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetProductsQuery } from "@/store/services/productsApi";
import { useGetCategoriesQuery } from "@/store/services/categoriesApi";
import type { ProductQuery } from "@/store/services/productsApi";

const GENDERS = ["all", "women", "men", "unisex"] as const;
const MATERIALS = [
  "all",
  "leather",
  "faux-leather",
  "canvas",
  "nylon",
  "polyester",
  "suede",
  "vegan-leather",
] as const;
const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Most Reviewed", value: "popular" },
  { label: "Top Rated", value: "rating" },
] as const;

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const [gender, setGender] = useState<string>(searchParams.get("gender") ?? "all");
  const [material, setMaterial] = useState<string>("all");
  const [category, setCategory] = useState<string>(searchParams.get("category") ?? "all");
  const [sortBy, setSortBy] = useState<ProductQuery["sortBy"]>("newest");
  const [max, setMax] = useState(50000);
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setGender(searchParams.get("gender") ?? "all");
    setCategory(searchParams.get("category") ?? "all");
    setSearch(searchParams.get("search") ?? "");
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => window.clearTimeout(timeout);
  }, [search]);

  const query: ProductQuery = {
    page,
    limit: 12,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(gender !== "all" && { gender }),
    ...(material !== "all" && { material }),
    ...(category !== "all" && { category }),
    maxPrice: max,
    sortBy,
  };

  const { currentData: data, isFetching, isError, refetch } = useGetProductsQuery(query);
  const { data: categories = [] } = useGetCategoriesQuery();

  const products = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const selectedCategory = categories.find((item) => item._id === category);
  const formatChipLabel = (value: string) =>
    value === "all"
      ? "All"
      : value
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ");

  const filterPanel = (
    <div className="space-y-6 bg-card p-5 rounded-xl border border-border">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2 text-xs tracking-wider uppercase font-bold text-primary">
          <SlidersHorizontal className="h-4 w-4 text-gold" /> Filter Collection
        </div>
        <button
          className="lg:hidden text-foreground p-1"
          onClick={() => setShowFilters(false)}
          aria-label="Close filters"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Search Input */}
      <div>
        <label
          htmlFor="shop-search"
          className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2"
        >
          Search by Keyword
        </label>
        <div className="relative">
          <input
            id="shop-search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search school, laptop, travel..."
            className="w-full bg-secondary border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
          />
          <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Categories */}
      <FilterGroup title="Bag Category">
        <Chip
          active={category === "all"}
          onClick={() => {
            setCategory("all");
            setPage(1);
          }}
        >
          All
        </Chip>
        {categories.map((c) => (
          <Chip
            key={c._id}
            active={category === c._id}
            onClick={() => {
              setCategory(c._id);
              setPage(1);
            }}
          >
            {c.name}
          </Chip>
        ))}
      </FilterGroup>

      {/* Audience */}
      <FilterGroup title="Audience">
        {GENDERS.map((g) => (
          <Chip
            key={g}
            active={gender === g}
            onClick={() => {
              setGender(g);
              setPage(1);
            }}
          >
            {formatChipLabel(g)}
          </Chip>
        ))}
      </FilterGroup>

      {/* Material */}
      <FilterGroup title="Material">
        {MATERIALS.map((m) => (
          <Chip
            key={m}
            active={material === m}
            onClick={() => {
              setMaterial(m);
              setPage(1);
            }}
          >
            {formatChipLabel(m)}
          </Chip>
        ))}
      </FilterGroup>

      {/* Price Slider */}
      <div className="pt-2 border-t border-border">
        <div className="flex items-center justify-between text-xs font-bold text-primary mb-2">
          <span className="uppercase tracking-wider">Max Price</span>
          <span>{formatPrice(max)}</span>
        </div>
        <input
          type="range"
          min={500}
          max={50000}
          step={100}
          value={max}
          onChange={(e) => {
            setMax(Number(e.target.value));
            setPage(1);
          }}
          className="w-full accent-primary cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
          <span>PKR 500</span>
          <span>PKR 50,000</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-secondary min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header Breadcrumb / Title */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="text-xs font-bold tracking-widest uppercase text-gold mb-2">
            {selectedCategory ? "Shop Collection" : "The Complete Collection"}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary">
            {selectedCategory?.name ?? "All Bags & Backpacks"}
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-muted-foreground">
            {selectedCategory
              ? `Browse ${selectedCategory.name.toLowerCase()} and see current prices, product details, and availability.`
              : "Browse school bags, backpacks, laptop bags and travel bags. Check each product page for available details and current stock."}
          </p>
        </div>

        <div className="grid lg:grid-cols-[270px_1fr] gap-6 lg:gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block sticky top-24">{filterPanel}</aside>

          {/* Main Product Grid */}
          <div>
            {/* Sorting & Filter toggle header */}
            <div className="bg-card p-3.5 sm:p-4 rounded-xl border border-border flex flex-wrap items-center justify-between gap-3 mb-6 shadow-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden inline-flex items-center gap-2 border border-border bg-secondary px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg text-primary"
                >
                  <SlidersHorizontal className="h-4 w-4 text-gold" /> Filters
                </button>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                  Showing <span className="font-bold text-primary">{products.length}</span> of{" "}
                  <span className="font-bold text-primary">{data?.total ?? 0}</span> products
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground hidden sm:inline">Sort:</span>
                <Select
                  value={sortBy}
                  onValueChange={(v) => {
                    setSortBy(v as ProductQuery["sortBy"]);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-auto rounded-lg bg-secondary border-border px-3 py-2 text-xs sm:text-sm font-medium text-foreground focus:border-primary">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 border-border bg-card text-foreground">
                    {SORT_OPTIONS.map((s) => (
                      <SelectItem
                        key={s.value}
                        value={s.value}
                        className="text-xs text-foreground focus:bg-primary focus:text-primary-foreground sm:text-sm"
                      >
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Listing */}
            {isFetching ? (
              <PageSpinner minH="40vh" />
            ) : isError ? (
              <div
                className="rounded-xl border border-border bg-card px-6 py-12 text-center"
                role="alert"
              >
                <p className="mb-4 text-sm text-muted-foreground">
                  We couldn’t load the collection. Please try again.
                </p>
                <button
                  onClick={() => refetch()}
                  className="rounded-lg bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
                  {products.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>

                {products.length === 0 && (
                  <div className="text-center py-20 bg-card rounded-xl border border-border p-8">
                    <p className="text-base text-foreground font-semibold mb-2">
                      No bags match your current filters.
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Try clearing search terms or selecting a different category.
                    </p>
                    <button
                      onClick={() => {
                        setGender("all");
                        setCategory("all");
                        setMaterial("all");
                        setSearch("");
                        setMax(50000);
                        setPage(1);
                      }}
                      className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10">
                    <button
                      disabled={page === 1}
                      onClick={() => {
                        setPage((p) => p - 1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="border border-border bg-card px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg disabled:opacity-40 hover:border-primary text-primary transition-colors"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      disabled={page === totalPages}
                      onClick={() => {
                        setPage((p) => p + 1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="border border-border bg-card px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg disabled:opacity-40 hover:border-primary text-primary transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/60 backdrop-blur-xs"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[88vw] max-w-sm bg-card overflow-y-auto p-5 shadow-2xl">
            {filterPanel}
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
        {title}
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
        active
          ? "bg-primary text-primary-foreground border-primary shadow-xs font-semibold"
          : "border-border bg-secondary text-foreground hover:border-primary/40 hover:bg-card"
      }`}
    >
      {children}
    </button>
  );
}
