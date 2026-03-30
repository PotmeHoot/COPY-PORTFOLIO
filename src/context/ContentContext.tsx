import React, { createContext, useContext, useState, useEffect } from "react";
import { SiteContent } from "../types/content";
import { CONTENT_FILES } from "../content/contentFiles";
import {
  isEditableContentDocument,
  mapEditableToSiteContent,
  mapLegacyToSiteContent
} from "../content/contentAdapters";

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

        // Phase 1 normalized source of truth.
        const editableRes = await fetch(CONTENT_FILES.editable);
        if (editableRes.ok) {
          const editableData = await editableRes.json();
          if (isEditableContentDocument(editableData)) {
            setContent(mapEditableToSiteContent(editableData));
            return;
          }
        }

        // Backward-compatible fallback to legacy split files.
        const [configRes, projectsRes] = await Promise.all([
          fetch(CONTENT_FILES.legacyConfig),
          fetch(CONTENT_FILES.legacyProjects)
        ]);

        if (!configRes.ok) {
          throw new Error(`Failed to fetch site config: ${configRes.statusText}`);
        }
        if (!projectsRes.ok) {
          throw new Error(`Failed to fetch project data: ${projectsRes.statusText}`);
        }

        const configData = await configRes.json();
        const projectsData = await projectsRes.json();

        setContent(mapLegacyToSiteContent(configData, projectsData));
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
