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
    <aside className="bg-sidebar border-r border-sidebar-border flex flex-col h-full w-[260px]">
      <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
        <div>
          <div className="font-display text-xl tracking-[0.2em] text-gold-gradient">{appName}</div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mt-1">
            Admin Console
          </div>
        </div>
        {onClose && (
          <button
            className="lg:hidden text-muted-foreground"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 text-sm rounded transition ${
                active ? "bg-gold/10 text-gold" : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-foreground rounded"
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
    <div className="min-h-screen lg:h-screen lg:overflow-hidden lg:grid lg:grid-cols-[260px_1fr]">
      {/* Desktop sidebar */}
      <div className="hidden lg:block lg:h-screen lg:overflow-hidden overscroll-contain">
        <Sidebar />
      </div>

      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between bg-sidebar border-b border-sidebar-border px-4 py-3">
        <button onClick={() => setDrawerOpen(true)} aria-label="Open menu" className="p-2 -ml-2">
          <Menu className="h-5 w-5" />
        </button>
        <div className="font-display text-lg tracking-[0.2em] text-gold-gradient">{appName}</div>
        <div className="w-8" />
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
