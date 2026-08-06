"use client";

import { Link, useNavigate, useLocation } from "@/lib/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  User,
  Package,
  Heart,
  MapPin,
  Lock,
  LogOut,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Plus,
  Edit2,
  Star,
} from "lucide-react";
import { TextInput } from "@/features/admin/components/Field";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { addToCart, type CartProduct } from "@/store/slices/cartSlice";
import { removeFromWishlist, selectWishlistIds } from "@/store/slices/wishlistSlice";
import { useChangePasswordMutation } from "@/store/services/authApi";
import { useGetMyOrdersQuery } from "@/store/services/ordersApi";
import { useGetProductsQuery } from "@/store/services/productsApi";
import {
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
  type ApiAddress,
  type CreateAddressDto,
} from "@/store/services/addressesApi";
import { formatPrice, getImageUrl } from "@/lib/constants";
import PageSpinner from "@/components/PageSpinner";

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "password", label: "Password", icon: Lock },
] as const;

type TabId = (typeof TABS)[number]["id"];

const emptyForm = (): CreateAddressDto => ({
  label: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
  phone: "",
});

// ─── Component ────────────────────────────────────────────────────────────────
export default function AccountPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const nav = useNavigate();
  const { state } = useLocation() as { state: { tab?: TabId } | null };
  const [tab, setTab] = useState<TabId>(state?.tab ?? "profile");

  // Orders
  const { data: ordersData, isLoading: ordersLoading } = useGetMyOrdersQuery({ limit: 10 });
  const orders = ordersData?.data ?? [];

  // Wishlist
  const wishlistIds = useAppSelector(selectWishlistIds);
  const { data: productsData, isLoading: wishlistLoading } = useGetProductsQuery(
    { limit: 100 },
    { skip: wishlistIds.length === 0 },
  );
  const wishlistItems = (productsData?.data ?? []).filter((p) => wishlistIds.includes(p._id));

  const [changePassword, { isLoading: passwordSaving }] = useChangePasswordMutation();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Addresses — real DB via RTK Query
  const { data: addresses = [], isLoading: addrLoading } = useGetAddressesQuery(undefined, {
    skip: !user,
  });
  const [addAddress, { isLoading: adding }] = useAddAddressMutation();
  const [updateAddress, { isLoading: updating }] = useUpdateAddressMutation();
  const [deleteAddress, { isLoading: deleting }] = useDeleteAddressMutation();
  const [setDefaultAddress, { isLoading: settingDefault }] = useSetDefaultAddressMutation();

  const addrBusy = adding || updating || deleting || settingDefault;

  const [addrModal, setAddrModal] = useState<{ open: boolean; editing: ApiAddress | null }>({
    open: false,
    editing: null,
  });
  const [addrForm, setAddrForm] = useState<CreateAddressDto>(emptyForm());

  const openAddAddr = () => {
    setAddrForm(emptyForm());
    setAddrModal({ open: true, editing: null });
  };

  const openEditAddr = (a: ApiAddress) => {
    setAddrForm({
      label: a.label ?? "",
      firstName: a.firstName,
      lastName: a.lastName ?? "",
      address: a.address,
      city: a.city,
      state: a.state ?? "",
      zip: a.zip ?? "",
      country: a.country,
      phone: a.phone ?? "",
    });
    setAddrModal({ open: true, editing: a });
  };

  const saveAddr = async () => {
    if (!addrForm.firstName.trim()) return toast.error("First name is required");
    if (!addrForm.address.trim()) return toast.error("Address is required");
    if (!addrForm.city.trim()) return toast.error("City is required");

    try {
      if (addrModal.editing) {
        await updateAddress({ addressId: addrModal.editing._id, body: addrForm }).unwrap();
        toast.success("Address updated");
      } else {
        await addAddress(addrForm).unwrap();
        toast.success("Address added");
      }
      setAddrModal({ open: false, editing: null });
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to save address");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAddress(id).unwrap();
      toast.success("Address removed");
    } catch {
      toast.error("Failed to remove address");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id).unwrap();
      toast.success("Default address updated");
    } catch {
      toast.error("Failed to update default");
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwordForm.currentPassword.trim()) return toast.error("Current password is required");
    if (!passwordForm.newPassword.trim()) return toast.error("New password is required");
    if (passwordForm.newPassword.length < 6)
      return toast.error("New password must be at least 6 characters");
    if (passwordForm.newPassword !== passwordForm.confirmPassword)
      return toast.error("Passwords do not match");

    try {
      const result = await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }).unwrap();
      toast.success(result.message);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update password");
    }
  };

  useEffect(() => {
    if (!user) nav("/login", { replace: true });
  }, [user, nav]);
  if (!user) return null;

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Signed out");
    nav("/");
  };

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-16">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-[11px] tracking-[0.3em] uppercase text-gold">My Account</div>
            {user.role === "admin" && (
              <span className="inline-flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase border border-gold/50 text-gold px-2 py-0.5">
                <ShieldCheck className="h-3 w-3" /> Admin
              </span>
            )}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl truncate">Welcome, {user.name}</h1>
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-6 lg:gap-10">
          {/* Sidebar */}
          <aside className="flex lg:block overflow-x-auto lg:overflow-visible gap-1 lg:gap-0 lg:space-y-1 border-b lg:border-b-0 border-border pb-2 lg:pb-0">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`shrink-0 lg:w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 text-sm text-left border-b-2 lg:border-b-0 lg:border-l-2 ${
                  tab === t.id
                    ? "border-gold text-gold lg:bg-gold/5"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="shrink-0 lg:w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 text-sm text-left text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
            {user.role === "admin" && (
              <Link
                to="/admin"
                className="shrink-0 lg:w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 text-sm text-left text-gold hover:text-gold/80 border-t border-border/60 mt-1"
              >
                <ShieldCheck className="h-4 w-4" /> Admin Panel
              </Link>
            )}
          </aside>

          {/* Content */}
          <div className="card-luxe p-5 sm:p-8">
            {/* ── Profile ──────────────────────────────────────── */}
            {tab === "profile" && (
              <div>
                <h2 className="font-display text-2xl mb-6">Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Name" defaultValue={user.name} />
                  <Field label="Email" defaultValue={user.email} />
                  <Field label="Phone" defaultValue={user.phone ?? ""} />
                </div>
                <button className="mt-6 bg-gold-gradient text-onyx px-6 py-3 text-xs tracking-[0.25em] uppercase font-medium">
                  Save Changes
                </button>
              </div>
            )}

            {/* ── Orders ───────────────────────────────────────── */}
            {tab === "orders" && (
              <div>
                <h2 className="font-display text-2xl mb-6">My Orders</h2>
                {ordersLoading ? (
                  <PageSpinner minH="200px" />
                ) : orders.length === 0 ? (
                  <p className="text-muted-foreground">No orders yet.</p>
                ) : (
                  <div className="space-y-3">
                    {orders.map((o) => (
                      <div
                        key={o._id}
                        className="border border-border/60 p-4 flex flex-wrap items-center justify-between gap-4"
                      >
                        <div>
                          <div className="font-display text-lg">Order {o.orderNumber}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(o.createdAt).toLocaleDateString()} · {o.items.length} item
                            {o.items.length !== 1 ? "s" : ""}
                          </div>
                        </div>
                        <StatusBadge status={o.status} />
                        <div className="text-gold">{formatPrice(o.total)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Wishlist ─────────────────────────────────────── */}
            {tab === "wishlist" && (
              <div>
                <h2 className="font-display text-2xl mb-6">
                  Wishlist
                  {wishlistIds.length > 0 && (
                    <span className="ml-2 text-sm font-sans font-normal text-muted-foreground">
                      ({wishlistIds.length} {wishlistIds.length === 1 ? "item" : "items"})
                    </span>
                  )}
                </h2>
                {wishlistIds.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="h-10 w-10 text-gold mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">You haven't saved any pieces yet.</p>
                    <Link
                      to="/shop"
                      className="bg-gold-gradient text-onyx px-6 py-3 text-xs tracking-[0.25em] uppercase font-medium"
                    >
                      Browse Collection
                    </Link>
                  </div>
                ) : wishlistLoading ? (
                  <PageSpinner minH="200px" />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistItems.map((p) => {
                      const cartProduct: CartProduct = {
                        _id: p._id,
                        slug: p.slug,
                        name: p.name,
                        price: p.price,
                        discountPrice: p.discountPrice,
                        images: p.images,
                        material: p.material,
                        category: typeof p.category === "object" ? p.category.name : p.category,
                        stock: p.stock,
                        sku: p.sku,
                      };
                      return (
                        <div key={p._id} className="flex gap-3 border border-border/60 p-3">
                          <img
                            src={getImageUrl(p.images[0])}
                            alt={p.name}
                            className="h-24 w-24 shrink-0 object-cover"
                          />
                          <div className="flex-1 flex flex-col justify-between min-w-0 gap-2">
                            <div className="min-w-0">
                              <Link
                                to={`/product/${p.slug}`}
                                className="font-display text-base hover:text-gold line-clamp-1"
                              >
                                {p.name}
                              </Link>
                              <div className="text-gold text-sm mt-0.5">
                                {formatPrice(p.discountPrice ?? p.price)}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  dispatch(addToCart({ product: cartProduct }));
                                  dispatch(removeFromWishlist(p._id));
                                  toast.success("Moved to cart");
                                }}
                                className="flex-1 bg-gold-gradient text-onyx py-1.5 text-xs tracking-[0.2em] uppercase font-medium inline-flex items-center justify-center gap-1.5"
                              >
                                <ShoppingBag className="h-3.5 w-3.5" /> Add to Cart
                              </button>
                              <button
                                onClick={() => dispatch(removeFromWishlist(p._id))}
                                className="p-1.5 border border-border hover:border-destructive hover:text-destructive"
                                aria-label="Remove"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── Addresses ────────────────────────────────────── */}
            {tab === "addresses" && (
              <div>
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <h2 className="font-display text-2xl">Saved Addresses</h2>
                  <button
                    onClick={openAddAddr}
                    className="inline-flex items-center gap-2 bg-gold-gradient text-onyx px-4 py-2.5 text-xs tracking-[0.25em] uppercase font-medium"
                  >
                    <Plus className="h-4 w-4" /> Add Address
                  </button>
                </div>

                {addrLoading ? (
                  <PageSpinner minH="200px" />
                ) : addresses.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-border/60">
                    <MapPin className="h-10 w-10 text-gold/40 mx-auto mb-3" />
                    <p className="text-muted-foreground mb-4">No saved addresses yet.</p>
                    <button
                      onClick={openAddAddr}
                      className="inline-flex items-center gap-2 border border-border hover:border-gold px-5 py-2.5 text-xs tracking-[0.25em] uppercase transition"
                    >
                      <Plus className="h-4 w-4" /> Add Your First Address
                    </button>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {addresses.map((a) => (
                      <div
                        key={a._id}
                        className={`relative border p-5 transition ${
                          a.isDefault ? "border-gold/60 bg-gold/5" : "border-border/60"
                        }`}
                      >
                        {a.isDefault && (
                          <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase text-gold border border-gold/40 px-2 py-0.5">
                            <Star className="h-2.5 w-2.5 fill-gold" /> Default
                          </span>
                        )}
                        {a.label && (
                          <div className="text-[11px] tracking-[0.3em] uppercase text-gold mb-2">
                            {a.label}
                          </div>
                        )}
                        <div className="text-sm space-y-0.5 pr-16">
                          <div className="font-medium">
                            {a.firstName} {a.lastName}
                          </div>
                          <div className="text-muted-foreground">{a.address}</div>
                          <div className="text-muted-foreground">
                            {a.city}
                            {a.state ? `, ${a.state}` : ""} {a.zip}
                          </div>
                          <div className="text-muted-foreground">{a.country}</div>
                          {a.phone && <div className="text-muted-foreground">{a.phone}</div>}
                        </div>
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/40">
                          <button
                            onClick={() => openEditAddr(a)}
                            disabled={addrBusy}
                            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-gold transition disabled:opacity-40"
                          >
                            <Edit2 className="h-3.5 w-3.5" /> Edit
                          </button>
                          {!a.isDefault && (
                            <>
                              <span className="text-border/60">·</span>
                              <button
                                onClick={() => handleSetDefault(a._id)}
                                disabled={addrBusy}
                                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-gold transition disabled:opacity-40"
                              >
                                <Star className="h-3.5 w-3.5" /> Set Default
                              </button>
                            </>
                          )}
                          <span className="text-border/60">·</span>
                          <button
                            onClick={() => handleDelete(a._id)}
                            disabled={addrBusy}
                            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition ml-auto disabled:opacity-40"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Password ─────────────────────────────────────── */}
            {tab === "password" && (
              <div>
                <h2 className="font-display text-2xl mb-6">Change Password</h2>
                <div className="space-y-4 max-w-md">
                  <Field label="Current password">
                    <TextInput
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))
                      }
                      autoComplete="current-password"
                    />
                  </Field>
                  <Field label="New password">
                    <TextInput
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))
                      }
                      autoComplete="new-password"
                    />
                  </Field>
                  <Field label="Confirm password">
                    <TextInput
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))
                      }
                      autoComplete="new-password"
                    />
                  </Field>
                </div>
                <button
                  onClick={handlePasswordUpdate}
                  disabled={passwordSaving}
                  className="mt-6 bg-gold-gradient text-onyx px-6 py-3 text-xs tracking-[0.25em] uppercase font-medium disabled:opacity-50"
                >
                  {passwordSaving ? "Updating…" : "Update Password"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Add / Edit Address Modal ──────────────────────────────────────── */}
      {addrModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setAddrModal({ open: false, editing: null })}
          />
          <div className="relative card-luxe w-full max-w-lg p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="font-display text-2xl mb-6">
              {addrModal.editing ? "Edit Address" : "Add New Address"}
            </h3>
            <div className="space-y-4">
              <AddrField
                label="Label (optional)"
                placeholder='e.g. "Home" or "Work"'
                value={addrForm.label ?? ""}
                onChange={(e) => setAddrForm((f) => ({ ...f, label: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-4">
                <AddrField
                  label="First Name *"
                  value={addrForm.firstName}
                  onChange={(e) => setAddrForm((f) => ({ ...f, firstName: e.target.value }))}
                />
                <AddrField
                  label="Last Name"
                  value={addrForm.lastName ?? ""}
                  onChange={(e) => setAddrForm((f) => ({ ...f, lastName: e.target.value }))}
                />
              </div>
              <AddrField
                label="Street Address *"
                value={addrForm.address}
                onChange={(e) => setAddrForm((f) => ({ ...f, address: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-4">
                <AddrField
                  label="City *"
                  value={addrForm.city}
                  onChange={(e) => setAddrForm((f) => ({ ...f, city: e.target.value }))}
                />
                <AddrField
                  label="State / Province"
                  value={addrForm.state ?? ""}
                  onChange={(e) => setAddrForm((f) => ({ ...f, state: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <AddrField
                  label="ZIP / Postal Code"
                  value={addrForm.zip ?? ""}
                  onChange={(e) => setAddrForm((f) => ({ ...f, zip: e.target.value }))}
                />
                <AddrField
                  label="Country"
                  value={addrForm.country ?? "United States"}
                  onChange={(e) => setAddrForm((f) => ({ ...f, country: e.target.value }))}
                />
              </div>
              <AddrField
                label="Phone (optional)"
                type="tel"
                value={addrForm.phone ?? ""}
                onChange={(e) => setAddrForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setAddrModal({ open: false, editing: null })}
                className="flex-1 border border-border hover:border-gold py-3 text-xs tracking-[0.25em] uppercase transition"
              >
                Cancel
              </button>
              <button
                onClick={saveAddr}
                disabled={addrBusy}
                className="flex-1 bg-gold-gradient text-onyx py-3 text-xs tracking-[0.25em] uppercase font-medium disabled:opacity-50"
              >
                {addrBusy ? "Saving…" : addrModal.editing ? "Save Changes" : "Add Address"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
const Field = ({
  label,
  children,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  children?: React.ReactNode;
}) => (
  <label className="block">
    <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">{label}</span>
    {children ?? (
      <input
        {...rest}
        className="mt-1 w-full bg-input border border-border px-3 py-2 focus:outline-none focus:border-gold"
      />
    )}
  </label>
);

const AddrField = ({
  label,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <label className="block">
    <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">{label}</span>
    <input
      {...rest}
      className="mt-1 w-full bg-input border border-border px-3 py-2 text-sm focus:outline-none focus:border-gold"
    />
  </label>
);

const STATUS_COLORS: Record<string, string> = {
  Pending: "text-yellow-400 border-yellow-400/40",
  Confirmed: "text-blue-400 border-blue-400/40",
  Packed: "text-purple-400 border-purple-400/40",
  Shipped: "text-cyan-400 border-cyan-400/40",
  Delivered: "text-green-400 border-green-400/40",
  Cancelled: "text-red-400 border-red-400/40",
  Returned: "text-orange-400 border-orange-400/40",
};

const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={`text-[10px] tracking-[0.2em] uppercase border px-2 py-1 ${STATUS_COLORS[status] ?? ""}`}
  >
    {status}
  </span>
);
