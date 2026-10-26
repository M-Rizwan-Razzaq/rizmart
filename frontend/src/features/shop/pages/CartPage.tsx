"use client";

import { Link } from "@/lib/router";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Truck } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  removeFromCart,
  setQty,
  selectCartItems,
  selectCartSubtotal,
} from "@/store/slices/cartSlice";
import { formatPrice, getShippingCost } from "@/lib/constants";
import { getImageUrl } from "@/lib/constants";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const shipping = subtotal > 0 ? getShippingCost(subtotal) : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="bg-secondary min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-card rounded-2xl border border-border p-8 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto mb-4 text-primary">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-primary mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Looking for a school backpack, laptop bag, or travel pack? Browse our latest arrivals.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-6 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
          >
            <span>Explore Bags Collection</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary min-h-screen py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-primary">
            Shopping Cart ({items.reduce((acc, curr) => acc + curr.qty, 0)})
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review your selected bags before proceeding to fast cash-on-delivery checkout.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Cart Item Cards */}
          <div className="space-y-3.5">
            {items.map(({ product, qty }) => (
              <div
                key={product._id}
                className="flex gap-4 bg-card rounded-xl border border-border p-4 sm:p-5 shadow-xs"
              >
                <Link
                  to={`/product/${product.slug}`}
                  className="h-24 w-24 sm:h-28 sm:w-28 rounded-lg bg-secondary border border-border p-2 shrink-0 overflow-hidden flex items-center justify-center"
                >
                  <img
                    src={getImageUrl(product.images[0])}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </Link>

                <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/product/${product.slug}`}
                        className="font-display text-sm sm:text-base font-bold text-primary hover:text-gold transition-colors line-clamp-2"
                      >
                        {product.name}
                      </Link>
                      <button
                        onClick={() => dispatch(removeFromCart(product._id))}
                        className="text-muted-foreground hover:text-red-600 transition-colors p-1"
                        aria-label={`Remove ${product.name} from cart`}
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">
                      {product.material || "Backpack"}{" "}
                      {product.category ? `• ${product.category}` : ""}
                    </div>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-border/60">
                    {/* Qty incrementer */}
                    <div className="flex items-center border border-border rounded-lg bg-secondary">
                      <button
                        onClick={() => dispatch(setQty({ id: product._id, qty: qty - 1 }))}
                        className="p-1.5 text-foreground hover:bg-card rounded-l-lg transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-9 text-center text-xs font-bold text-primary">
                        {qty}
                      </span>
                      <button
                        onClick={() => dispatch(setQty({ id: product._id, qty: qty + 1 }))}
                        disabled={qty >= product.stock}
                        className="p-1.5 text-foreground hover:bg-card rounded-r-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-sm sm:text-base font-bold text-primary">
                        {formatPrice((product.discountPrice ?? product.price) * qty)}
                      </span>
                    </div>
                  </div>
                  {product.stock < 1 && (
                    <p className="text-xs font-medium text-red-600" role="status">
                      This item is currently out of stock. Remove it before checkout.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Card */}
          <aside className="bg-card rounded-xl border border-border p-6 shadow-xs lg:sticky lg:top-24 space-y-6">
            <h2 className="font-display text-xl font-bold text-primary pb-3 border-b border-border">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm text-foreground">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-primary">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-semibold text-emerald-700">
                  {shipping === 0 ? "Free Shipping" : formatPrice(shipping)}
                </span>
              </div>
            </div>

            <div className="border-t border-border pt-4 flex justify-between items-baseline">
              <span className="font-bold text-foreground text-base">Estimated Total</span>
              <span className="text-2xl font-extrabold text-primary">{formatPrice(total)}</span>
            </div>

            <Link
              to="/checkout"
              className="block w-full text-center bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground py-3.5 px-6 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md transition-all"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/shop"
              className="block text-center text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
            >
              Continue Shopping
            </Link>

            {/* Micro Trust Icons */}
            <div className="pt-4 border-t border-border space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-gold shrink-0" />
                <span>Cash on delivery available</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-gold shrink-0" />
                <span>Delivery fee shown before checkout</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
