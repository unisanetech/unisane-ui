// ─── I18N PUBLIC API ────────────────────────────────────────────────────────
// Exports for internationalization support

// Types
export type {
  DataTableStrings,
  DataTableLocale,
  PartialDataTableLocale,
} from "@/components/ui/data-table/i18n/types";

// Context and hooks
export {
  I18nProvider,
  useI18n,
  createTranslator,
  defaultLocale,
  type I18nContextValue,
} from "@/components/ui/data-table/i18n/context";

// Locale files and registry
export { enStrings, hiStrings, locales, getLocaleStrings } from "@/components/ui/data-table/i18n/locales/index";
