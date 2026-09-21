"use client";

import { useEffect, type ReactNode } from "react";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { store, useAppDispatch, useAppSelector } from "@/store";
import { fetchMeThunk } from "@/store/slices/authSlice";
import { useGetThemeQuery } from "@/store/services/themeApi";
import { applyThemeColors } from "@/lib/theme";
import { useLocation } from "@/lib/router";
import { BASE_URL } from "@/lib/api";

function ThemeBootstrap() {
  const { data } = useGetThemeQuery();

  useEffect(() => {
    applyThemeColors(data);
  }, [data]);

  return null;
}

function AuthBootstrap() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);

  // Rehydrate user from token on every page load/refresh
  useEffect(() => {
    if (token) dispatch(fetchMeThunk());
  }, [dispatch, token]);

  return null;
}

/** Pings the backend on first load so Render's free-tier instance wakes up
 *  before the user actually tries to browse products/categories. */
function BackendWakeUp() {
  useEffect(() => {
    // Fire and forget — we only need to wake the server, not read the response
    fetch(`${BASE_URL}/products?page=1&limit=1`).catch(() => {});
  }, []);

  return null;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeBootstrap />
      <AuthBootstrap />
      <BackendWakeUp />
      <ScrollToTop />
      {children}
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: "#2b251f",
            border: "1px solid #5b4b3b",
            color: "#f7f1e3",
          },
        }}
      />
    </Provider>
  );
}
