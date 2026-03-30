import type { ThemeTokens } from "../types/content";

const THEME_VAR_MAP: Record<keyof ThemeTokens, string> = {
  pageBackground: "--color-bg-primary",
  surfaceBackground: "--color-bg-secondary",
  textPrimary: "--color-text-primary",
  textSecondary: "--color-text-secondary",
  accent: "--color-accent",
  border: "--color-border",
  buttonBackground: "--theme-button-bg",
  buttonText: "--theme-button-text"
};

export const DEFAULT_THEME_TOKENS: ThemeTokens = {
  pageBackground: "#F8F9FB",
  surfaceBackground: "#FFFFFF",
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  accent: "#2563EB",
  border: "#E2E8F0",
  buttonBackground: "#2563EB",
  buttonText: "#FFFFFF"
};

export function applyThemeTokens(theme?: ThemeTokens): void {
  if (typeof document === "undefined") {
    return;
  }

  const resolvedTheme: ThemeTokens = {
    ...DEFAULT_THEME_TOKENS,
    ...theme
  };

  const rootStyle = document.documentElement.style;

  Object.entries(THEME_VAR_MAP).forEach(([token, cssVar]) => {
    const value = resolvedTheme[token as keyof ThemeTokens];
    if (value) {
      rootStyle.setProperty(cssVar, value);
    }
  });

  rootStyle.setProperty("--color-text-muted", resolvedTheme.textSecondary);
  rootStyle.setProperty("--color-accent-hover", resolvedTheme.accent);
}
