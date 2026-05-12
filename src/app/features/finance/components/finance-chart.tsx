"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

type FinanceChartProps = {
  data: {
    name: string;
    income: number;
    expense: number;
  }[];
};

export function FinanceChart({
  data,
}: FinanceChartProps) {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <AreaChart data={data}>
          <XAxis dataKey="name" />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="income"
          />

          <Area
            type="monotone"
            dataKey="expense"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}