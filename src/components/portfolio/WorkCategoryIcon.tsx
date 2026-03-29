import { memo } from "react";
import { cn } from "../../lib/utils";
import { Project } from "../../types/content";

interface CategoryIconProps {
  category: string;
  className?: string;
}

export const WorkCategoryIcon = memo(({ category, className }: CategoryIconProps) => {
  const normalizedCategory = category.toLowerCase();
  
  // Category string analysis
  const activeType = (
    (normalizedCategory.includes("ar") || normalizedCategory.includes("filter")) ? "AR" :
    (normalizedCategory.includes("video") || normalizedCategory.includes("film")) ? "video" :
    (normalizedCategory.includes("motion") || normalizedCategory.includes("animation")) ? "motion" :
    "graphic"
  );

  // Mapping types to icons
  if (activeType === "AR") {
    // AR Icon (Box/Cube)
    return (
      <svg 
        className={cn("w-4 h-4", className)} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    );
  }

  if (activeType === "video") {
    // Video Icon (Play)
    return (
      <svg 
        className={cn("w-4 h-4", className)} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
    );
  }

  if (activeType === "motion") {
    // Motion Icon (Layers)
    return (
      <svg 
        className={cn("w-4 h-4", className)} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
        <polyline points="2 17 12 22 22 17"/>
        <polyline points="2 12 12 17 22 12"/>
      </svg>
    );
  }

  // Default: Graphic Icon (Image)
  return (
    <svg 
      className={cn("w-4 h-4", className)} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  );
});

WorkCategoryIcon.displayName = "WorkCategoryIcon";
