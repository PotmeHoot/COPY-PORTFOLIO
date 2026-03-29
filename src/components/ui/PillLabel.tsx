import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface PillLabelProps {
  children: ReactNode;
  className?: string;
}

export const PillLabel = ({ children, className }: PillLabelProps) => {
  return (
    <div className={cn("inline-block px-4 py-1.5 rounded-full bg-bg-primary border border-border text-[10px] font-semibold uppercase tracking-[0.2em] text-text-secondary", className)}>
      {children}
    </div>
  );
};
