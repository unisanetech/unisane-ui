'use client';

import { useState } from 'react';
import { Calendar } from '@unisane/ui/calendar';
import { DatePicker } from '@unisane/ui/date-picker';
import { HeroBackground } from '../../runtime/hero-background';
import type { ComponentDoc } from '../types';

const DatePickerHeroVisual = () => (
  <HeroBackground tone="secondary">
    <div className="min-h-[430px] w-full max-w-sm">
      <DatePicker
        label="Event date"
        defaultValue={new Date(2026, 2, 13)}
        defaultOpen
        portal={false}
      />
    </div>
  </HeroBackground>
);

function DatePickerBasicExample() {
  const [date, setDate] = useState<Date>();
  return (
    <div className="w-full max-w-xs">
      <DatePicker
        label="Appointment date"
        value={date}
        onValueChange={setDate}
        description="Type the date or choose it from the calendar."
      />
    </div>
  );
}

export const datePickerDoc: ComponentDoc = {
  slug: 'date-picker',
  name: 'Date Picker',
  description:
    'A segmented date field with an optional calendar popover for direct entry and visual selection.',
  category: 'selection',
  status: 'stable',
  icon: 'calendar_today',
  importPath: '@/components/ui/date-picker',
  exports: ['DatePicker'],
  heroVisual: <DatePickerHeroVisual />,
  examplesPreview: {
    overflow: 'visible',
    minHeight: 'xl',
  },
  choosing: {
    description:
      'Choose the composed picker for forms and Calendar for always-visible month context.',
    columns: {
      emphasis: 'Component',
      component: 'Preview',
      rationale: 'When to use',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'Date Picker',
        component: (
          <div className="w-56">
            <DatePicker label="Date" defaultValue={new Date(2026, 2, 13)} />
          </div>
        ),
        rationale:
          'Users may type a known date or browse visually without a permanently visible grid.',
        examples: 'Forms, filters, booking details',
      },
      {
        emphasis: 'Calendar',
        component: (
          <div className="w-64">
            <Calendar selectedDate={new Date(2026, 2, 13)} />
          </div>
        ),
        rationale: 'Month context is primary and enough space is available.',
        examples: 'Availability, scheduling, dashboards',
      },
    ],
  },
  placement: {
    description:
      'Use a visible label and place the picker with the other fields in its form section.',
    previewDefaults: {
      overflow: 'visible',
      minHeight: 'xl',
      align: 'start',
      justify: 'start',
    },
    examples: [
      {
        title: 'Form field',
        visual: <DatePickerBasicExample />,
        caption: 'Direct segmented entry and calendar selection share one Date value.',
      },
    ],
  },
  props: [
    { name: 'value', type: 'Date | undefined', description: 'Controlled selected date.' },
    { name: 'defaultValue', type: 'Date | undefined', description: 'Initial uncontrolled date.' },
    {
      name: 'onValueChange',
      type: '(date: Date | undefined) => void',
      description: 'Called when direct entry or calendar selection changes the date.',
    },
    { name: 'open', type: 'boolean', description: 'Controlled calendar open state.' },
    { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Initial open state.' },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: 'Called when the calendar requests an open-state change.',
    },
    { name: 'label', type: 'string', required: true, description: 'Accessible field label.' },
    {
      name: 'hideLabel',
      type: 'boolean',
      default: 'false',
      description: 'Visually hides the label.',
    },
    {
      name: 'description',
      type: 'ReactNode',
      description: 'Guidance linked to every date segment.',
    },
    {
      name: 'errorMessage',
      type: 'ReactNode',
      description: 'Linked error content that marks the field invalid.',
    },
    {
      name: 'invalid',
      type: 'boolean',
      default: 'false',
      description: 'Marks the field invalid without requiring error content.',
    },
    {
      name: 'required',
      type: 'boolean',
      default: 'false',
      description: 'Communicates required field state.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables entry and visual selection.',
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
    {
      name: 'locale',
      type: 'string',
      description: 'Locale shared by segment order and calendar labels.',
    },
    { name: 'format', type: 'string', description: 'Explicit segment pattern such as dd/MM/yyyy.' },
    { name: 'min', type: 'Date', description: 'Earliest allowed local calendar day.' },
    { name: 'max', type: 'Date', description: 'Latest allowed local calendar day.' },
    {
      name: 'showCalendarButton',
      type: 'boolean',
      default: 'true',
      description: 'Shows the visual-picker trigger.',
    },
    {
      name: 'portal',
      type: 'boolean',
      default: 'true',
      description: 'Renders the popover in document.body when enabled.',
    },
    {
      name: 'weekStartsOn',
      type: '0 | 1 | 2 | 3 | 4 | 5 | 6',
      default: '0',
      description: 'First weekday column.',
    },
    { name: 'name', type: 'string', description: 'Adds a YYYY-MM-DD hidden form value.' },
    { name: 'className', type: 'string', description: 'Project-owned layout classes.' },
  ],
  accessibility: {
    screenReader: [
      'The visible or hidden field label names every editable segment.',
      'Description and error content are linked to all segments.',
      'The calendar is announced as a non-modal dialog containing a date grid.',
      'Selected, current, and unavailable dates expose distinct states.',
    ],
    keyboard: [
      { key: 'Tab', description: 'Move through date segments and the calendar button.' },
      { key: 'Arrow Up / Down', description: 'Adjust the focused date segment.' },
      { key: 'Alt + Arrow Down', description: 'Open the calendar from a date segment.' },
      { key: 'Arrow keys', description: 'Move through calendar dates, including across months.' },
      { key: 'Enter / Space', description: 'Select the focused calendar date.' },
      { key: 'Escape', description: 'Close the calendar and restore focus.' },
    ],
    focus: [
      'Opening the calendar moves focus to the selected or nearest available date.',
      'The non-modal popover does not trap focus or inert the page.',
      'Dismissal restores focus to the calendar trigger when it is present.',
    ],
  },
  implementation: {
    description:
      'Registry-installed projects import the local recipe. The DateInput, Calendar, field, icon, overlay, and positioning dependencies are installed with it.',
    code: `import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";

export function BookingDateField() {
  const [date, setDate] = useState<Date>();

  return (
    <DatePicker
      label="Booking date"
      value={date}
      onValueChange={setDate}
      description="Type a date or choose one from the calendar."
      min={new Date()}
    />
  );
}`,
  },
  guidelines: [
    { type: 'do', text: 'Use DatePicker when both fast typing and visual exploration matter.' },
    { type: 'do', text: 'Use one locale for segment ordering and calendar labels.' },
    {
      type: 'do',
      text: 'Use description and errorMessage for distinct guidance and validation roles.',
    },
    { type: 'dont', text: 'Do not use DatePicker for month-only chronology; use MonthPicker.' },
    {
      type: 'dont',
      text: 'Do not hide the calendar button unless Alt+ArrowDown is documented for your audience.',
    },
  ],
  related: [
    {
      slug: 'date-input',
      reason: 'Use for keyboard-first segmented entry without a visual picker.',
    },
    { slug: 'calendar', reason: 'Use when the month grid should remain visible.' },
    { slug: 'month-picker', reason: 'Use for month/year precision.' },
  ],
};
