import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
  containerClassName?: string;
  showGlow?: boolean;
}

export const SectionWrapper = ({ 
  children, 
  className, 
  id,
  containerClassName,
  showGlow = true
}: SectionWrapperProps) => {
  return (
    <section 
      id={id} 
      className={cn("relative overflow-hidden section-padding", className)}
    >
      {showGlow && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-500/[0.02] rounded-full blur-[120px] -z-10" />
      )}
      <div className={cn("section-container", containerClassName)}>
        {children}
      </div>
    </section>
  );
};
