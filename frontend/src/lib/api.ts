import axios from "axios";
import { STORAGE_KEYS } from "@/lib/storageKeys";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem(STORAGE_KEYS.authToken) ?? localStorage.getItem("luxora_token");
  }
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Unwrap the { success, data } envelope returned by the backend
api.interceptors.response.use(
  (res) => {
    if (res.data && "data" in res.data) res.data = res.data.data;
    return res;
  },
  (error) => {
    const msg =
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message ??
      "An error occurred";
    return Promise.reject(new Error(msg));
  },
);

export default api;
