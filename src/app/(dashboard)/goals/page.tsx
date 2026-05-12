import { getServerSession } from "next-auth";

import { authOptions } from "../../lib/auth";

import { prisma } from "../../lib/prisma";

import { CreateGoalForm } from "../../features/goals/components/create-goal-form";

import { GoalCard } from "../../features/goals/components/goal-card";

export default async function GoalsPage() {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email || "",
    },
  });

  const goals = await prisma.goal.findMany({
    include: {
      savings: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Saving Goals</h1>

        <p className="text-muted-foreground">Manage your financial targets</p>
      </div>

      <CreateGoalForm />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
}
