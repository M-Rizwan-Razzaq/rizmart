import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./baseQuery";

export type ContactFormPayload = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export const contactApi = createApi({
  reducerPath: "contactApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    sendContactMessage: builder.mutation<{ sent: boolean }, ContactFormPayload>({
      query: (body) => ({ url: "/contact", method: "POST", data: body }),
    }),
  }),
});

export const { useSendContactMessageMutation } = contactApi;
