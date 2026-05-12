import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { CreateGoalForm } from "../../features/goals/components/create-goal-form";
import { GoalCard } from "../../features/goals/components/goal-card";
import { EmptyState } from "../../components/shared/empty-state";
import { SectionHeader } from "../../components/shared/section-header";
import { PageContainer } from "../../components/shared/page-container";
import { PiggyBank } from "lucide-react";

export default async function GoalsPage() {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email || "",
    },
  });

  const goals = await prisma.goal.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      savings: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <PageContainer>
      <SectionHeader
        title="Saving Goals"
        description="Set targets and track your saving progress"
      />

      <CreateGoalForm />

      {goals.length === 0 ? (
        <EmptyState
          icon={PiggyBank}
          title="No saving goals yet"
          description="Create your first saving goal above and start building your financial future."
        />
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
