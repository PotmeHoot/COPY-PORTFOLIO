import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface CardShellProps {
  children: ReactNode;
  className?: string;
  variant?: 'glass' | 'premium';
}

export const CardShell = ({ 
  children, 
  className, 
  variant = 'glass' 
}: CardShellProps) => {
  return (
    <div className={cn(variant === 'glass' ? 'card-glass' : 'card-premium', className)}>
      {children}
    </div>
  );
};
