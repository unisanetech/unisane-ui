'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type AppearanceMode = 'light' | 'dark' | 'system';
export type Density = 'compact' | 'standard' | 'comfortable' | 'dense';
export type ContrastLevel = 'standard' | 'medium' | 'high';
export type RadiusTheme = 'none' | 'minimal' | 'sharp' | 'standard' | 'soft';
export type ActionShape = 'standard' | 'full';
export type Elevation = 'flat' | 'subtle' | 'standard' | 'pronounced';

export type AppearanceAxis =
  | 'mode'
  | 'density'
  | 'contrast'
  | 'radius'
  | 'actionShape'
  | 'elevation';

export interface AppearancePreferences {
  mode: AppearanceMode;
  density: Density;
  contrast: ContrastLevel;
  radius: RadiusTheme;
  actionShape: ActionShape;
  elevation: Elevation;
}

export type AppearancePersistence = 'none' | 'localStorage' | 'cookie';

const DEFAULT_PREFERENCES: AppearancePreferences = {
  mode: 'system',
  density: 'standard',
  contrast: 'standard',
  radius: 'standard',
  actionShape: 'standard',
  elevation: 'standard',
};

const VALUES: { [K in AppearanceAxis]: readonly AppearancePreferences[K][] } = {
  mode: ['light', 'dark', 'system'],
  density: ['compact', 'standard', 'comfortable', 'dense'],
  contrast: ['standard', 'medium', 'high'],
  radius: ['none', 'minimal', 'sharp', 'standard', 'soft'],
  actionShape: ['standard', 'full'],
  elevation: ['flat', 'subtle', 'standard', 'pronounced'],
};

const ATTRIBUTES: Record<AppearanceAxis, string> = {
  mode: 'data-theme-mode',
  density: 'data-density',
  contrast: 'data-contrast',
  radius: 'data-radius',
  actionShape: 'data-action-shape',
  elevation: 'data-elevation',
};

const DEFAULT_PERSISTENCE_KEY = 'unisane-appearance';

function isValidPreference<K extends AppearanceAxis>(
  axis: K,
  value: unknown,
): value is AppearancePreferences[K] {
  return typeof value === 'string' && (VALUES[axis] as readonly string[]).includes(value);
}

function resolveMode(mode: AppearanceMode): 'light' | 'dark' {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return mode;
}

function applyMode(mode: AppearanceMode): 'light' | 'dark' {
  const resolved = resolveMode(mode);
  const root = document.documentElement;
  root.classList.toggle('dark', resolved === 'dark');
  root.style.colorScheme = resolved;
  root.setAttribute(ATTRIBUTES.mode, mode);
  return resolved;
}

function applyPreference<K extends AppearanceAxis>(axis: K, value: AppearancePreferences[K]) {
  if (axis === 'mode') {
    return applyMode(value as AppearanceMode);
  }
  document.documentElement.setAttribute(ATTRIBUTES[axis], value);
  return undefined;
}

function readCookie(name: string): string | null {
  const prefix = `${encodeURIComponent(name)}=`;
  for (const part of document.cookie.split(';')) {
    const candidate = part.trim();
    if (candidate.startsWith(prefix)) {
      return decodeURIComponent(candidate.slice(prefix.length));
    }
  }
  return null;
}

function readPersistedRaw(persistence: AppearancePersistence, key: string): string | null {
  try {
    if (persistence === 'localStorage') return localStorage.getItem(key);
    if (persistence === 'cookie') return readCookie(key);
  } catch {
    return null;
  }
  return null;
}

function parsePersistedPreferences(raw: string | null): Partial<AppearancePreferences> {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const record = parsed as Record<string, unknown>;
    const result: Partial<AppearancePreferences> = {};
    for (const axis of Object.keys(VALUES) as AppearanceAxis[]) {
      if (isValidPreference(axis, record[axis])) {
        (result as Record<string, string>)[axis] = record[axis];
      }
    }
    return result;
  } catch {
    return {};
  }
}

function writePersistedPreferences(
  persistence: AppearancePersistence,
  key: string,
  values: Partial<AppearancePreferences>,
  cookieMaxAge: number,
) {
  if (persistence === 'none') return;
  const serialized = JSON.stringify(values);
  try {
    if (persistence === 'localStorage') {
      localStorage.setItem(key, serialized);
    } else {
      document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(serialized)}; Path=/; Max-Age=${cookieMaxAge}; SameSite=Lax`;
    }
  } catch {
    // Storage can be unavailable in privacy-restricted browser contexts.
  }
}

function clearPersistedPreferences(persistence: AppearancePersistence, key: string) {
  try {
    if (persistence === 'localStorage') {
      localStorage.removeItem(key);
    } else if (persistence === 'cookie') {
      document.cookie = `${encodeURIComponent(key)}=; Path=/; Max-Age=0; SameSite=Lax`;
    }
  } catch {
    // Storage can be unavailable in privacy-restricted browser contexts.
  }
}

export function clearStoredAppearance(
  persistenceKey = DEFAULT_PERSISTENCE_KEY,
  persistence: AppearancePersistence = 'localStorage',
) {
  if (typeof document === 'undefined') return;
  clearPersistedPreferences(persistence, persistenceKey);
}

function readDomPreferences(enabledAxes: readonly AppearanceAxis[]) {
  const result: Partial<AppearancePreferences> = {};
  const root = document.documentElement;
  for (const axis of enabledAxes) {
    const value = root.getAttribute(ATTRIBUTES[axis]);
    if (isValidPreference(axis, value)) {
      (result as Record<string, string>)[axis] = value;
    }
  }
  return result;
}

function selectEnabledPreferences(
  source: Partial<AppearancePreferences>,
  enabledAxes: readonly AppearanceAxis[],
) {
  const selected: Partial<AppearancePreferences> = {};
  for (const axis of enabledAxes) {
    const value = source[axis];
    if (isValidPreference(axis, value)) {
      (selected as Record<string, string>)[axis] = value;
    }
  }
  return selected;
}

interface AppearanceContextValue {
  enabledAxes: readonly AppearanceAxis[];
  preferences: AppearancePreferences;
  resolvedMode: 'light' | 'dark';
  isEnabled: (axis: AppearanceAxis) => boolean;
  setPreference: <K extends AppearanceAxis>(axis: K, value: AppearancePreferences[K]) => void;
  resetPreferences: () => void;
}

const AppearanceContext = createContext<AppearanceContextValue | undefined>(undefined);

export interface AppearanceProviderProps {
  children: React.ReactNode;
  enabledAxes: readonly AppearanceAxis[];
  defaults?: Partial<AppearancePreferences>;
  persistence?: AppearancePersistence;
  persistenceKey?: string;
  cookieMaxAge?: number;
}

export function AppearanceProvider({
  children,
  enabledAxes,
  defaults,
  persistence = 'none',
  persistenceKey = DEFAULT_PERSISTENCE_KEY,
  cookieMaxAge = 60 * 60 * 24 * 365,
}: AppearanceProviderProps) {
  const normalizedAxes = useMemo(() => Array.from(new Set(enabledAxes)), [enabledAxes]);
  const configuredDefaults = useMemo(() => ({ ...DEFAULT_PREFERENCES, ...defaults }), [defaults]);
  const [preferences, setPreferences] = useState<AppearancePreferences>(configuredDefaults);
  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>('light');

  const isEnabled = useCallback(
    (axis: AppearanceAxis) => normalizedAxes.includes(axis),
    [normalizedAxes],
  );

  useEffect(() => {
    const dom = readDomPreferences(normalizedAxes);
    const stored = selectEnabledPreferences(
      parsePersistedPreferences(readPersistedRaw(persistence, persistenceKey)),
      normalizedAxes,
    );
    const next = { ...configuredDefaults, ...dom, ...stored };
    setPreferences(next);

    for (const axis of normalizedAxes) {
      const resolved = applyPreference(axis, next[axis] as never);
      if (axis === 'mode' && resolved) setResolvedMode(resolved);
    }
  }, [configuredDefaults, normalizedAxes, persistence, persistenceKey]);

  const persistCurrent = useCallback(
    (next: AppearancePreferences) => {
      writePersistedPreferences(
        persistence,
        persistenceKey,
        selectEnabledPreferences(next, normalizedAxes),
        cookieMaxAge,
      );
    },
    [cookieMaxAge, normalizedAxes, persistence, persistenceKey],
  );

  const setPreference = useCallback(
    <K extends AppearanceAxis>(axis: K, value: AppearancePreferences[K]) => {
      if (!isEnabled(axis)) {
        console.warn(`Appearance axis "${axis}" is not enabled.`);
        return;
      }
      if (!isValidPreference(axis, value)) {
        console.warn(`Invalid ${axis} value "${String(value)}".`);
        return;
      }
      setPreferences((current) => {
        const next = { ...current, [axis]: value };
        persistCurrent(next);
        return next;
      });
      const resolved = applyPreference(axis, value);
      if (axis === 'mode' && resolved) setResolvedMode(resolved);
    },
    [isEnabled, persistCurrent],
  );

  const resetPreferences = useCallback(() => {
    clearPersistedPreferences(persistence, persistenceKey);
    setPreferences(configuredDefaults);
    for (const axis of normalizedAxes) {
      const resolved = applyPreference(axis, configuredDefaults[axis] as never);
      if (axis === 'mode' && resolved) setResolvedMode(resolved);
    }
  }, [configuredDefaults, normalizedAxes, persistence, persistenceKey]);

  useEffect(() => {
    if (!isEnabled('mode') || preferences.mode !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setResolvedMode(applyMode('system'));
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [isEnabled, preferences.mode]);

  const value = useMemo<AppearanceContextValue>(
    () => ({
      enabledAxes: normalizedAxes,
      preferences,
      resolvedMode,
      isEnabled,
      setPreference,
      resetPreferences,
    }),
    [isEnabled, normalizedAxes, preferences, resetPreferences, resolvedMode, setPreference],
  );

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (!context) throw new Error('useAppearance must be used within an AppearanceProvider');
  return context;
}

export function useAppearancePreference<K extends AppearanceAxis>(axis: K) {
  const { preferences, setPreference, isEnabled } = useAppearance();
  const setValue = useCallback(
    (value: AppearancePreferences[K]) => setPreference(axis, value),
    [axis, setPreference],
  );
  return { value: preferences[axis], setValue, enabled: isEnabled(axis) };
}

export function useMode() {
  const { value, setValue, enabled } = useAppearancePreference('mode');
  const { resolvedMode } = useAppearance();
  return { mode: value, setMode: setValue, resolvedMode, enabled };
}

export function useDensity() {
  const { value, setValue, enabled } = useAppearancePreference('density');
  return { density: value, setDensity: setValue, enabled };
}

export interface AppearanceScriptProps {
  enabledAxes: readonly AppearanceAxis[];
  defaults?: Partial<AppearancePreferences>;
  persistence?: AppearancePersistence;
  persistenceKey?: string;
  nonce?: string;
}

export function getAppearanceScript({
  enabledAxes,
  defaults,
  persistence = 'none',
  persistenceKey = DEFAULT_PERSISTENCE_KEY,
}: Omit<AppearanceScriptProps, 'nonce'>) {
  const config = JSON.stringify({
    axes: Array.from(new Set(enabledAxes)),
    defaults: { ...DEFAULT_PREFERENCES, ...defaults },
    persistence,
    key: persistenceKey,
    values: VALUES,
    attributes: ATTRIBUTES,
  }).replaceAll('<', '\\u003c');

  return `(()=>{try{const c=${config};let raw=null;if(c.persistence==='localStorage')raw=localStorage.getItem(c.key);else if(c.persistence==='cookie'){const p=encodeURIComponent(c.key)+'=';const v=document.cookie.split(';').map(x=>x.trim()).find(x=>x.startsWith(p));if(v)raw=decodeURIComponent(v.slice(p.length));}let stored={};if(raw){const parsed=JSON.parse(raw);if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed))stored=parsed;}const root=document.documentElement;for(const axis of c.axes){const value=c.values[axis].includes(stored[axis])?stored[axis]:c.defaults[axis];if(axis==='mode'){const dark=value==='dark'||(value==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);root.classList.toggle('dark',dark);root.style.colorScheme=dark?'dark':'light';}root.setAttribute(c.attributes[axis],value);}}catch{}})();`;
}

export function AppearanceScript({ nonce, ...config }: AppearanceScriptProps) {
  return <script nonce={nonce} dangerouslySetInnerHTML={{ __html: getAppearanceScript(config) }} />;
}
