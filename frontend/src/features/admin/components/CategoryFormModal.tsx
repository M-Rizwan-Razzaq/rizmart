import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Field, TextInput, Select } from "./Field";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  type ApiCategory,
} from "@/store/services/categoriesApi";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  category?: ApiCategory | null;
};

const blank = (): Partial<ApiCategory> => ({ name: "", gender: "unisex", isActive: true });

export function CategoryFormModal({ open, onOpenChange, category }: Props) {
  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();
  const isLoading = creating || updating;

  const [form, setForm] = useState<Partial<ApiCategory>>(blank());

  useEffect(() => {
    if (open)
      setForm(
        category
          ? { name: category.name, gender: category.gender, isActive: category.isActive }
          : blank(),
      );
  }, [open, category]);

  const set = <K extends keyof ApiCategory>(k: K, v: ApiCategory[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name?.trim()) return toast.error("Name is required");

    try {
      // Never send _id or slug — backend generates slug from name
      const { _id, slug, ...payload } = form as any;
      if (category?._id) {
        await updateCategory({ id: category._id, body: payload }).unwrap();
        toast.success("Category updated");
      } else {
        await createCategory(payload).unwrap();
        toast.success("Category created");
      }
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to save category");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {category ? "Edit Category" : "Add Category"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Field label="Name">
            <TextInput value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <Field label="Gender">
            <Select
              value={form.gender ?? "unisex"}
              onChange={(e) => set("gender", e.target.value as ApiCategory["gender"])}
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="unisex">Unisex</option>
            </Select>
          </Field>
          <Field label="Status">
            <Select
              value={form.isActive ? "active" : "hidden"}
              onChange={(e) => set("isActive", e.target.value === "active")}
            >
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
            </Select>
          </Field>
        </div>
        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="px-5 py-3 text-xs tracking-[0.25em] uppercase border border-border hover:border-gold"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={isLoading}
            className="bg-gold-gradient text-onyx px-5 py-3 text-xs tracking-[0.25em] uppercase font-medium disabled:opacity-50"
          >
            {isLoading ? "Saving…" : "Save"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
