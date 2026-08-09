// @vitest-environment happy-dom

import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../src/components/tabs';

async function render(ui: React.ReactNode) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(ui);
  });

  return {
    root,
    container,
    async rerender(nextUi: React.ReactNode) {
      await act(async () => {
        root.render(nextUi);
      });
    },
  };
}

async function cleanup(root: Root, container: HTMLElement) {
  await act(async () => {
    root.unmount();
  });
  container.remove();
}

function getTabs(container: HTMLElement) {
  return Array.from(container.querySelectorAll('[role="tab"]')) as HTMLButtonElement[];
}

function getTabPanel() {
  return document.querySelector('[role="tabpanel"]') as HTMLDivElement | null;
}

describe('Tabs', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders the selected tab with matching ARIA wiring from defaultValue', async () => {
    const rendered = await render(
      <Tabs id="settings-tabs" defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Account panel</TabsContent>
        <TabsContent value="security">Security panel</TabsContent>
      </Tabs>,
    );

    const [accountTab, securityTab] = getTabs(rendered.container);
    const panel = getTabPanel();

    expect(accountTab.getAttribute('aria-selected')).toBe('true');
    expect(accountTab.tabIndex).toBe(0);
    expect(accountTab.getAttribute('aria-controls')).toBe('settings-tabs-panel-account');
    expect(securityTab.getAttribute('aria-selected')).toBe('false');
    expect(securityTab.tabIndex).toBe(-1);
    expect(panel?.id).toBe('settings-tabs-panel-account');
    expect(panel?.getAttribute('aria-labelledby')).toBe('settings-tabs-trigger-account');
    expect(panel?.textContent).toContain('Account panel');

    await cleanup(rendered.root, rendered.container);
  });

  it('changes the active tab on click for uncontrolled usage', async () => {
    const rendered = await render(
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview panel</TabsContent>
        <TabsContent value="activity">Activity panel</TabsContent>
      </Tabs>,
    );

    const [, activityTab] = getTabs(rendered.container);

    await act(async () => {
      activityTab.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(activityTab.getAttribute('aria-selected')).toBe('true');
    expect(activityTab.tabIndex).toBe(0);
    expect(getTabPanel()?.textContent).toContain('Activity panel');

    await cleanup(rendered.root, rendered.container);
  });

  it('supports controlled value changes without mutating selection until rerendered', async () => {
    const onValueChange = vi.fn();
    const rendered = await render(
      <Tabs value="billing" onValueChange={onValueChange}>
        <TabsList>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        <TabsContent value="billing">Billing panel</TabsContent>
        <TabsContent value="team">Team panel</TabsContent>
      </Tabs>,
    );

    const [, teamTab] = getTabs(rendered.container);

    await act(async () => {
      teamTab.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onValueChange).toHaveBeenCalledWith('team');
    expect(teamTab.getAttribute('aria-selected')).toBe('false');
    expect(getTabPanel()?.textContent).toContain('Billing panel');

    await rendered.rerender(
      <Tabs value="team" onValueChange={onValueChange}>
        <TabsList>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        <TabsContent value="billing">Billing panel</TabsContent>
        <TabsContent value="team">Team panel</TabsContent>
      </Tabs>,
    );

    expect(teamTab.getAttribute('aria-selected')).toBe('true');
    expect(getTabPanel()?.textContent).toContain('Team panel');

    await cleanup(rendered.root, rendered.container);
  });

  it('moves focus and selection with Arrow, Home, and End while skipping disabled tabs', async () => {
    const rendered = await render(
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two" disabled>
            Two
          </TabsTrigger>
          <TabsTrigger value="three">Three</TabsTrigger>
        </TabsList>
        <TabsContent value="one">One panel</TabsContent>
        <TabsContent value="two">Two panel</TabsContent>
        <TabsContent value="three">Three panel</TabsContent>
      </Tabs>,
    );

    const [oneTab, , threeTab] = getTabs(rendered.container);
    oneTab.focus();

    await act(async () => {
      oneTab.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    });

    expect(document.activeElement).toBe(threeTab);
    expect(threeTab.getAttribute('aria-selected')).toBe('true');
    expect(getTabPanel()?.textContent).toContain('Three panel');

    await act(async () => {
      threeTab.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    });

    expect(document.activeElement).toBe(oneTab);
    expect(oneTab.getAttribute('aria-selected')).toBe('true');

    await act(async () => {
      oneTab.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    });

    expect(document.activeElement).toBe(threeTab);
    expect(threeTab.getAttribute('aria-selected')).toBe('true');

    await cleanup(rendered.root, rendered.container);
  });
});
