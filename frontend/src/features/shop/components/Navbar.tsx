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

  const isActive = (to: string) => {
    const [path, query] = to.split("?");
    if (location.pathname !== path) return false;
    if (!query) return location.pathname === path;
    return location.search === `?${query}`;
  };

  const primaryCategories = categories.slice(0, 4);

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Top Banner / Announcement Strip */}
      <div className="bg-[#193B63] text-white">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 py-2 text-center text-[9px] sm:text-xs tracking-[0.06em] sm:tracking-[0.14em] uppercase font-semibold flex items-center justify-center gap-1 sm:gap-2">
          <span>Free Shipping Over PKR 500</span>
          <span className="opacity-50">•</span>
          <span>Cash on Delivery Available</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="border-b border-[#E6E8EC] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-1.5 -ml-1.5 text-[#193B63] hover:text-[#E3A34D] transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo */}
          <Link to="/" aria-label={`${appName} home`} className="flex items-center gap-2.5 group">
            <img
              src="/rizmart-mark.jpg"
              alt=""
              className="h-10 w-10 rounded-lg border border-[#E6E8EC] object-cover sm:h-11 sm:w-11"
            />
            <span className="font-display text-2xl sm:text-3xl tracking-tight text-[#193B63] font-extrabold group-hover:text-[#132D4C] transition-colors">
              {appName.toUpperCase()}
            </span>
          </Link>

          {/* Desktop Categories & Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold tracking-normal text-[#263445]">
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `transition-colors py-1 ${
                  isActive ? "text-[#193B63] border-b-2 border-[#193B63]" : "hover:text-[#E3A34D]"
                }`
              }
            >
              All Bags
            </NavLink>
            {primaryCategories.map((category) => (
              <Link
                key={category._id}
                to={`/shop?category=${category._id}`}
                className={`transition-colors py-1 ${
                  isActive(`/shop?category=${category._id}`)
                    ? "text-[#193B63] border-b-2 border-[#193B63]"
                    : "hover:text-[#E3A34D]"
                }`}
              >
                {category.name}
              </Link>
            ))}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `transition-colors py-1 ${
                  isActive ? "text-[#193B63] border-b-2 border-[#193B63]" : "hover:text-[#E3A34D]"
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `transition-colors py-1 ${
                  isActive ? "text-[#193B63] border-b-2 border-[#193B63]" : "hover:text-[#E3A34D]"
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-4 sm:gap-5">
            <Link
              to="/shop"
              aria-label="Search bags"
              className="p-1.5 text-[#B8791B] hover:text-[#193B63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3A34D] focus-visible:ring-offset-2 rounded-md transition-colors"
            >
              <Search className="h-5 w-5" />
            </Link>

            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative p-1.5 text-[#B8791B] hover:text-[#193B63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3A34D] focus-visible:ring-offset-2 rounded-md transition-colors"
            >
              <Heart className="h-5 w-5" />
              {mounted && wishCount > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] bg-[#E3A34D] text-white rounded-full h-4 min-w-4 px-1 flex items-center justify-center font-bold shadow-sm">
                  {wishCount}
                </span>
              )}
            </Link>

            {mounted && isAdmin && (
              <Link
                to="/admin"
                aria-label="Admin panel"
                title="Admin Panel"
                className="p-1.5 text-[#193B63] hover:text-[#E3A34D] transition-colors"
              >
                <ShieldCheck className="h-5 w-5" />
              </Link>
            )}

            <Link
              to="/account"
              aria-label="My Account"
              className="p-1.5 text-[#B8791B] hover:text-[#193B63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3A34D] focus-visible:ring-offset-2 rounded-md transition-colors"
            >
              <User className="h-5 w-5" />
            </Link>

            <Link
              to="/cart"
              aria-label="Shopping Cart"
              className="relative p-1.5 text-[#B8791B] hover:text-[#193B63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3A34D] focus-visible:ring-offset-2 rounded-md transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] bg-[#E3A34D] text-white rounded-full h-4 min-w-4 px-1 flex items-center justify-center font-bold shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {open && (
        <div className="lg:hidden border-b border-[#E6E8EC] bg-white px-4 py-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1.5 text-sm font-semibold">
            <Link
              to="/shop"
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between rounded-lg px-4 py-2.5 transition-colors ${
                location.pathname === "/shop" && !location.search
                  ? "bg-[#193B63] text-white"
                  : "text-[#263445] hover:bg-[#FAF9F6]"
              }`}
            >
              All Bags & Backpacks
            </Link>
            {categories.map((c) => (
              <Link
                key={c._id}
                to={`/shop?category=${c._id}`}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between rounded-lg px-4 py-2.5 transition-colors ${
                  isActive(`/shop?category=${c._id}`)
                    ? "bg-[#193B63] text-white"
                    : "text-[#263445] hover:bg-[#FAF9F6]"
                }`}
              >
                {c.name}
              </Link>
            ))}
            <div className="my-2 border-t border-[#E6E8EC]" />
            <Link
              to="/about"
              onClick={() => setOpen(false)}
              className={`flex items-center rounded-lg px-4 py-2.5 transition-colors ${
                isActive("/about") ? "bg-[#193B63] text-white" : "text-[#263445] hover:bg-[#FAF9F6]"
              }`}
            >
              About RizMart
            </Link>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className={`flex items-center rounded-lg px-4 py-2.5 transition-colors ${
                isActive("/contact")
                  ? "bg-[#193B63] text-white"
                  : "text-[#263445] hover:bg-[#FAF9F6]"
              }`}
            >
              Contact Support
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
