import { getServerSession } from "next-auth";

import { authOptions } from "../../lib/auth";

import { prisma } from "../../lib/prisma";

import { AIInsightCard } from "../../features/ai/components/ai-insight-card";

import { generateFinancialInsight } from "../../features/ai/services/generate-financial-insight";

import { formatRupiah } from "../../utils/format-rupiah";

export default async function DashboardPage() {
  const session = await getServerSession(
    authOptions
  );

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email || "",
    },
  });

  const transactions =
    await prisma.transaction.findMany({
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
    .filter(
      (transaction) =>
        transaction.type === "income"
    )
    .reduce(
      (acc, transaction) =>
        acc + transaction.amount,
      0
    );

  const totalExpense = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense"
    )
    .reduce(
      (acc, transaction) =>
        acc + transaction.amount,
      0
    );

  const balance =
    totalIncome - totalExpense;

  const topExpenses = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense"
    )
    .map(
      (transaction) =>
        transaction.category
    );

  const insight =
    await generateFinancialInsight({
      income: totalIncome,

      expense: totalExpense,

      balance,

      topExpenses,

      goals,
    });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-muted-foreground">
          Your financial overview
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border p-6">
          <p className="text-muted-foreground">
            Balance
          </p>

          <h2 className="text-3xl font-bold">
            {formatRupiah(balance)}
          </h2>
        </div>

        <div className="rounded-2xl border p-6">
          <p className="text-muted-foreground">
            Income
          </p>

          <h2 className="text-3xl font-bold">
            {formatRupiah(totalIncome)}
          </h2>
        </div>

        <div className="rounded-2xl border p-6">
          <p className="text-muted-foreground">
            Expense
          </p>

          <h2 className="text-3xl font-bold">
            {formatRupiah(totalExpense)}
          </h2>
        </div>
      </div>

      <AIInsightCard
        insight={insight || ""}
      />
    </div>
  );
}