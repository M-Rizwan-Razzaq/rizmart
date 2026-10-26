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

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  const isActive = (to: string) => {
    const [path, query] = to.split("?");
    if (location.pathname !== path) return false;
    if (!query) return location.pathname === path;
    return location.search === `?${query}`;
  };

  const primaryCategories = categories.slice(0, 4);

  return (
    <header className="sticky top-0 z-50 bg-card">
      {/* Top Banner / Announcement Strip */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-1 px-2 py-2 text-center text-[8px] font-semibold uppercase tracking-[0.02em] sm:gap-x-2 sm:px-6 sm:text-xs sm:tracking-[0.14em]">
          <span>Free Shipping Over PKR 500</span>
          <span className="hidden opacity-50 min-[360px]:inline">•</span>
          <span>Cash on Delivery Available</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-0.5 px-2 py-2.5 min-[380px]:gap-1.5 min-[380px]:px-3 sm:gap-3 sm:px-6 sm:py-4 lg:gap-2">
          {/* Mobile hamburger */}
          <button
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-primary transition-colors hover:bg-secondary hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold min-[380px]:h-10 min-[380px]:w-10 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <X className="h-5 w-5 min-[380px]:h-6 min-[380px]:w-6" /> : <Menu className="h-5 w-5 min-[380px]:h-6 min-[380px]:w-6" />}
          </button>

          {/* Logo */}
          <Link
            to="/"
            aria-label={`${appName} home`}
            className="group flex min-w-0 flex-1 items-center gap-1 sm:gap-2.5 lg:flex-none lg:gap-1 2xl:gap-2.5"
          >
            <img
              src="/rizmart-mark.jpg"
              alt=""
              className="h-7 w-7 shrink-0 rounded-lg border border-border object-cover min-[380px]:h-8 min-[380px]:w-8 sm:h-11 sm:w-11 lg:h-9 lg:w-9 2xl:h-11 2xl:w-11"
            />
            <span className="truncate font-display text-[16px] font-extrabold tracking-tight text-primary transition-colors group-hover:text-primary/90 min-[380px]:text-[19px] sm:text-3xl lg:text-xl 2xl:text-3xl">
              {appName.toUpperCase()}
            </span>
          </Link>

          {/* Desktop Categories & Links */}
          <nav className="hidden shrink-0 items-center gap-3 whitespace-nowrap text-[11px] font-semibold tracking-normal text-foreground lg:flex lg:gap-3 2xl:gap-5 2xl:text-sm">
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `shrink-0 whitespace-nowrap py-1 transition-colors ${
                  isActive ? "text-primary border-b-2 border-primary" : "hover:text-gold"
                }`
              }
            >
              All Bags
            </NavLink>
            {primaryCategories.map((category) => (
              <Link
                key={category._id}
                to={`/shop?category=${category._id}`}
                className={`shrink-0 whitespace-nowrap py-1 transition-colors ${
                  isActive(`/shop?category=${category._id}`)
                    ? "text-primary border-b-2 border-primary"
                    : "hover:text-gold"
                }`}
              >
                {category.name}
              </Link>
            ))}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `shrink-0 whitespace-nowrap py-1 transition-colors ${
                  isActive ? "text-primary border-b-2 border-primary" : "hover:text-gold"
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `shrink-0 whitespace-nowrap py-1 transition-colors ${
                  isActive ? "text-primary border-b-2 border-primary" : "hover:text-gold"
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Action Icons */}
          <div className="flex shrink-0 items-center gap-0 sm:gap-2 lg:gap-2 2xl:gap-3">
            <Link
              to="/shop"
              aria-label="Search bags"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gold-dark transition-colors hover:bg-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 min-[380px]:h-10 min-[380px]:w-10 lg:h-8 lg:w-8 2xl:h-10 2xl:w-10"
            >
              <Search className="h-[18px] w-[18px] min-[380px]:h-5 min-[380px]:w-5" />
            </Link>

            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative flex h-8 w-8 items-center justify-center rounded-lg text-gold-dark transition-colors hover:bg-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 min-[380px]:h-10 min-[380px]:w-10 lg:h-8 lg:w-8 2xl:h-10 2xl:w-10"
            >
              <Heart className="h-[18px] w-[18px] min-[380px]:h-5 min-[380px]:w-5" />
              {mounted && wishCount > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] bg-gold text-accent-foreground rounded-full h-4 min-w-4 px-1 flex items-center justify-center font-bold shadow-sm">
                  {wishCount}
                </span>
              )}
            </Link>

            {mounted && isAdmin && (
              <Link
                to="/admin"
                aria-label="Admin panel"
                title="Admin Panel"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-primary transition-colors hover:bg-secondary hover:text-gold min-[380px]:h-10 min-[380px]:w-10 lg:h-8 lg:w-8 2xl:h-10 2xl:w-10"
              >
                <ShieldCheck className="h-[18px] w-[18px] min-[380px]:h-5 min-[380px]:w-5" />
              </Link>
            )}

            <Link
              to="/account"
              aria-label="My Account"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gold-dark transition-colors hover:bg-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 min-[380px]:h-10 min-[380px]:w-10 lg:h-8 lg:w-8 2xl:h-10 2xl:w-10"
            >
              <User className="h-[18px] w-[18px] min-[380px]:h-5 min-[380px]:w-5" />
            </Link>

            <Link
              to="/cart"
              aria-label="Shopping Cart"
              className="relative flex h-8 w-8 items-center justify-center rounded-lg text-gold-dark transition-colors hover:bg-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 min-[380px]:h-10 min-[380px]:w-10 lg:h-8 lg:w-8 2xl:h-10 2xl:w-10"
            >
              <ShoppingBag className="h-[18px] w-[18px] min-[380px]:h-5 min-[380px]:w-5" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] bg-gold text-accent-foreground rounded-full h-4 min-w-4 px-1 flex items-center justify-center font-bold shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {open && (
        <div
          id="mobile-navigation"
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain border-b border-border bg-card px-3 py-3 shadow-xl animate-in slide-in-from-top-2 duration-200 sm:px-4 sm:py-4 lg:hidden"
        >
          <nav className="mx-auto flex max-w-7xl flex-col gap-1.5 text-sm font-semibold">
            <Link
              to="/shop"
              onClick={() => setOpen(false)}
              className={`flex min-h-11 items-center justify-between rounded-lg px-3 py-2.5 transition-colors sm:px-4 ${
                location.pathname === "/shop" && !location.search
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              All Bags & Backpacks
            </Link>
            {categories.map((c) => (
              <Link
                key={c._id}
                to={`/shop?category=${c._id}`}
                onClick={() => setOpen(false)}
                className={`flex min-h-11 items-center justify-between rounded-lg px-3 py-2.5 transition-colors sm:px-4 ${
                  isActive(`/shop?category=${c._id}`)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                {c.name}
              </Link>
            ))}
            <div className="my-2 border-t border-border" />
            <Link
              to="/about"
              onClick={() => setOpen(false)}
              className={`flex min-h-11 items-center rounded-lg px-3 py-2.5 transition-colors sm:px-4 ${
                isActive("/about") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
              }`}
            >
              About RizMart
            </Link>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className={`flex min-h-11 items-center rounded-lg px-3 py-2.5 transition-colors sm:px-4 ${
                isActive("/contact")
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              Contact Support
            </Link>
            <Link
              to="/account"
              onClick={() => setOpen(false)}
              className={`flex min-h-11 items-center rounded-lg px-3 py-2.5 transition-colors sm:px-4 ${
                isActive("/account")
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              My Account
            </Link>
            {mounted && isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center rounded-lg px-3 py-2.5 text-foreground transition-colors hover:bg-secondary sm:px-4"
              >
                Admin Panel
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
