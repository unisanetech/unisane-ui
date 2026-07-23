// ─── LOCALE REGISTRY ────────────────────────────────────────────────────────
// All available locale files

import { enStrings } from "@/components/ui/data-table/i18n/locales/en";
import { hiStrings } from "@/components/ui/data-table/i18n/locales/hi";
import type { DataTableStrings } from "@/components/ui/data-table/i18n/types";

/**
 * Registry of all available locales
 */
export const locales: Record<string, DataTableStrings> = {
  en: enStrings,
  hi: hiStrings,
};

/**
 * Get strings for a locale by identifier
 * Falls back to English if locale not found
 */
export function getLocaleStrings(locale: string): DataTableStrings {
  // Try exact match first
  if (locales[locale]) {
    return locales[locale];
  }

  // Try language code only (e.g., "en-US" -> "en")
  const languageCode = locale.split("-")[0];
  if (languageCode && locales[languageCode]) {
    return locales[languageCode];
  }

  // Fallback to English
  return enStrings;
}

// Re-export individual locales
export { enStrings } from "@/components/ui/data-table/i18n/locales/en";
export { hiStrings } from "@/components/ui/data-table/i18n/locales/hi";
