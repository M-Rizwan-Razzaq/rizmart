import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./baseQuery";

export type OrderStatus =
  "Pending" | "Confirmed" | "Packed" | "Shipped" | "Delivered" | "Cancelled" | "Returned";

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  qty: number;
}

export interface ShippingAddress {
  name?: string;
  firstName?: string;
  lastName?: string;
  address: string;
  city: string;
  state?: string;
  zip: string;
  country: string;
}

export interface ApiOrder {
  _id: string;
  orderNumber: string;
  user?: { _id: string; name: string; email: string } | null;
  guestEmail?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  phone: string;
  notes?: string;
  createdAt: string;
}

export interface PaginatedOrders {
  data: ApiOrder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateOrderPayload {
  items: { productId: string; qty: number }[];
  shippingAddress: ShippingAddress;
  phone: string;
  guestEmail?: string;
  notes?: string;
}

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    // Customer — own orders
    getMyOrders: builder.query<PaginatedOrders, { page?: number; limit?: number }>({
      query: (params) => ({ url: "/orders/my", params }),
      providesTags: ["Order"],
    }),

    // Admin — all orders
    getAllOrders: builder.query<
      PaginatedOrders,
      { page?: number; limit?: number; status?: OrderStatus; search?: string }
    >({
      query: (params) => ({ url: "/orders", params }),
      providesTags: ["Order"],
    }),

    getOrderById: builder.query<ApiOrder, string>({
      query: (id) => ({ url: `/orders/${id}` }),
      providesTags: (_r, _e, id) => [{ type: "Order", id }],
    }),

    createOrder: builder.mutation<ApiOrder, CreateOrderPayload>({
      query: (body) => ({ url: "/orders", method: "POST", data: body }),
      invalidatesTags: ["Order"],
    }),

    createAdminOrder: builder.mutation<ApiOrder, CreateOrderPayload>({
      query: (body) => ({ url: "/orders/admin", method: "POST", data: body }),
      invalidatesTags: ["Order"],
    }),

    updateOrderStatus: builder.mutation<ApiOrder, { id: string; status: OrderStatus }>({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Order", id }, "Order"],
    }),

    cancelOrder: builder.mutation<ApiOrder, string>({
      query: (id) => ({ url: `/orders/${id}/cancel`, method: "PATCH" }),
      invalidatesTags: (_r, _e, id) => [{ type: "Order", id }, "Order"],
    }),

    deleteOrder: builder.mutation<void, string>({
      query: (id) => ({ url: `/orders/${id}`, method: "DELETE" }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useGetMyOrdersQuery,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useCreateAdminOrderMutation,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useDeleteOrderMutation,
} = ordersApi;
