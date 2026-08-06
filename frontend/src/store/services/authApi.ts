import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./baseQuery";

export type ForgotPasswordResponse = {
  message: string;
  resetUrl?: string;
};

export type ResetPasswordResponse = {
  message: string;
};

export type ChangePasswordResponse = {
  message: string;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    forgotPassword: builder.mutation<ForgotPasswordResponse, { email: string }>({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", data: body }),
    }),
    resetPassword: builder.mutation<ResetPasswordResponse, { token: string; password: string }>({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", data: body }),
    }),
    changePassword: builder.mutation<
      ChangePasswordResponse,
      { currentPassword: string; newPassword: string }
    >({
      query: (body) => ({ url: "/users/me/password", method: "PATCH", data: body }),
    }),
  }),
});

export const { useForgotPasswordMutation, useResetPasswordMutation, useChangePasswordMutation } =
  authApi;
