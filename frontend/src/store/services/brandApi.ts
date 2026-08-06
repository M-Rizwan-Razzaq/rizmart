import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./baseQuery";
import type { BrandSettings } from "@/lib/brand";

export interface BrandSettingsResponse extends BrandSettings {
  key?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const brandApi = createApi({
  reducerPath: "brandApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Brand"],
  endpoints: (builder) => ({
    getBrandSettings: builder.query<BrandSettingsResponse | null, void>({
      query: () => ({ url: "/brand-settings" }),
      providesTags: ["Brand"],
    }),
    updateBrandSettings: builder.mutation<BrandSettingsResponse, BrandSettings>({
      query: (body) => ({ url: "/brand-settings", method: "PATCH", data: body }),
      invalidatesTags: ["Brand"],
    }),
  }),
});

export const { useGetBrandSettingsQuery, useUpdateBrandSettingsMutation } = brandApi;
