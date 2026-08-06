"use client";

import { useEffect, type ReactNode } from "react";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { store, useAppDispatch, useAppSelector } from "@/store";
import { fetchMeThunk } from "@/store/slices/authSlice";
import { useGetThemeQuery } from "@/store/services/themeApi";
import { applyThemeColors } from "@/lib/theme";
import { useLocation } from "@/lib/router";

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
      <ScrollToTop />
      {children}
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: "oklch(0.17 0.006 60)",
            border: "1px solid oklch(0.28 0.008 70 / 60%)",
            color: "oklch(0.96 0.01 80)",
          },
        }}
      />
    </Provider>
  );
}
