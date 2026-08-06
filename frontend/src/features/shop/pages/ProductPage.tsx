"use client";

import { useState } from "react";
import { Link, useParams } from "@/lib/router";
import { Heart, Minus, Plus, Star, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store";
import { addToCart, type CartProduct } from "@/store/slices/cartSlice";
import { toggleWishlist, selectIsWishlisted } from "@/store/slices/wishlistSlice";
import { ProductCard } from "@/features/shop/components/ProductCard";
import PageSpinner from "@/components/PageSpinner";
import { Button } from "@/components/ui/button";
import {
  useGetProductBySlugQuery,
  useGetProductsQuery,
  useGetProductReviewsQuery,
  useCreateReviewMutation,
} from "@/store/services/productsApi";
import { formatPrice } from "@/lib/constants";
import { getImageUrl } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const { data: product, isLoading, isError } = useGetProductBySlugQuery(slug ?? "");
  const categoryId =
    typeof product?.category === "object" ? product.category._id : product?.category;
  const { data: relatedData } = useGetProductsQuery(
    { category: categoryId, limit: 4 },
    { skip: !categoryId },
  );
  const { data: reviewsData } = useGetProductReviewsQuery(
    { productId: product?._id ?? "" },
    { skip: !product?._id },
  );
  const [createReview, { isLoading: savingReview }] = useCreateReviewMutation();

  const wishHas = useAppSelector(selectIsWishlisted(product?._id ?? ""));

  const [image, setImage] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"specs" | "reviews">("specs");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewDisplayName, setReviewDisplayName] = useState("");

  if (isLoading) return <PageSpinner />;
  if (isError || !product) {
    return (
      <div className="p-24 text-center">
        Product not found.{" "}
        <Link to="/shop" className="text-gold underline">
          Back to shop
        </Link>
      </div>
    );
  }

  const currentImage = image ?? product.images[0];
  const price = product.discountPrice ?? product.price;
  const related = (relatedData?.data ?? []).filter((p) => p._id !== product._id).slice(0, 4);
  const reviews = reviewsData?.data ?? [];

  const cartProduct: CartProduct = {
    _id: product._id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    discountPrice: product.discountPrice,
    images: product.images,
    material: product.material,
    category: typeof product.category === "object" ? product.category.name : product.category,
    stock: product.stock,
    sku: product.sku,
  };

  const categoryName =
    typeof product.category === "object" ? product.category.name : product.category;
  const specs =
    product.specifications instanceof Map
      ? Object.fromEntries(product.specifications)
      : (product.specifications ?? {});

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
      <nav className="text-xs text-muted-foreground mb-6 sm:mb-8 tracking-wider uppercase truncate">
        <Link to="/" className="hover:text-gold">
          Home
        </Link>{" "}
        /{" "}
        <Link to="/shop" className="hover:text-gold">
          Shop
        </Link>{" "}
        / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
        {/* Images */}
        <div>
          <div className="aspect-square overflow-hidden bg-card border border-border/60 mb-4">
            <img
              src={getImageUrl(currentImage)}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex gap-2 sm:gap-3 overflow-x-auto">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setImage(img)}
                className={`h-16 w-16 sm:h-20 sm:w-20 shrink-0 border ${img === currentImage ? "border-gold" : "border-border/60"} overflow-hidden`}
              >
                <img src={getImageUrl(img)} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <div className="text-[11px] tracking-[0.3em] uppercase text-gold mb-3">
            {categoryName} · {product.material}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl mb-4">{product.name}</h1>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(product.averageRating) ? "fill-gold text-gold" : "text-muted-foreground"}`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {product.averageRating.toFixed(1)} · {product.reviewCount} reviews
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-display text-gold">{formatPrice(price)}</span>
            {product.discountPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8">
            <div className="flex items-center border border-border">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="p-3 hover:text-gold"
                aria-label="Decrease"
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="w-12 text-center">{qty}</div>
              <button
                onClick={() => setQty(qty + 1)}
                className="p-3 hover:text-gold"
                aria-label="Increase"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="text-xs text-muted-foreground">
              {product.stock} in stock · SKU {product.sku}
            </span>
          </div>

          <div className="flex gap-3 mb-10">
            <button
              onClick={() => {
                dispatch(addToCart({ product: cartProduct, qty }));
                toast.success(`${product.name} added to cart`);
              }}
              className="flex-1 bg-gold-gradient text-onyx py-4 text-xs tracking-[0.25em] uppercase font-medium"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                dispatch(toggleWishlist(product._id));
                toast(wishHas ? "Removed from wishlist" : "Added to wishlist");
              }}
              className="h-14 w-14 shrink-0 grid place-items-center border border-border hover:border-gold"
              aria-label="Wishlist"
            >
              <Heart className={`h-5 w-5 ${wishHas ? "fill-gold text-gold" : ""}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-10 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-gold shrink-0" /> Free shipping
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-gold shrink-0" /> Lifetime warranty
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-gold shrink-0" /> 30-day returns
            </div>
          </div>

          {/* Tabs */}
          <div>
            <div className="flex border-b border-border overflow-x-auto">
              {(["specs", "reviews"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={`shrink-0 px-4 py-3 text-xs tracking-[0.2em] uppercase ${tab === k ? "text-gold border-b border-gold -mb-px" : "text-muted-foreground"}`}
                >
                  {k === "specs" ? "Specifications" : `Reviews (${product.reviewCount})`}
                </button>
              ))}
            </div>
            <div className="py-6 text-sm text-muted-foreground leading-relaxed">
              {tab === "specs" && (
                <dl className="grid grid-cols-2 gap-2">
                  {Object.entries(specs).map(([k, v]) => (
                    <div key={k} className="contents">
                      <dt className="text-foreground">{k}</dt>
                      <dd>{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {tab === "reviews" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <h3 className="font-display text-xl">Write a review</h3>
                      <p className="text-sm text-muted-foreground">
                        Share your experience with this piece.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant={showReviewForm ? "outline" : "gold"}
                      size="sm"
                      onClick={() => setShowReviewForm((open) => !open)}
                      className="tracking-[0.25em] uppercase"
                    >
                      {showReviewForm ? "Close Form" : "Post Review"}
                    </Button>
                  </div>

                  {showReviewForm && (
                    <div className="card-luxe p-4 sm:p-5">
                      <form
                        className="grid gap-4"
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (!product?._id) return;
                          if (reviewComment.trim().length < 10) {
                            toast.error("Comment must be at least 10 characters");
                            return;
                          }

                          try {
                            await createReview({
                              productId: product._id,
                              rating: reviewRating,
                              comment: reviewComment.trim(),
                              displayName: reviewDisplayName.trim() || "Guest",
                            }).unwrap();
                            toast.success("Review posted");
                            setReviewRating(5);
                            setReviewComment("");
                            setReviewDisplayName("");
                            setShowReviewForm(false);
                          } catch (error: any) {
                            toast.error(error?.message ?? "Failed to post review");
                          }
                        }}
                      >
                        <label className="block">
                          <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                            Display Name
                          </span>
                          <input
                            value={reviewDisplayName}
                            onChange={(e) => setReviewDisplayName(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-border bg-input px-4 py-3 text-sm focus:outline-none focus:border-gold"
                            placeholder="Guest"
                          />
                        </label>
                        <label className="block">
                          <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                            Rating
                          </span>
                          <Select
                            value={String(reviewRating)}
                            onValueChange={(v) => setReviewRating(Number(v))}
                          >
                            <SelectTrigger className="mt-1 w-full rounded-none bg-input px-4 py-2 text-sm focus:border-gold sm:w-40">
                              <SelectValue placeholder="Select rating" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                              {[5, 4, 3, 2, 1].map((value) => (
                                <SelectItem key={value} value={String(value)}>
                                  {value} star{value > 1 ? "s" : ""}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </label>
                        <label className="block">
                          <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                            Comment
                          </span>
                          <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            rows={4}
                            className="mt-1 w-full rounded-xl border border-border bg-input px-4 py-3 text-sm focus:outline-none focus:border-gold"
                            placeholder="Share your experience with this product..."
                          />
                        </label>
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={savingReview}
                            className="bg-gold-gradient text-onyx px-5 py-3 text-xs tracking-[0.25em] uppercase font-medium disabled:opacity-50"
                          >
                            {savingReview ? "Posting…" : "Submit Review"}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                  <div className="space-y-4">
                    {reviews.length === 0 && (
                      <p className="text-muted-foreground">No reviews yet. Be the first!</p>
                    )}
                    {reviews.map((r) => (
                      <div key={r._id} className="border border-border p-4">
                        <div className="flex items-center gap-2 mb-2">
                          {[...Array(r.rating)].map((_, j) => (
                            <Star key={j} className="h-3 w-3 fill-gold text-gold" />
                          ))}
                          <span className="text-foreground text-sm">
                            {r.displayName ?? r.user?.name ?? "Guest"}
                          </span>
                        </div>
                        <p>{r.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 sm:mt-24">
          <h2 className="font-display text-2xl sm:text-3xl mb-6 sm:mb-8">You May Also Love</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
