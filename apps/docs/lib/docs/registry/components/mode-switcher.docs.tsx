'use client';

import type { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';
import { ModeSwitcher } from '@unisane/ui/mode-switcher';
import { AppearanceProvider } from '@unisane/ui/appearance-provider';

const ModeSwitcherPreview = () => (
  <AppearanceProvider enabledAxes={['mode']} persistence="none">
    <ModeSwitcher />
  </AppearanceProvider>
);

export const modeSwitcherDoc: ComponentDoc = {
  slug: 'mode-switcher',
  name: 'Mode Switcher',
  description: 'A light, dark, and system mode selector backed by the shared appearance contract.',
  category: 'selection',
  status: 'stable',
  icon: 'contrast',
  importPath: '@/components/ui/mode-switcher',
  exports: ['ModeSwitcher', 'ModeSwitcherProps'],
  heroVisual: (
    <HeroBackground tone="primary">
      <ModeSwitcherPreview />
    </HeroBackground>
  ),
  props: [
    {
      name: 'size',
      type: '"sm" | "md" | "lg"',
      default: '"md"',
      description: 'Controls the action frame and icon scale.',
    },
    {
      name: 'showLabels',
      type: 'boolean',
      default: 'true',
      description: 'Shows the visible mode labels.',
    },
    { name: 'showIcons', type: 'boolean', default: 'true', description: 'Shows the mode icons.' },
  ],
  accessibility: {
    keyboard: [{ key: 'Tab / Space', description: 'Moves to and selects a native mode button.' }],
    screenReader: ['Uses a radiogroup with one aria-checked mode.'],
  },
  implementation: {
    code: `import { ModeSwitcher } from "@/components/ui/mode-switcher";`,
  },
  related: [
    { slug: 'segmented-button', reason: 'Use Segmented Button for non-appearance view selection.' },
  ],
};
