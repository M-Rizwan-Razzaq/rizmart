import { useState } from "react";
import { toast } from "sonner";
import { Eye, Plus, Search, Trash2 } from "lucide-react";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  type ApiOrder,
  type OrderStatus,
} from "@/store/services/ordersApi";
import { formatPrice, ORDER_STATUSES, getImageUrl } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageSpinner from "@/components/PageSpinner";
import { ConfirmDialog } from "@/features/admin/components/ConfirmDialog";
import { OrderFormModal } from "@/features/admin/components/OrderFormModal";

export default function OrdersPage() {
  const [filter, setFilter] = useState<"All" | OrderStatus>("All");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<ApiOrder | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOrder, setDeleteOrder] = useState<ApiOrder | null>(null);

  const { data, isLoading } = useGetAllOrdersQuery({
    page,
    limit: 10,
    status: filter !== "All" ? filter : undefined,
    search: q || undefined,
  });

  const [updateStatus] = useUpdateOrderStatusMutation();
  const [deleteOrderMutation, { isLoading: deleting }] = useDeleteOrderMutation();
  const orders = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleDelete = async () => {
    if (!deleteOrder) return;
    try {
      await deleteOrderMutation(deleteOrder._id).unwrap();
      toast.success(`Order ${deleteOrder.orderNumber} deleted`);
      if (detail?._id === deleteOrder._id) setDetail(null);
    } catch {
      toast.error("Failed to delete order");
    }
    setDeleteOrder(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8 flex-wrap">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl mb-1">Orders</h1>
          <p className="text-sm text-muted-foreground">{data?.total ?? 0} total orders</p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="bg-gold-gradient text-onyx px-4 sm:px-5 py-3 text-xs tracking-[0.25em] uppercase font-medium inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Manual Order
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(["All", ...ORDER_STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => {
              setFilter(s);
              setPage(1);
            }}
            className={`px-3 sm:px-4 py-2 text-xs tracking-widest uppercase border transition ${filter === s ? "bg-gold-gradient text-onyx border-transparent" : "border-border text-muted-foreground hover:border-gold"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="card-luxe">
        <div className="p-3 sm:p-4 border-b border-border relative">
          <Search className="absolute left-6 sm:left-7 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search order # or email…"
            className="bg-input border border-border pl-10 pr-4 py-2 text-sm w-full sm:w-80 focus:outline-none focus:border-gold"
          />
        </div>

        {isLoading ? (
          <PageSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[820px]">
              <thead className="text-left text-xs tracking-widest uppercase text-muted-foreground border-b border-border">
                <tr>
                  <th className="p-4">Order</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-b border-border/50 hover:bg-accent/30">
                    <td className="p-4 text-gold whitespace-nowrap">{o.orderNumber}</td>
                    <td className="p-4">
                      <div className="truncate">{o.user?.name ?? "Guest"}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {o.user?.email ?? o.guestEmail}
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">{o.items.length}</td>
                    <td className="p-4 whitespace-nowrap">{formatPrice(o.total)}</td>
                    <td className="p-4">
                      <Select
                        value={o.status}
                        onValueChange={async (v) => {
                          try {
                            await updateStatus({
                              id: o._id,
                              status: v as OrderStatus,
                            }).unwrap();
                            toast.success(`Order ${o.orderNumber} → ${v}`);
                          } catch {
                            toast.error("Failed to update status");
                          }
                        }}
                      >
                        <SelectTrigger className="h-auto rounded-none bg-input px-2 py-1 text-xs focus:border-gold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {ORDER_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => setDetail(o)}
                          className="p-2 hover:text-gold inline-flex items-center gap-2 text-xs uppercase tracking-widest"
                        >
                          <Eye className="h-4 w-4" /> View
                        </button>
                        <button
                          onClick={() => setDeleteOrder(o)}
                          className="p-2 hover:text-destructive inline-flex items-center gap-2 text-xs uppercase tracking-widest"
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No orders match.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border text-xs tracking-widest uppercase text-muted-foreground">
            <div>
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="border border-border px-3 py-1 disabled:opacity-40 hover:border-gold"
              >
                Prev
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="border border-border px-3 py-1 disabled:opacity-40 hover:border-gold"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order detail modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80" onClick={() => setDetail(null)} />
          <div className="relative card-luxe max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="font-display text-2xl mb-1">Order {detail.orderNumber}</h2>
            <div className="text-xs text-muted-foreground mb-6">
              {new Date(detail.createdAt).toLocaleString()}
            </div>
            <div className="space-y-3 mb-6">
              {detail.items.map((item, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <img
                    src={getImageUrl(item.image)}
                    alt=""
                    className="h-14 w-14 shrink-0 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{item.name}</div>
                    <div className="text-xs text-muted-foreground">Qty {item.qty}</div>
                  </div>
                  <div className="text-gold">{formatPrice(item.price * item.qty)}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(detail.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{detail.shipping === 0 ? "Free" : formatPrice(detail.shipping)}</span>
              </div>
              <div className="flex justify-between font-medium pt-1 border-t border-border mt-1">
                <span>Total</span>
                <span className="text-gold">{formatPrice(detail.total)}</span>
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <div>
                <span className="text-foreground">Ship to:</span>{" "}
                {detail.shippingAddress.name ??
                  `${detail.shippingAddress.firstName ?? ""} ${detail.shippingAddress.lastName ?? ""}`.trim()}
                , {detail.shippingAddress.address},{" "}
                {detail.shippingAddress.city}, {detail.shippingAddress.country}
              </div>
              {detail.notes && (
                <div className="mt-1">
                  <span className="text-foreground">Notes:</span> {detail.notes}
                </div>
              )}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => setDetail(null)}
                className="border border-border hover:border-gold py-2 text-xs tracking-widest uppercase"
              >
                Close
              </button>
              <button
                onClick={() => setDeleteOrder(detail)}
                className="border border-destructive/40 text-destructive hover:border-destructive py-2 text-xs tracking-widest uppercase inline-flex items-center justify-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <OrderFormModal open={formOpen} onOpenChange={setFormOpen} />
      <ConfirmDialog
        open={!!deleteOrder}
        onOpenChange={(v) => !v && setDeleteOrder(null)}
        title="Delete this order?"
        description="This will permanently remove the order and restore the item stock."
        confirmLabel={deleting ? "Deleting…" : "Delete"}
        onConfirm={handleDelete}
      />
    </div>
  );
}
