'use client';

import { SelectField } from '@unisane/ui/select-field';
import type { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';

const workspaceOptions = [
  { value: 'northstar', label: 'Northstar' },
  { value: 'atlas', label: 'Atlas' },
  { value: 'archive', label: 'Archive', disabled: true },
];

export const selectFieldDoc: ComponentDoc = {
  slug: 'select-field',
  name: 'Select Field',
  description:
    'SelectField is the standard labeled, described, and validated options-array recipe built on Select.',
  category: 'text-inputs',
  status: 'stable',
  icon: 'forms_add_on',
  importPath: '@/components/ui/select-field',
  exports: ['SelectField'],
  heroVisual: (
    <HeroBackground tone="secondary">
      <SelectField
        className="w-80"
        defaultValue="northstar"
        description="Changes where newly created records are stored."
        label="Workspace"
        options={workspaceOptions}
      />
    </HeroBackground>
  ),
  heroPreview: { overflow: 'visible', minHeight: 'lg' },
  choosing: {
    description: 'Choose a visual shell that matches the surrounding form controls.',
    rows: [
      {
        emphasis: 'Outlined',
        component: (
          <SelectField
            className="w-52"
            defaultValue="northstar"
            label="Workspace"
            options={workspaceOptions}
            variant="outlined"
          />
        ),
        rationale: 'A clear boundary for standalone fields or mixed surfaces.',
        examples: 'Dialogs, settings, focused forms',
      },
      {
        emphasis: 'Filled',
        component: (
          <SelectField
            className="w-52"
            defaultValue="atlas"
            label="Workspace"
            options={workspaceOptions}
            variant="filled"
          />
        ),
        rationale: 'A quieter boundary for dense forms with several adjacent fields.',
        examples: 'Filters, configuration panels',
      },
      {
        emphasis: 'Invalid',
        component: (
          <SelectField
            className="w-52"
            errorMessage="Choose an available workspace."
            label="Workspace"
            options={workspaceOptions}
          />
        ),
        rationale: 'Connects an error to the trigger and announces invalid state.',
        examples: 'Submission validation',
      },
    ],
  },
  props: [
    {
      name: 'options',
      type: 'SelectFieldOption[]',
      required: true,
      description: 'Flat options with value, label, optional textValue, and disabled state.',
    },
    {
      name: 'label / aria-label',
      type: 'ReactNode | string',
      required: true,
      description: 'Provide a visible label, or an explicit accessible name for compact controls.',
    },
    {
      name: 'description',
      type: 'ReactNode',
      description: 'Guidance connected to the trigger while the field is valid.',
    },
    {
      name: 'errorMessage',
      type: 'ReactNode',
      description: 'Error content connected to the trigger; also marks the field invalid.',
    },
    {
      name: 'value / defaultValue',
      type: 'string',
      description: 'Controlled or initial selected value.',
    },
    {
      name: 'variant',
      type: '"filled" | "outlined"',
      default: '"outlined"',
      description: 'Shared field-shell appearance.',
    },
    {
      name: 'size',
      type: '"sm" | "md" | "lg"',
      default: '"md"',
      description: 'Shared field height, typography, and spacing.',
    },
    {
      name: 'portal',
      type: 'boolean',
      default: 'true',
      description: 'Renders the popup in the shared overlay layer when enabled.',
    },
  ],
  accessibility: {
    screenReader: [
      'A visible label is associated with the trigger, or aria-label supplies the compact-control name.',
      'Descriptions and errors merge with caller-provided aria-describedby references.',
      'Required, disabled, and invalid states are exposed on the trigger.',
    ],
    focus: ['Uses the Select foundation keyboard and focus contract.'],
  },
  implementation: {
    description:
      'Use SelectField for standard application forms. The CLI installs its Select and Field dependencies into the project.',
    code: `import { SelectField } from "@/components/ui/select-field";

function WorkspaceField() {
  return (
    <SelectField
      label="Workspace"
      description="New records are stored here."
      name="workspace"
      options={[
        { value: "northstar", label: "Northstar" },
        { value: "atlas", label: "Atlas" },
      ]}
    />
  );
}`,
  },
  related: [
    {
      slug: 'select',
      reason: 'Use the foundation when items need custom composition or grouping.',
    },
    {
      slug: 'field',
      reason: 'Use Field when the standard recipe does not fit the form layout.',
    },
  ],
};
