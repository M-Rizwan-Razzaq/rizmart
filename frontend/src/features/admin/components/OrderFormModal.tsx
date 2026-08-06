import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Field, TextInput, Select, TextArea } from "./Field";
import { useCreateAdminOrderMutation, type CreateOrderPayload } from "@/store/services/ordersApi";
import { useGetProductsQuery } from "@/store/services/productsApi";
import { formatPrice } from "@/lib/constants";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

type ItemRow = { productId: string; qty: number };

type FormState = {
  guestEmail: string;
  phone: string;
  notes: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

const blankForm = (): FormState => ({
  guestEmail: "",
  phone: "",
  notes: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
});

export function OrderFormModal({ open, onOpenChange }: Props) {
  const { data: productsData } = useGetProductsQuery({ page: 1, limit: 100 });
  const [createAdminOrder, { isLoading }] = useCreateAdminOrderMutation();

  const products = productsData?.data ?? [];
  const defaultProductId = productsData?.data?.[0]?._id ?? "";

  const [form, setForm] = useState<FormState>(blankForm());
  const [items, setItems] = useState<ItemRow[]>([{ productId: "", qty: 1 }]);

  useEffect(() => {
    if (open) {
      setForm(blankForm());
      setItems([{ productId: defaultProductId, qty: 1 }]);
    }
  }, [open, defaultProductId]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addItem = () => {
    setItems((prev) => [...prev, { productId: "", qty: 1 }]);
  };

  const updateItem = (index: number, patch: Partial<ItemRow>) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const itemPreview = useMemo(() => {
    return items
      .map((row) => {
        const product = products.find((p) => p._id === row.productId);
        if (!product) return null;
        const price = product.discountPrice ?? product.price;
        return {
          name: product.name,
          qty: row.qty,
          total: price * row.qty,
        };
      })
      .filter(Boolean) as Array<{ name: string; qty: number; total: number }>;
  }, [items, products]);

  const estimatedTotal = itemPreview.reduce((sum, item) => sum + item.total, 0);

  const submit = async () => {
    if (!form.guestEmail.trim()) return toast.error("Customer email is required");
    if (!form.phone.trim()) return toast.error("Phone number is required");
    if (!form.firstName.trim()) return toast.error("First name is required");
    if (!form.lastName.trim()) return toast.error("Last name is required");
    if (!form.address.trim()) return toast.error("Address is required");
    if (!form.city.trim()) return toast.error("City is required");
    if (!form.country.trim()) return toast.error("Country is required");

    const normalizedItems = items
      .filter((item) => item.productId && item.qty > 0)
      .reduce((acc: ItemRow[], item) => {
        const existing = acc.find((x) => x.productId === item.productId);
        if (existing) {
          existing.qty += item.qty;
        } else {
          acc.push({ ...item });
        }
        return acc;
      }, []);

    if (normalizedItems.length === 0) {
      return toast.error("Add at least one product");
    }

    const payload: CreateOrderPayload = {
      guestEmail: form.guestEmail.trim(),
      phone: form.phone.trim(),
      notes: form.notes.trim() || undefined,
      shippingAddress: {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        zip: form.zip.trim(),
        country: form.country.trim(),
      },
      items: normalizedItems.map((item) => ({
        productId: item.productId,
        qty: item.qty,
      })),
    };

    try {
      await createAdminOrder(payload).unwrap();
      toast.success("Manual order created");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to create manual order");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Create Manual Order</DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-5 py-4">
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Customer Email">
                <TextInput
                  value={form.guestEmail}
                  onChange={(e) => set("guestEmail", e.target.value)}
                  placeholder="customer@example.com"
                />
              </Field>
              <Field label="Phone">
                <TextInput
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+1 555 123 4567"
                />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="First Name">
                <TextInput
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                />
              </Field>
              <Field label="Last Name">
                <TextInput
                  value={form.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                />
              </Field>
            </div>

            <Field label="Address">
              <TextInput value={form.address} onChange={(e) => set("address", e.target.value)} />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="City">
                <TextInput value={form.city} onChange={(e) => set("city", e.target.value)} />
              </Field>
              <Field label="State">
                <TextInput value={form.state} onChange={(e) => set("state", e.target.value)} />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="ZIP">
                <TextInput value={form.zip} onChange={(e) => set("zip", e.target.value)} />
              </Field>
              <Field label="Country">
                <TextInput value={form.country} onChange={(e) => set("country", e.target.value)} />
              </Field>
            </div>

            <Field label="Notes">
              <TextArea
                rows={4}
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Optional order notes"
              />
            </Field>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                  Order Items
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Choose products and quantities for the manual order.
                </div>
              </div>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-2 border border-border hover:border-gold px-3 py-2 text-xs tracking-[0.2em] uppercase"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-border/80 p-4 bg-background/40 space-y-3"
                >
                  <div className="grid grid-cols-[1fr_92px_auto] gap-3 items-end">
                    <Field label={`Product ${index + 1}`}>
                      <Select
                        value={item.productId}
                        onChange={(e) => updateItem(index, { productId: e.target.value })}
                      >
                        <option value="">Select product</option>
                        {products.map((product) => (
                          <option key={product._id} value={product._id}>
                            {product.name}{" "}
                            {product.stock <= 0
                              ? "(Out of stock)"
                              : `(${formatPrice(product.discountPrice ?? product.price)})`}
                          </option>
                        ))}
                      </Select>
                    </Field>
                    <Field label="Qty">
                      <TextInput
                        type="number"
                        min={1}
                        value={item.qty}
                        onChange={(e) => updateItem(index, { qty: Number(e.target.value) || 1 })}
                      />
                    </Field>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                      className="inline-flex items-center justify-center h-10 px-3 border border-border hover:border-gold disabled:opacity-40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-border/80 bg-gradient-to-br from-background to-accent/10 p-4 space-y-2">
              <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                Estimated Total
              </div>
              <div className="font-display text-3xl text-gold">{formatPrice(estimatedTotal)}</div>
              <div className="text-xs text-muted-foreground">
                Final total will be calculated from current product prices and shipping rules on
                submit.
              </div>
              <div className="text-xs text-muted-foreground pt-2">
                {itemPreview.length > 0 ? (
                  <ul className="space-y-1">
                    {itemPreview.map((item, index) => (
                      <li
                        key={`${item.name}-${index}`}
                        className="flex items-center justify-between gap-3"
                      >
                        <span className="truncate">
                          {item.name} x{item.qty}
                        </span>
                        <span className="shrink-0">{formatPrice(item.total)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span>Add a product to see a preview.</span>
                )}
              </div>
            </div>
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
            {isLoading ? "Creating…" : "Create Order"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
