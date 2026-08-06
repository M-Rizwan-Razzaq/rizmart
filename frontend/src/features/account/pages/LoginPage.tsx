"use client";

import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "@/lib/router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store";
import { loginThunk, clearError } from "@/store/slices/authSlice";

type Form = { email: string; password: string };
type LocationState = { from?: string } | null;

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((s) => s.auth);
  const nav = useNavigate();
  const { state } = useLocation() as { state: LocationState };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      nav(user.role === "admin" ? "/admin" : (state?.from ?? "/account"), { replace: true });
    }
  }, [user, nav, state?.from]);

  // Show server error as toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data: Form) => {
    const result = await dispatch(loginThunk(data));
    if (loginThunk.fulfilled.match(result)) {
      toast.success("Signed in");
      const role = result.payload.user.role;
      nav(role === "admin" ? "/admin" : (state?.from ?? "/account"), { replace: true });
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-16 sm:py-24">
      <h1 className="font-display text-3xl sm:text-4xl text-center mb-2">Welcome back</h1>
      <p className="text-center text-muted-foreground mb-10">Sign in to your account</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("email", { required: "Email is required" })}
          type="email"
          placeholder="Email"
          autoComplete="email"
          className="w-full bg-input border border-border px-4 py-3 focus:outline-none focus:border-gold"
        />
        {errors.email && <p className="text-xs text-destructive -mt-2">{errors.email.message}</p>}

        <input
          {...register("password", { required: "Password is required" })}
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          className="w-full bg-input border border-border px-4 py-3 focus:outline-none focus:border-gold"
        />
        {errors.password && (
          <p className="text-xs text-destructive -mt-2">{errors.password.message}</p>
        )}

        <Link
          to="/forgot-password"
          className="block text-right text-xs text-muted-foreground hover:text-gold"
        >
          Forgot password?
        </Link>

        <button
          disabled={loading}
          className="w-full bg-gold-gradient text-onyx py-3 text-xs tracking-[0.25em] uppercase font-medium disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link to="/register" className="text-gold">
          Create an account
        </Link>
      </div>
    </div>
  );
}
