import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./baseQuery";

export interface ApiAddress {
  _id: string;
  label?: string;
  firstName: string;
  lastName?: string;
  address: string;
  city: string;
  state?: string;
  zip?: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export type CreateAddressDto = Omit<ApiAddress, "_id" | "isDefault">;

export const addressesApi = createApi({
  reducerPath: "addressesApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Address"],
  endpoints: (builder) => ({
    getAddresses: builder.query<ApiAddress[], void>({
      query: () => ({ url: "/users/me/addresses" }),
      providesTags: ["Address"],
    }),

    addAddress: builder.mutation<ApiAddress[], CreateAddressDto>({
      query: (body) => ({ url: "/users/me/addresses", method: "POST", data: body }),
      invalidatesTags: ["Address"],
    }),

    updateAddress: builder.mutation<ApiAddress[], { addressId: string; body: CreateAddressDto }>({
      query: ({ addressId, body }) => ({
        url: `/users/me/addresses/${addressId}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["Address"],
    }),

    setDefaultAddress: builder.mutation<ApiAddress[], string>({
      query: (addressId) => ({
        url: `/users/me/addresses/${addressId}/default`,
        method: "PATCH",
      }),
      invalidatesTags: ["Address"],
    }),

    deleteAddress: builder.mutation<ApiAddress[], string>({
      query: (addressId) => ({
        url: `/users/me/addresses/${addressId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Address"],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useSetDefaultAddressMutation,
  useDeleteAddressMutation,
} = addressesApi;
