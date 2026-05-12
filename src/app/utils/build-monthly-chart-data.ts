/**
 * Aggregates transactions into monthly chart data sorted chronologically.
 * Always returns the last N months (default 6) so the chart has consistent shape.
 */

export type MonthlyChartEntry = {
  name: string;       // e.g. "Jan", "Feb"
  month: string;      // sortable key e.g. "2026-01"
  income: number;
  expense: number;
};

type Transaction = {
  type: string;
  amount: number;
  createdAt: Date;
};

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Returns the last `months` calendar months as YYYY-MM strings, oldest first.
 */
function getLastMonths(count: number): string[] {
  const result: string[] = [];
  const now = new Date();

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    result.push(`${yyyy}-${mm}`);
  }

  return result;
}

export function buildMonthlyChartData(
  transactions: Transaction[],
  monthCount = 6
): MonthlyChartEntry[] {
  // Build a map: "YYYY-MM" → { income, expense }
  const map = new Map<string, { income: number; expense: number }>();

  for (const t of transactions) {
    const d = new Date(t.createdAt);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const key = `${yyyy}-${mm}`;

    const existing = map.get(key) ?? { income: 0, expense: 0 };

    if (t.type === "income") {
      existing.income += t.amount;
    } else if (t.type === "expense") {
      existing.expense += t.amount;
    }

    map.set(key, existing);
  }

  // Use the last N months as the x-axis, filling zeros for months with no data
  const months = getLastMonths(monthCount);

  return months.map((key) => {
    const [yyyy, mm] = key.split("-");
    const monthIndex = parseInt(mm, 10) - 1;
    const label = `${MONTH_LABELS[monthIndex]} '${yyyy.slice(2)}`;
    const data = map.get(key) ?? { income: 0, expense: 0 };

    return {
      name: label,
      month: key,
      income: data.income,
      expense: data.expense,
    };
  });
}

/**
 * Returns true if at least one month has non-zero income or expense.
 */
export function hasChartData(data: MonthlyChartEntry[]): boolean {
  return data.some((d) => d.income > 0 || d.expense > 0);
}
