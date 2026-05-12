import { Goal } from "@prisma/client";

import { Card, CardContent } from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

import { formatRupiah } from "../../../utils/format-rupiah";

type GoalCardProps = {
  goal: Goal;
};

export function GoalCard({
  goal,
}: GoalCardProps) {
  const progress =
    (goal.savedAmount / goal.targetAmount) * 100;

  const remainingAmount =
    goal.targetAmount - goal.savedAmount;

  const estimatedDays = Math.ceil(
    remainingAmount / goal.dailyTarget
  );

  return (
    <Card className="border-none shadow-xl">
      <CardContent className="p-6 space-y-5">
        <div className="space-y-1">
          <h2 className="text-xl font-bold">
            {goal.title}
          </h2>

          <p className="text-sm text-muted-foreground">
            Target: {formatRupiah(goal.targetAmount)}
          </p>
        </div>

        <Progress value={progress} />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Saved
            </p>

            <h3 className="text-lg font-semibold">
              {formatRupiah(goal.savedAmount)}
            </h3>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Progress
            </p>

            <h3 className="text-lg font-semibold">
              {progress.toFixed(1)}%
            </h3>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Daily Target
            </p>

            <h3 className="text-lg font-semibold">
              {formatRupiah(goal.dailyTarget)}
            </h3>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Estimated
            </p>

            <h3 className="text-lg font-semibold">
              {estimatedDays} days
            </h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}