import { Link, useSearchParams, useLocation } from "@/lib/router";
import { CheckCircle, Package, UserPlus, ShoppingBag, Truck, CheckCircle2 } from "lucide-react";
import { useAppSelector } from "@/store";
import { formatPrice, getImageUrl } from "@/lib/constants";

type OrderItem = { name: string; image: string; price: number; qty: number };

type OrderState = {
  email: string;
  name: string;
  subtotal: number;
  shipping: number;
  total: number;
  items: OrderItem[];
};

export default function OrderSuccessPage() {
  const [params] = useSearchParams();
  const { state } = useLocation() as { state: OrderState | null };
  const user = useAppSelector((s) => s.auth.user);

  const id = params.get("id") ?? "RZ-00000";
  const hasOrderData = !!state?.items?.length;

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-12 sm:py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 bg-white p-8 rounded-2xl border border-[#E6E8EC] shadow-xs">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-600">
            <CheckCircle className="h-9 w-9" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#193B63] mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-sm text-[#627184] mb-4">
            Thank you{state?.name ? ` ${state.name.split(" ")[0]}` : ""}, we have received your bag
            order.
          </p>
          <div className="inline-block border border-[#193B63]/20 bg-[#FAF9F6] text-[#193B63] font-bold text-sm tracking-wider px-5 py-2 rounded-lg">
            Order ID: #{id}
          </div>
        </div>

        {/* Order summary */}
        {hasOrderData && (
          <div className="bg-white p-6 rounded-2xl border border-[#E6E8EC] shadow-xs mb-8 space-y-4">
            <h2 className="font-display text-lg font-bold text-[#193B63] pb-2 border-b border-[#E6E8EC]">
              Ordered Bags
            </h2>
            <div className="space-y-3">
              {state!.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="h-14 w-14 rounded-lg bg-[#FAF9F6] border border-[#E6E8EC] p-1 shrink-0 flex items-center justify-center">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs text-[#193B63] truncate">{item.name}</div>
                    <div className="text-[11px] text-[#627184]">Quantity: {item.qty}</div>
                  </div>
                  <div className="font-bold text-[#193B63] text-sm shrink-0">
                    {formatPrice(item.price)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E6E8EC] pt-4 space-y-2 text-sm text-[#263445]">
              <div className="flex justify-between">
                <span className="text-[#627184]">Subtotal</span>
                <span>{formatPrice(state!.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#627184]">Delivery</span>
                <span className="font-semibold text-emerald-700">
                  {state!.shipping === 0 ? "Free Shipping" : formatPrice(state!.shipping)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E6E8EC] font-bold text-[#193B63] text-base">
                <span>Total Amount Due (COD)</span>
                <span className="text-xl font-extrabold">{formatPrice(state!.total)}</span>
              </div>
            </div>

            {state?.email && (
              <p className="pt-2 text-xs text-[#627184]">
                Order contact email:{" "}
                <span className="font-semibold text-[#193B63]">{state.email}</span>
              </p>
            )}
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 justify-center">
          {user ? (
            <Link
              to="/account"
              state={{ tab: "orders" }}
              className="inline-flex items-center gap-2 border border-[#E6E8EC] bg-white hover:border-[#193B63] text-[#193B63] px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-xs"
            >
              <Package className="h-4 w-4" />
              View My Orders
            </Link>
          ) : (
            <Link
              to="/register"
              state={{ email: state?.email, name: state?.name }}
              className="inline-flex items-center gap-2 border border-[#E6E8EC] bg-white hover:border-[#193B63] text-[#193B63] px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-xs"
            >
              <UserPlus className="h-4 w-4" />
              Create Account to Track
            </Link>
          )}

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#193B63] hover:bg-[#132D4C] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
          >
            <ShoppingBag className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
