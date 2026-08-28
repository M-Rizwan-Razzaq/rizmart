import { Link } from "@/lib/router";
import { Trash2, ShoppingBag } from "lucide-react";
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

  // Fetch all products then filter by wishlist ids client-side
  // (avoids a dedicated "get by ids" endpoint)
  const { data, isLoading } = useGetProductsQuery({ limit: 100 }, { skip: ids.length === 0 });
  const items = (data?.data ?? []).filter((p) => ids.includes(p._id));

  if (ids.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20 sm:py-32 text-center">
        <h1 className="font-display text-4xl sm:text-5xl mb-4">Your wishlist is empty</h1>
        <p className="text-muted-foreground mb-8">Save the bags you love for later.</p>
        <Link
          to="/shop"
          className="inline-block bg-gold-gradient text-onyx px-8 py-4 text-xs tracking-[0.25em] uppercase font-medium"
        >
          Shop Bags
        </Link>
      </div>
    );
  }

  if (isLoading) return <PageSpinner />;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16">
      <h1 className="font-display text-4xl sm:text-5xl mb-8 sm:mb-12">Wishlist</h1>
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
            <div key={p._id} className="flex gap-3 sm:gap-4 border border-border/60 p-3 sm:p-4">
              <img
                src={getImageUrl(p.images[0])}
                alt={p.name}
                className="h-28 w-28 sm:h-32 sm:w-32 shrink-0 object-cover"
              />
              <div className="flex-1 flex flex-col justify-between min-w-0 gap-2">
                <div className="min-w-0">
                  <Link
                    to={`/product/${p.slug}`}
                    className="font-display text-lg sm:text-xl hover:text-gold line-clamp-1"
                  >
                    {p.name}
                  </Link>
                  <div className="text-gold mt-1">{formatPrice(p.discountPrice ?? p.price)}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      dispatch(addToCart({ product: cartProduct }));
                      dispatch(removeFromWishlist(p._id));
                      toast.success("Moved to bag");
                    }}
                    className="flex-1 bg-gold-gradient text-onyx py-2 text-xs tracking-[0.2em] uppercase font-medium inline-flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="h-4 w-4" /> Move to Bag
                  </button>
                  <button
                    onClick={() => dispatch(removeFromWishlist(p._id))}
                    className="p-2 border border-border hover:border-destructive hover:text-destructive"
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
  );
}
