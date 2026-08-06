import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./baseQuery";
import type { ApiOrder } from "./ordersApi";
import type { ApiProduct } from "./productsApi";

export interface RevenueMonth {
  month: string;
  revenue: number;
  orders: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  ordersByStatus: Record<string, number>;
  revenueByMonth: RevenueMonth[];
  recentOrders: ApiOrder[];
  topProducts: ApiProduct[];
}

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Dashboard"],
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => ({ url: "/dashboard/stats" }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
