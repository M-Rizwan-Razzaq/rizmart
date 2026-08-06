import { useState } from "react";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  type ApiProduct,
} from "@/store/services/productsApi";
import { ConfirmDialog } from "@/features/admin/components/ConfirmDialog";
import { ProductFormModal } from "@/features/admin/components/ProductFormModal";
import { formatPrice } from "@/lib/constants";
import { getImageUrl } from "@/lib/constants";
import PageSpinner from "@/components/PageSpinner";

export default function ProductsPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<ApiProduct | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useGetProductsQuery({
    page,
    limit: 10,
    search: q || undefined,
    includeInactive: true,
  });
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();

  const products = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProduct(deleteId).unwrap();
      toast.success("Product removed");
    } catch {
      toast.error("Failed to delete");
    }
    setDeleteId(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl">Products</h1>
          <p className="text-sm text-muted-foreground">{data?.total ?? 0} pieces in catalog</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="bg-gold-gradient text-onyx px-4 sm:px-5 py-3 text-xs tracking-[0.25em] uppercase font-medium inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
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
            placeholder="Search…"
            className="bg-input border border-border pl-10 pr-4 py-2 text-sm w-full sm:w-80 focus:outline-none focus:border-gold"
          />
        </div>
        {isLoading ? (
          <PageSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead className="text-left text-xs tracking-widest uppercase text-muted-foreground border-b border-border">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b border-border/50 hover:bg-accent/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {p.images?.[0] ? (
                          <img
                            src={getImageUrl(p.images[0])}
                            alt=""
                            className="h-12 w-12 shrink-0 object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-accent/50 text-xs text-muted-foreground">
                            No img
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="truncate">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.material}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground whitespace-nowrap">{p.sku}</td>
                    <td className="p-4 capitalize">
                      {typeof p.category === "object" ? p.category.name : p.category}
                    </td>
                    <td className="p-4 text-gold whitespace-nowrap">
                      {formatPrice(p.discountPrice ?? p.price)}
                    </td>
                    <td className="p-4">
                      <span className={p.stock <= 10 ? "text-yellow-400" : ""}>{p.stock}</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] tracking-widest uppercase border px-2 py-1 whitespace-nowrap ${p.isActive ? "text-green-400 border-green-400/40" : "text-red-400 border-red-400/40"}`}
                      >
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => {
                            setEditing(p);
                            setFormOpen(true);
                          }}
                          className="p-2 hover:text-gold"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(p._id)}
                          className="p-2 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No products found.
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

      <ProductFormModal open={formOpen} onOpenChange={setFormOpen} product={editing} />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Delete this product?"
        description="It will be removed from the catalog immediately."
        onConfirm={handleDelete}
      />
    </div>
  );
}
