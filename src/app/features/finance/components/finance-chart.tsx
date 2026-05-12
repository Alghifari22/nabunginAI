"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import type { MonthlyChartEntry } from "@/app/utils/build-monthly-chart-data";

type FinanceChartProps = {
  data: MonthlyChartEntry[];
};

// ── Tooltip payload entry type ────────────────────────────────────────────────
interface TooltipEntry {
  dataKey?: string | number;
  value?: number;
  color?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

// ── Rupiah formatter ──────────────────────────────────────────────────────────
function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatAxisValue(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-2xl border bg-background shadow-xl p-3 space-y-2 text-sm min-w-[160px]">
      <p className="font-semibold text-foreground">{String(label ?? "")}</p>
      {payload.map((entry) => {
        const isIncome = entry.dataKey === "income";
        const value = typeof entry.value === "number" ? entry.value : 0;
        return (
          <div key={String(entry.dataKey)} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span
                className="size-2.5 rounded-full shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">
                {isIncome ? "Income" : "Expense"}
              </span>
            </div>
            <span className="font-medium tabular-nums">
              {formatRupiah(value)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Custom Legend ─────────────────────────────────────────────────────────────
function CustomLegend() {
  return (
    <div className="flex items-center justify-center gap-5 pt-2 text-xs text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-full bg-emerald-500" />
        Income
      </div>
      <div className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-full bg-red-500" />
        Expense
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function FinanceChart({ data }: FinanceChartProps) {
  return (
    <div className="w-full space-y-2">
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#888"
              strokeOpacity={0.08}
              vertical={false}
            />

            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "currentColor" }}
              axisLine={false}
              tickLine={false}
              dy={6}
            />

            <YAxis
              tickFormatter={formatAxisValue}
              tick={{ fontSize: 11, fill: "currentColor" }}
              axisLine={false}
              tickLine={false}
              width={44}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#888", strokeOpacity: 0.15, strokeWidth: 1 }}
            />

            <Legend content={<CustomLegend />} />

            <Area
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#incomeGradient)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />

            <Area
              type="monotone"
              dataKey="expense"
              stroke="#ef4444"
              strokeWidth={2.5}
              fill="url(#expenseGradient)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
