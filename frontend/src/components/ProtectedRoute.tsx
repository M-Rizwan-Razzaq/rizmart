"use client";

import { useEffect, useState } from "react";
import { Navigate, useLocation } from "@/lib/router";
import { useAppSelector } from "@/store";
import PageSpinner from "@/components/PageSpinner";

type Props = {
  role: "admin" | "customer";
  children: React.ReactNode;
};

export default function ProtectedRoute({ role, children }: Props) {
  // Auth state lives in localStorage, so it's unavailable during SSR. Gate on
  // mount so the server HTML and the first client render match, avoiding a
  // hydration mismatch between the server's redirect and the client's content.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const user = useAppSelector((s) => s.auth.user);
  const token = useAppSelector((s) => s.auth.token);
  const location = useLocation();

  if (!mounted) {
    return <PageSpinner />;
  }

  if (!token && !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
