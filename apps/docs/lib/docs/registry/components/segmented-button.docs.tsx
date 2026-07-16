'use client';

import { useState } from 'react';
import { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';
import { SegmentedButton } from '@unisane/ui/segmented-button';

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const SegmentedButtonHeroVisual = () => (
  <HeroBackground tone="primary">
    {/* Mock View Toggle */}
    <div className="bg-surface border-outline-variant relative w-80 overflow-hidden rounded-sm border p-6 shadow-xl">
      <div className="text-title-medium text-on-surface mb-4">View Options</div>
      <div className="border-outline-variant inline-flex overflow-hidden rounded-sm border">
        <div className="bg-secondary-container text-on-secondary-container flex items-center gap-2 px-4 py-2">
          <span className="material-symbols-outlined text-[18px]">check</span>
          <span className="text-label-medium">Grid</span>
        </div>
        <div className="text-on-surface-variant border-outline-variant border-l px-4 py-2">
          <span className="text-label-medium">List</span>
        </div>
        <div className="text-on-surface-variant border-outline-variant border-l px-4 py-2">
          <span className="text-label-medium">Cards</span>
        </div>
      </div>
    </div>
  </HeroBackground>
);

// ─── INTERACTIVE EXAMPLES ────────────────────────────────────────────────────
const singleOptions = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
] as const;

const SegmentedButtonSingleExample = () => {
  const [value, setValue] = useState<(typeof singleOptions)[number]['value']>('day');
  return (
    <SegmentedButton
      aria-label="Time range"
      options={singleOptions}
      value={value}
      onValueChange={setValue}
    />
  );
};

const formattingOptions = [
  { value: 'bold', label: 'B', icon: <span className="font-bold">B</span> },
  { value: 'italic', label: 'I', icon: <span className="italic">I</span> },
  { value: 'underline', label: 'U', icon: <span className="underline">U</span> },
] as const;

const SegmentedButtonMultiExample = () => {
  const [value, setValue] = useState<Array<(typeof formattingOptions)[number]['value']>>(['bold']);
  return (
    <SegmentedButton
      aria-label="Text formatting"
      options={formattingOptions}
      value={value}
      onValueChange={setValue}
      selectionMode="multiple"
    />
  );
};

export const segmentedButtonDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: 'segmented-button',
  name: 'Segmented Button',
  description: 'Segmented buttons help users select options, switch views, or sort elements.',
  category: 'actions',
  status: 'stable',
  icon: 'view_week',

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: '@/components/ui/segmented-button',
  exports: ['SegmentedButton'],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <SegmentedButtonHeroVisual />,

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description: 'Choose between single and multi-select based on the interaction model.',
    columns: {
      emphasis: 'Type',
      component: 'Preview',
      rationale: 'When to use',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'Single select',
        component: (
          <SegmentedButton
            aria-label="Single selection example"
            options={[
              { value: 'a', label: 'One' },
              { value: 'b', label: 'Two' },
            ]}
            value="a"
            onValueChange={() => {}}
          />
        ),
        rationale: 'Only one option can be active at a time.',
        examples: 'View switcher, Time range, Sort order',
      },
      {
        emphasis: 'Multi select',
        component: (
          <SegmentedButton
            aria-label="Multiple selection example"
            options={[
              { value: 'a', label: 'A' },
              { value: 'b', label: 'B' },
              { value: 'c', label: 'C' },
            ]}
            value={['a', 'b']}
            onValueChange={() => {}}
            selectionMode="multiple"
          />
        ),
        rationale: 'Multiple options can be selected.',
        examples: 'Text formatting, Filters, Tags',
      },
    ],
  },

  // ─── PLACEMENT SECTION ─────────────────────────────────────────────────────
  placement: {
    description: 'Segmented buttons are used for related choices that affect content display.',
    examples: [
      {
        title: 'Single selection',
        visual: <SegmentedButtonSingleExample />,
        caption: 'Select one option at a time',
      },
      {
        title: 'Multi selection',
        visual: <SegmentedButtonMultiExample />,
        caption: 'Toggle multiple options',
      },
    ],
  },

  // ─── PROPS ──────────────────────────────────────────────────────────────────
  props: [
    {
      name: 'options',
      type: 'SegmentedButtonOption[]',
      description: 'Array of options with value, label, and optional icon.',
    },
    {
      name: 'value',
      type: 'string when single; string[] when multiple',
      description: 'Selected value with a type determined by selectionMode.',
    },
    {
      name: 'defaultValue',
      type: 'string when single; string[] when multiple',
      description: 'Initial selection with a type determined by selectionMode.',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void or (value: string[]) => void',
      description: 'Type-safe callback determined by selectionMode.',
    },
    {
      name: 'selectionMode',
      type: '"single" | "multiple"',
      default: '"single"',
      description: 'Selects the single-value radiogroup or multiple-value checkbox-group contract.',
    },
    {
      name: 'size',
      type: '"sm" | "md" | "lg"',
      default: '"md"',
      description: 'Shared control size used for the group height and item spacing.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes.',
    },
  ],

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  accessibility: {
    screenReader: [
      "Uses role='radiogroup' for single select.",
      "Uses role='group' with checkboxes for multi-select.",
      'aria-checked indicates selection state.',
    ],
    keyboard: [
      { key: 'Tab', description: 'Move focus to/from button group' },
      { key: 'Arrow Keys', description: 'Navigate between options' },
      { key: 'Space/Enter', description: 'Toggle selection' },
    ],
    focus: ['Focus ring visible on focused segment.', 'Selected state clearly indicated visually.'],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description: 'Use controlled value for selection state.',
    code: `import { SegmentedButton } from "@/components/ui/segmented-button";
import { useState } from "react";

function ViewSwitcher() {
  const [view, setView] = useState("grid");

  return (
    <SegmentedButton
      aria-label="View"
      options={[
        { value: "grid", label: "Grid" },
        { value: "list", label: "List" },
        { value: "table", label: "Table" },
      ]}
      value={view}
      onValueChange={setView}
    />
  );
}`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: 'tabs',
      reason: 'Use for content sections with separate panels.',
    },
    {
      slug: 'radio',
      reason: 'Use for form input with visible options.',
    },
    {
      slug: 'chip',
      reason: 'Use for filterable tags or categories.',
    },
  ],
};
