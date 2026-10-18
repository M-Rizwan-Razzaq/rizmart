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
      <div className="bg-[#FAF9F6] min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#E6E8EC] p-8 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF9F6] border border-[#E6E8EC] flex items-center justify-center mx-auto mb-4 text-[#193B63]">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#193B63] mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-sm text-[#627184] mb-6">
            Looking for a school backpack, laptop bag, or travel pack? Browse our latest arrivals.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 w-full bg-[#193B63] hover:bg-[#132D4C] text-white py-3 px-6 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
          >
            <span>Explore Bags Collection</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#193B63]">
            Shopping Cart ({items.reduce((acc, curr) => acc + curr.qty, 0)})
          </h1>
          <p className="text-sm text-[#627184] mt-1">
            Review your selected bags before proceeding to fast cash-on-delivery checkout.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Cart Item Cards */}
          <div className="space-y-3.5">
            {items.map(({ product, qty }) => (
              <div
                key={product._id}
                className="flex gap-4 bg-white rounded-xl border border-[#E6E8EC] p-4 sm:p-5 shadow-xs"
              >
                <Link
                  to={`/product/${product.slug}`}
                  className="h-24 w-24 sm:h-28 sm:w-28 rounded-lg bg-[#FAF9F6] border border-[#E6E8EC] p-2 shrink-0 overflow-hidden flex items-center justify-center"
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
                        className="font-display text-sm sm:text-base font-bold text-[#193B63] hover:text-[#E3A34D] transition-colors line-clamp-2"
                      >
                        {product.name}
                      </Link>
                      <button
                        onClick={() => dispatch(removeFromCart(product._id))}
                        className="text-[#8C9BAA] hover:text-red-600 transition-colors p-1"
                        aria-label={`Remove ${product.name} from cart`}
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-xs text-[#627184] mt-0.5 uppercase tracking-wide">
                      {product.material || "Backpack"}{" "}
                      {product.category ? `• ${product.category}` : ""}
                    </div>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-[#E6E8EC]/60">
                    {/* Qty incrementer */}
                    <div className="flex items-center border border-[#E6E8EC] rounded-lg bg-[#FAF9F6]">
                      <button
                        onClick={() => dispatch(setQty({ id: product._id, qty: qty - 1 }))}
                        className="p-1.5 text-[#263445] hover:bg-white rounded-l-lg transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-9 text-center text-xs font-bold text-[#193B63]">
                        {qty}
                      </span>
                      <button
                        onClick={() => dispatch(setQty({ id: product._id, qty: qty + 1 }))}
                        disabled={qty >= product.stock}
                        className="p-1.5 text-[#263445] hover:bg-white rounded-r-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-sm sm:text-base font-bold text-[#193B63]">
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
          <aside className="bg-white rounded-xl border border-[#E6E8EC] p-6 shadow-xs lg:sticky lg:top-24 space-y-6">
            <h2 className="font-display text-xl font-bold text-[#193B63] pb-3 border-b border-[#E6E8EC]">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm text-[#263445]">
              <div className="flex justify-between">
                <span className="text-[#627184]">Subtotal</span>
                <span className="font-semibold text-[#193B63]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#627184]">Shipping</span>
                <span className="font-semibold text-emerald-700">
                  {shipping === 0 ? "Free Shipping" : formatPrice(shipping)}
                </span>
              </div>
            </div>

            <div className="border-t border-[#E6E8EC] pt-4 flex justify-between items-baseline">
              <span className="font-bold text-[#263445] text-base">Estimated Total</span>
              <span className="text-2xl font-extrabold text-[#193B63]">{formatPrice(total)}</span>
            </div>

            <Link
              to="/checkout"
              className="block w-full text-center bg-[#193B63] hover:bg-[#132D4C] active:bg-[#0E223B] text-white py-3.5 px-6 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md transition-all"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/shop"
              className="block text-center text-xs font-bold uppercase tracking-wider text-[#627184] hover:text-[#193B63] transition-colors"
            >
              Continue Shopping
            </Link>

            {/* Micro Trust Icons */}
            <div className="pt-4 border-t border-[#E6E8EC] space-y-2 text-xs text-[#627184]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#E3A34D] shrink-0" />
                <span>Cash on delivery available</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-[#E3A34D] shrink-0" />
                <span>Delivery fee shown before checkout</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
