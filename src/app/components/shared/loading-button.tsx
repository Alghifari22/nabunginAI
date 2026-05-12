import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading, loadingText, children, disabled, className, variant, size, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={loading || disabled}
        variant={variant}
        size={size}
        className={cn("min-h-[44px]", className)}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            {loadingText || "Loading..."}
          </>
        ) : (
          children
        )}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";
