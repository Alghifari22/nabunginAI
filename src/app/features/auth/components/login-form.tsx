"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "../schemas/login-schema";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/app/components/shared/loading-button";
import { toast } from "sonner";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginSchema) => {
    setIsLoading(true);

    try {
      const response = await signIn("credentials", {
        ...values,
        redirect: false,
      });

      if (response?.error) {
        toast.error("Invalid email or password");
        return;
      }

      toast.success("Login successful");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input
          {...form.register("email")}
          placeholder="john@mail.com"
          type="email"
          disabled={isLoading}
          className="h-11"
        />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message || "Invalid email address"}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <Input
          type="password"
          {...form.register("password")}
          placeholder="Enter your password"
          disabled={isLoading}
          className="h-11"
        />
        {form.formState.errors.password && (
          <p className="text-sm text-destructive">
            {form.formState.errors.password.message || "Password must be at least 6 characters"}
          </p>
        )}
      </div>

      <LoadingButton
        type="submit"
        className="w-full"
        loading={isLoading}
        loadingText="Signing in..."
      >
        Sign In
      </LoadingButton>
    </form>
  );
}