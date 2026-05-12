import { z } from "zod";

export const createGoalSchema = z.object({
  title: z.string().min(3),

  targetAmount: z.string(),

  dailyTarget: z.string(),
});

export type CreateGoalSchema = z.infer<
  typeof createGoalSchema
>;