"use client";

import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterSchema } from "../schemas/register-schema";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/app/components/shared/loading-button";
import { toast } from "sonner";
import { useState } from "react";

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterSchema) => {
    setIsLoading(true);

    try {
      await axios.post("/api/register", values);
      toast.success("Account created! Please sign in.");
      router.push("/login");
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      const message = axiosError.response?.data?.error;

      if (message === "Email already exists") {
        toast.error("This email is already registered.");
        form.setError("email", { message: "Email already in use" });
      } else {
        toast.error(message || "Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium">Full Name</label>
        <Input
          {...form.register("name")}
          placeholder="John Doe"
          disabled={isLoading}
          className="h-11"
        />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">
            {form.formState.errors.name.message || "Name must be at least 3 characters"}
          </p>
        )}
      </div>

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
          placeholder="At least 6 characters"
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
        loadingText="Creating account..."
      >
        Create Account
      </LoadingButton>
    </form>
  );
}