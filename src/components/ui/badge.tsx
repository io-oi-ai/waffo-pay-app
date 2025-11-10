import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "success" | "warning";
}

export function Badge({ variant = "default", className, ...props }: BadgeProps) {
  const variants = {
    default: "bg-white/15 text-white border-transparent",
    outline: "border border-white/20 text-white",
    success: "bg-success/20 text-success border-success/30",
    warning: "bg-warning/20 text-warning border-warning/30",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium uppercase tracking-wide",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
