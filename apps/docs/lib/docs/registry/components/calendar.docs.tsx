'use client';

import { useState } from 'react';
import { Calendar } from '@unisane/ui/calendar';
import { DatePicker } from '@unisane/ui/date-picker';
import { HeroBackground } from '../../runtime/hero-background';
import type { ComponentDoc } from '../types';

const CalendarHeroVisual = () => (
  <HeroBackground tone="secondary">
    <div className="w-full max-w-sm">
      <Calendar selectedDate={new Date(2026, 2, 13)} />
    </div>
  </HeroBackground>
);

function CalendarBasicExample() {
  const [date, setDate] = useState<Date>(new Date(2026, 2, 13));
  return (
    <Calendar
      selectedDate={date}
      onDateSelect={setDate}
      min={new Date(2026, 2, 5)}
      max={new Date(2026, 3, 25)}
      className="max-w-xs"
    />
  );
}

export const calendarDoc: ComponentDoc = {
  slug: 'calendar',
  name: 'Calendar',
  description: 'A localized single-date grid with month navigation and bounded keyboard movement.',
  category: 'selection',
  status: 'stable',
  icon: 'calendar_month',
  importPath: '@/components/ui/calendar',
  exports: ['Calendar'],
  heroVisual: <CalendarHeroVisual />,
  examplesPreview: { overflow: 'visible', minHeight: 'lg' },
  choosing: {
    description:
      'Use Calendar when month context is primary and DatePicker when the grid is secondary.',
    columns: {
      emphasis: 'Component',
      component: 'Preview',
      rationale: 'When to use',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'Calendar',
        component: (
          <div className="w-64">
            <Calendar selectedDate={new Date(2026, 2, 13)} />
          </div>
        ),
        rationale: 'Users should see a month grid without opening another surface.',
        examples: 'Availability, scheduling, date dashboards',
      },
      {
        emphasis: 'Date Picker',
        component: (
          <div className="w-56">
            <DatePicker label="Date" defaultValue={new Date(2026, 2, 13)} />
          </div>
        ),
        rationale: 'The date belongs in a compact form field.',
        examples: 'Forms, filters, record editors',
      },
    ],
  },
  placement: {
    description:
      'Give inline calendars enough width for seven stable columns and visible focus rings.',
    examples: [
      {
        title: 'Bounded single-date selection',
        visual: <CalendarBasicExample />,
        caption: 'Unavailable days and unreachable months are disabled from one min/max contract.',
      },
    ],
  },
  props: [
    { name: 'selectedDate', type: 'Date', description: 'Selected local calendar day.' },
    {
      name: 'onDateSelect',
      type: '(date: Date) => void',
      description: 'Called when an enabled day is selected.',
    },
    { name: 'min', type: 'Date', description: 'Earliest selectable local calendar day.' },
    { name: 'max', type: 'Date', description: 'Latest selectable local calendar day.' },
    {
      name: 'locale',
      type: 'string',
      description: 'Locale for month, weekday, and full-date labels.',
    },
    {
      name: 'weekStartsOn',
      type: '0 | 1 | 2 | 3 | 4 | 5 | 6',
      default: '0',
      description: 'First weekday column.',
    },
    {
      name: 'autoFocus',
      type: 'boolean',
      default: 'false',
      description: 'Moves focus to the selected or nearest enabled date after mount.',
    },
    { name: 'aria-label', type: 'string', description: 'Optional date-grid accessible name.' },
    { name: 'className', type: 'string', description: 'Project-owned layout classes.' },
  ],
  accessibility: {
    screenReader: [
      'The month is exposed as one grid with weekday column headers.',
      'Each date is a gridcell with a localized full-date name.',
      'Selected dates use aria-selected and today uses aria-current="date".',
      'Unavailable dates and month navigation are natively disabled.',
    ],
    keyboard: [
      { key: 'Arrow keys', description: 'Move by one day or one week, including across months.' },
      { key: 'Home / End', description: 'Move to the start or end of the current week.' },
      {
        key: 'Page Up / Page Down',
        description: 'Move to the corresponding date in the previous or next month.',
      },
      { key: 'Enter / Space', description: 'Select the focused date.' },
      {
        key: 'Tab',
        description: 'Move between month controls, the date-grid tab stop, and surrounding UI.',
      },
    ],
    focus: [
      'Only one date participates in the grid tab sequence.',
      'Arrow movement preserves focus as the visible month changes.',
      'Month-button activation keeps focus on the activated button.',
    ],
  },
  implementation: {
    description: 'Install and import the project-owned Calendar source directly.',
    code: `import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

export function AvailabilityCalendar() {
  const [date, setDate] = useState<Date>();

  return (
    <Calendar
      selectedDate={date}
      onDateSelect={setDate}
      locale="en-GB"
      weekStartsOn={1}
      min={new Date()}
    />
  );
}`,
  },
  guidelines: [
    { type: 'do', text: 'Use Calendar for one exact day when month context is always relevant.' },
    { type: 'do', text: 'Set locale and weekStartsOn from the same product localization policy.' },
    { type: 'do', text: 'Use min and max to prevent impossible navigation as well as selection.' },
    { type: 'dont', text: 'Do not imply range selection; this foundation selects one Date.' },
  ],
  related: [
    { slug: 'date-picker', reason: 'Composes Calendar into a segmented form field.' },
    {
      slug: 'date-input',
      reason: 'Use for keyboard-first date entry without a visible month grid.',
    },
    { slug: 'time-picker', reason: 'Use for time-of-day selection.' },
  ],
};
