'use client';

import { Field, FieldError, FieldLabel } from '@unisane/ui/field';
import { Input } from '@unisane/ui/input';
import type { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';

const FieldHeroVisual = () => (
  <HeroBackground tone="surface">
    <Field className="w-80 gap-2" invalid>
      <FieldLabel htmlFor="field-preview-email" required>
        Email
      </FieldLabel>
      <Input id="field-preview-email" aria-describedby="field-preview-error" aria-invalid />
      <FieldError id="field-preview-error">Enter a valid email address.</FieldError>
    </Field>
  </HeroBackground>
);

export const fieldDoc: ComponentDoc = {
  slug: 'field',
  name: 'Field',
  description:
    'Field composes labels, controls, descriptions, and errors without imposing a form library.',
  category: 'foundations',
  status: 'stable',
  icon: 'forms_add_on',
  importPath: '@/components/ui/field',
  exports: ['Field', 'FieldLabel', 'FieldDescription', 'FieldError'],
  heroVisual: <FieldHeroVisual />,
  docsLayout: { hideChoosing: true },
  props: [
    {
      name: 'invalid',
      type: 'boolean',
      default: 'false',
      description: 'Exposes invalid state on the field wrapper for styling and composition.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Adds project-owned layout or styling classes.',
    },
  ],
  subComponents: [
    {
      name: 'FieldLabel',
      description: 'A label associated to the control through htmlFor and id.',
    },
    {
      name: 'FieldDescription',
      description: 'Non-error guidance referenced by the control through aria-describedby.',
    },
    {
      name: 'FieldError',
      description: 'Error content rendered as an alert and referenced by the invalid control.',
    },
  ],
  accessibility: {
    screenReader: [
      'FieldLabel uses native label semantics.',
      'Consumers connect descriptions and errors with aria-describedby.',
      'Controls expose aria-invalid; FieldError announces dynamically rendered error content.',
    ],
    focus: ['Field does not add a focus target; the native control owns focus.'],
  },
  implementation: {
    description:
      'Use Field for custom compositions. Use TextField when the built-in floating-label recipe is sufficient.',
    code: `import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

function WorkspaceNameField({ error }: { error?: string }) {
  const invalid = Boolean(error);

  return (
    <Field invalid={invalid} className="gap-2">
      <FieldLabel htmlFor="workspace-name" required>
        Workspace name
      </FieldLabel>
      <Input
        id="workspace-name"
        aria-describedby={invalid ? "workspace-name-error" : "workspace-name-description"}
        aria-invalid={invalid || undefined}
        required
      />
      {error ? (
        <FieldError id="workspace-name-error">{error}</FieldError>
      ) : (
        <FieldDescription id="workspace-name-description">
          This name is visible to collaborators.
        </FieldDescription>
      )}
    </Field>
  );
}`,
  },
  related: [
    {
      slug: 'text-field',
      reason: 'Use the rich recipe when the standard floating-label field is sufficient.',
    },
  ],
};
