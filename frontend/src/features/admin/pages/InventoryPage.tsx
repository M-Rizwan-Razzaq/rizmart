import { useState, useMemo } from "react";
import { toast } from "sonner";
import { AlertTriangle, Save } from "lucide-react";
import { useGetProductsQuery, useUpdateProductMutation } from "@/store/services/productsApi";
import { getImageUrl } from "@/lib/constants";
import PageSpinner from "@/components/PageSpinner";

type FilterMode = "all" | "low" | "out";

export default function InventoryPage() {
  const { data, isLoading } = useGetProductsQuery({ limit: 100 });
  const [updateProduct] = useUpdateProductMutation();

  const products = data?.data ?? [];
  const [drafts, setDrafts] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState<FilterMode>("all");
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        if (filter === "low") return p.stock > 0 && p.stock <= 10;
        if (filter === "out") return p.stock === 0;
        return true;
      }),
    [products, filter],
  );

  const dirtyIds = Object.keys(drafts).filter(
    (id) => drafts[id] !== products.find((p) => p._id === id)?.stock,
  );

  const saveAll = async () => {
    if (dirtyIds.length === 0) return;
    setSaving(true);
    let successCount = 0;
    for (const id of dirtyIds) {
      try {
        await updateProduct({ id, body: { stock: drafts[id] } }).unwrap();
        successCount++;
      } catch {
        toast.error(`Failed to update stock for product`);
      }
    }
    if (successCount > 0) {
      toast.success(`Updated stock for ${successCount} product${successCount === 1 ? "" : "s"}`);
    }
    setDrafts({});
    setSaving(false);
  };

  if (isLoading) return <PageSpinner />;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl">Inventory</h1>
          <p className="text-sm text-muted-foreground">Manage stock levels across all products.</p>
        </div>
        {dirtyIds.length > 0 && (
          <button
            onClick={saveAll}
            disabled={saving}
            className="bg-gold-gradient text-onyx px-4 sm:px-5 py-3 text-xs tracking-[0.25em] uppercase font-medium inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving
              ? "Saving…"
              : `Save ${dirtyIds.length} change${dirtyIds.length === 1 ? "" : "s"}`}
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(
          [
            ["all", "All"],
            ["low", "Low Stock"],
            ["out", "Out of Stock"],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`px-3 sm:px-4 py-2 text-xs tracking-widest uppercase border transition ${
              filter === k
                ? "bg-gold-gradient text-onyx border-transparent"
                : "border-border text-muted-foreground hover:border-gold"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="card-luxe overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="text-left text-xs tracking-widest uppercase text-muted-foreground border-b border-border">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Current Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4">Update</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const stockStatus =
                p.stock === 0
                  ? { label: "Out of Stock", cls: "text-red-400 border-red-400/40" }
                  : p.stock <= 10
                    ? { label: "Low", cls: "text-yellow-400 border-yellow-400/40" }
                    : { label: "In Stock", cls: "text-green-400 border-green-400/40" };

              const draftValue = drafts[p._id] ?? p.stock;
              const isDirty = drafts[p._id] !== undefined && drafts[p._id] !== p.stock;

              return (
                <tr key={p._id} className="border-b border-border/50 hover:bg-accent/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] ? (
                        <img
                          src={getImageUrl(p.images[0])}
                          alt=""
                          className="h-10 w-10 shrink-0 object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-accent/50 text-xs text-muted-foreground">
                          No img
                        </div>
                      )}
                      <span className="truncate">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground whitespace-nowrap">{p.sku}</td>
                  <td className="p-4 font-display text-lg">{p.stock}</td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] tracking-widest uppercase border px-2 py-1 inline-flex items-center gap-1 whitespace-nowrap ${stockStatus.cls}`}
                    >
                      {p.stock <= 10 && <AlertTriangle className="h-3 w-3" />}
                      {stockStatus.label}
                    </span>
                  </td>
                  <td className="p-4">
                    <input
                      type="number"
                      min={0}
                      value={draftValue}
                      onChange={(e) =>
                        setDrafts((d) => ({ ...d, [p._id]: Math.max(0, Number(e.target.value)) }))
                      }
                      className={`w-24 bg-input border px-2 py-1 text-sm focus:outline-none focus:border-gold ${
                        isDirty ? "border-gold" : "border-border"
                      }`}
                    />
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  No products match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
