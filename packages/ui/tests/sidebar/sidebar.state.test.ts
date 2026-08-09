import { describe, expect, it } from 'vitest';
import {
  computeViewportFlags,
  deriveSidebarState,
  flagsToViewport,
  parseStoredBoolean,
  parseStoredString,
  parseStoredStringArray,
  resolveSidebarBehavior,
  shouldRenderSidebarTrigger,
} from '../../src/components/sidebar/model/sidebar.state';

describe('sidebar responsive behavior', () => {
  it('computes one viewport from the configured breakpoints', () => {
    const breakpoints = { mobile: 600, desktop: 840 };
    expect(flagsToViewport(computeViewportFlags(480, breakpoints))).toBe('mobile');
    expect(flagsToViewport(computeViewportFlags(700, breakpoints))).toBe('tablet');
    expect(flagsToViewport(computeViewportFlags(1024, breakpoints))).toBe('desktop');
  });

  it('uses the canonical responsive policy by default', () => {
    expect(resolveSidebarBehavior(undefined, 'mobile')).toBe('overlay');
    expect(resolveSidebarBehavior(undefined, 'tablet')).toBe('overlay');
    expect(resolveSidebarBehavior(undefined, 'desktop')).toBe('inset');
  });

  it('supports fixed and per-viewport behavior without a compatibility value', () => {
    expect(resolveSidebarBehavior('overlay', 'desktop')).toBe('overlay');
    expect(resolveSidebarBehavior('inset', 'mobile')).toBe('inset');
    expect(resolveSidebarBehavior({ desktop: 'overlay' }, 'desktop')).toBe('overlay');
    expect(resolveSidebarBehavior({ desktop: 'overlay' }, 'mobile')).toBe('overlay');
  });
});

describe('sidebar derived layout state', () => {
  it('uses an overlay drawer on compact viewports', () => {
    const state = deriveSidebarState({
      mode: 'rail-drawer',
      behavior: 'overlay',
      expanded: false,
      mobileOpen: true,
      previewHasChildren: false,
      railWidth: 96,
      drawerWidth: 220,
    });
    expect(state).toMatchObject({
      railEnabled: true,
      drawerEnabled: true,
      isOverlay: true,
      isRailVisible: false,
      isDrawerVisible: true,
      contentMargin: 0,
    });
  });

  it('retains inset and collapsible drawer geometry', () => {
    expect(
      deriveSidebarState({
        mode: 'rail-drawer',
        behavior: 'inset',
        expanded: true,
        mobileOpen: false,
        previewHasChildren: false,
        railWidth: 84,
        drawerWidth: 240,
      }).contentMargin,
    ).toBe(240);
    expect(
      deriveSidebarState({
        mode: 'collapsible-drawer',
        behavior: 'inset',
        expanded: false,
        mobileOpen: false,
        previewHasChildren: false,
        railWidth: 84,
        drawerWidth: 256,
      }).contentMargin,
    ).toBe(84);
  });
});

describe('sidebar trigger and persistence helpers', () => {
  it('uses the selected visibility policy', () => {
    expect(
      shouldRenderSidebarTrigger({
        visibility: 'desktop',
        drawerEnabled: true,
        viewport: 'desktop',
      }),
    ).toBe(true);
    expect(
      shouldRenderSidebarTrigger({
        visibility: 'desktop',
        drawerEnabled: true,
        viewport: 'tablet',
      }),
    ).toBe(false);
    expect(
      shouldRenderSidebarTrigger({ visibility: 'mobile', drawerEnabled: true, viewport: 'tablet' }),
    ).toBe(true);
  });

  it('parses only safe persisted values', () => {
    expect(parseStoredString(JSON.stringify('home'))).toBe('home');
    expect(parseStoredBoolean(JSON.stringify(true))).toBe(true);
    expect(parseStoredStringArray(JSON.stringify(['a', 'b']))).toEqual(['a', 'b']);
    expect(parseStoredString('{')).toBeNull();
    expect(parseStoredBoolean(JSON.stringify('true'))).toBeNull();
    expect(parseStoredStringArray(JSON.stringify(['a', 1]))).toBeNull();
  });
});
