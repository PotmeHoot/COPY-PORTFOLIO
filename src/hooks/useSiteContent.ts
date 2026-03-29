import { useContent } from "../context/ContentContext";
import { SiteContent } from "../types/content";

/**
 * useSiteContent hook for easy access to site content in components.
 * Now uses the centralized ContentContext.
 */
export function useSiteContent() {
  const { content, isLoading, error } = useContent();
  
  // We cast to SiteContent because App.tsx handles the null case
  // and components using this hook expect the content to be present.
  // If content is null, we return a partial object to prevent immediate crashes
  // although App.tsx should prevent this from being rendered.
  return { 
    content: content as SiteContent, 
    isLoading, 
    error,
    isReady: !isLoading && !error && !!content
  };
}
