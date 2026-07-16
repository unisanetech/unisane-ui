'use client';

import { useState } from 'react';
import { DateInput } from '@unisane/ui/date-input';
import { DatePicker } from '@unisane/ui/date-picker';
import { Icon } from '@unisane/ui/icon';
import { HeroBackground } from '../../runtime/hero-background';
import type { ComponentDoc } from '../types';

const DateInputHeroVisual = () => (
  <HeroBackground tone="primary">
    <div className="w-full max-w-sm">
      <DateInput
        label="Delivery date"
        defaultValue={new Date(2026, 6, 13)}
        description="Use arrow keys or enter each segment."
      />
    </div>
  </HeroBackground>
);

function DateInputBasicExample() {
  const [date, setDate] = useState<Date>();
  return (
    <div className="w-full max-w-xs space-y-2">
      <DateInput label="Birth date" value={date} onValueChange={setDate} format="dd/MM/yyyy" />
      {date ? (
        <p className="text-label-small text-on-surface-variant">
          Selected: {date.toLocaleDateString()}
        </p>
      ) : null}
    </div>
  );
}

function DateInputStatesExample() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <DateInput label="Start date" description="Enter day, month, and year." />
      <DateInput label="End date" errorMessage="End date must follow the start date." invalid />
      <DateInput label="Archived date" disabled defaultValue={new Date(2026, 2, 13)} />
    </div>
  );
}

export const dateInputDoc: ComponentDoc = {
  slug: 'date-input',
  name: 'Date Input',
  description:
    'A keyboard-first date field where day, month, and year are individually editable segments.',
  category: 'text-inputs',
  status: 'stable',
  icon: 'edit_calendar',
  importPath: '@/components/ui/date-input',
  exports: ['DateInput'],
  heroVisual: <DateInputHeroVisual />,
  examplesPreview: { overflow: 'visible', minHeight: 'lg' },
  choosing: {
    description:
      'Choose DateInput for known dates and DatePicker when visual exploration also matters.',
    columns: {
      emphasis: 'Component',
      component: 'Preview',
      rationale: 'When to use',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'Date Input',
        component: (
          <div className="w-56">
            <DateInput label="Date" defaultValue={new Date(2026, 6, 13)} />
          </div>
        ),
        rationale: 'The user already knows the date and keyboard speed matters.',
        examples: 'Birth dates, document dates, exact records',
      },
      {
        emphasis: 'Date Picker',
        component: (
          <div className="w-56">
            <DatePicker label="Date" defaultValue={new Date(2026, 6, 13)} />
          </div>
        ),
        rationale: 'The user benefits from month context and visual availability.',
        examples: 'Appointments, bookings, scheduling',
      },
    ],
  },
  placement: {
    description: 'Align DateInput with other fields and always provide an accessible label.',
    examples: [
      {
        title: 'Direct entry',
        visual: <DateInputBasicExample />,
        caption: 'Explicit format controls segment order and separators.',
      },
      {
        title: 'Guidance and validation',
        visual: <DateInputStatesExample />,
        caption: 'Description and errorMessage have separate semantic roles.',
      },
      {
        title: 'Trailing content',
        visual: (
          <div className="w-full max-w-xs">
            <DateInput label="Review date" trailingIcon={<Icon symbol="event" size="sm" />} />
          </div>
        ),
        caption: 'Use the trailing slot for contextual or interactive project-owned content.',
      },
    ],
  },
  props: [
    { name: 'value', type: 'Date | undefined', description: 'Controlled local calendar date.' },
    { name: 'defaultValue', type: 'Date | undefined', description: 'Initial uncontrolled date.' },
    {
      name: 'onValueChange',
      type: '(date: Date | undefined) => void',
      description: 'Called after a complete valid edit or clear.',
    },
    {
      name: 'label',
      type: 'string',
      required: true,
      description: 'Accessible name shared by every segment.',
    },
    {
      name: 'hideLabel',
      type: 'boolean',
      default: 'false',
      description: 'Visually hides but preserves the field label.',
    },
    { name: 'description', type: 'ReactNode', description: 'Guidance linked to all segments.' },
    {
      name: 'errorMessage',
      type: 'ReactNode',
      description: 'Alert content linked to all segments.',
    },
    {
      name: 'invalid',
      type: 'boolean',
      default: 'false',
      description: 'Marks every segment invalid.',
    },
    {
      name: 'required',
      type: 'boolean',
      default: 'false',
      description: 'Marks every segment and label required.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables every segment and trailing action.',
    },
    {
      name: 'variant',
      type: '"outlined" | "filled"',
      default: '"outlined"',
      description: 'Field presentation.',
    },
    {
      name: 'size',
      type: '"sm" | "md" | "lg"',
      default: '"md"',
      description: 'Field density size.',
    },
    { name: 'locale', type: 'string', description: 'Locale-derived segment order and separator.' },
    { name: 'format', type: 'string', description: 'Explicit pattern such as yyyy-MM-dd.' },
    { name: 'min', type: 'Date', description: 'Earliest allowed local calendar day.' },
    { name: 'max', type: 'Date', description: 'Latest allowed local calendar day.' },
    { name: 'name', type: 'string', description: 'Adds a YYYY-MM-DD hidden form value.' },
    {
      name: 'trailingIcon',
      type: 'ReactNode',
      description: 'Contextual or interactive trailing content.',
    },
    {
      name: 'onFocus',
      type: 'FocusEventHandler<HTMLDivElement>',
      description: 'Called once when focus enters the field.',
    },
    {
      name: 'onBlur',
      type: 'FocusEventHandler<HTMLDivElement>',
      description: 'Called once when focus leaves the field.',
    },
    { name: 'id', type: 'string', description: 'ID for the first segment and associated label.' },
    { name: 'className', type: 'string', description: 'Project-owned layout classes.' },
  ],
  accessibility: {
    screenReader: [
      'Each segment is a spinbutton named with the field label and its date part.',
      'Current, minimum, maximum, required, disabled, and invalid states are exposed per segment.',
      'Description or error content is linked to every segment.',
    ],
    keyboard: [
      { key: 'Tab', description: 'Move between segments and onward through the form.' },
      { key: 'Arrow Up / Down', description: 'Increment or decrement the focused segment.' },
      { key: 'Arrow Left / Right', description: 'Move between date segments.' },
      { key: '0–9', description: 'Enter a segment directly and advance when complete.' },
      { key: 'Backspace / Delete', description: 'Edit or clear the focused segment.' },
    ],
    focus: [
      'The active segment is visually distinct inside the field focus treatment.',
      'Clicking the field surface focuses the first locale-ordered segment.',
      'Interactive trailing content keeps its own focus target.',
    ],
  },
  implementation: {
    description: 'Install DateInput as local source and keep the Date value in application state.',
    code: `import { DateInput } from "@/components/ui/date-input";
import { useState } from "react";

export function BirthDateField() {
  const [birthDate, setBirthDate] = useState<Date>();
  const tooRecent = birthDate ? birthDate > new Date(2008, 0, 1) : false;

  return (
    <DateInput
      label="Birth date"
      value={birthDate}
      onValueChange={setBirthDate}
      errorMessage={tooRecent ? "You must be at least 18." : undefined}
      description={tooRecent ? undefined : "Use day, month, and year."}
      max={new Date()}
    />
  );
}`,
  },
  guidelines: [
    {
      type: 'do',
      text: 'Use explicit format when product requirements must override locale order.',
    },
    { type: 'do', text: 'Treat min and max as local calendar days rather than timestamps.' },
    {
      type: 'do',
      text: 'Use errorMessage only for validation and description for normal guidance.',
    },
    { type: 'dont', text: 'Do not use DateInput for month-only or date-range values.' },
  ],
  related: [
    {
      slug: 'date-picker',
      reason: 'Adds visual calendar selection to the same segmented entry model.',
    },
    { slug: 'calendar', reason: 'Use for an always-visible month grid.' },
    { slug: 'month-picker', reason: 'Use for month/year precision.' },
  ],
};
