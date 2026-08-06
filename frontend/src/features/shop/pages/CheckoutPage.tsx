import { useNavigate } from "@/lib/router";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearCart, selectCartItems, selectCartSubtotal } from "@/store/slices/cartSlice";
import { useCreateOrderMutation } from "@/store/services/ordersApi";
import { formatPrice } from "@/lib/constants";
import { getImageUrl } from "@/lib/constants";
import { PAKISTAN_CITIES } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Form = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  notes?: string;
};

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const shipping = subtotal > 500 ? 0 : 25;
  const total = subtotal + shipping;

  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Form>({
    defaultValues: { email: user?.email ?? "", country: "Pakistan" },
  });

  const onSubmit = async (data: Form) => {
    try {
      const order = await createOrder({
        items: items.map(({ product, qty }) => ({ productId: product._id, qty })),
        shippingAddress: {
          name: data.name,
          address: data.address,
          city: data.city,
          zip: data.zip,
          country: data.country,
        },
        phone: data.phone,
        guestEmail: !user ? data.email : undefined,
        notes: data.notes,
      }).unwrap();

      const snapshot = items.map(({ product, qty }) => ({
        name: product.name,
        image: product.images[0],
        price: (product.discountPrice ?? product.price) * qty,
        qty,
      }));

      dispatch(clearCart());
      toast.success("Order placed successfully");
      nav(`/order-success?id=${order.orderNumber}`, {
        state: {
          email: data.email,
          name: data.name,
          subtotal,
          shipping,
          total,
          items: snapshot,
        },
      });
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to place order");
    }
  };

  if (items.length === 0 && !isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20 sm:py-32 text-center">
        <h1 className="font-display text-3xl mb-4">Your bag is empty</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16">
      <h1 className="font-display text-4xl sm:text-5xl mb-8 sm:mb-12">Checkout</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12"
      >
        <div className="space-y-10">
          <section>
            <h2 className="font-display text-2xl mb-6">Contact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Email"
                {...register("email", { required: true })}
                error={errors.email}
              />
              <Field
                label="Phone"
                {...register("phone", { required: true })}
                error={errors.phone}
              />
            </div>
          </section>
          <section>
            <h2 className="font-display text-2xl mb-6">Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                className="sm:col-span-2"
                label="Name"
                {...register("name", { required: true })}
                error={errors.name}
              />
              <Field
                className="sm:col-span-2"
                label="Address"
                {...register("address", { required: true })}
                error={errors.address}
              />
              <Controller
                name="city"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <div>
                    <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                      City
                    </span>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={`mt-1 h-auto w-full rounded-none bg-input px-3 py-2 text-sm ${errors.city ? "border-destructive" : "border-border"} focus:border-gold`}
                      >
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {PAKISTAN_CITIES.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              <Field label="ZIP" {...register("zip", { required: true })} error={errors.zip} />
              <input type="hidden" {...register("country")} />
              <Field label="Country" value="Pakistan" disabled />
            </div>
          </section>
          <section>
            <h2 className="font-display text-2xl mb-6">Payment</h2>
            <label className="flex items-center gap-3 border border-gold p-5 bg-gold/5 cursor-pointer">
              <input type="radio" defaultChecked className="accent-gold" />
              <div>
                <div className="text-sm">Cash on Delivery</div>
                <div className="text-xs text-muted-foreground">
                  Pay in cash when your order arrives.
                </div>
              </div>
            </label>
            <label className="mt-2 flex items-center gap-3 border border-border p-5 opacity-50">
              <input type="radio" disabled />
              <div className="text-sm">
                Credit Card <span className="text-xs text-gold">(Coming Soon)</span>
              </div>
            </label>
          </section>
          <section>
            <h2 className="font-display text-2xl mb-6">Order Notes</h2>
            <textarea
              {...register("notes")}
              rows={3}
              className="w-full bg-input border border-border px-3 py-2 text-sm focus:outline-none focus:border-gold"
            />
          </section>
        </div>

        <aside className="card-luxe p-6 sm:p-8 h-fit lg:sticky lg:top-32">
          <h2 className="font-display text-2xl mb-6">Your Order</h2>
          <div className="space-y-3 mb-6 max-h-64 overflow-auto">
            {items.map(({ product, qty }) => (
              <div key={product._id} className="flex gap-3 text-sm">
                <img
                  src={getImageUrl(product.images[0])}
                  alt=""
                  className="h-14 w-14 shrink-0 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="truncate">{product.name}</div>
                  <div className="text-xs text-muted-foreground">Qty {qty}</div>
                </div>
                <div className="text-gold">
                  {formatPrice((product.discountPrice ?? product.price) * qty)}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between text-lg pt-2 border-t border-border mt-2">
              <span>Total</span>
              <span className="text-gold font-display text-2xl">{formatPrice(total)}</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full bg-gold-gradient text-onyx py-4 text-xs tracking-[0.25em] uppercase font-medium disabled:opacity-50"
          >
            {isLoading ? "Placing order…" : "Place Order"}
          </button>
        </aside>
      </form>
    </div>
  );
}

const Field = ({
  label,
  className,
  error,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: unknown }) => (
  <label className={`block ${className ?? ""}`}>
    <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">{label}</span>
    <input
      {...rest}
      className={`mt-1 w-full bg-input border ${error ? "border-destructive" : "border-border"} px-3 py-2 text-sm focus:outline-none focus:border-gold`}
    />
  </label>
);
