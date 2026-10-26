import { useState } from "react";
import { Link } from "@/lib/router";
import { Heart, Star, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store";
import { addToCart, type CartProduct } from "@/store/slices/cartSlice";
import { toggleWishlist, selectIsWishlisted } from "@/store/slices/wishlistSlice";
import { formatPrice } from "@/lib/constants";
import { getImageUrl } from "@/lib/constants";
import type { ApiProduct } from "@/store/services/productsApi";

export function ProductCard({ product }: { product: ApiProduct }) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const wishHas = useAppSelector(selectIsWishlisted(product._id));

  const cartProduct: CartProduct = {
    _id: product._id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    discountPrice: product.discountPrice,
    images: product.images,
    material: product.material,
    category:
      typeof product.category === "string" ? product.category : (product.category?.name ?? ""),
    stock: product.stock,
    sku: product.sku,
  };

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    dispatch(addToCart({ product: cartProduct }));
    toast.success(`${product.name} added to cart`);
  };

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const rawCategoryName =
    typeof product.category === "object" ? product.category?.name : product.category;
  // Some product responses contain only the category's MongoDB ID. Never show
  // that internal identifier as the customer-facing category label.
  const categoryName =
    rawCategoryName && !/^[a-f\d]{24}$/i.test(rawCategoryName)
      ? rawCategoryName
      : product.material || "Bag";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.35 }}
      className="group flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[4/5] bg-secondary overflow-hidden flex items-center justify-center p-3">
        <Link
          to={`/product/${product.slug}`}
          className="w-full h-full flex items-center justify-center"
        >
          {product.images?.[0] && failedImage !== product.images[0] ? (
            <img
              src={getImageUrl(product.images[0])}
              alt={product.name}
              width={600}
              height={750}
              loading="lazy"
              decoding="async"
              onError={() => setFailedImage(product.images[0])}
              className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="px-4 text-center text-xs text-muted-foreground">
              Product image unavailable
            </span>
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <span className="bg-gold text-accent-foreground text-[10px] tracking-wider px-2 py-0.5 uppercase font-bold rounded shadow-sm">
              Sale
            </span>
          )}
          {product.newArrival && !hasDiscount && (
            <span className="bg-primary text-primary-foreground text-[10px] tracking-wider px-2 py-0.5 uppercase font-bold rounded shadow-sm">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            dispatch(toggleWishlist(product._id));
            toast(wishHas ? "Removed from wishlist" : "Saved to wishlist");
          }}
          className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:text-gold hover:border-gold transition-colors shadow-sm z-10"
          aria-label={
            wishHas ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`
          }
        >
          <Heart className={`h-4 w-4 ${wishHas ? "fill-gold text-gold" : ""}`} />
        </button>
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col justify-between gap-2.5 bg-card p-2.5 min-[380px]:p-3.5 sm:p-4">
        <div className="min-w-0">
          {/* Category / Material tag */}
          <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1 truncate">
            {categoryName}
          </div>

          {/* Product Name */}
          <Link
            to={`/product/${product.slug}`}
            className="block font-display text-sm sm:text-base font-bold text-primary hover:text-gold transition-colors line-clamp-3 leading-snug"
            title={product.name}
          >
            {product.name}
          </Link>
        </div>

        <div>
          {/* Price & Rating */}
          <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-2">
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
              {hasDiscount ? (
                <>
                  <span className="whitespace-nowrap text-primary font-bold text-sm sm:text-base">
                    {formatPrice(product.discountPrice!)}
                  </span>
                  <span className="whitespace-nowrap text-xs text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="whitespace-nowrap text-primary font-bold text-sm sm:text-base">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {product.averageRating > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0 font-medium">
                <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                <span>{product.averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Keep the primary action visible on touch screens and desktop. */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock < 1}
            className="mt-3 flex min-h-11 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-primary px-2 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80 min-[380px]:text-xs min-[380px]:tracking-wider disabled:cursor-not-allowed disabled:bg-muted-foreground"
          >
            <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
            <span className="whitespace-nowrap">{product.stock > 0 ? "Add to Cart" : "Out of Stock"}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
