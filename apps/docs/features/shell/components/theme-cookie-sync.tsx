"use client";

import { useEffect } from "react";
import { useTheme } from "@unisane/ui";
import {
  DOCS_THEME_COOKIE,
  serializeDocsThemeState,
} from "../lib/theme-persistence";

export function ThemeCookieSync() {
  const {
    density,
    theme,
    radius,
    actionShape,
    scheme,
    contrast,
    colorTheme,
    elevation,
  } = useTheme();

  useEffect(() => {
    document.cookie = `${DOCS_THEME_COOKIE}=${serializeDocsThemeState({
      density,
      theme,
      radius,
      actionShape,
      scheme,
      contrast,
      colorTheme,
      elevation,
    })}; path=/; max-age=31536000; samesite=lax`;
  }, [
    actionShape,
    colorTheme,
    contrast,
    density,
    elevation,
    radius,
    scheme,
    theme,
  ]);

  return null;
}
