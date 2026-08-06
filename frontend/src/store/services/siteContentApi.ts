import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./baseQuery";
import type { SiteContentDraft, SiteContentSlug } from "@/lib/siteContent";

export interface SiteContentResponse extends SiteContentDraft {
  key?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const siteContentApi = createApi({
  reducerPath: "siteContentApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["SiteContent"],
  endpoints: (builder) => ({
    getContents: builder.query<SiteContentResponse[], void>({
      query: () => ({ url: "/site-content" }),
      providesTags: ["SiteContent"],
    }),
    getContent: builder.query<SiteContentResponse | null, SiteContentSlug>({
      query: (slug) => ({ url: `/site-content/${slug}` }),
      providesTags: (_result, _error, slug) => [{ type: "SiteContent", id: slug }],
    }),
    updateContent: builder.mutation<SiteContentResponse, SiteContentDraft>({
      query: ({ slug, ...body }) => ({
        url: `/site-content/${slug}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: (_result, _error, { slug }) => [
        { type: "SiteContent", id: slug },
        "SiteContent",
      ],
    }),
  }),
});

export const { useGetContentsQuery, useGetContentQuery, useUpdateContentMutation } = siteContentApi;
