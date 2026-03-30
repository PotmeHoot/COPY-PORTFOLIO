import { 
  CheckCircle2 as CheckCircle, 
  Sparkles, 
  Play, 
  Zap, 
  Cpu, 
  Palette, 
  Briefcase, 
  MessageSquare, 
  Layout, 
  LucideIcon
} from "lucide-react";

export const Icons: Record<string, LucideIcon> = {
  CheckCircle,
  Sparkles,
  Play,
  Zap,
  Cpu,
  Palette,
  Briefcase,
  MessageSquare,
  Layout
};

export type IconName = keyof typeof Icons;

export interface SiteSettings {
  title: string;
  ownerName: string;
  email: string;
  location: string;
  inquireLabel: string;
  seo: {
    description: string;
    keywords: string[];
    ogImage: string;
  };
}


export interface ThemeTokens {
  pageBackground: string;
  surfaceBackground: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  border: string;
  buttonBackground?: string;
  buttonText?: string;
}

export interface NavItem {
  id: string;
  label: string;
  visible: boolean;
  order: number;
}

export interface HeroContent {
  backgroundImage: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaPrimary: {
    label: string;
    href: string;
  };
  ctaSecondary: {
    label: string;
    href: string;
  };
  stats: {
    label: string;
    value: string;
  }[];
  availabilityLabel: string;
  scrollLabel: string;
}

export interface ShowreelContent {
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
  poster: string;
  videoUrl: string;
  videoLabel: string;
  highlightsLabel: string;
  cta: {
    label: string;
    href: string;
  };
  featured: boolean;
}

export type ProjectStatus = 'ready' | 'coming_soon' | 'hidden';

export interface ProjectAsset {
  type: 'image' | 'video';
  file: string;
  webpFile?: string;
  srcSet?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  folder: string;
  poster: string;
  webpPoster?: string;
  assets: ProjectAsset[];
  client?: string;
  agency?: string;
  year?: string;
  shortDescription?: string;
  process?: string;
  status?: ProjectStatus;
  featured?: boolean;
  order?: number;
}

export interface ARItem {
  id: string;
  title: string;
  platform: 'TikTok' | 'Snapchat';
  previewImage?: string;
  qrCode?: string;
  link: string;
  status: ProjectStatus;
  featured: boolean;
  order: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  order: number;
}

export interface CollaborationStep {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  order: number;
}

export interface ContactContent {
  title: string;
  subtitle: string;
  highlight: string;
  description: string;
  cta: string;
  status: string;
  email: string;
  directLabel: string;
  socialLabel: string;
  form: {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitLabel: string;
    successMessage: string;
  };
  socials: {
    name: string;
    url: string;
    icon?: IconName;
  }[];
}

export interface AboutContent {
  eyebrow: string;
  title: string;
  description: string;
  brandsLabel: string;
  expertiseLabel: string;
  experienceEyebrow: string;
  experienceTitle: string;
  toolsEyebrow: string;
  toolsTitle: string;
  expertise: string[];
  experience: {
    icon: IconName;
    title: string;
    desc: string;
  }[];
  tools: {
    name: string;
    level: string;
    desc: string;
  }[];
}

export interface PricingPlan {
  id: string;
  title: string;
  price: string;
  description: string;
  cta: string;
  featured?: boolean;
}

export interface PricingContent {
  eyebrow: string;
  title: string;
  description: string;
  plans: PricingPlan[];
}

export interface SiteContent {
  settings: SiteSettings;
  footer: {
    privacyLabel: string;
    termsLabel: string;
    cookiePolicyLabel: string;
    rightsReservedLabel: string;
  };
  error: {
    title: string;
    description: string;
    retryLabel: string;
    invalidFormatLabel: string;
    missingAssetLabel: string;
  };
  navigation: NavItem[];
  hero: HeroContent;
  showreel: ShowreelContent;
  projects: Project[];
  portfolio: {
    eyebrow: string;
    description: string;
    trustedByLabel: string;
    graphicWorkLabel: string;
    motionWorkLabel: string;
    videoIndicatorLabel: string;
    comingSoonLabel: string;
    clientLabel: string;
    agencyLabel: string;
    yearLabel: string;
    viewProjectLabel: string;
    backToProjectsLabel: string;
    projectDetailsLabel: string;
    descriptionLabel: string;
    processLabel: string;
    galleryLabel: string;
    nextProjectLabel: string;
    interestedLabel: string;
    startConversationLabel: string;
  };
  arItems: ARItem[];
  arShowcase: {
    eyebrow: string;
    title: string;
    description: string;
    platformLabel: string;
    comingSoonLabel: string;
    features: { title: string; desc: string; }[];
  };
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
  pricing?: PricingContent;
  theme?: ThemeTokens;
}
