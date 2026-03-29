import React, { createContext, useContext, useState, useEffect } from "react";
import { SiteContent } from "../types/content";

interface ContentContextType {
  content: SiteContent | null;
  isLoading: boolean;
  error: Error | null;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const [configRes, projectsRes] = await Promise.all([
          fetch("/data/config.json"),
          fetch("/data/projects.json")
        ]);

        if (!configRes.ok) {
          throw new Error(`Failed to fetch site config: ${configRes.statusText}`);
        }
        if (!projectsRes.ok) {
          throw new Error(`Failed to fetch project data: ${projectsRes.statusText}`);
        }

        const configData = await configRes.json();
        const projectsData = await projectsRes.json();

        // Merge config and projects into a single SiteContent object
        const mergedContent: SiteContent = {
          ...configData,
          ...projectsData
        };

        setContent(mergedContent);
      } catch (err) {
        console.error("Error loading site content:", err);
        setError(err instanceof Error ? err : new Error("Unknown error loading content"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <ContentContext.Provider value={{ content, isLoading, error }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
};
