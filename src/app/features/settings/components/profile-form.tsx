"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/app/components/shared/loading-button";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});
type ProfileSchema = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  initialName: string;
  email: string;
}

export function ProfileForm({ initialName, email }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    mode: "onTouched",
    defaultValues: { name: initialName },
  });

  const onSubmit = async (values: ProfileSchema) => {
    setIsLoading(true);
    try {
      await axios.patch("/api/settings/profile", { name: values.name });
      toast.success("Profile updated successfully!");
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      toast.error(axiosError.response?.data?.error || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Full Name</label>
        <Input
          {...form.register("name")}
          placeholder="Your name"
          disabled={isLoading}
          className="h-11"
        />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Email</label>
        <Input value={email} disabled className="h-11 opacity-60" />
        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
      </div>

      <LoadingButton
        type="submit"
        loading={isLoading}
        loadingText="Saving..."
        className="w-full"
      >
        Save Profile
      </LoadingButton>
    </form>
  );
}
