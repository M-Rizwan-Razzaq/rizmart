import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios, { type AxiosRequestConfig, type AxiosError } from "axios";
import api from "@/lib/api";

/**
 * RTK Query base query that delegates to our configured axios instance.
 * The instance already handles JWT injection and the { success, data } envelope.
 */
export const axiosBaseQuery =
  (): BaseQueryFn<
    { url: string; method?: AxiosRequestConfig["method"]; data?: unknown; params?: unknown },
    unknown,
    string
  > =>
  async ({ url, method = "GET", data, params }) => {
    try {
      const result = await api({ url, method, data, params });
      return { data: result.data };
    } catch (err) {
      const error = err as AxiosError | Error;
      return {
        error: (error as AxiosError).response?.data
          ? (((error as AxiosError).response!.data as any)?.message ?? error.message)
          : error.message,
      };
    }
  };
