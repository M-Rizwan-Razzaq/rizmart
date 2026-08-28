import { useState } from "react";
import { toast } from "sonner";
import { Plus, Edit2, Trash2 } from "lucide-react";
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
  type ApiCategory,
} from "@/store/services/categoriesApi";
import { CategoryFormModal } from "@/features/admin/components/CategoryFormModal";
import { ConfirmDialog } from "@/features/admin/components/ConfirmDialog";
import PageSpinner from "@/components/PageSpinner";

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useGetCategoriesQuery({ all: true });
  const [deleteCategory, { isLoading: deleting }] = useDeleteCategoryMutation();

  const [editing, setEditing] = useState<ApiCategory | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCategory(deleteId).unwrap();
      toast.success("Category deleted");
    } catch {
      toast.error("Failed to delete category");
    }
    setDeleteId(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-3">
        <h1 className="font-display text-2xl sm:text-3xl">Categories</h1>
        <button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="bg-gold-gradient text-onyx px-4 sm:px-5 py-3 text-xs tracking-[0.25em] uppercase font-medium inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="card-luxe overflow-x-auto">
        {isLoading ? (
          <PageSpinner />
        ) : (
          <table className="w-full text-sm min-w-[560px]">
            <thead className="text-left text-xs tracking-widest uppercase text-muted-foreground border-b border-border">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Audience</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id} className="border-b border-border/50 hover:bg-accent/30">
                  <td className="p-4 font-display text-lg">{c.name}</td>
                  <td className="p-4 text-muted-foreground">/{c.slug}</td>
                  <td className="p-4 capitalize">{c.gender}</td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] tracking-widest uppercase border px-2 py-1 ${c.isActive ? "text-green-400 border-green-400/40" : "text-red-400 border-red-400/40"}`}
                    >
                      {c.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex gap-1">
                      <button
                        onClick={() => {
                          setEditing(c);
                          setFormOpen(true);
                        }}
                        className="p-2 hover:text-gold"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(c._id)}
                        className="p-2 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <CategoryFormModal open={formOpen} onOpenChange={setFormOpen} category={editing} />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Delete this category?"
        description="Products in this category will remain but become uncategorized."
        onConfirm={handleDelete}
      />
    </div>
  );
}
