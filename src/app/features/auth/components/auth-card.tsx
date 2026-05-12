import { cn } from "@/lib/utils";

export function AuthCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "w-full max-w-md",
        "rounded-3xl border",
        "bg-background/80 backdrop-blur-xl",
        "shadow-2xl shadow-black/5",
        "p-8"
      )}
    >
      {children}
    </div>
  );
}