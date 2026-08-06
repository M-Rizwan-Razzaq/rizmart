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
    <div className="mx-auto max-w-md px-4 sm:px-6 py-16 sm:py-24">
      <h1 className="font-display text-3xl sm:text-4xl text-center mb-2">Create your account</h1>
      <p className="text-center text-muted-foreground mb-10">Join the {appName} circle</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("name", { required: "Name is required" })}
          placeholder="Full name"
          className="w-full bg-input border border-border px-4 py-3 focus:outline-none focus:border-gold"
        />
        {errors.name && <p className="text-xs text-destructive -mt-2">{errors.name.message}</p>}

        <input
          {...register("email", { required: "Email is required" })}
          type="email"
          placeholder="Email"
          className="w-full bg-input border border-border px-4 py-3 focus:outline-none focus:border-gold"
        />
        {errors.email && <p className="text-xs text-destructive -mt-2">{errors.email.message}</p>}

        <input
          {...register("password", {
            required: "Password required",
            minLength: { value: 6, message: "Min 6 characters" },
          })}
          type="password"
          placeholder="Password"
          className="w-full bg-input border border-border px-4 py-3 focus:outline-none focus:border-gold"
        />
        {errors.password && (
          <p className="text-xs text-destructive -mt-2">{errors.password.message}</p>
        )}

        <button
          disabled={loading}
          className="w-full bg-gold-gradient text-onyx py-3 text-xs tracking-[0.25em] uppercase font-medium disabled:opacity-50"
        >
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already a member?{" "}
        <Link to="/login" className="text-gold">
          Sign in
        </Link>
      </div>
    </div>
  );
}
