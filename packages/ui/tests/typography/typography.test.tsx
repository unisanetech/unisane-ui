// @vitest-environment happy-dom

import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Typography } from '../../src/components/typography';

async function render(ui: React.ReactNode) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(ui);
  });

  return { root, container };
}

async function cleanup(root: Root, container: HTMLElement) {
  await act(async () => {
    root.unmount();
  });
  container.remove();
}

describe('Typography', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders the default body scale as a paragraph', async () => {
    const rendered = await render(<Typography>Body copy</Typography>);
    const text = rendered.container.querySelector('p');

    expect(text?.textContent).toBe('Body copy');
    expect(text?.classList.contains('text-body-large')).toBe(true);

    await cleanup(rendered.root, rendered.container);
  });

  it('maps scale variants to their default semantic elements', async () => {
    const rendered = await render(<Typography variant="displayLarge">Display heading</Typography>);
    const heading = rendered.container.querySelector('h1');

    expect(heading?.classList.contains('text-display-large')).toBe(true);

    await cleanup(rendered.root, rendered.container);
  });

  it('uses the same variant prop for semantic typography roles', async () => {
    const rendered = await render(<Typography variant="pageTitle">Page title</Typography>);
    const heading = rendered.container.querySelector('h1');

    expect(heading?.classList.contains('text-role-page-title')).toBe(true);

    await cleanup(rendered.root, rendered.container);
  });

  it('allows an explicit semantic element override without changing the visual role', async () => {
    const rendered = await render(
      <Typography variant="panelTitle" component="h2">
        Panel title
      </Typography>,
    );
    const heading = rendered.container.querySelector('h2');

    expect(heading?.classList.contains('text-role-panel-title')).toBe(true);

    await cleanup(rendered.root, rendered.container);
  });
});
