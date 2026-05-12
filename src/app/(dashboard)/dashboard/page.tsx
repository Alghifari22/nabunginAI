import { getServerSession } from "next-auth";

import { authOptions } from "../../lib/auth";

import { prisma } from "../../lib/prisma";

import { AIInsightCard } from "../../features/ai/components/ai-insight-card";

import { generateFinancialInsight } from "../../features/ai/services/generate-financial-insight";

import { formatRupiah } from "../../utils/format-rupiah";

import { FinanceChart } from "../../features/finance/components/finance-chart";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email || "",
    },
  });

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: user?.id,
    },
  });

  const goals = await prisma.goal.findMany({
    where: {
      userId: user?.id,
    },
  });

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const balance = totalIncome - totalExpense;

  const topExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .map((transaction) => transaction.category);

  const insight = await generateFinancialInsight({
    income: totalIncome,

    expense: totalExpense,

    balance,

    topExpenses,

    goals,
  });

  const monthlyData = [
    {
      name: "Jan",
      income: 4000000,
      expense: 2500000,
    },
    {
      name: "Feb",
      income: 4500000,
      expense: 3200000,
    },
    {
      name: "Mar",
      income: totalIncome,
      expense: totalExpense,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="text-muted-foreground">Your financial overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div
          className="
            rounded-2xl
            border
            bg-background/70
            backdrop-blur-xl
            p-6
            transition-all
            hover:scale-[1.02]
            hover:shadow-xl
          "
        >
          <p className="text-muted-foreground">Balance</p>

          <h2 className="text-3xl font-bold">{formatRupiah(balance)}</h2>
        </div>

        <div
          className="
            rounded-2xl
            border
            bg-background/70
            backdrop-blur-xl
            p-6
            transition-all
            hover:scale-[1.02]
            hover:shadow-xl
          "
        >
          <p className="text-muted-foreground">Income</p>

          <h2 className="text-3xl font-bold">{formatRupiah(totalIncome)}</h2>
        </div>

        <div
          className="
            rounded-2xl
            border
            bg-background/70
            backdrop-blur-xl
            p-6
            transition-all
            hover:scale-[1.02]
            hover:shadow-xl
          "
        >
          <p className="text-muted-foreground">Expense</p>

          <h2 className="text-3xl font-bold">{formatRupiah(totalExpense)}</h2>
        </div>
      </div>

      <AIInsightCard insight={insight || ""} />

      <div
        className="
          rounded-3xl
          border
          bg-background/70
          backdrop-blur-xl
          p-6
          transition-all
          hover:scale-[1.02]
          hover:shadow-xl
        "
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Financial Analytics</h2>

          <p className="text-sm text-muted-foreground">
            Income vs expense overview
          </p>
        </div>

        <FinanceChart data={monthlyData} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {goals.slice(0, 2).map((goal) => {
          const progress = (goal.savedAmount / goal.targetAmount) * 100;

          return (
            <div
              key={goal.id}
              className="
                rounded-3xl border p-6
                space-y-4
              "
            >
              <div>
                <h3 className="font-semibold">{goal.title}</h3>

                <p className="text-sm text-muted-foreground">
                  {progress.toFixed(1)}% completed
                </p>
              </div>

              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className="
                    h-full rounded-full
                    bg-emerald-500
                  "
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {goals.length === 0 && (
        <div
          className="
            rounded-3xl border border-dashed
            p-10 text-center
          "
        >
          <h2 className="text-xl font-semibold">No financial goals yet</h2>

          <p className="text-muted-foreground">
            Start by creating your first saving goal
          </p>
        </div>
      )}
    </div>
  );
}
