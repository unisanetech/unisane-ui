'use client';

import { useState } from 'react';
import { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';
import { Button } from '@unisane/ui/button';
import { Card } from '@unisane/ui/card';
import { TokenField } from '@unisane/ui/token-field';

const TokenFieldHeroVisual = () => {
  const [skills, setSkills] = useState(['React', 'TypeScript', 'MongoDB']);

  return (
    <HeroBackground tone="surface">
      <div className="bg-surface border-outline-variant relative w-96 max-w-full overflow-hidden rounded-sm border shadow-xl">
        <div className="border-outline-variant border-b px-5 py-4">
          <span className="text-title-medium text-on-surface">Profile skills</span>
        </div>
        <div className="space-y-4 p-5">
          <TokenField
            label="Skills"
            value={skills}
            onValueChange={setSkills}
            placeholder="Add skill"
            helperText="Press Enter or paste a comma-separated list."
          />
          <Button className="w-full">Save skills</Button>
        </div>
      </div>
    </HeroBackground>
  );
};

export const tokenFieldDoc: ComponentDoc = {
  slug: 'token-field',
  name: 'Token Field',
  description:
    'Token fields let users enter multiple short text values such as tags, skills, keywords, recipients, or labels.',
  category: 'text-inputs',
  status: 'beta',
  icon: 'label',

  importPath: '@/components/ui/token-field',
  exports: ['TokenField'],

  heroVisual: <TokenFieldHeroVisual />,

  choosing: {
    description:
      'Use token fields when the stored value is an array of short text values. Use text fields or textareas for single strings.',
    columns: {
      emphasis: 'Input',
      component: 'Example',
      rationale: 'When to use',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'Token Field',
        component: (
          <TokenField
            label="Skills"
            value={['React', 'TypeScript']}
            placeholder="Add skill"
            className="pointer-events-none w-64"
          />
        ),
        rationale: 'Best when each value should be removable, validated, or submitted separately.',
        examples: 'Skills, tags, keywords, email recipients',
      },
      {
        emphasis: 'Validation',
        component: (
          <TokenField
            label="Guests"
            value={['kevin@example.com']}
            helperText="Enter a valid email address."
            error
            className="pointer-events-none w-64"
          />
        ),
        rationale: 'Use validation when tokens must match a specific format.',
        examples: 'Emails, invite lists, IDs',
      },
    ],
  },

  hierarchy: {
    description:
      'Token fields share form-field structure with text fields while using input chips for entered values.',
    items: [
      {
        component: (
          <TokenField label="Keywords" value={['ATS', 'Analytics', 'SEO']} className="w-72" />
        ),
        title: 'Entered values',
        subtitle: 'Removable input chips',
      },
      {
        component: (
          <TokenField
            label="Guests"
            value={['lena@example.com']}
            placeholder="Add email"
            helperText="Press Enter after each address."
            className="w-72"
          />
        ),
        title: 'With helper text',
        subtitle: 'Guides entry behavior',
      },
    ],
  },

  placement: {
    description:
      'Token fields work in profile editors, invitation forms, filters, and settings panels.',
    examples: [
      {
        title: 'Resume skills',
        visual: (
          <Card variant="outlined" padding="md" className="mx-auto max-w-96">
            <div className="text-title-small text-on-surface mb-4">Skills</div>
            <TokenField
              label="Core skills"
              value={['React', 'TypeScript', 'PostgreSQL']}
              placeholder="Add skill"
              helperText="Use specific tools, methods, and keywords."
            />
          </Card>
        ),
        caption: 'A token field for resume skills or keywords.',
      },
      {
        title: 'Invite guests',
        visual: (
          <Card variant="outlined" padding="md" className="mx-auto max-w-96">
            <div className="text-title-small text-on-surface mb-4">Invite guests</div>
            <TokenField
              label="Emails"
              value={['kevin@example.com', 'markus@example.com']}
              placeholder="Add email"
            />
          </Card>
        ),
        caption: 'A token field for removable email recipients.',
      },
    ],
  },

  props: [
    {
      name: 'label',
      type: 'string',
      required: true,
      description: 'The field label.',
    },
    {
      name: 'value',
      type: 'readonly string[]',
      description: 'Controlled token values.',
    },
    {
      name: 'defaultValue',
      type: 'readonly string[]',
      description: 'Initial token values for uncontrolled usage.',
    },
    {
      name: 'onValueChange',
      type: '(value: string[]) => void',
      description: 'Callback fired when tokens are added or removed.',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Placeholder shown in the inline text input.',
    },
    {
      name: 'helperText',
      type: 'string',
      description: 'Helper text displayed below the field.',
    },
    {
      name: 'variant',
      type: '"outlined" | "filled"',
      default: '"outlined"',
      description: 'The shared field shell variant.',
    },
    {
      name: 'size',
      type: '"sm" | "md" | "lg"',
      default: '"md"',
      description: 'Shared field size used for spacing and text scale.',
    },
    {
      name: 'maxTokens',
      type: 'number',
      description: 'Maximum number of tokens that may be entered.',
    },
    {
      name: 'allowDuplicates',
      type: 'boolean',
      default: 'false',
      description: 'Whether duplicate tokens are allowed.',
    },
    {
      name: 'validateToken',
      type: '(token: string, values: readonly string[]) => string | null | undefined',
      description: 'Returns an error message when a token is invalid.',
    },
    {
      name: 'normalizeToken',
      type: '(token: string) => string',
      description: 'Normalizes text before it is added as a token.',
    },
  ],

  accessibility: {
    screenReader: [
      'The visible label is associated with the text input.',
      'Entered tokens are exposed as a list of removable input chips.',
      'Validation and helper text are connected through aria-describedby.',
    ],
    keyboard: [
      { key: 'Enter / comma / semicolon', description: 'Adds the typed token.' },
      { key: 'Paste', description: 'Splits comma, semicolon, and newline separated values.' },
      { key: 'Backspace', description: 'Removes the last token when the input is empty.' },
      { key: 'Tab', description: 'Moves focus through token remove buttons and the input.' },
    ],
    focus: ['The field uses the shared Unisane focus ring and field focus styling.'],
  },

  implementation: {
    description:
      'Use TokenField for array values. Keep validation and normalization domain-specific.',
    code: `import { TokenField } from "@/components/ui/token-field";
import { useState } from "react";

function SkillsField() {
  const [skills, setSkills] = useState(["React", "TypeScript"]);

  return (
    <TokenField
      label="Skills"
      value={skills}
      onValueChange={setSkills}
      placeholder="Add skill"
      helperText="Press Enter, comma, or paste a list."
      maxTokens={30}
    />
  );
}`,
  },

  related: [
    {
      slug: 'text-field',
      reason: 'Use for one text value instead of a list of tokens.',
    },
    {
      slug: 'chip',
      reason: 'Token fields use input chips to display entered values.',
    },
    {
      slug: 'combobox',
      reason: 'Use when users must choose values from a searchable option list.',
    },
  ],
};
