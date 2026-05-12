import { z } from "zod";

export const createTransactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Please select a category"),
  customCategory: z.string().optional(),
  amount: z.string().min(1, "Amount is required"),
  description: z.string().optional(),
}).refine(
  (data) => {
    // If category is "Other", customCategory must be filled
    if (data.category === "Other") {
      return !!data.customCategory && data.customCategory.trim().length >= 2;
    }
    return true;
  },
  {
    message: "Please enter a custom category (min 2 characters)",
    path: ["customCategory"],
  }
);

export type CreateTransactionSchema = z.infer<typeof createTransactionSchema>;
