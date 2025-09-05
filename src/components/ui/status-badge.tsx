import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        pending: "bg-warning-light text-warning border-warning/20",
        confirmed: "bg-success-light text-success border-success/20",
        cancelled: "bg-destructive/10 text-destructive border-destructive/20",
        completed: "bg-muted text-muted-foreground border-border",
        in_progress: "bg-primary/10 text-primary border-primary/20",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "pending",
      size: "md",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  status?: "pending" | "confirmed" | "cancelled" | "completed" | "in_progress";
}

function StatusBadge({ className, variant, size, status, ...props }: StatusBadgeProps) {
  const badgeVariant = status || variant;
  
  return (
    <div className={cn(statusBadgeVariants({ variant: badgeVariant, size }), className)} {...props} />
  );
}

export { StatusBadge, statusBadgeVariants };