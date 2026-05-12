import { z } from "zod";

export const createTransactionSchema =
  z.object({
    type: z.string(),

    category: z.string(),

    amount: z.string(),

    description: z.string().optional(),
  });

export type CreateTransactionSchema =
  z.infer<
    typeof createTransactionSchema
  >;