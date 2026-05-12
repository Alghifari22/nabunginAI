type GenerateInsightProps = {
  income: number;

  expense: number;

  balance: number;

  topExpenses: string[];

  goals: {
    title: string;
    targetAmount: number;
    savedAmount: number;
  }[];
};

export async function generateFinancialInsight({
  income,
  expense,
  balance,
  topExpenses,
  goals,
}: GenerateInsightProps) {
  const expenseRatio =
    income > 0
      ? (expense / income) * 100
      : 0;

  const topGoal = goals[0];

  let spendingInsight = "";

  if (expenseRatio > 80) {
    spendingInsight =
      "Pengeluaran kamu cukup tinggi dibanding pemasukan bulan ini.";
  } else if (expenseRatio > 50) {
    spendingInsight =
      "Kondisi pengeluaran masih cukup aman, tetapi tetap perlu dikontrol.";
  } else {
    spendingInsight =
      "Kondisi finansial kamu cukup sehat bulan ini.";
  }

  const recommendation =
    topGoal
      ? `Fokus menabung untuk ${topGoal.title} agar target lebih cepat tercapai.`
      : "Mulai buat financial goal untuk membantu konsistensi menabung.";

  const expenseCategory =
    topExpenses[0]
      ? `Kategori pengeluaran terbesar kamu saat ini adalah ${topExpenses[0]}.`
      : "Belum ada data pengeluaran yang cukup.";

  return `
${spendingInsight}

${expenseCategory}

Saldo kamu saat ini sebesar Rp${balance.toLocaleString("id-ID")}.

${recommendation}

Tetap konsisten mencatat transaksi dan menabung setiap hari 🚀
`;
}