"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/app/components/shared/loading-button";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordSchema = z.infer<typeof passwordSchema>;

export function PasswordForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PasswordSchema>({
    resolver: zodResolver(passwordSchema),
    mode: "onTouched",
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (values: PasswordSchema) => {
    setIsLoading(true);
    try {
      await axios.patch("/api/settings/password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success("Password changed successfully!");
      form.reset();
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      const message = axiosError.response?.data?.error;
      if (message === "Current password is incorrect") {
        form.setError("currentPassword", { message });
      }
      toast.error(message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Current Password</label>
        <Input
          type="password"
          {...form.register("currentPassword")}
          placeholder="Enter current password"
          disabled={isLoading}
          className="h-11"
        />
        {form.formState.errors.currentPassword && (
          <p className="text-sm text-destructive">{form.formState.errors.currentPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">New Password</label>
        <Input
          type="password"
          {...form.register("newPassword")}
          placeholder="At least 6 characters"
          disabled={isLoading}
          className="h-11"
        />
        {form.formState.errors.newPassword && (
          <p className="text-sm text-destructive">{form.formState.errors.newPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Confirm New Password</label>
        <Input
          type="password"
          {...form.register("confirmPassword")}
          placeholder="Repeat new password"
          disabled={isLoading}
          className="h-11"
        />
        {form.formState.errors.confirmPassword && (
          <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
        )}
      </div>

      <LoadingButton
        type="submit"
        loading={isLoading}
        loadingText="Changing password..."
        className="w-full"
      >
        Change Password
      </LoadingButton>
    </form>
  );
}
