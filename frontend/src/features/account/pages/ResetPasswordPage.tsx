"use client";

import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "@/lib/router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useResetPasswordMutation } from "@/store/services/authApi";

type Form = { password: string; confirmPassword: string };

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const nav = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Form>();

  useEffect(() => {
    if (!token) {
      toast.error("Reset token is missing");
    }
  }, [token]);

  const onSubmit = async (data: Form) => {
    if (!token) {
      toast.error("Reset token is missing");
      return;
    }

    try {
      const result = await resetPassword({ token, password: data.password }).unwrap();
      toast.success(result.message);
      nav("/login", { replace: true });
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to reset password");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-16 sm:py-24">
      <h1 className="font-display text-3xl sm:text-4xl text-center mb-2">Create a new password</h1>
      <p className="text-center text-muted-foreground mb-10">
        Choose a strong password for your account.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Min 6 characters" },
          })}
          type="password"
          placeholder="New password"
          autoComplete="new-password"
          className="w-full bg-input border border-border px-4 py-3 focus:outline-none focus:border-gold"
        />
        {errors.password && (
          <p className="text-xs text-destructive -mt-2">{errors.password.message}</p>
        )}

        <input
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === watch("password") || "Passwords do not match",
          })}
          type="password"
          placeholder="Confirm new password"
          autoComplete="new-password"
          className="w-full bg-input border border-border px-4 py-3 focus:outline-none focus:border-gold"
        />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive -mt-2">{errors.confirmPassword.message}</p>
        )}

        <button
          disabled={isLoading || !token}
          className="w-full bg-gold-gradient text-onyx py-3 text-xs tracking-[0.25em] uppercase font-medium disabled:opacity-50"
        >
          {isLoading ? "Updating…" : "Update Password"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Back to{" "}
        <Link to="/login" className="text-gold">
          Sign in
        </Link>
      </div>
    </div>
  );
}
