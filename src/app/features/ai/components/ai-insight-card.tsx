import { Sparkles } from "lucide-react";

type AIInsightCardProps = {
  insight: string;
};

export function AIInsightCard({
  insight,
}: AIInsightCardProps) {
  return (
    <div
      className="
        rounded-3xl
        border
        bg-gradient-to-br
        from-emerald-500/10
        to-cyan-500/10
        p-6
        space-y-4
      "
    >
      <div className="flex items-center gap-2">
        <Sparkles className="size-5" />

        <h2 className="font-semibold">
          AI Financial Insight
        </h2>
      </div>

      <p className="leading-relaxed text-sm">
        {insight}
      </p>
    </div>
  );
}