'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@unisane/ui/select';
import type { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';

function SelectPreview() {
  return (
    <Select defaultValue="weekly">
      <SelectTrigger aria-label="Report frequency" className="w-64">
        <SelectValue placeholder="Choose a frequency" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Frequency</SelectLabel>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectItem value="manual">Only when requested</SelectItem>
      </SelectContent>
    </Select>
  );
}

export const selectDoc: ComponentDoc = {
  slug: 'select',
  name: 'Select',
  description:
    'Select is the composable single-value selection foundation for custom item content and structure.',
  category: 'selection',
  status: 'stable',
  icon: 'arrow_drop_down',
  importPath: '@/components/ui/select',
  exports: [
    'Select',
    'SelectTrigger',
    'SelectValue',
    'SelectContent',
    'SelectItem',
    'SelectGroup',
    'SelectLabel',
    'SelectSeparator',
  ],
  heroVisual: (
    <HeroBackground tone="secondary">
      <SelectPreview />
    </HeroBackground>
  ),
  heroPreview: { overflow: 'visible', minHeight: 'lg' },
  docsLayout: { hideChoosing: true },
  props: [
    {
      name: 'value',
      type: 'string',
      description: 'Controlled selected value.',
    },
    {
      name: 'defaultValue',
      type: 'string',
      description: 'Initial selected value for uncontrolled usage.',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      description: 'Runs after a selectable item is chosen.',
    },
    {
      name: 'open',
      type: 'boolean',
      description: 'Controlled popup state.',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: 'Runs when the popup opens or closes.',
    },
    {
      name: 'name',
      type: 'string',
      description: 'Adds a hidden form value under this field name.',
    },
  ],
  subComponents: [
    {
      name: 'SelectTrigger',
      description:
        'The combobox trigger. Give it an accessible name with aria-label or aria-labelledby.',
    },
    {
      name: 'SelectValue',
      description: 'Renders the selected item content or the placeholder.',
    },
    {
      name: 'SelectContent',
      description: 'The listbox popup; portalled by default and optionally rendered inline.',
    },
    {
      name: 'SelectItem',
      description: 'A selectable option with a stable string value and optional textValue.',
    },
    {
      name: 'SelectGroup, SelectLabel, SelectSeparator',
      description: 'Optional structure for organizing a longer option collection.',
    },
  ],
  accessibility: {
    keyboard: [
      { key: 'Arrow Down / Arrow Up', description: 'Opens and moves through enabled items.' },
      { key: 'Home / End', description: 'Moves to the first or last enabled item.' },
      { key: 'Enter / Space', description: 'Opens the list or chooses the highlighted item.' },
      { key: 'Typing', description: 'Moves to the next item whose text starts with the query.' },
      { key: 'Escape', description: 'Closes the list and returns focus to the trigger.' },
      { key: 'Tab', description: 'Closes the list and continues normal focus navigation.' },
    ],
    screenReader: [
      'The trigger exposes combobox state and controls a listbox.',
      'The active item and selected item are exposed independently.',
      'Disabled items remain readable but cannot be highlighted or selected.',
    ],
    focus: ['Focus remains on the trigger while aria-activedescendant tracks the active option.'],
  },
  implementation: {
    description:
      'Use this foundation for custom item composition. Use SelectField for the standard labeled options-array field.',
    code: `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function StatusSelect() {
  return (
    <Select defaultValue="active" name="status">
      <SelectTrigger aria-label="Status">
        <SelectValue placeholder="Choose a status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="paused">Paused</SelectItem>
        <SelectItem value="archived" disabled>
          Archived
        </SelectItem>
      </SelectContent>
    </Select>
  );
}`,
  },
  related: [
    {
      slug: 'select-field',
      reason: 'Use the recipe for a labeled form field backed by an options array.',
    },
  ],
};
