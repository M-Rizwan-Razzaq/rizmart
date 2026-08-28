"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "@/lib/router";
import { SlidersHorizontal, X } from "lucide-react";
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
const MATERIALS = ["all", "leather", "faux-leather", "canvas", "nylon", "polyester", "suede"] as const;
const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low", value: "price_asc" },
  { label: "Price: High", value: "price_desc" },
  { label: "Popularity", value: "popular" },
  { label: "Top Rated", value: "rating" },
] as const;

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const [gender, setGender] = useState<string>(searchParams.get("gender") ?? "all");
  const [material, setMaterial] = useState<string>("all");
  const [category, setCategory] = useState<string>(searchParams.get("category") ?? "all");
  const [sortBy, setSortBy] = useState<ProductQuery["sortBy"]>("newest");
  const [max, setMax] = useState(50000);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setGender(searchParams.get("gender") ?? "all");
    setCategory(searchParams.get("category") ?? "all");
    setPage(1);
  }, [searchParams]);

  const query: ProductQuery = {
    page,
    limit: 12,
    ...(search && { search }),
    ...(gender !== "all" && { gender }),
    ...(material !== "all" && { material }),
    ...(category !== "all" && { category }),
    maxPrice: max,
    sortBy,
  };

  const { data, isLoading } = useGetProductsQuery(query);
  const { data: categories = [] } = useGetCategoriesQuery();

  const products = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const formatChipLabel = (value: string) =>
    value === "all"
      ? "All"
      : value
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ");

  const filterPanel = (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-gold">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </div>
        <button
          className="lg:hidden"
          onClick={() => setShowFilters(false)}
          aria-label="Close filters"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder="Search bags…"
        className="w-full bg-input border border-border px-3 py-2 text-sm focus:outline-none focus:border-gold"
      />
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
      <FilterGroup title="Category">
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
      <div>
        <div className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-3">
          Max price: {formatPrice(max)}
        </div>
        <input
          type="range"
          min={200}
          max={50000}
          step={50}
          value={max}
          onChange={(e) => {
            setMax(Number(e.target.value));
            setPage(1);
          }}
          className="w-full accent-gold"
        />
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16">
      <div className="text-center mb-8 sm:mb-12">
        <div className="text-[11px] tracking-[0.3em] uppercase text-gold mb-3">The Collection</div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl">All Bags</h1>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6 lg:gap-10">
        <aside className="hidden lg:block">{filterPanel}</aside>
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-widest"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </button>
              <div className="text-sm text-muted-foreground">{data?.total ?? 0} bags</div>
            </div>
            <Select
              value={sortBy === "newest" ? "featured" : sortBy}
              onValueChange={(v) => {
                setSortBy((v === "featured" ? "newest" : v) as ProductQuery["sortBy"]);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-auto rounded-none bg-input px-3 py-2 text-sm focus:border-gold">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {SORT_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <PageSpinner />
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
              {products.length === 0 && (
                <div className="text-center py-24 text-muted-foreground">
                  No bags match your filters.
                </div>
              )}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="border border-border px-4 py-2 text-xs uppercase tracking-widest disabled:opacity-40 hover:border-gold"
                  >
                    Prev
                  </button>
                  <span className="px-4 py-2 text-xs text-muted-foreground">
                    {page} / {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="border border-border px-4 py-2 text-xs uppercase tracking-widest disabled:opacity-40 hover:border-gold"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[85vw] max-w-sm bg-card border-l border-border overflow-y-auto p-6">
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
      <div className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-3">{title}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
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
      className={`px-3 py-1.5 text-xs uppercase tracking-wider border transition ${active ? "bg-gold-gradient text-onyx border-transparent" : "border-border text-muted-foreground hover:border-gold hover:text-gold"}`}
    >
      {children}
    </button>
  );
}
