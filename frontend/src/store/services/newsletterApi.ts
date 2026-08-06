import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./baseQuery";

export interface NewsletterSubscribeResponse {
  subscribed: boolean;
  alreadySubscribed?: boolean;
}

export const newsletterApi = createApi({
  reducerPath: "newsletterApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Newsletter"],
  endpoints: (builder) => ({
    subscribeNewsletter: builder.mutation<NewsletterSubscribeResponse, { email: string }>({
      query: (body) => ({ url: "/newsletter/subscribe", method: "POST", data: body }),
    }),
  }),
});

export const { useSubscribeNewsletterMutation } = newsletterApi;
