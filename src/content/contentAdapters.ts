import { DEFAULT_THEME_TOKENS } from "./theme";
import type { EditableContentDocument } from "../shared/types/editableContent";
import type { SiteContent, ThemeTokens } from "../types/content";

export function mapEditableToSiteContent(document: EditableContentDocument): SiteContent {
  const { site, sections, collections, theme } = document;

  return {
    settings: site.settings,
    navigation: site.navigation,
    footer: site.footer,
    error: site.error,
    hero: sections.hero,
    showreel: sections.showreel,
    portfolio: sections.portfolio,
    arShowcase: sections.arShowcase,
    services: sections.services,
    collaboration: sections.collaboration,
    contact: sections.contact,
    about: sections.about,
    pricing: sections.pricing ?? undefined,
    projects: collections.projects,
    arItems: collections.arItems,
    theme
  };
}

export function mapLegacyToSiteContent(configData: any, projectsData: any): SiteContent {
  return {
    ...configData,
    ...projectsData
  } as SiteContent;
}

export function mapLegacyToEditableContentDocument(
  configData: any,
  projectsData: any,
  theme: ThemeTokens = DEFAULT_THEME_TOKENS
): EditableContentDocument {
  return {
    theme,
    site: {
      settings: configData.settings,
      navigation: configData.navigation,
      footer: configData.footer,
      error: configData.error
    },
    sections: {
      hero: configData.hero,
      showreel: configData.showreel,
      portfolio: configData.portfolio,
      arShowcase: configData.arShowcase,
      services: configData.services,
      collaboration: configData.collaboration,
      contact: configData.contact,
      about: configData.about,
      pricing: configData.pricing ?? null
    },
    collections: {
      projects: projectsData.projects,
      arItems: projectsData.arItems
    }
  };
}

export function isEditableContentDocument(value: unknown): value is EditableContentDocument {
  if (!value || typeof value !== "object") {
    return false;
  }

  const maybeDocument = value as Partial<EditableContentDocument>;
  return Boolean(maybeDocument.theme && maybeDocument.site && maybeDocument.sections && maybeDocument.collections);
}
