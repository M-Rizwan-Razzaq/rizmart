import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./baseQuery";

export interface PromotionRecipientSummary {
  totalUniqueRecipients: number;
  userEmails: number;
  orderEmails: number;
  newsletterEmails: number;
  duplicateEmails: number;
}

export interface SendPromotionPayload {
  subject: string;
  message: string;
}

export interface SendPromotionResponse extends PromotionRecipientSummary {
  sent: number;
}

export const marketingApi = createApi({
  reducerPath: "marketingApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Marketing"],
  endpoints: (builder) => ({
    getPromotionRecipients: builder.query<PromotionRecipientSummary, void>({
      query: () => ({ url: "/marketing/promotion-recipients" }),
      providesTags: ["Marketing"],
    }),
    sendPromotionEmails: builder.mutation<SendPromotionResponse, SendPromotionPayload>({
      query: (body) => ({ url: "/marketing/promotion-emails", method: "POST", data: body }),
      invalidatesTags: ["Marketing"],
    }),
  }),
});

export const { useGetPromotionRecipientsQuery, useSendPromotionEmailsMutation } = marketingApi;
