"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/app/components/shared/loading-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const editGoalSchema = z.object({
  title: z.string().min(3, "Goal name must be at least 3 characters"),
  targetAmount: z.string().min(1, "Target amount is required"),
  dailyTarget: z.string().min(1, "Daily target is required"),
});

type EditGoalSchema = z.infer<typeof editGoalSchema>;

interface GoalForEdit {
  id: string;
  title: string;
  targetAmount: number;
  dailyTarget: number;
}

interface EditGoalDialogProps {
  goal: GoalForEdit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditGoalDialog({ goal, open, onOpenChange }: EditGoalDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EditGoalSchema>({
    resolver: zodResolver(editGoalSchema),
    mode: "onTouched",
    defaultValues: {
      title: goal.title,
      targetAmount: String(goal.targetAmount),
      dailyTarget: String(goal.dailyTarget),
    },
  });

  useEffect(() => {
    form.reset({
      title: goal.title,
      targetAmount: String(goal.targetAmount),
      dailyTarget: String(goal.dailyTarget),
    });
  }, [goal]);

  const onSubmit = async (values: EditGoalSchema) => {
    setIsLoading(true);
    try {
      await axios.patch("/api/goals", {
        id: goal.id,
        title: values.title,
        targetAmount: Number(values.targetAmount),
        dailyTarget: Number(values.dailyTarget),
      });
      toast.success("Goal updated successfully!");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      toast.error(axiosError.response?.data?.error || "Failed to update goal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Goal</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Goal Name</label>
            <Input
              {...form.register("title")}
              placeholder="e.g. Macbook Pro"
              disabled={isLoading}
              className="h-11"
            />
            {form.formState.errors.title && (
              <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Amount (Rp)</label>
              <Input
                type="number"
                min="0"
                {...form.register("targetAmount")}
                disabled={isLoading}
                className="h-11"
              />
              {form.formState.errors.targetAmount && (
                <p className="text-xs text-destructive">{form.formState.errors.targetAmount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Daily Target (Rp)</label>
              <Input
                type="number"
                min="0"
                {...form.register("dailyTarget")}
                disabled={isLoading}
                className="h-11"
              />
              {form.formState.errors.dailyTarget && (
                <p className="text-xs text-destructive">{form.formState.errors.dailyTarget.message}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <LoadingButton
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </LoadingButton>
            <LoadingButton
              type="submit"
              className="flex-1"
              loading={isLoading}
              loadingText="Saving..."
            >
              Save Changes
            </LoadingButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
