// @vitest-environment happy-dom

import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AppearanceProvider,
  getAppearanceScript,
  useAppearance,
  type AppearanceAxis,
  type AppearancePersistence,
} from '../../src/layout/appearance-provider';

type MatchMediaController = { setMatches: (matches: boolean) => void };

function installMatchMedia(initialMatches = false): MatchMediaController {
  let matches = initialMatches;
  const listeners = new Set<() => void>();
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: () => ({
      get matches() {
        return matches;
      },
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addEventListener: (_event: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_event: string, listener: () => void) => listeners.delete(listener),
      addListener: (listener: () => void) => listeners.add(listener),
      removeListener: (listener: () => void) => listeners.delete(listener),
      dispatchEvent: () => true,
    }),
  });
  return {
    setMatches(next) {
      matches = next;
      listeners.forEach((listener) => listener());
    },
  };
}

function resetDocument() {
  const root = document.documentElement;
  for (const attribute of [
    'data-theme-mode',
    'data-density',
    'data-contrast',
    'data-radius',
    'data-action-shape',
    'data-elevation',
  ]) {
    root.removeAttribute(attribute);
  }
  root.classList.remove('dark');
  root.style.colorScheme = '';
  localStorage.clear();
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0]?.trim();
    if (name) document.cookie = `${name}=; Path=/; Max-Age=0`;
  }
}

async function renderProvider({
  enabledAxes,
  persistence = 'none',
}: {
  enabledAxes: readonly AppearanceAxis[];
  persistence?: AppearancePersistence;
}) {
  let captured: ReturnType<typeof useAppearance> | undefined;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  function Probe() {
    captured = useAppearance();
    return null;
  }

  await act(async () => {
    root.render(
      <AppearanceProvider
        enabledAxes={enabledAxes}
        persistence={persistence}
        persistenceKey="appearance-test"
      >
        <Probe />
      </AppearanceProvider>,
    );
  });

  return {
    root,
    container,
    getAppearance() {
      if (!captured) throw new Error('Appearance context was not captured');
      return captured;
    },
  };
}

async function cleanup(root: Root, container: HTMLElement) {
  await act(async () => root.unmount());
  container.remove();
}

describe('AppearanceProvider', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    resetDocument();
    installMatchMedia(false);
  });

  afterEach(resetDocument);

  it('applies only explicitly enabled runtime axes', async () => {
    document.documentElement.setAttribute('data-radius', 'soft');
    const rendered = await renderProvider({ enabledAxes: ['mode', 'density'] });

    expect(document.documentElement.getAttribute('data-theme-mode')).toBe('system');
    expect(document.documentElement.getAttribute('data-density')).toBe('standard');
    expect(document.documentElement.getAttribute('data-radius')).toBe('soft');
    expect(document.documentElement.hasAttribute('data-contrast')).toBe(false);

    await cleanup(rendered.root, rendered.container);
  });

  it('validates persisted values and ignores disabled axes', async () => {
    localStorage.setItem(
      'appearance-test',
      JSON.stringify({ density: 'compact', contrast: 'invalid', radius: 'soft' }),
    );
    const rendered = await renderProvider({
      enabledAxes: ['density', 'contrast'],
      persistence: 'localStorage',
    });

    expect(rendered.getAppearance().preferences.density).toBe('compact');
    expect(rendered.getAppearance().preferences.contrast).toBe('standard');
    expect(document.documentElement.hasAttribute('data-radius')).toBe(false);

    await cleanup(rendered.root, rendered.container);
  });

  it('persists generic preference updates and resets to defaults', async () => {
    const rendered = await renderProvider({
      enabledAxes: ['density', 'contrast'],
      persistence: 'localStorage',
    });

    await act(async () => {
      rendered.getAppearance().setPreference('density', 'comfortable');
      rendered.getAppearance().setPreference('contrast', 'high');
    });
    expect(JSON.parse(localStorage.getItem('appearance-test') ?? '{}')).toEqual({
      density: 'comfortable',
      contrast: 'high',
    });

    await act(async () => rendered.getAppearance().resetPreferences());
    expect(localStorage.getItem('appearance-test')).toBeNull();
    expect(document.documentElement.getAttribute('data-density')).toBe('standard');
    expect(document.documentElement.getAttribute('data-contrast')).toBe('standard');

    await cleanup(rendered.root, rendered.container);
  });

  it('supports cookie persistence without changing the provider contract', async () => {
    const rendered = await renderProvider({
      enabledAxes: ['density'],
      persistence: 'cookie',
    });
    await act(async () => rendered.getAppearance().setPreference('density', 'compact'));
    expect(decodeURIComponent(document.cookie)).toContain('"density":"compact"');

    await cleanup(rendered.root, rendered.container);
  });

  it('rejects updates for disabled axes', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const rendered = await renderProvider({ enabledAxes: ['mode'] });
    await act(async () => rendered.getAppearance().setPreference('density', 'compact'));

    expect(warning).toHaveBeenCalledWith('Appearance axis "density" is not enabled.');
    expect(document.documentElement.hasAttribute('data-density')).toBe(false);
    warning.mockRestore();
    await cleanup(rendered.root, rendered.container);
  });

  it('tracks operating-system mode changes only when mode is enabled', async () => {
    const media = installMatchMedia(false);
    const rendered = await renderProvider({ enabledAxes: ['mode'] });
    expect(rendered.getAppearance().resolvedMode).toBe('light');

    await act(async () => media.setMatches(true));
    expect(rendered.getAppearance().resolvedMode).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    await cleanup(rendered.root, rendered.container);
  });

  it('generates a pre-hydration script for enabled preferences only', () => {
    const script = getAppearanceScript({
      enabledAxes: ['mode', 'contrast'],
      persistence: 'localStorage',
      persistenceKey: 'custom-appearance',
    });
    expect(script).toContain('custom-appearance');
    expect(script).toContain('"axes":["mode","contrast"]');
    expect(script).toContain('data-theme-mode');
    expect(script).toContain('data-contrast');
    expect(script).toContain('for(const axis of c.axes)');
  });
});
