import { CreateGoalForm } from "../../features/goals/components/create-goal-form";

export default function GoalsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Saving Goals
        </h1>

        <p className="text-muted-foreground">
          Manage your financial targets
        </p>
      </div>

      <CreateGoalForm />
    </div>
  );
}