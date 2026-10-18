"use client";

import { useEffect, useState } from "react";
import { Link, useParams } from "@/lib/router";
import {
  Heart,
  Minus,
  Plus,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store";
import { addToCart, selectCartSubtotal, type CartProduct } from "@/store/slices/cartSlice";
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
import { formatPrice, getShippingCost, SOCIAL_LINKS } from "@/lib/constants";
import { SITE_URL } from "@/lib/seo";
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
  const [tab, setTab] = useState<"specs" | "reviews">("specs");

  const { data: product, isLoading, isError } = useGetProductBySlugQuery(slug ?? "");
  const categoryId =
    typeof product?.category === "object" ? product.category._id : product?.category;
  const { data: relatedData } = useGetProductsQuery(
    { category: categoryId, limit: 4 },
    { skip: !categoryId },
  );
  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    isError: reviewsError,
  } = useGetProductReviewsQuery(
    { productId: product?._id ?? "" },
    { skip: !product?._id || tab !== "reviews" },
  );
  const [createReview, { isLoading: savingReview }] = useCreateReviewMutation();

  const wishHas = useAppSelector(selectIsWishlisted(product?._id ?? ""));
  const cartQty = useAppSelector(
    (state) => state.cart.items.find((item) => item.product._id === product?._id)?.qty ?? 0,
  );
  const cartSubtotal = useAppSelector(selectCartSubtotal);

  const [image, setImage] = useState<string | null>(null);
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewDisplayName, setReviewDisplayName] = useState("");

  useEffect(() => {
    setImage(null);
    setQty(1);
  }, [slug]);

  useEffect(() => {
    if (product) setQty((currentQty) => Math.min(currentQty, Math.max(1, product.stock - cartQty)));
  }, [cartQty, product]);

  if (isLoading) return <PageSpinner minH="60vh" />;
  if (isError || !product) {
    return (
      <div className="p-20 text-center bg-[#FAF9F6]">
        <h2 className="text-xl font-bold text-[#193B63] mb-2">Product Not Found</h2>
        <p className="text-sm text-[#627184] mb-4">
          The bag you are looking for is currently unavailable.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-[#193B63] text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider"
        >
          Back to Bag Store
        </Link>
      </div>
    );
  }

  const productImages = product.images ?? [];
  const currentImage = image ?? productImages[0];
  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.price);
  const price = hasDiscount ? product.discountPrice! : product.price;
  const related = (relatedData?.data ?? []).filter((p) => p._id !== product._id).slice(0, 4);
  const reviews = reviewsData?.data ?? [];

  const cartProduct: CartProduct = {
    _id: product._id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    discountPrice: product.discountPrice,
    images: productImages,
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
  const stockAvailable = product.stock > 0;
  const maxAddable = Math.max(0, product.stock - cartQty);
  const whatsappMessage = [
    `Hello RizMart, I have a question about ${product.name}.`,
    `Quantity: ${Math.min(qty, maxAddable)}`,
    `Price: ${formatPrice(price)} each`,
    `Product page: ${SITE_URL}/product/${product.slug}`,
    "Please confirm availability and delivery details. This message is an inquiry, not a confirmed order.",
  ].join("\n");
  const whatsappUrl = `https://wa.me/${SOCIAL_LINKS.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Breadcrumb navigation */}
        <nav className="text-xs text-[#627184] mb-6 flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-[#193B63] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#193B63] transition-colors">
            Bags
          </Link>
          <span>/</span>
          {categoryName && (
            <>
              <span className="text-[#263445] font-medium">{categoryName}</span>
              <span>/</span>
            </>
          )}
          <span className="text-[#193B63] font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Main Container */}
        <div className="bg-white rounded-2xl border border-[#E6E8EC] p-5 sm:p-8 lg:p-10 shadow-xs mb-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery Section */}
            <div className="space-y-4">
              <div className="aspect-[4/5] sm:aspect-square bg-[#FAF9F6] rounded-xl border border-[#E6E8EC] overflow-hidden flex items-center justify-center p-4 relative">
                {currentImage && failedImage !== currentImage ? (
                  <img
                    src={getImageUrl(currentImage)}
                    alt={product.name}
                    fetchPriority="high"
                    decoding="async"
                    onError={() => setFailedImage(currentImage)}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-sm text-[#627184]">Product image unavailable</span>
                )}
                {hasDiscount && (
                  <span className="absolute top-4 left-4 bg-[#E3A34D] text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                    Sale
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {productImages.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {productImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setImage(img)}
                      aria-label={`View ${product.name}, image ${i + 1}`}
                      className={`h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-lg bg-[#FAF9F6] border-2 p-1.5 transition-all overflow-hidden ${
                        img === currentImage
                          ? "border-[#193B63] shadow-xs"
                          : "border-[#E6E8EC] hover:border-[#193B63]/40"
                      }`}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#E3A34D] tracking-wider uppercase mb-2">
                  <span>{categoryName}</span>
                  {product.material && (
                    <>
                      <span>•</span>
                      <span>{product.material}</span>
                    </>
                  )}
                </div>

                <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#193B63] mb-3 leading-tight">
                  {product.name}
                </h1>

                {/* Rating & reviews summary */}
                {product.reviewCount > 0 ? (
                  <div
                    className="flex items-center gap-2 mb-5"
                    aria-label={`${product.averageRating.toFixed(1)} out of 5 from ${product.reviewCount} reviews`}
                  >
                    <div
                      className="flex items-center gap-1"
                      role="img"
                      aria-label={`${product.averageRating.toFixed(1)} out of 5 stars`}
                    >
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(product.averageRating)
                              ? "fill-[#E3A34D] text-[#E3A34D]"
                              : "text-[#E6E8EC]"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-[#627184]">
                      {product.averageRating.toFixed(1)} ({product.reviewCount}{" "}
                      {product.reviewCount === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-[#627184] mb-5">
                    No reviews yet. Be the first to review this bag.
                  </p>
                )}

                {/* Price block */}
                <div className="flex items-baseline gap-3 mb-6 p-4 rounded-xl bg-[#FAF9F6] border border-[#E6E8EC]">
                  <span className="text-3xl font-extrabold text-[#193B63]">
                    {formatPrice(price)}
                  </span>
                  {hasDiscount && (
                    <span className="text-base text-[#8C9BAA] line-through font-medium">
                      {formatPrice(product.price)}
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="text-xs font-bold text-[#E3A34D] ml-auto uppercase tracking-wider">
                      Save {formatPrice(product.price - product.discountPrice!)}
                    </span>
                  )}
                </div>

                {/* Description snippet */}
                <p className="text-sm text-[#263445] leading-relaxed mb-6">
                  {product.description ||
                    "Product details are currently unavailable. Contact us if you need more information."}
                </p>

                {/* Quantity selector & stock */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center border border-[#E6E8EC] rounded-lg bg-white overflow-hidden shadow-xs">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      disabled={qty <= 1}
                      className="p-3 text-[#263445] hover:bg-[#FAF9F6] transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <div className="w-12 text-center font-bold text-sm text-[#193B63]">{qty}</div>
                    <button
                      onClick={() => setQty(Math.min(maxAddable, qty + 1))}
                      disabled={!stockAvailable || qty >= maxAddable}
                      className="p-3 text-[#263445] hover:bg-[#FAF9F6] transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-xs text-[#627184] font-medium">
                    <span
                      className={`font-bold inline-flex items-center gap-1 ${stockAvailable ? "text-emerald-700" : "text-red-600"}`}
                    >
                      {stockAvailable && <Check className="h-3.5 w-3.5" />}
                      {product.stock < 1
                        ? "Out of stock"
                        : maxAddable > 0
                          ? `In stock (${maxAddable} available)`
                          : "Available quantity already in cart"}
                    </span>
                    <span className="block text-[11px] text-[#8C9BAA]">SKU: {product.sku}</span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="grid grid-cols-[1fr_auto] gap-3 mb-3">
                  <button
                    type="button"
                    disabled={maxAddable < 1}
                    onClick={() => {
                      const quantityToAdd = Math.min(qty, maxAddable);
                      dispatch(addToCart({ product: cartProduct, qty: quantityToAdd }));
                      toast.success(`${quantityToAdd} × ${product.name} added to cart`);
                    }}
                    className="min-w-0 bg-[#193B63] hover:bg-[#132D4C] active:bg-[#0E223B] text-white py-3.5 px-4 sm:px-6 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={() => {
                      dispatch(toggleWishlist(product._id));
                      toast(wishHas ? "Removed from wishlist" : "Saved to wishlist");
                    }}
                    className={`h-12 w-12 shrink-0 rounded-lg border flex items-center justify-center transition-colors shadow-xs ${
                      wishHas
                        ? "border-[#E3A34D] bg-[#E3A34D]/10 text-[#E3A34D]"
                        : "border-[#E6E8EC] hover:border-[#193B63] text-[#263445]"
                    }`}
                    aria-label={
                      wishHas
                        ? `Remove ${product.name} from wishlist`
                        : `Add ${product.name} to wishlist`
                    }
                  >
                    <Heart className={`h-5 w-5 ${wishHas ? "fill-[#E3A34D]" : ""}`} />
                  </button>
                </div>
                {maxAddable > 0 && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-6 flex w-full items-center justify-center gap-2 rounded-lg border border-[#25D366]/40 bg-[#25D366]/10 px-4 py-3 text-sm font-semibold text-[#167A3E] transition-colors hover:bg-[#25D366]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
                  >
                    Ask about this bag on WhatsApp
                  </a>
                )}
              </div>

              {/* Product Trust Highlights */}
              <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-[#E6E8EC] text-[11px] sm:text-xs text-[#263445] font-semibold text-center">
                <div className="p-2.5 rounded-lg bg-[#FAF9F6] border border-[#E6E8EC]">
                  <Truck className="h-4 w-4 text-[#193B63] mx-auto mb-1" />
                  <span>
                    {getShippingCost(cartSubtotal + price * qty) === 0
                      ? "Free shipping"
                      : `${formatPrice(getShippingCost(cartSubtotal + price * qty))} shipping`}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#FAF9F6] border border-[#E6E8EC]">
                  <ShieldCheck className="h-4 w-4 text-[#193B63] mx-auto mb-1" />
                  <span>Cash on delivery</span>
                </div>
                <Link
                  to="/refund"
                  className="p-2.5 rounded-lg bg-[#FAF9F6] border border-[#E6E8EC] hover:border-[#193B63]/40 transition-colors"
                >
                  <RotateCcw className="h-4 w-4 text-[#193B63] mx-auto mb-1" />
                  <span>Return policy</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Specifications & Reviews Tab */}
          <div className="mt-12 pt-8 border-t border-[#E6E8EC]">
            <div className="flex border-b border-[#E6E8EC] gap-6">
              <button
                onClick={() => setTab("specs")}
                className={`pb-3 text-sm font-bold tracking-wider uppercase transition-colors relative ${
                  tab === "specs"
                    ? "text-[#193B63] border-b-2 border-[#193B63]"
                    : "text-[#627184] hover:text-[#193B63]"
                }`}
              >
                Specifications & Features
              </button>
              <button
                onClick={() => setTab("reviews")}
                className={`pb-3 text-sm font-bold tracking-wider uppercase transition-colors relative ${
                  tab === "reviews"
                    ? "text-[#193B63] border-b-2 border-[#193B63]"
                    : "text-[#627184] hover:text-[#193B63]"
                }`}
              >
                Customer Reviews ({product.reviewCount})
              </button>
            </div>

            <div className="py-6">
              {tab === "specs" && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E6E8EC] space-y-2 text-sm">
                    <div className="text-xs font-bold text-[#627184] uppercase">Category</div>
                    <div className="font-semibold text-[#193B63]">{categoryName}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E6E8EC] space-y-2 text-sm">
                    <div className="text-xs font-bold text-[#627184] uppercase">Material</div>
                    <div className="font-semibold text-[#193B63]">
                      {product.material || "Not specified"}
                    </div>
                  </div>
                  {Object.entries(specs).map(([k, v]) => (
                    <div
                      key={k}
                      className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E6E8EC] space-y-2 text-sm"
                    >
                      <div className="text-xs font-bold text-[#627184] uppercase">{k}</div>
                      <div className="font-semibold text-[#193B63]">{String(v)}</div>
                    </div>
                  ))}
                </div>
              )}

              {tab === "reviews" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-[#E6E8EC]">
                    <div>
                      <h3 className="font-display text-lg font-bold text-[#193B63]">
                        Customer Experiences
                      </h3>
                      <p className="text-xs text-[#627184]">Reviews submitted for this product.</p>
                    </div>
                    <Button
                      type="button"
                      variant={showReviewForm ? "outline" : "default"}
                      size="sm"
                      onClick={() => setShowReviewForm((open) => !open)}
                      className="text-xs font-bold uppercase tracking-wider"
                    >
                      {showReviewForm ? "Cancel Review" : "Write a Review"}
                    </Button>
                  </div>

                  {showReviewForm && (
                    <div className="bg-[#FAF9F6] p-5 sm:p-6 rounded-xl border border-[#E6E8EC]">
                      <form
                        className="space-y-4"
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (!product?._id) return;
                          if (reviewComment.trim().length < 10) {
                            toast.error("Review comment must be at least 10 characters long.");
                            return;
                          }

                          try {
                            await createReview({
                              productId: product._id,
                              rating: reviewRating,
                              comment: reviewComment.trim(),
                              displayName: reviewDisplayName.trim() || "Guest",
                            }).unwrap();
                            toast.success("Thank you! Your review has been submitted.");
                            setReviewRating(5);
                            setReviewComment("");
                            setReviewDisplayName("");
                            setShowReviewForm(false);
                          } catch (error: unknown) {
                            toast.error(
                              error instanceof Error
                                ? error.message
                                : "Failed to post review. Please try again.",
                            );
                          }
                        }}
                      >
                        <div className="grid sm:grid-cols-2 gap-4">
                          <label className="block">
                            <span className="text-xs font-bold text-[#263445] uppercase">
                              Your Name
                            </span>
                            <input
                              value={reviewDisplayName}
                              onChange={(e) => setReviewDisplayName(e.target.value)}
                              className="mt-1 w-full rounded-lg border border-[#E6E8EC] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#193B63]"
                              placeholder="e.g. Asad K."
                            />
                          </label>
                          <label className="block">
                            <span className="text-xs font-bold text-[#263445] uppercase">
                              Rating
                            </span>
                            <Select
                              value={String(reviewRating)}
                              onValueChange={(v) => setReviewRating(Number(v))}
                            >
                              <SelectTrigger className="mt-1 w-full rounded-lg border border-[#E6E8EC] bg-white px-3 py-2 text-sm">
                                <SelectValue placeholder="Select rating" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-[#E6E8EC]">
                                {[5, 4, 3, 2, 1].map((value) => (
                                  <SelectItem key={value} value={String(value)}>
                                    {value} Star{value > 1 ? "s" : ""}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </label>
                        </div>
                        <label className="block">
                          <span className="text-xs font-bold text-[#263445] uppercase">
                            Your Review
                          </span>
                          <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            rows={3}
                            className="mt-1 w-full rounded-lg border border-[#E6E8EC] bg-white p-3 text-sm focus:outline-none focus:border-[#193B63]"
                            placeholder="Share your thoughts on the bag quality, straps, space..."
                          />
                        </label>
                        <button
                          type="submit"
                          disabled={savingReview}
                          className="bg-[#193B63] hover:bg-[#132D4C] text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                        >
                          {savingReview ? "Submitting…" : "Post Review"}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-3">
                    {reviewsLoading && (
                      <p className="text-sm text-[#627184] py-4" role="status">
                        Loading reviews…
                      </p>
                    )}
                    {reviewsError && (
                      <p className="text-sm text-red-600 py-4" role="alert">
                        Reviews could not be loaded. Please try again later.
                      </p>
                    )}
                    {!reviewsLoading && !reviewsError && reviews.length === 0 && (
                      <p className="text-sm text-[#627184] py-4">
                        No reviews yet for this bag. Be the first to review!
                      </p>
                    )}
                    {!reviewsLoading &&
                      reviews.map((r) => (
                        <div
                          key={r._id}
                          className="p-4 rounded-xl border border-[#E6E8EC] bg-white space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-[#193B63]">
                              {r.displayName ?? r.user?.name ?? "Customer"}
                            </span>
                            <div className="flex items-center gap-0.5">
                              {[...Array(r.rating)].map((_, j) => (
                                <Star
                                  key={j}
                                  className="h-3.5 w-3.5 fill-[#E3A34D] text-[#E3A34D]"
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-[#263445]">{r.comment}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-8">
            <h2 className="font-display text-2xl font-bold text-[#193B63] mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
