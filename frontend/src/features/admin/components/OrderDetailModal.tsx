import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, Circle, Printer } from "lucide-react";
import { formatPrice, ORDER_STATUSES, getImageUrl } from "@/lib/constants";
import type { ApiOrder } from "@/store/services/ordersApi";

const TIMELINE = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered"] as const;

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  order: ApiOrder | null;
};

export function OrderDetailModal({ open, onOpenChange, order }: Props) {
  if (!order) return null;

  const currentIdx = TIMELINE.indexOf(order.status as (typeof TIMELINE)[number]);
  const isCancelled = order.status === "Cancelled" || order.status === "Returned";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Order {order.orderNumber}</DialogTitle>
        </DialogHeader>

        {/* Summary */}
        <div className="grid md:grid-cols-2 gap-6 py-4">
          <div>
            <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
              Customer
            </div>
            <div className="mt-1">{order.user?.name ?? "Guest"}</div>
            <div className="text-xs text-muted-foreground">
              {order.user?.email ?? order.guestEmail}
            </div>
          </div>
          <div>
            <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Date</div>
            <div className="mt-1">{new Date(order.createdAt).toLocaleDateString()}</div>
          </div>
          <div>
            <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
              Ship To
            </div>
            <div className="mt-1 text-sm">
              {order.shippingAddress.name ??
                `${order.shippingAddress.firstName ?? ""} ${order.shippingAddress.lastName ?? ""}`.trim()}
              <br />
              {order.shippingAddress.address}, {order.shippingAddress.city}
              <br />
              {order.shippingAddress.country} {order.shippingAddress.zip}
            </div>
          </div>
          <div>
            <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
              Total
            </div>
            <div className="mt-1 text-gold font-display text-xl">{formatPrice(order.total)}</div>
            <div className="text-xs text-muted-foreground">
              Subtotal {formatPrice(order.subtotal)} +{" "}
              {order.shipping === 0 ? "Free shipping" : formatPrice(order.shipping)}
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="border-t border-border pt-4">
          <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
            Items
          </div>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-3 text-sm items-center">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="h-12 w-12 shrink-0 object-cover border border-border/60"
                />
                <div className="flex-1 min-w-0">
                  <div className="truncate">{item.name}</div>
                  <div className="text-xs text-muted-foreground">Qty {item.qty}</div>
                </div>
                <div className="text-gold shrink-0">{formatPrice(item.price * item.qty)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="border-t border-border pt-4">
          <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Timeline
          </div>
          {isCancelled ? (
            <div className="text-sm text-destructive">Order {order.status.toLowerCase()}.</div>
          ) : (
            <ol className="space-y-3">
              {TIMELINE.map((step, i) => {
                const done = i <= currentIdx;
                return (
                  <li key={step} className="flex items-center gap-3 text-sm">
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 text-gold" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={done ? "" : "text-muted-foreground"}>{step}</span>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 border border-border hover:border-gold px-5 py-3 text-xs tracking-[0.25em] uppercase"
          >
            <Printer className="h-4 w-4" /> Print Invoice
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
