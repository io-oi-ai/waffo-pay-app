import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, description, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-4 flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300/80">
          {title}
        </p>
        {description && <p className="mt-1 max-w-2xl text-sm text-white/70">{description}</p>}
      </div>
      {action}
    </div>
  );
}
