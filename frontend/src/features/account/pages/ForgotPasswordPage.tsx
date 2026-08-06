"use client";

import { Link } from "@/lib/router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useForgotPasswordMutation } from "@/store/services/authApi";

type Form = { email: string };

export default function ForgotPasswordPage() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>();

  const onSubmit = async (data: Form) => {
    try {
      const result = await forgotPassword({ email: data.email.trim() }).unwrap();
      toast.success(result.message);
      if (result.resetUrl) {
        toast.info(`Dev reset link: ${result.resetUrl}`);
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to send reset link");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-16 sm:py-24">
      <h1 className="font-display text-3xl sm:text-4xl text-center mb-2">Reset your password</h1>
      <p className="text-center text-muted-foreground mb-10">
        Enter your email and we'll send you a link.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("email", { required: "Email is required" })}
          type="email"
          required
          placeholder="Email"
          className="w-full bg-input border border-border px-4 py-3 focus:outline-none focus:border-gold"
        />
        {errors.email && <p className="text-xs text-destructive -mt-2">{errors.email.message}</p>}
        <button
          disabled={isLoading}
          className="w-full bg-gold-gradient text-onyx py-3 text-xs tracking-[0.25em] uppercase font-medium disabled:opacity-50"
        >
          {isLoading ? "Sending…" : "Send Reset Link"}
        </button>
      </form>
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Remembered?{" "}
        <Link to="/login" className="text-gold">
          Sign in
        </Link>
      </div>
    </div>
  );
}
