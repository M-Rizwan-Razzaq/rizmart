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
    <div className="bg-[#FAF9F6] min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#E6E8EC] p-7 sm:p-9 shadow-xs">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#193B63] text-center mb-1.5">
          Welcome Back
        </h1>
        <p className="text-center text-xs text-[#627184] mb-8">
          Sign in to manage your bag orders & profile
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#627184] mb-1">
              Email Address
            </label>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              className="w-full bg-[#FAF9F6] border border-[#E6E8EC] rounded-lg px-3.5 py-2.5 text-sm text-[#263445] focus:outline-none focus:border-[#193B63]"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#627184] mb-1">
              Password
            </label>
            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full bg-[#FAF9F6] border border-[#E6E8EC] rounded-lg px-3.5 py-2.5 text-sm text-[#263445] focus:outline-none focus:border-[#193B63]"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-[#627184] hover:text-[#193B63]"
            >
              Forgot password?
            </Link>
          </div>

          <button
            disabled={loading}
            className="w-full bg-[#193B63] hover:bg-[#132D4C] active:bg-[#0E223B] text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
          >
            {loading ? "Signing in…" : "Sign In to RizMart"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#627184]">
          New customer?{" "}
          <Link to="/register" className="font-bold text-[#193B63] hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
