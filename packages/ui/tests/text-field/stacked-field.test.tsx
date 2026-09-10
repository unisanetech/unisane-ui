// @vitest-environment happy-dom
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, it } from 'vitest';
import { TextField } from '../../src/components/text-field';

it('keeps one associated external label through value and error changes', async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  try {
    for (const value of ['', 'Maya']) {
      await act(async () => root.render(<TextField label="Full name" labelPlacement="stacked" value={value} errorMessage={value ? undefined : 'Required'} />));
      const input = container.querySelector('input')!;
      const labels = container.querySelectorAll('label');
      expect(labels).toHaveLength(1);
      expect(labels[0]?.htmlFor).toBe(input.id);
      expect(labels[0]?.className).not.toContain('absolute');
      expect(labels[0]?.className).not.toContain('sr-only');
      if (!value) {
        expect(input.getAttribute('aria-invalid')).toBe('true');
        expect(document.getElementById(input.getAttribute('aria-describedby')!)?.textContent).toBe('Required');
      }
    }
  } finally {
    await act(async () => root.unmount());
    container.remove();
  }
});
