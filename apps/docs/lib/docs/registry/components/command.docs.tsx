'use client';

import type { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@unisane/ui/command';

const CommandPreview = () => (
  <Command className="border-outline-soft shadow-2 max-w-sm border">
    <CommandInput aria-label="Search commands" placeholder="Search commands…" />
    <CommandList>
      <CommandEmpty>No command found.</CommandEmpty>
      <CommandGroup heading="Workspace">
        <CommandItem value="new-document">
          New document<CommandShortcut>⌘N</CommandShortcut>
        </CommandItem>
        <CommandItem value="open-settings">
          Open settings<CommandShortcut>⌘,</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
);

export const commandDoc: ComponentDoc = {
  slug: 'command',
  name: 'Command',
  description: 'A searchable keyboard-oriented command collection for fast application actions.',
  category: 'containment',
  status: 'stable',
  icon: 'terminal',
  importPath: '@/components/ui/command',
  exports: [
    'Command',
    'CommandDialog',
    'CommandInput',
    'CommandList',
    'CommandEmpty',
    'CommandGroup',
    'CommandItem',
    'CommandShortcut',
    'CommandSeparator',
  ],
  heroVisual: (
    <HeroBackground tone="surface">
      <CommandPreview />
    </HeroBackground>
  ),
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Command input, groups, items, and empty state.',
    },
    {
      name: 'value',
      type: 'string',
      description:
        'Controlled search or selected value supported by the underlying command primitive.',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      description: 'Receives controlled value changes.',
    },
  ],
  accessibility: {
    keyboard: [
      { key: 'Arrow Up / Down', description: 'Moves through available commands.' },
      { key: 'Enter', description: 'Runs the highlighted command.' },
    ],
    screenReader: ['The input and option collection expose combobox and listbox semantics.'],
    focus: ['CommandDialog delegates modal focus ownership to Dialog.'],
  },
  implementation: {
    code: `import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";`,
  },
  related: [
    { slug: 'dialog', reason: 'Use CommandDialog when commands need a modal presentation.' },
  ],
};
