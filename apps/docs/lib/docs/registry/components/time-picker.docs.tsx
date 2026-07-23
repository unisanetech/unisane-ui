'use client';

import { useState } from 'react';
import { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';
import { TimePicker } from '@unisane/ui/time-picker';
import { Button } from '@unisane/ui/button';

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const TimePickerHeroVisual = () => (
  <HeroBackground tone="secondary">
    {/* Mock Time Picker */}
    <div className="bg-surface border-outline-variant relative w-72 overflow-hidden rounded-sm border p-6 shadow-xl">
      <div className="text-label-medium text-on-surface-variant mb-4">Select time</div>
      <div className="mb-6 flex items-center justify-center gap-2">
        <div className="bg-primary-container text-on-primary-container text-display-small rounded-lg px-4 py-3">
          09
        </div>
        <span className="text-display-small text-on-surface">:</span>
        <div className="bg-surface-container-highest text-on-surface text-display-small rounded-lg px-4 py-3">
          30
        </div>
        <div className="border-outline ml-2 flex flex-col overflow-hidden rounded-sm border">
          <div className="bg-tertiary-container text-on-tertiary-container text-label-small px-3 py-1">
            AM
          </div>
          <div className="text-on-surface-variant text-label-small border-outline border-t px-3 py-1">
            PM
          </div>
        </div>
      </div>
      <div className="bg-surface-container-highest relative mx-auto h-40 w-40 rounded-full">
        <div className="bg-primary absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full" />
        <div className="bg-primary absolute top-1/2 left-1/2 h-14 w-0.5 origin-bottom -translate-x-1/2 -translate-y-full rotate-[-60deg]" />
      </div>
    </div>
  </HeroBackground>
);

// ─── INTERACTIVE EXAMPLES ────────────────────────────────────────────────────
const TimePickerExample = () => {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState('09:30');

  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="tonal" onClick={() => setOpen(true)}>
        Select Time: {time}
      </Button>
      <TimePicker open={open} onOpenChange={setOpen} value={time} onValueChange={setTime} />
    </div>
  );
};

const TimePickerDialPreview = () => {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState('09:30');

  return (
    <>
      <Button variant="outlined" size="sm" onClick={() => setOpen(true)}>
        Open dial
      </Button>
      <TimePicker open={open} onOpenChange={setOpen} value={time} onValueChange={setTime} />
    </>
  );
};

const TimePickerKeyboardPreview = () => {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState('13:45');

  return (
    <>
      <Button variant="outlined" size="sm" onClick={() => setOpen(true)}>
        Open input
      </Button>
      <TimePicker open={open} onOpenChange={setOpen} value={time} onValueChange={setTime} />
    </>
  );
};

export const timePickerDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: 'time-picker',
  name: 'Time Picker',
  description: 'Time picker allows users to select a time using a clock dial or keyboard input.',
  category: 'selection',
  status: 'stable',
  icon: 'schedule',

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: '@/components/ui/time-picker',
  exports: ['TimePicker'],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <TimePickerHeroVisual />,
  examplesPreview: {
    overflow: 'visible',
    minHeight: 'lg',
  },

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description: 'Time picker supports both dial and keyboard input modes.',
    columns: {
      emphasis: 'Mode',
      component: 'Preview',
      rationale: 'When to use',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'Clock dial',
        component: <TimePickerDialPreview />,
        rationale: 'Visual, intuitive time selection.',
        examples: 'Mobile apps, Touch interfaces',
      },
      {
        emphasis: 'Keyboard input',
        component: <TimePickerKeyboardPreview />,
        rationale: 'Precise, quick time entry.',
        examples: 'Desktop apps, Power users',
      },
    ],
  },

  // ─── PLACEMENT SECTION ─────────────────────────────────────────────────────
  placement: {
    description: 'Time picker opens in a dialog for focused time selection.',
    previewDefaults: {
      overflow: 'visible',
      minHeight: 'xl',
      align: 'start',
      justify: 'start',
    },
    examples: [
      {
        title: 'Time picker dialog',
        visual: <TimePickerExample />,
        caption: 'Click to open the time picker',
      },
    ],
  },

  // ─── PROPS ──────────────────────────────────────────────────────────────────
  props: [
    {
      name: 'open',
      type: 'boolean',
      description: 'Controlled open state.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      default: '"false"',
      description: 'Initial open state when the picker is uncontrolled.',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: 'Callback fired when picker visibility changes.',
    },
    {
      name: 'value',
      type: 'string',
      description: 'Controlled time value in HH:mm format.',
    },
    {
      name: 'defaultValue',
      type: 'string',
      default: '"12:00"',
      description: 'Initial time value in HH:mm format when uncontrolled.',
    },
    {
      name: 'onValueChange',
      type: '(time: string) => void',
      description: 'Callback fired when time is selected (format: HH:mm).',
    },
  ],

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  accessibility: {
    screenReader: [
      'Dialog has proper role and aria-modal.',
      "Clock dial uses role='listbox' with options.",
      "AM/PM selection uses role='radiogroup'.",
      'Current selection announced via aria-live.',
    ],
    keyboard: [
      { key: 'Tab', description: 'Navigate between hours, minutes, AM/PM' },
      { key: 'Arrow Keys', description: 'Change values' },
      { key: 'Enter', description: 'Confirm selection' },
      { key: 'Escape', description: 'Close picker' },
    ],
    focus: ['Focus trapped within dialog while open.', 'Focus returns to trigger on close.'],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description: 'Control picker visibility with state.',
    code: `import { TimePicker } from "@/components/ui/time-picker";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function MeetingScheduler() {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState("09:00");

  return (
    <div>
      <Button onClick={() => setOpen(true)}>
        Meeting at {time}
      </Button>

      <TimePicker
        open={open}
        onOpenChange={setOpen}
        value={time}
        onValueChange={setTime}
      />
    </div>
  );
}`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: 'date-picker',
      reason: 'Use for date selection.',
    },
    {
      slug: 'calendar',
      reason: 'Use for inline date display.',
    },
    {
      slug: 'text-field',
      reason: 'Use for free-form time input.',
    },
  ],
};
