import { Goal, Saving } from "@prisma/client";
import { Progress } from "@/components/ui/progress";
import { formatRupiah } from "../../../utils/format-rupiah";
import { AddSavingForm } from "./add-saving-form";
import { CheckCircle2, Target } from "lucide-react";
import { cn } from "@/lib/utils";

type GoalCardProps = {
  goal: Goal & {
    savings: Saving[];
  };
};

export function GoalCard({ goal }: GoalCardProps) {
  const progress = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
  const remainingAmount = Math.max(goal.targetAmount - goal.savedAmount, 0);
  const estimatedDays = remainingAmount > 0 ? Math.ceil(remainingAmount / goal.dailyTarget) : 0;
  const isCompleted = progress >= 100;

  return (
    <div
      className={cn(
        "rounded-3xl border p-6 space-y-5 transition-all duration-200",
        "bg-background/70 backdrop-blur-xl hover:shadow-lg",
        isCompleted && "border-emerald-500/50 bg-emerald-500/5"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold truncate">{goal.title}</h2>
            {isCompleted && (
              <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Target: {formatRupiah(goal.targetAmount)}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <span
            className={cn(
              "text-xs font-semibold px-2.5 py-1 rounded-full",
              isCompleted
                ? "bg-emerald-500/15 text-emerald-600"
                : "bg-muted text-muted-foreground"
            )}
          >
            {isCompleted ? "Completed" : `${progress.toFixed(1)}%`}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <Progress
          value={progress}
          className={cn("h-2.5", isCompleted && "[&>div]:bg-emerald-500")}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatRupiah(goal.savedAmount)} saved</span>
          <span>{formatRupiah(remainingAmount)} left</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-muted/50 p-3 space-y-0.5">
          <p className="text-xs text-muted-foreground">Daily Target</p>
          <p className="text-sm font-semibold">{formatRupiah(goal.dailyTarget)}</p>
        </div>
        <div className="rounded-2xl bg-muted/50 p-3 space-y-0.5">
          <p className="text-xs text-muted-foreground">Est. Completion</p>
          <p className="text-sm font-semibold">
            {isCompleted ? "Done!" : `${estimatedDays} days`}
          </p>
        </div>
      </div>

      {/* Add Saving Form */}
      {!isCompleted && <AddSavingForm goalId={goal.id} />}

      {/* Recent Savings */}
      {goal.savings.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Recent Savings
          </p>
          <div className="space-y-1.5">
            {goal.savings.slice(0, 3).map((saving) => (
              <div
                key={saving.id}
                className="flex items-center justify-between text-sm p-2.5 rounded-xl bg-muted/40"
              >
                <span className="font-medium text-emerald-600">
                  +{formatRupiah(saving.amount)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(saving.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty savings state */}
      {goal.savings.length === 0 && !isCompleted && (
        <p className="text-xs text-muted-foreground text-center py-1">
          No savings recorded yet. Start adding!
        </p>
      )}
    </div>
  );
}
