import { cn } from "@/lib/utils";

interface CardWrapperProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function CardWrapper({ children, className, hover = false }: CardWrapperProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border bg-background/70 backdrop-blur-xl p-6",
        "transition-all duration-200",
        hover && "hover:scale-[1.01] hover:shadow-xl cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
