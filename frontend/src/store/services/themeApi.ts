import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./baseQuery";
import type { ThemeColors } from "@/lib/theme";

export interface ThemeSettings extends ThemeColors {
  key?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const themeApi = createApi({
  reducerPath: "themeApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Theme"],
  endpoints: (builder) => ({
    getTheme: builder.query<ThemeSettings | null, void>({
      query: () => ({ url: "/theme" }),
      providesTags: ["Theme"],
    }),
    updateTheme: builder.mutation<ThemeSettings, ThemeColors>({
      query: (body) => ({ url: "/theme", method: "PATCH", data: body }),
      invalidatesTags: ["Theme"],
    }),
    resetTheme: builder.mutation<{ deleted: boolean }, void>({
      query: () => ({ url: "/theme", method: "DELETE" }),
      invalidatesTags: ["Theme"],
    }),
  }),
});

export const { useGetThemeQuery, useUpdateThemeMutation, useResetThemeMutation } = themeApi;
