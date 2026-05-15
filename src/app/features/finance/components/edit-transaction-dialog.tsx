"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/app/components/shared/loading-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Transaction } from "./transaction-list";

const CATEGORIES: Record<"income" | "expense", string[]> = {
  expense: ["Food", "Transport", "Shopping", "Bills", "Health", "Entertainment", "Other"],
  income: ["Salary", "Freelance", "Investment", "Gift", "Other"],
};

const editSchema = z.object({
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Please select a category"),
  customCategory: z.string().optional(),
  amount: z.string().min(1, "Amount is required"),
  description: z.string().optional(),
}).refine(
  (data) => {
    if (data.category === "Other") {
      return !!data.customCategory && data.customCategory.trim().length >= 2;
    }
    return true;
  },
  { message: "Please enter a custom category (min 2 characters)", path: ["customCategory"] }
);

type EditSchema = z.infer<typeof editSchema>;

interface EditTransactionDialogProps {
  transaction: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTransactionDialog({
  transaction,
  open,
  onOpenChange,
}: EditTransactionDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const isKnownCategory = (type: string, cat: string) =>
    CATEGORIES[type as "income" | "expense"]?.includes(cat);

  const initialCategory = isKnownCategory(transaction.type, transaction.category)
    ? transaction.category
    : "Other";
  const initialCustom = initialCategory === "Other" ? transaction.category : "";

  const form = useForm<EditSchema>({
    resolver: zodResolver(editSchema),
    mode: "onTouched",
    defaultValues: {
      type: transaction.type as "income" | "expense",
      category: initialCategory,
      customCategory: initialCustom,
      amount: String(transaction.amount),
      description: transaction.description ?? "",
    },
  });

  const selectedType = form.watch("type");
  const selectedCategory = form.watch("category");
  const isOther = selectedCategory === "Other";

  // Reset form when transaction changes
  useEffect(() => {
    const cat = isKnownCategory(transaction.type, transaction.category)
      ? transaction.category
      : "Other";
    form.reset({
      type: transaction.type as "income" | "expense",
      category: cat,
      customCategory: cat === "Other" ? transaction.category : "",
      amount: String(transaction.amount),
      description: transaction.description ?? "",
    });
  }, [transaction]);

  const onSubmit = async (values: EditSchema) => {
    setIsLoading(true);
    const finalCategory =
      values.category === "Other"
        ? (values.customCategory ?? "").trim()
        : values.category;

    try {
      await axios.patch("/api/transactions", {
        id: transaction.id,
        type: values.type,
        category: finalCategory,
        amount: values.amount,
        description: values.description,
      });
      toast.success("Transaction updated!");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      toast.error(axiosError.response?.data?.error || "Failed to update transaction");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Type Toggle */}
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

          <div className="grid grid-cols-2 gap-3">
            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                {...form.register("category")}
                disabled={isLoading}
                className="w-full h-11 rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              >
                <option value="">Select category</option>
                {CATEGORIES[selectedType].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {form.formState.errors.category && (
                <p className="text-xs text-destructive">{form.formState.errors.category.message}</p>
              )}
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount (Rp)</label>
              <Input
                type="number"
                min="0"
                {...form.register("amount")}
                disabled={isLoading}
                className="h-11"
              />
              {form.formState.errors.amount && (
                <p className="text-xs text-destructive">{form.formState.errors.amount.message}</p>
              )}
            </div>
          </div>

          {/* Custom Category */}
          {isOther && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Custom Category</label>
              <Input
                placeholder="e.g. Nongkrong, Game"
                {...form.register("customCategory")}
                disabled={isLoading}
                className="h-11"
                autoFocus
              />
              {form.formState.errors.customCategory && (
                <p className="text-xs text-destructive">{form.formState.errors.customCategory.message}</p>
              )}
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Description <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Input
              placeholder="e.g. Lunch at warung"
              {...form.register("description")}
              disabled={isLoading}
              className="h-11"
            />
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
