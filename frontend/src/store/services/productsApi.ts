import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./baseQuery";

export interface ApiCategory {
  _id: string;
  name: string;
  slug: string;
  gender: "men" | "women" | "unisex";
  image?: string;
  isActive: boolean;
}

export interface ApiProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: ApiCategory | string;
  gender: "men" | "women" | "unisex";
  material: string;
  style: string;
  sku: string;
  stock: number;
  description: string;
  specifications: Record<string, string>;
  tags: string[];
  featured: boolean;
  trending: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  isActive: boolean;
  averageRating: number;
  reviewCount: number;
}

export interface PaginatedProducts {
  data: ApiProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  includeInactive?: boolean;
  category?: string;
  gender?: string;
  material?: string;
  style?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  trending?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  sortBy?: "price_asc" | "price_desc" | "rating" | "newest" | "popular";
}

export interface ApiReview {
  _id: string;
  product: string;
  user?: { _id: string; name: string; avatar?: string };
  rating: number;
  comment: string;
  displayName?: string;
  createdAt: string;
}

export interface PaginatedReviews {
  data: ApiReview[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Product", "Review"],
  endpoints: (builder) => ({
    // ── Products ─────────────────────────────────────────────────────────────
    getProducts: builder.query<PaginatedProducts, ProductQuery>({
      query: (params) => ({ url: "/products", params }),
      providesTags: ["Product"],
    }),

    getProductBySlug: builder.query<ApiProduct, string>({
      query: (slug) => ({ url: `/products/slug/${slug}` }),
      providesTags: (_r, _e, slug) => [{ type: "Product", id: slug }],
    }),

    getProductById: builder.query<ApiProduct, string>({
      query: (id) => ({ url: `/products/${id}` }),
      providesTags: (_r, _e, id) => [{ type: "Product", id }],
    }),

    getFeaturedProducts: builder.query<ApiProduct[], void>({
      query: () => ({ url: "/products/featured" }),
      providesTags: ["Product"],
    }),

    getTrendingProducts: builder.query<ApiProduct[], void>({
      query: () => ({ url: "/products/trending" }),
      providesTags: ["Product"],
    }),

    getBestSellers: builder.query<ApiProduct[], void>({
      query: () => ({ url: "/products/best-sellers" }),
      providesTags: ["Product"],
    }),

    getNewArrivals: builder.query<ApiProduct[], void>({
      query: () => ({ url: "/products/new-arrivals" }),
      providesTags: ["Product"],
    }),

    createProduct: builder.mutation<ApiProduct, Partial<ApiProduct>>({
      query: (body) => ({ url: "/products", method: "POST", data: body }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation<ApiProduct, { id: string; body: Partial<ApiProduct> }>({
      query: ({ id, body }) => ({ url: `/products/${id}`, method: "PATCH", data: body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Product", id }, "Product"],
    }),

    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: ["Product"],
    }),

    // ── Reviews ──────────────────────────────────────────────────────────────
    getProductReviews: builder.query<PaginatedReviews, { productId: string; page?: number }>({
      query: ({ productId, page = 1 }) => ({
        url: `/reviews/product/${productId}`,
        params: { page },
      }),
      providesTags: (_r, _e, { productId }) => [{ type: "Review", id: productId }],
    }),

    createReview: builder.mutation<
      ApiReview,
      { productId: string; rating: number; comment: string; displayName?: string }
    >({
      query: (body) => ({ url: "/reviews", method: "POST", data: body }),
      invalidatesTags: (_r, _e, { productId }) => [
        { type: "Review", id: productId },
        { type: "Product", id: productId },
      ],
    }),

    updateReview: builder.mutation<
      ApiReview,
      { reviewId: string; productId: string; rating: number; comment: string; displayName?: string }
    >({
      query: ({ reviewId, productId: _productId, ...body }) => ({
        url: `/reviews/${reviewId}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: (_r, _e, { productId }) => [
        { type: "Review", id: productId },
        { type: "Product", id: productId },
      ],
    }),

    deleteReview: builder.mutation<void, { reviewId: string; productId: string }>({
      query: ({ reviewId }) => ({ url: `/reviews/${reviewId}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, { productId }) => [{ type: "Review", id: productId }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useGetProductByIdQuery,
  useGetFeaturedProductsQuery,
  useGetTrendingProductsQuery,
  useGetBestSellersQuery,
  useGetNewArrivalsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = productsApi;
