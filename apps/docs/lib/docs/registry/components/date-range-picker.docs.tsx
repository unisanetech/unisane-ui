'use client';

import { useState } from 'react';
import { DateRangePicker, type DateRangeValue } from '@unisane/ui/date-range-picker';
import { HeroBackground } from '../../runtime/hero-background';
import type { ComponentDoc } from '../types';

const initialRange: DateRangeValue = {
  start: new Date(2026, 1, 14),
  end: new Date(2026, 2, 13),
};

function ControlledExample() {
  const [range, setRange] = useState<DateRangeValue>(initialRange);
  return (
    <DateRangePicker
      label="Reporting period"
      value={range}
      onValueChange={setRange}
      max={new Date(2026, 2, 31)}
    />
  );
}

export const dateRangePickerDoc: ComponentDoc = {
  slug: 'date-range-picker',
  name: 'Date Range Picker',
  description:
    'A committed start-and-end date control with a tokenized calendar dialog and explicit apply or cancel actions.',
  category: 'selection',
  status: 'stable',
  icon: 'date_range',
  importPath: '@/components/ui/date-range-picker',
  exports: ['DateRangePicker', 'DateRangeValue'],
  heroVisual: (
    <HeroBackground tone="secondary">
      <ControlledExample />
    </HeroBackground>
  ),
  examplesPreview: { overflow: 'visible', minHeight: 'lg' },
  placement: {
    description:
      'Place it with the filters whose data window it controls. Keep product-specific presets outside the picker.',
    examples: [
      {
        title: 'Reporting filter',
        visual: <ControlledExample />,
        caption: 'Draft selections do not replace the committed range until Apply is chosen.',
      },
    ],
  },
  props: [
    { name: 'value', type: 'DateRangeValue', description: 'Controlled committed range.' },
    {
      name: 'defaultValue',
      type: 'DateRangeValue',
      description: 'Initial uncontrolled committed range.',
    },
    {
      name: 'onValueChange',
      type: '(value: DateRangeValue) => void',
      description: 'Called after a complete draft range is applied.',
    },
    { name: 'open', type: 'boolean', description: 'Controlled dialog state.' },
    {
      name: 'defaultOpen',
      type: 'boolean',
      default: 'false',
      description: 'Initial dialog state.',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: 'Called when the dialog requests an open-state change.',
    },
    { name: 'min', type: 'Date', description: 'Earliest selectable local calendar day.' },
    { name: 'max', type: 'Date', description: 'Latest selectable local calendar day.' },
    { name: 'locale', type: 'string', description: 'Locale used for dates and weekday labels.' },
    {
      name: 'weekStartsOn',
      type: '0 | 1 | 2 | 3 | 4 | 5 | 6',
      default: '0',
      description: 'First weekday column.',
    },
    {
      name: 'label',
      type: 'string',
      default: '"Date range"',
      description: 'Dialog and trigger accessible name.',
    },
    {
      name: 'triggerLabel',
      type: 'ReactNode',
      description: 'Optional compact trigger text; the accessible name retains the exact range.',
    },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the picker.' },
    { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Trigger size.' },
    {
      name: 'triggerVariant',
      type: 'ButtonProps["variant"]',
      default: '"outlined"',
      description: 'Trigger emphasis using the shared button variants.',
    },
  ],
  accessibility: {
    screenReader: [
      'The trigger announces its purpose and the exact committed range.',
      'The modal calendar exposes grid, selected-range, current-date, and unavailable-date semantics.',
      'An incomplete range is announced before Apply becomes available.',
    ],
    keyboard: [
      { key: 'Tab', description: 'Move through dialog controls.' },
      { key: 'Arrow keys', description: 'Move by day or week in the calendar.' },
      { key: 'Page Up / Down', description: 'Move by month.' },
      { key: 'Enter / Space', description: 'Choose the focused date.' },
      { key: 'Escape', description: 'Discard the draft and close the dialog.' },
    ],
    focus: [
      'The dialog traps focus while open and restores focus to the trigger when dismissed.',
      'Calendar days use one roving tab stop.',
    ],
  },
  implementation: {
    description:
      'The registry recipe installs its dialog, button, calendar-control, token, and overlay dependencies.',
    code: `import { DateRangePicker, type DateRangeValue } from "@/components/ui/date-range-picker";
import { useState } from "react";

export function ReportDates() {
  const [range, setRange] = useState<DateRangeValue>({
    start: new Date(2026, 1, 14),
    end: new Date(2026, 2, 13),
  });

  return <DateRangePicker value={range} onValueChange={setRange} label="Reporting period" />;
}`,
  },
  guidelines: [
    { type: 'do', text: 'Use DateRangePicker when one view needs a committed start and end date.' },
    {
      type: 'do',
      text: 'Keep common product presets beside the picker instead of hard-coding them into it.',
    },
    { type: 'dont', text: 'Do not update expensive report data for each draft calendar click.' },
    { type: 'dont', text: 'Do not use it for one exact day; use DatePicker.' },
  ],
  related: [
    { slug: 'date-picker', reason: 'Use for one exact date.' },
    { slug: 'calendar', reason: 'Use when a single-date month grid should remain visible.' },
    { slug: 'segmented-button', reason: 'Use beside the picker for a short set of range presets.' },
  ],
};
