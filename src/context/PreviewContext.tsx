import React, { createContext, useContext, useState, useCallback } from 'react';

interface PreviewContextType {
  activePreviewId: string | null;
  requestPreview: (id: string) => void;
  clearPreview: (id: string) => void;
}

const PreviewContext = createContext<PreviewContextType | undefined>(undefined);

export const PreviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePreviewId, setActivePreviewId] = useState<string | null>(null);

  const requestPreview = useCallback((id: string) => {
    setActivePreviewId(id);
  }, []);

  const clearPreview = useCallback((id: string) => {
    setActivePreviewId(prev => (prev === id ? null : prev));
  }, []);

  return (
    <PreviewContext.Provider value={{ activePreviewId, requestPreview, clearPreview }}>
      {children}
    </PreviewContext.Provider>
  );
};

export const usePreview = () => {
  const context = useContext(PreviewContext);
  if (context === undefined) {
    throw new Error('usePreview must be used within a PreviewProvider');
  }
  return context;
};
