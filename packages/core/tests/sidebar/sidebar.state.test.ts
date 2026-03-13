import { describe, expect, it } from 'vitest';
import {
  computeViewportFlags,
  deriveSidebarState,
  parseStoredBoolean,
  parseStoredString,
  parseStoredStringArray,
  resolveSidebarBehavior,
  shouldRenderSidebarTrigger,
} from '../../src/components/sidebar/model/sidebar.state';

describe('sidebar viewport state', () => {
  it('computes mobile/tablet/desktop from breakpoints', () => {
    const breakpoints = { mobile: 600, desktop: 840 };

    expect(computeViewportFlags(480, breakpoints)).toEqual({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
    });

    expect(computeViewportFlags(700, breakpoints)).toEqual({
      isMobile: false,
      isTablet: true,
      isDesktop: false,
    });

    expect(computeViewportFlags(1024, breakpoints)).toEqual({
      isMobile: false,
      isTablet: false,
      isDesktop: true,
    });
  });

  it('resolves adaptive behavior by viewport', () => {
    expect(resolveSidebarBehavior('adaptive', { isMobile: true, isTablet: false })).toBe('overlay');
    expect(resolveSidebarBehavior('adaptive', { isMobile: false, isTablet: true })).toBe('overlay');
    expect(resolveSidebarBehavior('adaptive', { isMobile: false, isTablet: false })).toBe('inset');
  });

  it('keeps explicit behavior untouched', () => {
    expect(resolveSidebarBehavior('overlay', { isMobile: false, isTablet: false })).toBe('overlay');
    expect(resolveSidebarBehavior('inset', { isMobile: true, isTablet: false })).toBe('inset');
  });
});

describe('sidebar derived layout state', () => {
  it('uses overlay drawer state when behavior is overlay', () => {
    const state = deriveSidebarState({
      mode: 'rail-drawer',
      behavior: 'overlay',
      expanded: false,
      mobileOpen: true,
      hoveredHasChildren: false,
      drawerWidth: 220,
    });

    expect(state.railEnabled).toBe(true);
    expect(state.drawerEnabled).toBe(true);
    expect(state.usesOverlayDrawer).toBe(true);
    expect(state.isRailVisible).toBe(false);
    expect(state.isDrawerVisible).toBe(true);
    expect(state.contentMargin).toBe(0);
  });

  it('uses inset rules on desktop behavior', () => {
    const state = deriveSidebarState({
      mode: 'rail-drawer',
      behavior: 'inset',
      expanded: true,
      mobileOpen: false,
      hoveredHasChildren: false,
      drawerWidth: 240,
    });

    expect(state.usesOverlayDrawer).toBe(false);
    expect(state.isRailVisible).toBe(true);
    expect(state.isDrawerVisible).toBe(true);
    expect(state.contentMargin).toBe(240);
  });

  it('respects mode toggles', () => {
    const railOnly = deriveSidebarState({
      mode: 'rail-only',
      behavior: 'inset',
      expanded: true,
      mobileOpen: true,
      hoveredHasChildren: true,
      drawerWidth: 220,
    });

    expect(railOnly.drawerEnabled).toBe(false);
    expect(railOnly.isDrawerVisible).toBe(false);

    const drawerOnly = deriveSidebarState({
      mode: 'drawer-only',
      behavior: 'inset',
      expanded: true,
      mobileOpen: false,
      hoveredHasChildren: false,
      drawerWidth: 220,
    });

    expect(drawerOnly.railEnabled).toBe(false);
    expect(drawerOnly.isRailVisible).toBe(false);
  });
});

describe('sidebar trigger visibility rules', () => {
  const desktop = { isMobile: false, isTablet: false, isDesktop: true };
  const tablet = { isMobile: false, isTablet: true, isDesktop: false };

  it('hides trigger when drawer is disabled', () => {
    expect(
      shouldRenderSidebarTrigger({
        visibility: 'always',
        drawerEnabled: false,
        viewport: desktop,
      }),
    ).toBe(false);
  });

  it('handles desktop/mobile visibility policies', () => {
    expect(
      shouldRenderSidebarTrigger({
        visibility: 'desktop',
        drawerEnabled: true,
        viewport: desktop,
      }),
    ).toBe(true);

    expect(
      shouldRenderSidebarTrigger({
        visibility: 'desktop',
        drawerEnabled: true,
        viewport: tablet,
      }),
    ).toBe(false);

    expect(
      shouldRenderSidebarTrigger({
        visibility: 'mobile',
        drawerEnabled: true,
        viewport: tablet,
      }),
    ).toBe(true);
  });
});

describe('sidebar persistence parsing', () => {
  it('parses safe persisted values', () => {
    expect(parseStoredString(JSON.stringify('home'))).toBe('home');
    expect(parseStoredBoolean(JSON.stringify(true))).toBe(true);
    expect(parseStoredStringArray(JSON.stringify(['a', 'b']))).toEqual(['a', 'b']);
  });

  it('rejects malformed persisted values', () => {
    expect(parseStoredString('{')).toBeNull();
    expect(parseStoredBoolean(JSON.stringify('true'))).toBeNull();
    expect(parseStoredStringArray(JSON.stringify(['a', 1]))).toBeNull();
  });
});
