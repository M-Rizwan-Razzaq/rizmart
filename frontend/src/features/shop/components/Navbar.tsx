import { Link, NavLink, useLocation } from "@/lib/router";
import { ShoppingBag, Heart, Search, User, Menu, X, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/store";
import { selectCartCount } from "@/store/slices/cartSlice";
import { selectWishlistCount } from "@/store/slices/wishlistSlice";
import { useGetCategoriesQuery } from "@/store/services/categoriesApi";
import { useGetBrandSettingsQuery } from "@/store/services/brandApi";
import { DEFAULT_BRAND_FORM } from "@/lib/brand";

export function Navbar() {
  const cartCount = useAppSelector(selectCartCount);
  const wishCount = useAppSelector(selectWishlistCount);
  const user = useAppSelector((s) => s.auth.user);
  const isAdmin = user?.role === "admin";
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const location = useLocation();

  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: brand } = useGetBrandSettingsQuery();
  const appName = brand?.appName?.trim() || DEFAULT_BRAND_FORM.appName;
  const themeStripStyle = {
    backgroundColor: "var(--muted)",
    borderColor: "var(--border)",
    color: "var(--muted-foreground)",
  } as const;

  const navItems = [
    { to: "/shop", label: "Shop" },
    { to: "/shop?gender=women", label: "Women" },
    { to: "/shop?gender=men", label: "Men" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (to: string) => {
    const [path, query] = to.split("?");
    if (location.pathname !== path) return false;
    if (!query) return location.pathname === path;
    return location.search === `?${query}`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="border-b" style={themeStripStyle}>
        <div
          className="mx-auto max-w-7xl px-6 py-2 text-center text-[11px] tracking-[0.25em] uppercase"
          style={{ color: "var(--muted-foreground)" }}
        >
          Complimentary Insured Shipping · Lifetime Craftsmanship Warranty
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <button
          className="lg:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link
          to="/"
          className="font-display text-2xl tracking-[0.2em] text-gold-gradient font-medium"
        >
          {appName}
        </Link>

        <nav className="hidden lg:flex items-center gap-10 text-sm">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `transition-colors ${
                  isActive ? "text-gold" : "hover:text-gold/90 text-foreground/90"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/shop" aria-label="Search">
            <Search className="h-5 w-5 hover:text-gold transition" />
          </Link>
          <Link to="/wishlist" aria-label="Wishlist" className="relative">
            <Heart className="h-5 w-5 hover:text-gold transition" />
            {mounted && wishCount > 0 && (
              <span className="absolute -top-2 -right-2 text-[10px] bg-gold-gradient text-onyx rounded-full h-4 min-w-4 px-1 flex items-center justify-center font-medium">
                {wishCount}
              </span>
            )}
          </Link>
          {mounted && isAdmin && (
            <Link to="/admin" aria-label="Admin panel" title="Admin Panel">
              <ShieldCheck className="h-5 w-5 hover:text-gold transition text-gold/70" />
            </Link>
          )}
          <Link to="/account" aria-label="Account">
            <User className="h-5 w-5 hover:text-gold transition" />
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative">
            <ShoppingBag className="h-5 w-5 hover:text-gold transition" />
            {mounted && cartCount > 0 && (
              <span className="absolute -top-2 -right-2 text-[10px] bg-gold-gradient text-onyx rounded-full h-4 min-w-4 px-1 flex items-center justify-center font-medium">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl">
          <nav className="mx-auto flex max-w-md flex-col items-center gap-3 px-6 py-6 text-sm">
            <Link
              to="/shop"
              onClick={() => setOpen(false)}
              className={`flex w-full items-center justify-center rounded-full border px-4 py-3 tracking-[0.18em] uppercase transition ${
                location.pathname === "/shop" && !location.search
                  ? "border-gold bg-gold/10 text-gold shadow-[0_0_0_1px_var(--gold)]"
                  : "border-border/70 bg-background/60 text-foreground/90 hover:border-gold/80 hover:bg-gold/5"
              }`}
            >
              Shop All
            </Link>
            {categories.map((c) => (
              <Link
                key={c._id}
                to={`/shop?category=${c._id}`}
                onClick={() => setOpen(false)}
                className={`flex w-full items-center justify-center rounded-full border px-4 py-3 tracking-[0.18em] uppercase transition ${
                  isActive(`/shop?category=${c._id}`)
                    ? "border-gold bg-[linear-gradient(135deg,var(--gold-soft),var(--gold))] text-onyx shadow-[0_12px_30px_-18px_var(--gold)]"
                    : "border-border/70 bg-background/60 text-muted-foreground hover:border-gold/80 hover:text-foreground"
                }`}
              >
                {c.name}
              </Link>
            ))}
            {navItems
              .filter((item) => item.to === "/about" || item.to === "/contact")
              .map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex w-full items-center justify-center rounded-full border px-4 py-3 tracking-[0.18em] uppercase transition ${
                    isActive(item.to)
                      ? "border-gold bg-gold/10 text-gold shadow-[0_0_0_1px_var(--gold)]"
                      : "border-border/70 bg-background/60 text-foreground/90 hover:border-gold/80 hover:bg-gold/5"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
          </nav>
        </div>
      )}
    </header>
  );
}
