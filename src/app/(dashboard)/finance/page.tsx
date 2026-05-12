import { getServerSession } from "next-auth";

import { authOptions } from "../../lib/auth";

import { prisma } from "../../lib/prisma";

import { formatRupiah } from "../../utils/format-rupiah";

import { CreateTransactionForm } from "../../features/finance/components/create-transaction-form";

export default async function FinancePage() {
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

      orderBy: {
        createdAt: "desc",
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">
          Financial Tracker
        </h1>

        <p className="text-muted-foreground">
          Track your income and expenses
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border p-6">
          <p className="text-muted-foreground">
            Balance
          </p>

          <h2 className="text-2xl md:text-3xl font-bold">
            {formatRupiah(balance)}
          </h2>
        </div>

        <div className="rounded-2xl border p-6">
          <p className="text-muted-foreground">
            Income
          </p>

          <h2 className="text-2xl md:text-3xl font-bold">
            {formatRupiah(totalIncome)}
          </h2>
        </div>

        <div className="rounded-2xl border p-6">
          <p className="text-muted-foreground">
            Expense
          </p>

          <h2 className="text-2xl md:text-3xl font-bold">
            {formatRupiah(totalExpense)}
          </h2>
        </div>
      </div>

      <CreateTransactionForm />

      <div className="space-y-4">
        {transactions.map(
          (transaction) => (
            <div
              key={transaction.id}
              className="
                flex items-center justify-between
                rounded-xl border p-4
              "
            >
              <div>
                <h3 className="font-semibold">
                  {transaction.category}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {
                    transaction.description
                  }
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  {formatRupiah(
                    transaction.amount
                  )}
                </p>

                <p className="text-sm text-muted-foreground capitalize">
                  {transaction.type}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}