// @vitest-environment happy-dom

import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Field, FieldDescription, FieldError, FieldLabel } from '../../src/components/field';

describe('Field', () => {
  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('provides a small semantic composition contract', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <Field invalid>
          <FieldLabel htmlFor="project-name" required>
            Project name
          </FieldLabel>
          <input id="project-name" />
          <FieldDescription id="project-name-description">Shown to collaborators.</FieldDescription>
          <FieldError id="project-name-error">Project name is required.</FieldError>
        </Field>,
      );
    });

    const field = container.firstElementChild;
    const label = container.querySelector('label');
    const requiredMarker = label?.querySelector('[aria-hidden="true"]');
    const description = container.querySelector('#project-name-description');
    const error = container.querySelector('#project-name-error');

    expect(field?.getAttribute('data-invalid')).toBe('true');
    expect(label?.getAttribute('for')).toBe('project-name');
    expect(requiredMarker?.textContent).toBe('*');
    expect(description?.className).toContain('text-on-surface-variant');
    expect(error?.getAttribute('role')).toBe('alert');
    expect(error?.className).toContain('text-error');

    await act(async () => root.unmount());
  });
});
