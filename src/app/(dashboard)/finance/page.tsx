import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { formatRupiah } from "../../utils/format-rupiah";
import { CreateTransactionForm } from "../../features/finance/components/create-transaction-form";
import { TransactionList } from "../../features/finance/components/transaction-list";
import { EmptyState } from "../../components/shared/empty-state";
import { SectionHeader } from "../../components/shared/section-header";
import { PageContainer } from "../../components/shared/page-container";
import { Receipt, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function FinancePage() {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email || "" },
  });

  const transactions = await prisma.transaction.findMany({
    where: { userId: user?.id },
    orderBy: { createdAt: "desc" },
  });

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const statCards = [
    { label: "Balance", value: balance, icon: Wallet, color: balance >= 0 ? "text-emerald-500" : "text-destructive" },
    { label: "Total Income", value: totalIncome, icon: TrendingUp, color: "text-emerald-500" },
    { label: "Total Expense", value: totalExpense, icon: TrendingDown, color: "text-destructive" },
  ];

  return (
    <PageContainer>
      <SectionHeader
        title="Financial Tracker"
        description="Track your income and expenses"
      />

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-3xl border bg-background/70 backdrop-blur-xl p-6 space-y-3 transition-all hover:shadow-lg"
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

      <CreateTransactionForm />

      {/* Transaction List */}
      <div className="space-y-3">
        <h2 className="font-semibold text-lg">Transaction History</h2>

        {transactions.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No transactions yet"
            description="Add your first income or expense above to start tracking your finances."
          />
        ) : (
          <TransactionList transactions={transactions} />
        )}
      </div>
    </PageContainer>
  );
}