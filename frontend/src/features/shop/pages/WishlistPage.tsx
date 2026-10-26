"use client";

import { Link } from "@/lib/router";
import { Trash2, ShoppingBag, ArrowRight, Heart } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store";
import { addToCart, type CartProduct } from "@/store/slices/cartSlice";
import { removeFromWishlist, selectWishlistIds } from "@/store/slices/wishlistSlice";
import { useGetProductsQuery } from "@/store/services/productsApi";
import { formatPrice } from "@/lib/constants";
import { getImageUrl } from "@/lib/constants";
import PageSpinner from "@/components/PageSpinner";

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const ids = useAppSelector(selectWishlistIds);

  const { data, isLoading } = useGetProductsQuery({ limit: 100 }, { skip: ids.length === 0 });
  const items = (data?.data ?? []).filter((p) => ids.includes(p._id));

  if (ids.length === 0) {
    return (
      <div className="bg-secondary min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-card rounded-2xl border border-border p-8 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto mb-4 text-gold">
            <Heart className="h-8 w-8" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-primary mb-2">
            Your Wishlist is Empty
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Save favorite backpacks and bags to review or purchase later.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-6 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
          >
            <span>Explore All Bags</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) return <PageSpinner minH="60vh" />;

  return (
    <div className="bg-secondary min-h-screen py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-primary">
            Saved Wishlist ({items.length})
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Items you have saved. Move them directly to your cart whenever you are ready.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((p) => {
            const cartProduct: CartProduct = {
              _id: p._id,
              slug: p.slug,
              name: p.name,
              price: p.price,
              discountPrice: p.discountPrice,
              images: p.images,
              material: p.material,
              category: typeof p.category === "object" ? p.category.name : p.category,
              stock: p.stock,
              sku: p.sku,
            };
            return (
              <div
                key={p._id}
                className="flex gap-4 bg-card rounded-xl border border-border p-4 shadow-xs"
              >
                <div className="h-28 w-28 rounded-lg bg-secondary border border-border p-2 shrink-0 flex items-center justify-center">
                  <img
                    src={getImageUrl(p.images[0])}
                    alt={p.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between min-w-0 gap-2">
                  <div className="min-w-0">
                    <Link
                      to={`/product/${p.slug}`}
                      className="font-display text-sm sm:text-base font-bold text-primary hover:text-gold transition-colors line-clamp-1"
                    >
                      {p.name}
                    </Link>
                    <div className="text-sm font-bold text-primary mt-1">
                      {formatPrice(p.discountPrice ?? p.price)}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-border/60">
                    <button
                      onClick={() => {
                        dispatch(addToCart({ product: cartProduct }));
                        dispatch(removeFromWishlist(p._id));
                        toast.success("Moved to cart");
                      }}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-3 text-xs tracking-wider uppercase font-bold rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" /> Move to Cart
                    </button>
                    <button
                      onClick={() => dispatch(removeFromWishlist(p._id))}
                      className="p-2 border border-border rounded-lg text-muted-foreground hover:border-red-400 hover:text-red-500 transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
