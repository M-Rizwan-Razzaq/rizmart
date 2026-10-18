import { useNavigate } from "@/lib/router";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearCart, selectCartItems, selectCartSubtotal } from "@/store/slices/cartSlice";
import { useCreateOrderMutation } from "@/store/services/ordersApi";
import { formatPrice, getShippingCost } from "@/lib/constants";
import { getImageUrl } from "@/lib/constants";
import { PAKISTAN_CITIES } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Truck, ShieldCheck, CheckCircle2 } from "lucide-react";

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
  const shipping = getShippingCost(subtotal);
  const total = subtotal + shipping;
  const hasUnavailableItems = items.some(({ product, qty }) => product.stock < qty);

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
    if (hasUnavailableItems) {
      toast.error("Update your cart: one or more items exceed the available stock.");
      return;
    }

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

      const snapshot = order.items.map((item) => ({
        name: item.name,
        image: item.image,
        price: item.price * item.qty,
      }));

      dispatch(clearCart());
      toast.success("Order placed successfully!");
      nav(`/order-success?id=${order.orderNumber}`, {
        state: {
          email: data.email,
          name: data.name,
          subtotal: order.subtotal,
          shipping: order.shipping,
          total: order.total,
          items: snapshot,
        },
      });
    } catch (error: unknown) {
      const message =
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : "Failed to place order";
      toast.error(message);
    }
  };

  if (items.length === 0 && !isLoading) {
    return (
      <div className="bg-[#FAF9F6] min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-[#E6E8EC] text-center max-w-md w-full shadow-xs">
          <h1 className="font-display text-2xl font-bold text-[#193B63] mb-2">Your Bag is Empty</h1>
          <p className="text-sm text-[#627184] mb-4">
            Please add bags to your cart before proceeding to checkout.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#193B63]">
            Checkout
          </h1>
          <p className="text-sm text-[#627184] mt-1">
            Place your order and pay the courier when it arrives. Shipping is calculated from your
            order total.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid lg:grid-cols-[1fr_400px] gap-8 items-start"
        >
          {/* Main Form Fields */}
          <div className="space-y-6">
            {/* Contact details */}
            <section className="bg-white p-6 sm:p-7 rounded-xl border border-[#E6E8EC] shadow-xs">
              <h2 className="font-display text-lg font-bold text-[#193B63] mb-4 flex items-center gap-2">
                <span>1. Contact Information</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Email Address"
                  placeholder="your.email@example.com"
                  {...register("email", { required: true })}
                  error={errors.email}
                />
                <Field
                  label="Contact Phone"
                  placeholder="03XX-XXXXXXX"
                  {...register("phone", { required: true })}
                  error={errors.phone}
                />
              </div>
            </section>

            {/* Delivery details */}
            <section className="bg-white p-6 sm:p-7 rounded-xl border border-[#E6E8EC] shadow-xs">
              <h2 className="font-display text-lg font-bold text-[#193B63] mb-4 flex items-center gap-2">
                <span>2. Delivery Address (Pakistan)</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  className="sm:col-span-2"
                  label="Full Name"
                  placeholder="Recipient full name"
                  {...register("name", { required: true })}
                  error={errors.name}
                />
                <Field
                  className="sm:col-span-2"
                  label="Street Address / House # / Area"
                  placeholder="House #, Street name, Sector/Town"
                  {...register("address", { required: true })}
                  error={errors.address}
                />
                <Controller
                  name="city"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#627184]">
                        City
                      </span>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger
                          className={`mt-1 h-10 w-full rounded-lg bg-white px-3 py-2 text-sm ${
                            errors.city ? "border-red-500" : "border-[#E6E8EC]"
                          } focus:border-[#193B63]`}
                        >
                          <SelectValue placeholder="Select delivery city" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 bg-white border-[#E6E8EC]">
                          {PAKISTAN_CITIES.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.city && (
                        <p className="text-[11px] text-red-500 mt-1">Please select your city</p>
                      )}
                    </div>
                  )}
                />
                <Field
                  label="Postal / ZIP Code"
                  placeholder="e.g. 75500"
                  {...register("zip", { required: true })}
                  error={errors.zip}
                />
                <input type="hidden" {...register("country")} />
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white p-6 sm:p-7 rounded-xl border border-[#E6E8EC] shadow-xs">
              <h2 className="font-display text-lg font-bold text-[#193B63] mb-4 flex items-center gap-2">
                <span>3. Payment Method</span>
              </h2>
              <div className="space-y-3">
                <label className="flex items-start gap-3 border-2 border-[#193B63] p-4 rounded-xl bg-[#FAF9F6] cursor-pointer">
                  <input
                    type="radio"
                    defaultChecked
                    name="payment"
                    className="mt-1 accent-[#193B63]"
                  />
                  <div>
                    <div className="text-sm font-bold text-[#193B63] flex items-center gap-1.5">
                      <span>Cash on Delivery (COD)</span>
                      <CheckCircle2 className="h-4 w-4 text-[#E3A34D]" />
                    </div>
                    <div className="text-xs text-[#627184] mt-0.5">
                      Pay cash to courier upon inspecting your bag at your doorstep.
                    </div>
                  </div>
                </label>

                <div className="flex items-start gap-3 border border-[#E6E8EC] p-4 rounded-xl opacity-60 bg-white">
                  <input type="radio" disabled name="payment" className="mt-1" />
                  <div>
                    <div className="text-sm font-bold text-[#263445]">
                      Online Card / JazzCash / EasyPaisa
                    </div>
                    <div className="text-xs text-[#8C9BAA]">
                      Prepaid payment gateways coming soon.
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Special Instructions */}
            <section className="bg-white p-6 sm:p-7 rounded-xl border border-[#E6E8EC] shadow-xs">
              <h2 className="font-display text-sm font-bold text-[#193B63] uppercase tracking-wider mb-2">
                Delivery Instructions (Optional)
              </h2>
              <textarea
                {...register("notes")}
                rows={3}
                placeholder="Special landmark, preferred delivery timing, etc."
                className="w-full bg-[#FAF9F6] border border-[#E6E8EC] rounded-lg p-3 text-sm text-[#263445] focus:outline-none focus:border-[#193B63]"
              />
            </section>
          </div>

          {/* Checkout Summary Card */}
          <aside className="bg-white rounded-xl border border-[#E6E8EC] p-6 shadow-xs lg:sticky lg:top-24 space-y-6">
            <h2 className="font-display text-xl font-bold text-[#193B63] pb-3 border-b border-[#E6E8EC]">
              Order Summary
            </h2>

            {/* Items list */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map(({ product, qty }) => (
                <div key={product._id} className="flex gap-3 text-sm">
                  <div className="h-14 w-14 rounded-lg bg-[#FAF9F6] border border-[#E6E8EC] p-1.5 shrink-0 flex items-center justify-center">
                    <img
                      src={getImageUrl(product.images[0])}
                      alt=""
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs text-[#193B63] line-clamp-1">
                      {product.name}
                    </div>
                    <div className="text-[11px] text-[#627184]">Qty: {qty}</div>
                    <div className="text-xs font-bold text-[#193B63]">
                      {formatPrice((product.discountPrice ?? product.price) * qty)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E6E8EC] pt-4 space-y-2 text-sm text-[#263445]">
              <div className="flex justify-between">
                <span className="text-[#627184]">Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#627184]">Shipping</span>
                <span className="font-semibold text-emerald-700">
                  {shipping === 0 ? "Free Shipping" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-base pt-3 border-t border-[#E6E8EC] mt-2 font-bold text-[#193B63]">
                <span>Total Amount</span>
                <span className="text-2xl font-extrabold">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || hasUnavailableItems}
              className="w-full bg-[#193B63] hover:bg-[#132D4C] active:bg-[#0E223B] text-white py-3.5 px-6 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer"
            >
              {isLoading ? "Placing Order…" : "Confirm Cash on Delivery Order"}
            </button>

            {hasUnavailableItems && (
              <p className="text-center text-xs text-red-600" role="alert">
                Update or remove items that are no longer available before placing your order.
              </p>
            )}

            <div className="pt-2 text-center text-xs text-[#627184] flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#E3A34D]" />
              <span>Cash on delivery checkout</span>
            </div>
          </aside>
        </form>
      </div>
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
    <span className="text-[11px] font-bold uppercase tracking-wider text-[#627184]">{label}</span>
    <input
      {...rest}
      className={`mt-1 w-full bg-white border ${
        error ? "border-red-500" : "border-[#E6E8EC]"
      } rounded-lg px-3.5 py-2.5 text-sm text-[#263445] focus:outline-none focus:border-[#193B63] shadow-xs`}
    />
    {Boolean(error) && <p className="text-[11px] text-red-500 mt-1">This field is required</p>}
  </label>
);
