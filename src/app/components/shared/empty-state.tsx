import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        "rounded-3xl border border-dashed p-10 space-y-4",
        "transition-colors",
        className
      )}
    >
      <div className="size-14 rounded-2xl bg-muted flex items-center justify-center">
        <Icon className="size-7 text-muted-foreground" />
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-base">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}
