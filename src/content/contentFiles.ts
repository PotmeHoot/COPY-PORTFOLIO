export const CONTENT_FILES = {
  editable: "/data/editable-content.json",
  legacyConfig: "/data/config.json",
  legacyProjects: "/data/projects.json"
} as const;

export type ContentFileKey = keyof typeof CONTENT_FILES;
