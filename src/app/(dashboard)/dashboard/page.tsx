import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { AIInsightCard } from "../../features/ai/components/ai-insight-card";
import { generateFinancialInsight } from "../../features/ai/services/generate-financial-insight";
import { formatRupiah } from "../../utils/format-rupiah";
import { FinanceChart } from "../../features/finance/components/finance-chart";
import { EmptyState } from "../../components/shared/empty-state";
import { SectionHeader } from "../../components/shared/section-header";
import { PageContainer } from "../../components/shared/page-container";
import { buildMonthlyChartData, hasChartData } from "../../utils/build-monthly-chart-data";
import { PiggyBank, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email || "",
    },
  });

  const [transactions, goals] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId: user?.id },
      orderBy: { createdAt: "asc" },
    }),
    prisma.goal.findMany({
      where: { userId: user?.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const topExpenses = transactions
    .filter((t) => t.type === "expense")
    .map((t) => t.category);

  const insight = await generateFinancialInsight({
    income: totalIncome,
    expense: totalExpense,
    balance,
    topExpenses,
    goals,
  });

  // Build proper monthly chart data — sorted, zero-filled, last 6 months
  const monthlyData = buildMonthlyChartData(transactions, 6);
  const showChart = hasChartData(monthlyData);

  const statCards = [
    {
      label: "Balance",
      value: balance,
      icon: Wallet,
      color: balance >= 0 ? "text-emerald-500" : "text-destructive",
    },
    {
      label: "Total Income",
      value: totalIncome,
      icon: TrendingUp,
      color: "text-emerald-500",
    },
    {
      label: "Total Expense",
      value: totalExpense,
      icon: TrendingDown,
      color: "text-destructive",
    },
  ];

  return (
    <PageContainer>
      <SectionHeader
        title={`Hello, ${session?.user?.name?.split(" ")[0] || "there"} 👋`}
        description="Here's your financial overview"
      />

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-3xl border bg-background/70 backdrop-blur-xl p-6 space-y-3 transition-all hover:shadow-lg hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <div className="size-9 rounded-2xl bg-muted flex items-center justify-center">
                  <Icon className={cn("size-4", card.color)} />
                </div>
              </div>
              <h2 className={cn("text-2xl md:text-3xl font-bold", card.color)}>
                {formatRupiah(card.value)}
              </h2>
            </div>
          );
        })}
      </div>

      {/* AI Insight */}
      <AIInsightCard insight={insight || ""} />

      {/* Chart */}
      <div className="rounded-3xl border bg-background/70 backdrop-blur-xl p-6 transition-all hover:shadow-lg">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">Financial Analytics</h2>
            <p className="text-sm text-muted-foreground">
              Income vs expense — last 6 months
            </p>
          </div>
        </div>

        {showChart ? (
          <FinanceChart data={monthlyData} />
        ) : (
          <EmptyState
            icon={TrendingUp}
            title="No data to display"
            description="Add your first transaction to see your financial analytics chart."
            className="border-0 py-8"
          />
        )}
      </div>

      {/* Goals Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Saving Goals</h2>
          <Link
            href="/goals"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all →
          </Link>
        </div>

        {goals.length === 0 ? (
          <EmptyState
            icon={PiggyBank}
            title="No saving goals yet"
            description="Create your first saving goal to start tracking your progress."
          />
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {goals.slice(0, 2).map((goal) => {
              const progress = Math.min(
                (goal.savedAmount / goal.targetAmount) * 100,
                100
              );
              const isCompleted = progress >= 100;

              return (
                <div
                  key={goal.id}
                  className={cn(
                    "rounded-3xl border p-6 space-y-4 transition-all hover:shadow-lg",
                    isCompleted && "border-emerald-500/50 bg-emerald-500/5"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{goal.title}</h3>
                    <span className="text-xs text-muted-foreground">
                      {isCompleted ? "✅ Done" : `${progress.toFixed(1)}%`}
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        isCompleted ? "bg-emerald-500" : "bg-primary"
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatRupiah(goal.savedAmount)} saved</span>
                    <span>{formatRupiah(goal.targetAmount)} target</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
