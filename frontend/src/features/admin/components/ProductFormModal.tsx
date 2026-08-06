import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Field, TextInput, Select, TextArea } from "./Field";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  type ApiProduct,
} from "@/store/services/productsApi";
import { useGetCategoriesQuery } from "@/store/services/categoriesApi";
import api from "@/lib/api";
import { getImageUrl } from "@/lib/constants";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product?: ApiProduct | null;
};

type FormState = {
  name: string;
  sku: string;
  price: number;
  discountPrice: number | "";
  category: string;
  gender: ApiProduct["gender"];
  material: ApiProduct["material"];
  style: ApiProduct["style"];
  stock: number;
  description: string;
  tags: string;
  featured: boolean;
  trending: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  isActive: boolean;
};

type SpecificationRow = {
  key: string;
  value: string;
};

function toSpecificationRows(p: ApiProduct | null): SpecificationRow[] {
  const entries =
    p?.specifications && typeof p.specifications === "object"
      ? Object.entries(p.specifications)
      : [];
  return entries.length > 0 ? entries.map(([key, value]) => ({ key, value })) : [];
}

function toForm(p: ApiProduct | null, defaultCategoryId: string): FormState {
  if (!p) {
    return {
      name: "",
      sku: "",
      price: 0,
      discountPrice: "",
      category: defaultCategoryId,
      gender: "unisex",
      material: "gold",
      style: "luxury",
      stock: 0,
      description: "",
      tags: "",
      featured: false,
      trending: false,
      bestSeller: false,
      newArrival: false,
      isActive: true,
    };
  }
  return {
    name: p.name,
    sku: p.sku,
    price: p.price,
    discountPrice: p.discountPrice ?? "",
    category: typeof p.category === "object" ? p.category._id : p.category,
    gender: p.gender,
    material: p.material,
    style: p.style,
    stock: p.stock,
    description: p.description,
    tags: p.tags.join(", "),
    featured: p.featured,
    trending: p.trending,
    bestSeller: p.bestSeller,
    newArrival: p.newArrival,
    isActive: p.isActive,
  };
}

export function ProductFormModal({ open, onOpenChange, product }: Props) {
  const { data: categories = [] } = useGetCategoriesQuery({ all: true });
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();

  const [form, setForm] = useState<FormState>(() =>
    toForm(product ?? null, categories[0]?._id ?? ""),
  );
  const [specifications, setSpecifications] = useState<SpecificationRow[]>(() =>
    toSpecificationRows(product ?? null),
  );
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null); // index being deleted
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLoading = creating || updating || uploading;

  useEffect(() => {
    if (open) {
      setForm(toForm(product ?? null, categories[0]?._id ?? ""));
      setSpecifications(toSpecificationRows(product ?? null));
      setImages(product?.images ?? []);
    }
  }, [open, product, categories]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  // Upload files — each goes to R2 via backend, returns { url, key }
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const { data } = await api.post<{ url: string; key: string }>("/uploads/image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        newUrls.push(data.url); // store the full R2 public URL
      } catch (err: any) {
        toast.error(`Failed to upload "${file.name}": ${err.message}`);
      }
    }

    setImages((prev) => [...prev, ...newUrls]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Delete image from R2 then remove from local list
  const removeImage = async (idx: number) => {
    const url = images[idx];
    setDeleting(idx);
    try {
      await api.delete("/uploads/image", { data: { key: url } });
    } catch {
      // Non-fatal — remove from list even if delete fails (e.g. already deleted)
    }
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setDeleting(null);
  };

  const submit = async () => {
    if (!form.name.trim()) return toast.error("Name is required");
    if (form.price <= 0) return toast.error("Price must be positive");
    if (!form.category) return toast.error("Category is required");
    if (!form.sku.trim()) return toast.error("SKU is required");
    if (!form.description.trim()) return toast.error("Description is required");
    if (specifications.some((row) => row.key.trim() || row.value.trim())) {
      const invalidSpec = specifications.find((row) => {
        const hasKey = row.key.trim().length > 0;
        const hasValue = row.value.trim().length > 0;
        return hasKey !== hasValue;
      });
      if (invalidSpec) {
        return toast.error("Each specification needs both a label and a value");
      }
    }

    const payload = {
      name: form.name,
      sku: form.sku,
      price: form.price,
      discountPrice: form.discountPrice !== "" ? Number(form.discountPrice) : undefined,
      category: form.category,
      gender: form.gender,
      material: form.material,
      style: form.style,
      stock: form.stock,
      description: form.description,
      specifications: specifications.reduce<Record<string, string>>((acc, row) => {
        const key = row.key.trim();
        const value = row.value.trim();
        if (key && value) acc[key] = value;
        return acc;
      }, {}),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      images,
      featured: form.featured,
      trending: form.trending,
      bestSeller: form.bestSeller,
      newArrival: form.newArrival,
      isActive: form.isActive,
    };

    try {
      if (product?._id) {
        await updateProduct({ id: product._id, body: payload }).unwrap();
        toast.success("Product updated");
      } else {
        await createProduct(payload).unwrap();
        toast.success("Product created");
      }
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to save product");
    }
  };

  const updateSpecification = (index: number, field: keyof SpecificationRow, value: string) => {
    setSpecifications((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  };

  const addSpecification = () => {
    setSpecifications((prev) => [...prev, { key: "", value: "" }]);
  };

  const removeSpecification = (index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {product ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4 py-4">
          {/* ── Product Images ───────────────────────────────── */}
          <div className="md:col-span-2">
            <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
              Product Images
              <span className="ml-2 normal-case text-muted-foreground/60">
                (jpg, png, webp — max 5 MB each)
              </span>
            </div>

            {/* Image previews grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-3">
                {images.map((url, i) => (
                  <div
                    key={i}
                    className="relative group aspect-square border border-border/60 overflow-hidden bg-card"
                  >
                    <img
                      src={getImageUrl(url)}
                      alt={`Product image ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {/* Delete button — calls R2 delete then removes from list */}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      disabled={deleting === i}
                      className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition hover:text-destructive disabled:opacity-60"
                      aria-label="Remove image"
                    >
                      {deleting === i ? (
                        <div className="h-3 w-3 rounded-full border border-gold border-t-transparent animate-spin" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                    </button>
                    {i === 0 && (
                      <div className="absolute bottom-0 inset-x-0 bg-gold/80 text-onyx text-[9px] tracking-widest uppercase text-center py-0.5">
                        Main
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload button */}
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 border border-border border-dashed hover:border-gold px-4 py-3 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-gold transition disabled:opacity-50 w-full justify-center"
            >
              {uploading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-gold border-t-transparent animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  {images.length === 0 ? "Upload Images" : "Add More Images"}
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />

            {images.length === 0 && (
              <p className="text-[11px] text-muted-foreground mt-2">
                <ImageIcon className="inline h-3 w-3 mr-1" />
                No images yet. You can save the product and add images later.
              </p>
            )}
          </div>

          {/* ── Basic info ───────────────────────────────────── */}
          <Field label="Name">
            <TextInput value={form.name} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <Field label="SKU">
            <TextInput value={form.sku} onChange={(e) => set("sku", e.target.value)} />
          </Field>

          <Field label="Price (PKR)">
            <TextInput
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => set("price", Number(e.target.value))}
            />
          </Field>
          <Field label="Discount Price">
            <TextInput
              type="number"
              min={0}
              value={form.discountPrice}
              placeholder="Optional"
              onChange={(e) => set("discountPrice", e.target.value ? Number(e.target.value) : "")}
            />
          </Field>

          <Field label="Category">
            <Select value={form.category} onChange={(e) => set("category", e.target.value)}>
              <option value="">Select category…</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Stock">
            <TextInput
              type="number"
              min={0}
              value={form.stock}
              onChange={(e) => set("stock", Number(e.target.value))}
            />
          </Field>

          <Field label="Gender">
            <Select
              value={form.gender}
              onChange={(e) => set("gender", e.target.value as ApiProduct["gender"])}
            >
              {["men", "women", "unisex"].map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Material">
            <Select
              value={form.material}
              onChange={(e) => set("material", e.target.value as ApiProduct["material"])}
            >
              {["gold", "silver", "rose-gold", "black"].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Style">
            <Select
              value={form.style}
              onChange={(e) => set("style", e.target.value as ApiProduct["style"])}
            >
              {["luxury", "minimal", "vintage", "goth", "casual"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Tags (comma-separated)">
            <TextInput
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              placeholder="gold, ring, engagement"
            />
          </Field>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                  Specifications
                </div>
                <p className="text-xs text-muted-foreground">
                  Add custom key/value details like metal type, stone, or size.
                </p>
              </div>
              <button
                type="button"
                onClick={addSpecification}
                className="border border-border px-3 py-2 text-[10px] tracking-[0.2em] uppercase hover:border-gold"
              >
                Add Specification
              </button>
            </div>

            <div className="grid gap-3">
              {specifications.length === 0 && (
                <div className="text-sm text-muted-foreground border border-dashed border-border px-4 py-4">
                  No specifications added yet.
                </div>
              )}

              {specifications.map((row, index) => (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
                  <TextInput
                    value={row.key}
                    onChange={(e) => updateSpecification(index, "key", e.target.value)}
                    placeholder="Label"
                  />
                  <TextInput
                    value={row.value}
                    onChange={(e) => updateSpecification(index, "value", e.target.value)}
                    placeholder="Value"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecification(index)}
                    className="border border-border px-3 py-2 text-xs tracking-[0.2em] uppercase hover:border-gold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <Field label="Description">
              <TextArea
                rows={4}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </Field>
          </div>

          {/* ── Flags ────────────────────────────────────────── */}
          <div className="md:col-span-2 flex gap-4 flex-wrap text-xs tracking-widest uppercase text-muted-foreground">
            {(["featured", "trending", "bestSeller", "newArrival"] as const).map((k) => (
              <label key={k} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!form[k]}
                  onChange={(e) => set(k, e.target.checked)}
                  className="accent-gold"
                />
                {k}
              </label>
            ))}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => set("isActive", e.target.checked)}
                className="accent-gold"
              />
              Active
            </label>
          </div>
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-5 py-3 text-xs tracking-[0.25em] uppercase border border-border hover:border-gold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={isLoading}
            className="bg-gold-gradient text-onyx px-5 py-3 text-xs tracking-[0.25em] uppercase font-medium disabled:opacity-50"
          >
            {isLoading ? "Saving…" : product ? "Save Changes" : "Create Product"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
