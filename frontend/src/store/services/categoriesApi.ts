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

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    getCategories: builder.query<ApiCategory[], { all?: boolean } | void>({
      query: (args) => ({ url: "/categories", params: args ?? {} }),
      providesTags: ["Category"],
    }),

    getCategoryById: builder.query<ApiCategory, string>({
      query: (id) => ({ url: `/categories/${id}` }),
      providesTags: (_r, _e, id) => [{ type: "Category", id }],
    }),

    createCategory: builder.mutation<ApiCategory, Partial<ApiCategory>>({
      query: (body) => ({ url: "/categories", method: "POST", data: body }),
      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation<ApiCategory, { id: string; body: Partial<ApiCategory> }>({
      query: ({ id, body }) => ({ url: `/categories/${id}`, method: "PATCH", data: body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Category", id }, "Category"],
    }),

    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({ url: `/categories/${id}`, method: "DELETE" }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
