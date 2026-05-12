"use client";

import axios from "axios";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  createTransactionSchema,
  CreateTransactionSchema,
} from "../schemas/create-transaction-schema";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";

export function CreateTransactionForm() {
  const router = useRouter();

  const form =
    useForm<CreateTransactionSchema>({
      resolver: zodResolver(
        createTransactionSchema
      ),

      defaultValues: {
        type: "expense",

        category: "",

        amount: "",

        description: "",
      },
    });

  const onSubmit = async (
    values: CreateTransactionSchema
  ) => {
    try {
      await axios.post(
        "/api/transactions",
        values
      );

      toast.success(
        "Transaction created"
      );

      router.refresh();
    } catch {
      toast.error(
        "Failed to create transaction"
      );
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <select
        {...form.register("type")}
        className="
          w-full rounded-md border
          bg-background px-3 py-2
        "
      >
        <option value="income">
          Income
        </option>

        <option value="expense">
          Expense
        </option>
      </select>

      <Input
        placeholder="Category"
        {...form.register("category")}
      />

      <Input
        type="number"
        placeholder="Amount"
        {...form.register("amount")}
      />

      <Input
        placeholder="Description"
        {...form.register(
          "description"
        )}
      />

      <Button
        type="submit"
        className="w-full"
      >
        Add Transaction
      </Button>
    </form>
  );
}