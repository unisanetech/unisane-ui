import { useState, useEffect, useCallback } from "react";
import type {
  NavigationState,
  UseNavigationStateConfig,
} from "@/types/navigation";

type PersistedNavigationState = {
  active?: string | null;
  collapsed?: boolean;
};

function parsePersistedNavigationState(raw: string | null): PersistedNavigationState | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    const record = parsed as Record<string, unknown>;
    const next: PersistedNavigationState = {};
    if (record.active === null || typeof record.active === "string") {
      next.active = record.active;
    }
    if (typeof record.collapsed === "boolean") {
      next.collapsed = record.collapsed;
    }
    return next;
  } catch (error) {
    console.warn("Failed to parse navigation state from localStorage:", error);
    return null;
  }
}

export function useNavigationState(
  config: UseNavigationStateConfig = {}
): NavigationState {
  const {
    defaultActive = null,
    defaultCollapsed = false,
    persistState = false,
    storageKey = "unisane-navigation",
    onActiveChange,
    onCollapsedChange,
  } = config;

  const getInitialState = useCallback(() => {
    if (!persistState || typeof window === "undefined") {
      return {
        active: defaultActive,
        collapsed: defaultCollapsed,
      };
    }

    try {
      const parsed = parsePersistedNavigationState(localStorage.getItem(storageKey));
      if (parsed) {
        return {
          active: parsed.active ?? defaultActive,
          collapsed: parsed.collapsed ?? defaultCollapsed,
        };
      }
    } catch (error) {
      console.warn("Failed to read navigation state from localStorage:", error);
    }

    return {
      active: defaultActive,
      collapsed: defaultCollapsed,
    };
  }, [persistState, storageKey, defaultActive, defaultCollapsed]);

  const [active, setActiveState] = useState<string | null>(
    () => getInitialState().active
  );
  const [collapsed, setCollapsedState] = useState<boolean>(
    () => getInitialState().collapsed
  );
  const [open, setOpenState] = useState<boolean>(false);

  useEffect(() => {
    if (!persistState || typeof window === "undefined") return;

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ active, collapsed })
      );
    } catch (error) {
      console.warn("Failed to persist navigation state to localStorage:", error);
    }
  }, [active, collapsed, persistState, storageKey]);

  const setActive = useCallback(
    (id: string | null) => {
      setActiveState(id);
      onActiveChange?.(id);
    },
    [onActiveChange]
  );

  const setCollapsed = useCallback(
    (value: boolean) => {
      setCollapsedState(value);
      onCollapsedChange?.(value);
    },
    [onCollapsedChange]
  );

  const setOpen = useCallback((value: boolean) => {
    setOpenState(value);
  }, []);

  return {
    active,
    setActive,
    collapsed,
    setCollapsed,
    open,
    setOpen,
  };
}
