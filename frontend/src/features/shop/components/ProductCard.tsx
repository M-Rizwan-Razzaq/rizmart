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
  const categoryName =
    typeof product.category === "object" ? product.category?.name : product.category;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.35 }}
      className="group flex flex-col h-full bg-white rounded-xl border border-[#E6E8EC] overflow-hidden hover:border-[#193B63]/30 hover:shadow-lg transition-all duration-300"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[4/5] bg-[#FAF9F6] overflow-hidden flex items-center justify-center p-3">
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
            <span className="px-4 text-center text-xs text-[#627184]">
              Product image unavailable
            </span>
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <span className="bg-[#E3A34D] text-white text-[10px] tracking-wider px-2 py-0.5 uppercase font-bold rounded shadow-sm">
              Sale
            </span>
          )}
          {product.newArrival && !hasDiscount && (
            <span className="bg-[#193B63] text-white text-[10px] tracking-wider px-2 py-0.5 uppercase font-bold rounded shadow-sm">
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
          className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm border border-[#E6E8EC] flex items-center justify-center text-[#263445] hover:text-[#E3A34D] hover:border-[#E3A34D] transition-colors shadow-sm z-10"
          aria-label={
            wishHas ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`
          }
        >
          <Heart className={`h-4 w-4 ${wishHas ? "fill-[#E3A34D] text-[#E3A34D]" : ""}`} />
        </button>
      </div>

      {/* Product Information */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-2.5 bg-white">
        <div>
          {/* Category / Material tag */}
          <div className="text-[11px] font-medium text-[#627184] uppercase tracking-wider mb-1 truncate">
            {categoryName || product.material || "Bag"}
          </div>

          {/* Product Name */}
          <Link
            to={`/product/${product.slug}`}
            className="block font-display text-sm sm:text-base font-bold text-[#193B63] hover:text-[#E3A34D] transition-colors line-clamp-2 leading-snug"
            title={product.name}
          >
            {product.name}
          </Link>
        </div>

        <div>
          {/* Price & Rating */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#E6E8EC]/60">
            <div className="flex items-baseline gap-1.5">
              {hasDiscount ? (
                <>
                  <span className="text-[#193B63] font-bold text-sm sm:text-base">
                    {formatPrice(product.discountPrice!)}
                  </span>
                  <span className="text-xs text-[#8C9BAA] line-through">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-[#193B63] font-bold text-sm sm:text-base">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {product.averageRating > 0 && (
              <div className="flex items-center gap-1 text-xs text-[#627184] shrink-0 font-medium">
                <Star className="h-3.5 w-3.5 fill-[#E3A34D] text-[#E3A34D]" />
                <span>{product.averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Keep the primary action visible on touch screens and desktop. */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock < 1}
            className="mt-3 w-full bg-[#193B63] text-white text-xs tracking-wider uppercase font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 hover:bg-[#132D4C] active:bg-[#0E223B] transition-colors disabled:cursor-not-allowed disabled:bg-[#8C9BAA]"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>{product.stock > 0 ? "Add to Cart" : "Out of Stock"}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
