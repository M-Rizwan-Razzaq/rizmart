import { Link, useLocation } from "@/lib/router";
import { useState, useEffect, useRef, type ReactNode } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Warehouse,
  Star,
  FileText,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { DEFAULT_BRAND_FORM } from "@/lib/brand";
import { useGetBrandSettingsQuery } from "@/store/services/brandApi";

const NAV_ITEMS: {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/inventory", label: "Inventory", icon: Warehouse },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/content", label: "Content", icon: FileText },
  { to: "/admin/promotion", label: "Promotion", icon: Mail },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const { pathname } = useLocation();
  const { data: brand } = useGetBrandSettingsQuery();
  const appName = brand?.appName?.trim() || DEFAULT_BRAND_FORM.appName;

  return (
    <aside className="flex h-full w-[260px] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-xl">
      <div className="flex items-center justify-between gap-3 border-b border-sidebar-border p-5">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src="/rizmart-mark.jpg"
            alt=""
            className="h-10 w-10 shrink-0 rounded-lg border border-sidebar-border object-cover"
          />
          <div className="min-w-0">
            <div className="truncate font-display text-lg font-extrabold tracking-wide text-gold-gradient">
              {appName}
            </div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/65">
              Admin Console
            </div>
          </div>
        </div>
        {onClose && (
          <button
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground transition hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex min-h-11 items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring ${
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Link
          to="/"
          className="flex min-h-11 items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-4 w-4" /> Exit Admin
        </Link>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const mainRef = useRef<HTMLElement | null>(null);
  const { data: brand } = useGetBrandSettingsQuery();
  const appName = brand?.appName?.trim() || DEFAULT_BRAND_FORM.appName;

  // Close mobile drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="admin-theme min-h-screen lg:h-screen lg:overflow-hidden lg:grid lg:grid-cols-[260px_1fr]">
      {/* Desktop sidebar */}
      <div className="hidden lg:block lg:h-screen lg:overflow-hidden overscroll-contain">
        <Sidebar />
      </div>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-sidebar-border bg-sidebar px-4 py-3 text-sidebar-foreground shadow-sm lg:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="truncate px-3 font-display text-lg font-extrabold tracking-wide text-gold-gradient">
          {appName}
        </div>
        <div className="h-9 w-9" />
      </div>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-background/70" onClick={() => setDrawerOpen(false)} />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar onClose={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <main
        ref={mainRef}
        className="min-w-0 bg-background lg:h-screen lg:overflow-y-auto overscroll-contain"
      >
        {children}
      </main>
    </div>
  );
}
