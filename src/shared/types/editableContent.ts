import type {
  AboutContent,
  ARItem,
  CollaborationStep,
  ContactContent,
  HeroContent,
  NavItem,
  PricingContent,
  Project,
  ServiceItem,
  ShowreelContent,
  SiteContent,
  SiteSettings,
  ThemeTokens
} from "../../types/content";

export interface EditableSiteMeta {
  settings: SiteSettings;
  navigation: NavItem[];
  footer: SiteContent["footer"];
  error: SiteContent["error"];
}

export interface EditableSections {
  hero: HeroContent;
  showreel: ShowreelContent;
  portfolio: SiteContent["portfolio"];
  arShowcase: SiteContent["arShowcase"];
  services: {
    eyebrow: string;
    title: string;
    description: string;
    items: ServiceItem[];
  };
  collaboration: {
    eyebrow: string;
    title: string;
    description: string;
    stepLabel: string;
    steps: CollaborationStep[];
  };
  contact: ContactContent;
  about: AboutContent;
  pricing: PricingContent | null;
}

export interface EditableCollections {
  projects: Project[];
  arItems: ARItem[];
}

/**
 * Phase 1 normalized editable model.
 * Structured for admin friendliness while preserving fixed frontend section architecture.
 */
export interface EditableContentDocument {
  theme: ThemeTokens;
  site: EditableSiteMeta;
  sections: EditableSections;
  collections: EditableCollections;
}
