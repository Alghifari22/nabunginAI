"use client";

import axios from "axios";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  createGoalSchema,
  CreateGoalSchema,
} from "../schemas/create-goal-schema";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";

export function CreateGoalForm() {
  const router = useRouter();

  const form = useForm<CreateGoalSchema>({
    resolver: zodResolver(createGoalSchema),

    defaultValues: {
        title: "",
        targetAmount: "",
        dailyTarget: "",
    },
  });

  const onSubmit = async (
    values: CreateGoalSchema
  ) => {
    try {
      await axios.post("/api/goals", {
        ...values,

        targetAmount: Number(values.targetAmount),

        dailyTarget: Number(values.dailyTarget),
      });

      toast.success("Goal created");

      router.refresh();
    } catch {
      toast.error("Failed to create goal");
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label>Goal Name</label>

        <Input
          {...form.register("title")}
          placeholder="Macbook Pro"
        />
      </div>

      <div className="space-y-2">
        <label>Target Amount</label>

        <Input
          type="number"
          {...form.register("targetAmount")}
        />
      </div>

      <div className="space-y-2">
        <label>Daily Saving Target</label>

        <Input
          type="number"
          {...form.register("dailyTarget")}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
      >
        Create Goal
      </Button>
    </form>
  );
}