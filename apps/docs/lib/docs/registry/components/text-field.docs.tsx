'use client';

import { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';
import { Button } from '@unisane/ui/button';
import { Card } from '@unisane/ui/card';
import { TextField } from '@unisane/ui/text-field';

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const TextFieldHeroVisual = () => (
  <HeroBackground tone="secondary">
    {/* Mock Login Form */}
    <div className="bg-surface border-outline-variant relative w-80 overflow-hidden rounded-sm border shadow-xl">
      <div className="border-outline-variant border-b px-6 py-5 text-center">
        <span className="text-headline-small text-on-surface">Welcome back</span>
      </div>
      <div className="space-y-4 p-6">
        <TextField
          label="Email"
          placeholder="you@example.com"
          leadingIcon={<span className="material-symbols-outlined">mail</span>}
        />
        <TextField
          label="Password"
          type="password"
          placeholder="Enter password"
          leadingIcon={<span className="material-symbols-outlined">lock</span>}
        />
        <div className="pt-2">
          <Button variant="filled" className="w-full">
            Sign in
          </Button>
        </div>
      </div>
    </div>
  </HeroBackground>
);

export const textFieldDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: 'text-field',
  name: 'Text Field',
  description:
    'Text fields allow users to enter and edit text, with support for labels, validation, and icons.',
  category: 'text-inputs',
  status: 'stable',
  icon: 'text_fields',

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: '@/components/ui/text-field',
  exports: ['TextField'],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <TextFieldHeroVisual />,

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description:
      'Text fields come in two variants. Choose based on the visual density and emphasis needed.',
    columns: {
      emphasis: 'Variant',
      component: 'Example',
      rationale: 'When to use',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'Filled',
        component: (
          <TextField
            variant="filled"
            label="Label"
            placeholder="Input text"
            className="pointer-events-none w-48"
          />
        ),
        rationale: 'Default variant with a subtle background. Good for forms with multiple fields.',
        examples: 'Registration forms, Search inputs, Settings',
      },
      {
        emphasis: 'Outlined',
        component: (
          <TextField
            variant="outlined"
            label="Label"
            placeholder="Input text"
            className="pointer-events-none w-48"
          />
        ),
        rationale: 'Higher contrast with a visible border. Works well on colored backgrounds.',
        examples: 'Contact forms, Login pages, Dialogs',
      },
      {
        emphasis: 'With Icons',
        component: (
          <TextField
            label="Search"
            placeholder="Search..."
            leadingIcon={<span className="material-symbols-outlined">search</span>}
            className="pointer-events-none w-48"
          />
        ),
        rationale: 'Icons provide visual context about the expected input type.',
        examples: 'Search, Email, Password, Phone',
      },
      {
        emphasis: 'Error State',
        component: (
          <TextField
            label="Email"
            value="invalid"
            errorMessage="Please enter a valid email"
            className="pointer-events-none w-48"
          />
        ),
        rationale: 'Shows validation feedback with error message and styling.',
        examples: 'Form validation, Required fields',
      },
    ],
  },

  // ─── HIERARCHY SECTION ─────────────────────────────────────────────────────
  hierarchy: {
    description:
      'Text field variants help establish visual hierarchy and match different contexts.',
    items: [
      {
        component: (
          <TextField variant="filled" label="Filled" placeholder="Filled input" className="w-48" />
        ),
        title: 'Filled',
        subtitle: 'Default variant',
      },
      {
        component: (
          <TextField
            variant="outlined"
            label="Outlined"
            placeholder="Outlined input"
            className="w-48"
          />
        ),
        title: 'Outlined',
        subtitle: 'Higher contrast',
      },
    ],
  },

  // ─── PLACEMENT SECTION ─────────────────────────────────────────────────────
  placement: {
    description: 'Text fields are commonly used in forms, search bars, and dialog inputs.',
    examples: [
      {
        title: 'Contact form',
        visual: (
          <Card variant="outlined" padding="md" className="mx-auto max-w-72">
            <div className="text-title-small text-on-surface mb-4">Contact Us</div>
            <div className="space-y-4">
              <TextField label="Name" placeholder="Your name" />
              <TextField label="Email" placeholder="you@example.com" />
              <TextField label="Message" placeholder="How can we help?" multiline rows={3} />
            </div>
          </Card>
        ),
        caption: 'Stacked text fields in a contact form layout',
      },
      {
        title: 'Inline with button',
        visual: (
          <Card variant="outlined" padding="md" className="mx-auto max-w-80">
            <div className="text-title-small text-on-surface mb-3">Subscribe</div>
            <div className="flex gap-2">
              <TextField
                label="Email"
                placeholder="Enter email"
                leadingIcon={<span className="material-symbols-outlined">mail</span>}
                className="flex-1"
              />
              <button className="bg-primary text-on-primary text-label-medium shrink-0 rounded-full px-4">
                Join
              </button>
            </div>
          </Card>
        ),
        caption: 'Text field with action button for inline forms',
      },
    ],
  },

  // ─── PROPS ──────────────────────────────────────────────────────────────────
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'The label text displayed above or within the field.',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Placeholder text shown when the field is empty.',
    },
    {
      name: 'variant',
      type: '"filled" | "outlined"',
      default: '"outlined"',
      description: 'The visual style of the text field.',
    },
    {
      name: 'size',
      type: '"sm" | "md" | "lg"',
      default: '"md"',
      description: 'Shared field size used for height and horizontal spacing.',
    },
    {
      name: 'value',
      type: 'string | number',
      description: 'The controlled value of the input.',
    },
    {
      name: 'defaultValue',
      type: 'string | number',
      description: 'The default value for uncontrolled usage.',
    },
    {
      name: 'invalid',
      type: 'boolean',
      description: 'Marks the control invalid even when no error message is shown.',
    },
    {
      name: 'description',
      type: 'ReactNode',
      description: 'Guidance linked to the control while it is valid.',
    },
    {
      name: 'errorMessage',
      type: 'ReactNode',
      description: 'Error content linked to the control; also marks it invalid.',
    },
    {
      name: 'leadingIcon',
      type: 'ReactNode',
      description: 'Icon displayed at the start of the input.',
    },
    {
      name: 'trailingIcon',
      type: 'ReactNode',
      description: 'Icon displayed at the end of the input.',
    },
    {
      name: 'multiline',
      type: 'boolean',
      default: 'false',
      description: 'If true, renders a textarea instead of input.',
    },
    {
      name: 'autoResize',
      type: 'boolean',
      default: 'false',
      description: 'Automatically grows a multiline field up to autoResizeMaxHeight.',
    },
    {
      name: 'hideLabel',
      type: 'boolean',
      default: 'false',
      description: 'Visually hides the label while preserving the accessible name.',
    },
    {
      name: 'rows',
      type: 'number',
      description: 'Number of rows for multiline text fields.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'If true, the field is disabled.',
    },
    {
      name: 'required',
      type: 'boolean',
      default: 'false',
      description: 'If true, marks the field as required.',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      description: 'Callback fired with the next string value.',
    },
  ],

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  accessibility: {
    screenReader: [
      'Label is associated with input via htmlFor/id for screen readers.',
      'Descriptions and errors are linked with aria-describedby without replacing consumer ids.',
      'Required state uses native required semantics and a visual marker.',
      'Invalid state is exposed through aria-invalid.',
    ],
    keyboard: [
      { key: 'Tab', description: 'Moves focus to the text field' },
      { key: 'Type', description: 'Enters text in the field' },
      { key: 'Escape', description: 'Clears focus (browser default)' },
    ],
    focus: [
      'Focus ring clearly indicates the active field.',
      'Label animates to indicate focus state.',
      'Error state is visually distinct with red border.',
    ],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description: 'Use controlled or uncontrolled state with validation.',
    code: `import { TextField } from "@/components/ui/text-field";
import { useState } from "react";

function ContactForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (value: string) => {
    if (!value) {
      setError("Email is required");
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)) {
      setError("Please enter a valid email");
    } else {
      setError("");
    }
  };

  return (
    <form className="space-y-4">
      <TextField
        label="Name"
        placeholder="Enter your name"
        required
      />
      <TextField
        label="Email"
        value={email}
        onValueChange={(value) => {
          setEmail(value);
          validateEmail(value);
        }}
        errorMessage={error || undefined}
        leadingIcon={<span className="material-symbols-outlined">mail</span>}
        required
      />
      <TextField
        label="Message"
        placeholder="Your message"
        multiline
        rows={4}
      />
    </form>
  );
}`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: 'select',
      reason: 'Use when users need to choose from predefined options.',
    },
    {
      slug: 'search-bar',
      reason: 'Use for dedicated search functionality with suggestions.',
    },
    {
      slug: 'combobox',
      reason: 'Use when combining text input with dropdown selection.',
    },
  ],
};
