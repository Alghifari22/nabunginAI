import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { formatRupiah } from "../../utils/format-rupiah";
import { CreateTransactionForm } from "../../features/finance/components/create-transaction-form";
import { EmptyState } from "../../components/shared/empty-state";
import { SectionHeader } from "../../components/shared/section-header";
import { PageContainer } from "../../components/shared/page-container";
import { Receipt, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function FinancePage() {
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
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

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
          <div className="space-y-2">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between rounded-2xl border bg-background/70 backdrop-blur-sm p-4 transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      "size-10 rounded-2xl flex items-center justify-center shrink-0",
                      transaction.type === "income"
                        ? "bg-emerald-500/10"
                        : "bg-destructive/10"
                    )}
                  >
                    {transaction.type === "income" ? (
                      <TrendingUp className="size-4 text-emerald-500" />
                    ) : (
                      <TrendingDown className="size-4 text-destructive" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm truncate">{transaction.category}</h3>
                    {transaction.description && (
                      <p className="text-xs text-muted-foreground truncate">
                        {transaction.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-3">
                  <p
                    className={cn(
                      "font-semibold text-sm",
                      transaction.type === "income"
                        ? "text-emerald-500"
                        : "text-destructive"
                    )}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatRupiah(transaction.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {transaction.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}