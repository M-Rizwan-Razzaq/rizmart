"use client";

import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "@/lib/router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store";
import { registerThunk, clearError } from "@/store/slices/authSlice";
import { DEFAULT_BRAND_FORM } from "@/lib/brand";
import { useGetBrandSettingsQuery } from "@/store/services/brandApi";

type Form = { name: string; email: string; password: string };
type RegisterState = { email?: string; name?: string } | null;

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((s) => s.auth);
  const nav = useNavigate();
  const { state } = useLocation() as { state: RegisterState };
  const { data: brand } = useGetBrandSettingsQuery();
  const appName = brand?.appName?.trim() || DEFAULT_BRAND_FORM.appName;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    defaultValues: { email: state?.email ?? "", name: state?.name ?? "" },
  });

  useEffect(() => {
    if (user) nav("/account", { state: { tab: "orders" }, replace: true });
  }, [user, nav]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data: Form) => {
    const result = await dispatch(registerThunk(data));
    if (registerThunk.fulfilled.match(result)) {
      toast.success(`Account created! Welcome to ${appName}.`);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#E6E8EC] p-7 sm:p-9 shadow-xs">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#193B63] text-center mb-1.5">
          Create Account
        </h1>
        <p className="text-center text-xs text-[#627184] mb-8">
          Register with {appName} for quick checkout and order tracking
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#627184] mb-1">
              Full Name
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              placeholder="e.g. Asad Khan"
              className="w-full bg-[#FAF9F6] border border-[#E6E8EC] rounded-lg px-3.5 py-2.5 text-sm text-[#263445] focus:outline-none focus:border-[#193B63]"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#627184] mb-1">
              Email Address
            </label>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              placeholder="name@example.com"
              className="w-full bg-[#FAF9F6] border border-[#E6E8EC] rounded-lg px-3.5 py-2.5 text-sm text-[#263445] focus:outline-none focus:border-[#193B63]"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#627184] mb-1">
              Password (Min. 6 Characters)
            </label>
            <input
              {...register("password", {
                required: "Password required",
                minLength: { value: 6, message: "Min 6 characters" },
              })}
              type="password"
              placeholder="••••••••"
              className="w-full bg-[#FAF9F6] border border-[#E6E8EC] rounded-lg px-3.5 py-2.5 text-sm text-[#263445] focus:outline-none focus:border-[#193B63]"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            disabled={loading}
            className="w-full bg-[#193B63] hover:bg-[#132D4C] active:bg-[#0E223B] text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#627184]">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-[#193B63] hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
