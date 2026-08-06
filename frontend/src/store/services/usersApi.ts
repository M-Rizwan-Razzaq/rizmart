import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./baseQuery";

export interface ApiUser {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  phone?: string;
  avatar?: string;
  isBlocked: boolean;
  createdAt: string;
}

export interface PaginatedUsers {
  data: ApiUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedUsers, { page?: number; limit?: number; search?: string }>({
      query: (params) => ({ url: "/users", params }),
      providesTags: ["User"],
    }),

    getUserById: builder.query<ApiUser, string>({
      query: (id) => ({ url: `/users/${id}` }),
      providesTags: (_r, _e, id) => [{ type: "User", id }],
    }),

    updateUser: builder.mutation<ApiUser, { id: string; body: Partial<ApiUser> }>({
      query: ({ id, body }) => ({ url: `/users/${id}`, method: "PATCH", data: body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "User", id }, "User"],
    }),

    blockUser: builder.mutation<ApiUser, { id: string; isBlocked: boolean }>({
      query: ({ id, isBlocked }) => ({
        url: `/users/${id}/block`,
        method: "PATCH",
        data: { isBlocked },
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "User", id }, "User"],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useBlockUserMutation,
  useDeleteUserMutation,
} = usersApi;
