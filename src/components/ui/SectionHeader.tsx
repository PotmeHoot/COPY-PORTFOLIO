import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title?: string;
  description?: string | ReactNode;
  centered?: boolean;
  className?: string;
}

export const SectionHeader = ({ 
  eyebrow, 
  title, 
  description, 
  centered = false,
  className 
}: SectionHeaderProps) => {
  return (
    <div className={cn("mb-20 md:mb-32", centered && "text-center", className)}>
      {eyebrow && (
        <div className={cn("section-eyebrow", centered && "justify-center")}>
          {!centered && <div className="section-eyebrow-line" />}
          {eyebrow}
        </div>
      )}
      {title && <h2 className="section-title">{title}</h2>}
      {description && (
        <p className={cn("section-description", centered && "mx-auto")}>
          {description}
        </p>
      )}
    </div>
  );
};
