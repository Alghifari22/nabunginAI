"use client";

import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createGoalSchema, CreateGoalSchema } from "../schemas/create-goal-schema";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/app/components/shared/loading-button";
import { toast } from "sonner";
import { useState } from "react";

export function CreateGoalForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateGoalSchema>({
    resolver: zodResolver(createGoalSchema),
    mode: "onTouched",
    defaultValues: {
      title: "",
      targetAmount: "",
      dailyTarget: "",
    },
  });

  const onSubmit = async (values: CreateGoalSchema) => {
    setIsLoading(true);

    try {
      await axios.post("/api/goals", {
        ...values,
        targetAmount: Number(values.targetAmount),
        dailyTarget: Number(values.dailyTarget),
      });

      toast.success("Goal created successfully!");
      form.reset();
      router.refresh();
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      const message = axiosError.response?.data?.error;
      toast.error(message || "Failed to create goal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border bg-background/70 backdrop-blur-xl p-6 space-y-5">
      <div>
        <h2 className="font-semibold text-lg">New Saving Goal</h2>
        <p className="text-sm text-muted-foreground">Set a target and start saving</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Goal Name</label>
          <Input
            {...form.register("title")}
            placeholder="e.g. Macbook Pro, Vacation Fund"
            disabled={isLoading}
            className="h-11"
          />
          {form.formState.errors.title && (
            <p className="text-sm text-destructive">
              {form.formState.errors.title.message || "Goal name must be at least 3 characters"}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Amount (Rp)</label>
            <Input
              type="number"
              min="0"
              {...form.register("targetAmount")}
              placeholder="e.g. 20000000"
              disabled={isLoading}
              className="h-11"
            />
            {form.formState.errors.targetAmount && (
              <p className="text-sm text-destructive">
                {form.formState.errors.targetAmount.message || "Enter a valid amount"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Daily Saving Target (Rp)</label>
            <Input
              type="number"
              min="0"
              {...form.register("dailyTarget")}
              placeholder="e.g. 50000"
              disabled={isLoading}
              className="h-11"
            />
            {form.formState.errors.dailyTarget && (
              <p className="text-sm text-destructive">
                {form.formState.errors.dailyTarget.message || "Enter a valid daily target"}
              </p>
            )}
          </div>
        </div>

        <LoadingButton
          type="submit"
          className="w-full"
          loading={isLoading}
          loadingText="Creating goal..."
        >
          Create Goal
        </LoadingButton>
      </form>
    </div>
  );
}