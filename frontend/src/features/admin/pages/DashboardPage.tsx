import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, AlertTriangle } from "lucide-react";
import { useGetDashboardStatsQuery } from "@/store/services/dashboardApi";
import { formatPrice } from "@/lib/constants";
import { getImageUrl } from "@/lib/constants";
import PageSpinner from "@/components/PageSpinner";

export default function DashboardPage() {
  const { data: stats, isLoading } = useGetDashboardStatsQuery();

  if (isLoading || !stats) return <PageSpinner />;

  const statCards = [
    { label: "Revenue", value: formatPrice(stats.totalRevenue), icon: DollarSign, delta: "+18.2%" },
    { label: "Orders", value: stats.totalOrders, icon: ShoppingCart, delta: "+12.4%" },
    { label: "Customers", value: stats.totalCustomers, icon: Users, delta: "+6.1%" },
    { label: "Products", value: stats.totalProducts, icon: Package, delta: "+2" },
  ];

  const lowStock = stats.topProducts.filter((p) => p.stock <= 10);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="font-display text-2xl sm:text-3xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back. Here's what's happening today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="card-luxe p-4 sm:p-6">
            <div className="flex items-start justify-between gap-2">
              <s.icon className="h-5 w-5 text-gold shrink-0" />
              <span className="text-[10px] sm:text-xs text-green-400 flex items-center gap-1 whitespace-nowrap">
                <TrendingUp className="h-3 w-3" /> {s.delta}
              </span>
            </div>
            <div className="font-display text-2xl sm:text-3xl mt-3 sm:mt-4 truncate">{s.value}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground tracking-widest uppercase mt-1">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
        <div className="card-luxe p-4 sm:p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="font-display text-lg sm:text-xl">Revenue</h3>
            <span className="text-[10px] sm:text-xs text-muted-foreground tracking-widest uppercase">
              Last 6 months
            </span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={stats.revenueByMonth}>
              <CartesianGrid stroke="oklch(0.28 0.008 70 / 40%)" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="oklch(0.68 0.015 80)" fontSize={12} />
              <YAxis stroke="oklch(0.68 0.015 80)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.17 0.006 60)",
                  border: "1px solid oklch(0.28 0.008 70)",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="oklch(0.82 0.13 82)"
                strokeWidth={2}
                dot={{ fill: "oklch(0.82 0.13 82)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card-luxe p-4 sm:p-6">
          <h3 className="font-display text-lg sm:text-xl mb-4">Orders by Status</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={Object.entries(stats.ordersByStatus).map(([status, count]) => ({
                status,
                count,
              }))}
            >
              <CartesianGrid stroke="oklch(0.28 0.008 70 / 40%)" strokeDasharray="3 3" />
              <XAxis dataKey="status" stroke="oklch(0.68 0.015 80)" fontSize={10} />
              <YAxis stroke="oklch(0.68 0.015 80)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.17 0.006 60)",
                  border: "1px solid oklch(0.28 0.008 70)",
                }}
              />
              <Bar dataKey="count" fill="oklch(0.82 0.13 82)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders + low stock */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card-luxe p-4 sm:p-6">
          <h3 className="font-display text-lg sm:text-xl mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {stats.recentOrders.map((o) => (
              <div
                key={o._id}
                className="flex items-center justify-between gap-3 text-sm border-b border-border/50 pb-3 last:border-0"
              >
                <div className="min-w-0">
                  <div className="truncate">{o.user?.name ?? o.guestEmail ?? "Guest"}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {o.orderNumber} · {new Date(o.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-gold shrink-0">{formatPrice(o.total)}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card-luxe p-4 sm:p-6">
          <h3 className="font-display text-lg sm:text-xl mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-400" /> Low Stock
          </h3>
          <div className="space-y-3">
            {lowStock.length === 0 && (
              <div className="text-sm text-muted-foreground">All products well-stocked.</div>
            )}
            {lowStock.map((p) => (
              <div
                key={p._id}
                className="flex items-center gap-3 text-sm border-b border-border/50 pb-3 last:border-0"
              >
                {p.images?.[0] ? (
                  <img
                    src={getImageUrl(p.images[0])}
                    alt=""
                    className="h-10 w-10 shrink-0 object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-accent/50 text-xs text-muted-foreground">
                    No img
                  </div>
                )}
                <div className="flex-1 min-w-0 truncate">{p.name}</div>
                <div className="text-yellow-400 shrink-0">{p.stock} left</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
