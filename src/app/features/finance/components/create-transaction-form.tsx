"use client";

import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTransactionSchema,
  CreateTransactionSchema,
} from "../schemas/create-transaction-schema";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/app/components/shared/loading-button";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";

// ── Category definitions ──────────────────────────────────────────────────────
const CATEGORIES: Record<"income" | "expense", string[]> = {
  expense: ["Food", "Transport", "Shopping", "Bills", "Health", "Entertainment", "Other"],
  income: ["Salary", "Freelance", "Investment", "Gift", "Other"],
};

// ── Component ─────────────────────────────────────────────────────────────────
export function CreateTransactionForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateTransactionSchema>({
    resolver: zodResolver(createTransactionSchema),
    mode: "onTouched",
    defaultValues: {
      type: "expense",
      category: "",
      customCategory: "",
      amount: "",
      description: "",
    },
  });

  const selectedType = form.watch("type");
  const selectedCategory = form.watch("category");
  const isOther = selectedCategory === "Other";

  const onSubmit = async (values: CreateTransactionSchema) => {
    setIsLoading(true);

    // Resolve final category: use customCategory when "Other" is selected
    const finalCategory =
      values.category === "Other"
        ? (values.customCategory ?? "").trim()
        : values.category;

    try {
      await axios.post("/api/transactions", {
        type: values.type,
        category: finalCategory,
        amount: values.amount,
        description: values.description,
      });

      toast.success("Transaction added successfully!");
      form.reset({
        type: "expense",
        category: "",
        customCategory: "",
        amount: "",
        description: "",
      });
      router.refresh();
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      const message = axiosError.response?.data?.error;
      toast.error(message || "Failed to add transaction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border bg-background/70 backdrop-blur-xl p-6 space-y-5">
      <div>
        <h2 className="font-semibold text-lg">Add Transaction</h2>
        <p className="text-sm text-muted-foreground">Record your income or expense</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* ── Type Toggle ── */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-muted">
          {(["expense", "income"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                form.setValue("type", type, { shouldValidate: false });
                form.setValue("category", "", { shouldValidate: false });
                form.setValue("customCategory", "", { shouldValidate: false });
              }}
              className={cn(
                "py-2.5 rounded-xl text-sm font-medium transition-all capitalize",
                selectedType === type
                  ? type === "expense"
                    ? "bg-destructive text-destructive-foreground shadow-sm"
                    : "bg-emerald-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ── Category Select ── */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select
              {...form.register("category")}
              disabled={isLoading}
              className={cn(
                "w-full h-11 rounded-xl border bg-background px-3 py-2 text-sm",
                "focus:outline-none focus:ring-2 focus:ring-ring transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <option value="">Select category</option>
              {CATEGORIES[selectedType].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {form.formState.errors.category && (
              <p className="text-sm text-destructive">
                {form.formState.errors.category.message}
              </p>
            )}
          </div>

          {/* ── Amount ── */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount (Rp)</label>
            <Input
              type="number"
              min="0"
              placeholder="e.g. 150000"
              {...form.register("amount")}
              disabled={isLoading}
              className="h-11"
            />
            {form.formState.errors.amount && (
              <p className="text-sm text-destructive">
                {form.formState.errors.amount.message}
              </p>
            )}
          </div>
        </div>

        {/* ── Custom Category Input (shown when "Other" is selected) ── */}
        {isOther && (
          <div
            className="space-y-2"
            style={{ animation: "splashFadeUp 0.2s ease-out forwards" }}
          >
            <label className="text-sm font-medium">
              Custom Category
              <span className="ml-1 text-xs text-muted-foreground font-normal">
                — type your own
              </span>
            </label>
            <Input
              placeholder="e.g. Nongkrong, Game, Freelance"
              {...form.register("customCategory")}
              disabled={isLoading}
              className="h-11"
              autoFocus
            />
            {form.formState.errors.customCategory && (
              <p className="text-sm text-destructive">
                {form.formState.errors.customCategory.message}
              </p>
            )}
          </div>
        )}

        {/* ── Description ── */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Description{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <Input
            placeholder="e.g. Lunch at warung"
            {...form.register("description")}
            disabled={isLoading}
            className="h-11"
          />
        </div>

        <LoadingButton
          type="submit"
          className="w-full"
          loading={isLoading}
          loadingText="Adding transaction..."
        >
          Add Transaction
        </LoadingButton>
      </form>
    </div>
  );
}
