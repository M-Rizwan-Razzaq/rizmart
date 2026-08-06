import { Link } from "@/lib/router";
import { Heart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store";
import { addToCart, type CartProduct } from "@/store/slices/cartSlice";
import { toggleWishlist, selectIsWishlisted } from "@/store/slices/wishlistSlice";
import { formatPrice } from "@/lib/constants";
import { getImageUrl } from "@/lib/constants";
import type { ApiProduct } from "@/store/services/productsApi";

export function ProductCard({ product }: { product: ApiProduct }) {
  const dispatch = useAppDispatch();
  const wishHas = useAppSelector(selectIsWishlisted(product._id));
  const handleAddToCart = () => {
    dispatch(addToCart({ product: cartProduct }));
    toast.success(`${product.name} added to cart`);
  };

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

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-[20px] border border-border/60 bg-card">
        <Link to={`/product/${product.slug}`} className="block aspect-square overflow-hidden">
          <img
            src={getImageUrl(product.images[0])}
            alt={product.name}
            width={800}
            height={800}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
          />
        </Link>
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-gold-gradient text-onyx text-[10px] tracking-[0.2em] px-2 py-1 uppercase font-medium">
            Sale
          </span>
        )}
        {product.newArrival && !hasDiscount && (
          <span className="absolute top-3 left-3 border border-gold text-gold text-[10px] tracking-[0.2em] px-2 py-1 uppercase">
            New
          </span>
        )}
        <button
          onClick={() => {
            dispatch(toggleWishlist(product._id));
            toast(wishHas ? "Removed from wishlist" : "Added to wishlist");
          }}
          className="absolute top-3 right-3 h-9 w-9 grid place-items-center bg-background/70 backdrop-blur border border-border/60 hover:border-gold transition"
          aria-label="Wishlist"
        >
          <Heart className={`h-4 w-4 ${wishHas ? "fill-gold text-gold" : "text-foreground"}`} />
        </button>
        <button
          onClick={handleAddToCart}
          className="absolute bottom-0 inset-x-0 hidden bg-gold-gradient text-onyx text-xs tracking-[0.25em] uppercase font-medium py-3 translate-y-full md:block md:group-hover:translate-y-0 transition-transform duration-500"
        >
          Add to Cart
        </button>
      </div>
      <div className="pt-4 space-y-1">
        <Link
          to={`/product/${product.slug}`}
          className="block font-display text-lg hover:text-gold transition"
        >
          {product.name}
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {hasDiscount ? (
              <>
                <span className="text-gold font-medium">{formatPrice(product.discountPrice!)}</span>
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-foreground">{formatPrice(product.price)}</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-gold text-gold" />
            {product.averageRating.toFixed(1)}
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          className="mt-3 w-full bg-gold-gradient text-onyx text-xs tracking-[0.25em] uppercase font-medium py-3 md:hidden"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
