import { Link, useSearchParams, useLocation } from "@/lib/router";
import { CheckCircle, Package, UserPlus, ShoppingBag } from "lucide-react";
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

  const id = params.get("id") ?? "LX-00000";
  const hasOrderData = !!state?.items?.length;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 sm:py-24">
      {/* Header */}
      <div className="text-center mb-10">
        <CheckCircle className="h-16 w-16 text-gold mx-auto mb-6" />
        <h1 className="font-display text-4xl sm:text-5xl mb-3">
          Thank You{state?.name ? `, ${state.name.split(" ")[0]}` : ""}!
        </h1>
        <p className="text-muted-foreground mb-2">Your order has been placed successfully.</p>
        <div className="inline-block border border-gold/40 bg-gold/5 text-gold text-base tracking-[0.2em] px-6 py-2 mt-2">
          Order #{id}
        </div>
      </div>

      {/* Order summary — only shown when navigating from checkout */}
      {hasOrderData && (
        <div className="card-luxe p-5 sm:p-6 mb-8">
          <h2 className="font-display text-xl mb-4">Order Summary</h2>
          <div className="space-y-3 mb-5">
            {state!.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="h-14 w-14 shrink-0 object-cover border border-border/60"
                />
                <div className="flex-1 min-w-0">
                  <div className="truncate">{item.name}</div>
                  <div className="text-xs text-muted-foreground">Qty {item.qty}</div>
                </div>
                <div className="text-gold shrink-0">{formatPrice(item.price)}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-border/60 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(state!.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{state!.shipping === 0 ? "Free" : formatPrice(state!.shipping)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border/60">
              <span className="font-medium">Total</span>
              <span className="text-gold font-display text-lg">{formatPrice(state!.total)}</span>
            </div>
          </div>
          {state?.email && (
            <p className="mt-4 text-xs text-muted-foreground">
              Confirmation sent to <span className="text-foreground">{state.email}</span>
            </p>
          )}
        </div>
      )}

      {/* What's next */}
      <div className="text-center text-sm text-muted-foreground mb-8">
        We'll notify you when your order ships. Keep your order ID handy to track your package.
      </div>

      {/* CTAs — differ for logged-in vs guest */}
      {user ? (
        // Logged-in: they have an account, send them to orders tab
        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
          <Link
            to="/account"
            state={{ tab: "orders" }}
            className="inline-flex items-center gap-2 border border-border hover:border-gold px-6 py-3 text-xs tracking-[0.25em] uppercase transition-colors"
          >
            <Package className="h-4 w-4" />
            View My Orders
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-gold-gradient text-onyx px-6 py-3 text-xs tracking-[0.25em] uppercase font-medium"
          >
            <ShoppingBag className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>
      ) : (
        // Guest: offer account creation to save their order, or just keep shopping
        <div className="space-y-4">
          <div className="card-luxe p-5 text-center">
            <UserPlus className="h-8 w-8 text-gold mx-auto mb-3" />
            <h3 className="font-display text-lg mb-1">Save your order history</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create a free account to track this order, manage returns, and shop faster next time.
            </p>
            <Link
              to="/register"
              state={{ email: state?.email, name: state?.name }}
              className="inline-flex items-center gap-2 bg-gold-gradient text-onyx px-6 py-3 text-xs tracking-[0.25em] uppercase font-medium"
            >
              <UserPlus className="h-4 w-4" />
              Create Account
            </Link>
            <div className="mt-3 text-xs text-muted-foreground">
              Already have one?{" "}
              <Link to="/login" className="text-gold hover:underline">
                Sign in
              </Link>
            </div>
          </div>
          <div className="text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
