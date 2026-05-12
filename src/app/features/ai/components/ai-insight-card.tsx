import { Sparkles } from "lucide-react";

type AIInsightCardProps = {
  insight: string;
};

export function AIInsightCard({ insight }: AIInsightCardProps) {
  if (!insight) return null;

  return (
    <div className="rounded-3xl border bg-linear-to-br from-emerald-500/10 to-cyan-500/10 p-6 space-y-4 transition-all hover:shadow-lg">
      <div className="flex items-center gap-2">
        <div className="size-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <Sparkles className="size-4 text-emerald-500" />
        </div>
        <h2 className="font-semibold">AI Financial Insight</h2>
      </div>

      <p className="leading-relaxed text-sm text-muted-foreground">{insight}</p>
    </div>
  );
}