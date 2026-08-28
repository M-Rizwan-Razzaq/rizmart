"use client";

import { Link } from "@/lib/router";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  removeFromCart,
  setQty,
  selectCartItems,
  selectCartSubtotal,
} from "@/store/slices/cartSlice";
import { formatPrice } from "@/lib/constants";
import { getImageUrl } from "@/lib/constants";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const shipping = subtotal > 0 ? (subtotal > 500 ? 0 : 25) : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20 sm:py-32 text-center">
        <h1 className="font-display text-4xl sm:text-5xl mb-4">Your bag is empty</h1>
        <p className="text-muted-foreground mb-8">
          Explore the collection and find your next carry-all.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-3 bg-gold-gradient text-onyx px-8 py-4 text-xs tracking-[0.25em] uppercase font-medium"
        >
          Shop Bags <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16">
      <h1 className="font-display text-4xl sm:text-5xl mb-8 sm:mb-12">Shopping Bag</h1>
      <div className="grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">
        <div className="space-y-4">
          {items.map(({ product, qty }) => (
            <div
              key={product._id}
              className="flex gap-3 sm:gap-4 border border-border/60 p-3 sm:p-4"
            >
              <Link
                to={`/product/${product.slug}`}
                className="h-24 w-24 sm:h-32 sm:w-32 shrink-0 overflow-hidden"
              >
                <img
                  src={getImageUrl(product.images[0])}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                <div className="min-w-0">
                  <Link
                    to={`/product/${product.slug}`}
                    className="font-display text-lg sm:text-xl hover:text-gold line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider truncate">
                    {product.material} · {product.category}
                  </div>
                </div>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center border border-border">
                    <button
                      onClick={() => dispatch(setQty({ id: product._id, qty: qty - 1 }))}
                      className="p-2"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-10 text-center text-sm">{qty}</span>
                    <button
                      onClick={() => dispatch(setQty({ id: product._id, qty: qty + 1 }))}
                      className="p-2"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="text-gold font-medium">
                      {formatPrice((product.discountPrice ?? product.price) * qty)}
                    </span>
                    <button
                      onClick={() => dispatch(removeFromCart(product._id))}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="card-luxe p-6 sm:p-8 h-fit lg:sticky lg:top-32">
          <h2 className="font-display text-2xl mb-6">Order Summary</h2>
          <div className="space-y-3 text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
          </div>
          <div className="border-t border-border pt-4 flex justify-between text-lg mb-6">
            <span>Total</span>
            <span className="text-gold font-display text-2xl">{formatPrice(total)}</span>
          </div>
          <Link
            to="/checkout"
            className="block text-center bg-gold-gradient text-onyx py-4 text-xs tracking-[0.25em] uppercase font-medium"
          >
            Proceed to Checkout
          </Link>
          <Link
            to="/shop"
            className="block text-center mt-3 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-gold"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
