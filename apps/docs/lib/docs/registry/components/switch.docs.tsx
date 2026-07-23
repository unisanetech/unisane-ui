'use client';

import { ComponentDoc } from '../types';
import { HeroBackground } from '../../runtime/hero-background';
import { Card } from '@unisane/ui/card';
import { Switch } from '@unisane/ui/switch';

// ─── HERO VISUAL ─────────────────────────────────────────────────────────────
const SwitchHeroVisual = () => (
  <HeroBackground tone="secondary">
    {/* Mock Settings Card */}
    <div className="bg-surface border-outline-variant relative w-72 overflow-hidden rounded-sm border shadow-xl">
      <div className="border-outline-variant border-b px-5 py-4">
        <span className="text-title-medium text-on-surface">Quick Settings</span>
      </div>
      <div className="space-y-1 p-4">
        <div className="hover:bg-surface-container-low flex items-center justify-between rounded-sm px-2 py-3">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface-variant">wifi</span>
            <span className="text-body-medium text-on-surface">Wi-Fi</span>
          </div>
          <Switch defaultChecked readOnly />
        </div>
        <div className="hover:bg-surface-container-low flex items-center justify-between rounded-sm px-2 py-3">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface-variant">bluetooth</span>
            <span className="text-body-medium text-on-surface">Bluetooth</span>
          </div>
          <Switch defaultChecked readOnly />
        </div>
        <div className="hover:bg-surface-container-low flex items-center justify-between rounded-sm px-2 py-3">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface-variant">dark_mode</span>
            <span className="text-body-medium text-on-surface">Dark mode</span>
          </div>
          <Switch />
        </div>
        <div className="hover:bg-surface-container-low flex items-center justify-between rounded-sm px-2 py-3">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface-variant">
              do_not_disturb_on
            </span>
            <span className="text-body-medium text-on-surface">Do not disturb</span>
          </div>
          <Switch />
        </div>
      </div>
    </div>
  </HeroBackground>
);

export const switchDoc: ComponentDoc = {
  // ─── BASIC INFO ─────────────────────────────────────────────────────────────
  slug: 'switch',
  name: 'Switch',
  description:
    'Switches toggle the state of a single item on or off, providing immediate visual feedback.',
  category: 'selection',
  status: 'stable',
  icon: 'toggle_on',

  // ─── IMPORT INFO ────────────────────────────────────────────────────────────
  importPath: '@/components/ui/switch',
  exports: ['Switch'],

  // ─── HERO VISUAL ───────────────────────────────────────────────────────────
  heroVisual: <SwitchHeroVisual />,

  // ─── CHOOSING SECTION ──────────────────────────────────────────────────────
  choosing: {
    description: 'Switches have two primary states. The visual feedback is immediate when toggled.',
    columns: {
      emphasis: 'State',
      component: 'Example',
      rationale: 'When to use',
      examples: 'Common uses',
    },
    rows: [
      {
        emphasis: 'Off',
        component: <Switch className="pointer-events-none" />,
        rationale: 'Default state indicating the feature is disabled or inactive.',
        examples: 'Disabled settings, Inactive features',
      },
      {
        emphasis: 'On',
        component: <Switch defaultChecked readOnly className="pointer-events-none" />,
        rationale: 'Indicates the feature is enabled and actively applied.',
        examples: 'Enabled settings, Active features',
      },
      {
        emphasis: 'With Icons',
        component: <Switch defaultChecked showIcons readOnly className="pointer-events-none" />,
        rationale: 'Adds visual clarity with check/close icons for state.',
        examples: 'Important toggles, Confirmation required',
      },
      {
        emphasis: 'Disabled',
        component: <Switch disabled className="pointer-events-none" />,
        rationale: 'Shows that the option exists but cannot be changed.',
        examples: 'Locked settings, Unavailable features',
      },
    ],
  },

  // ─── HIERARCHY SECTION ─────────────────────────────────────────────────────
  hierarchy: {
    description: 'Switches can be used standalone or paired with labels for clarity.',
    items: [
      {
        component: <Switch label="With label" defaultChecked readOnly />,
        title: 'With label',
        subtitle: 'Most common usage',
      },
      {
        component: <Switch defaultChecked readOnly />,
        title: 'Without label',
        subtitle: 'When context is clear',
      },
      {
        component: <Switch defaultChecked showIcons readOnly />,
        title: 'With icons',
        subtitle: 'Visual confirmation',
      },
      {
        component: <Switch showIcons readOnly />,
        title: 'Icons (off)',
        subtitle: 'Unchecked state with icon',
      },
      {
        component: <Switch defaultChecked showIcons disabled readOnly />,
        title: 'Icons disabled',
        subtitle: 'Read-only status display',
      },
    ],
  },

  // ─── PLACEMENT SECTION ─────────────────────────────────────────────────────
  placement: {
    description:
      'Switches are commonly used in settings pages and list items for toggling options.',
    examples: [
      {
        title: 'Settings list',
        visual: (
          <Card variant="outlined" padding="none" className="mx-auto max-w-72 overflow-hidden">
            {['Notifications', 'Auto-update', 'Analytics'].map((item, i) => (
              <div
                key={i}
                className="border-outline-variant flex items-center justify-between border-b px-4 py-3 last:border-0"
              >
                <span className="text-body-medium text-on-surface">{item}</span>
                <Switch defaultChecked={i === 0} readOnly />
              </div>
            ))}
          </Card>
        ),
        caption: 'Inline switches in list items for quick toggles',
      },
      {
        title: 'Form with switches',
        visual: (
          <Card variant="outlined" padding="md" className="mx-auto max-w-72">
            <div className="text-title-small text-on-surface mb-4">Privacy</div>
            <div className="space-y-4">
              <Switch label="Share usage data" />
              <Switch label="Personalized ads" />
              <Switch label="Third-party tracking" defaultChecked readOnly />
            </div>
          </Card>
        ),
        caption: 'Vertical list with labels for form settings',
      },
      {
        title: 'Status toggles with icons',
        visual: (
          <Card variant="outlined" padding="md" className="mx-auto max-w-72">
            <div className="text-title-small text-on-surface mb-4">Automation</div>
            <div className="space-y-4">
              <Switch label="Auto backup" defaultChecked showIcons readOnly />
              <Switch label="Auto sync" showIcons readOnly />
              <Switch label="Safe mode" defaultChecked showIcons disabled readOnly />
            </div>
          </Card>
        ),
        caption: 'Icon switches for quick state scanning in settings panels',
      },
    ],
  },

  // ─── PROPS ──────────────────────────────────────────────────────────────────
  props: [
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Rich label content displayed next to the switch.',
    },
    {
      name: 'checked',
      type: 'boolean',
      description: 'Whether the switch is in the on position.',
    },
    {
      name: 'showIcons',
      type: 'boolean',
      default: 'false',
      description: 'Shows check/close state icons without changing switch semantics.',
    },
    {
      name: 'invalid',
      type: 'boolean',
      default: 'false',
      description: 'Publishes aria-invalid and displays the switch in an invalid state.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'If true, the switch is disabled and cannot be toggled.',
    },
    {
      name: 'onChange',
      type: '(event: ChangeEvent) => void',
      description: 'Callback fired when the switch value changes.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes to apply to the switch container.',
    },
  ],

  // ─── ACCESSIBILITY ──────────────────────────────────────────────────────────
  accessibility: {
    screenReader: [
      'Uses role="switch" for proper screen reader announcement.',
      'aria-checked reflects the current on/off state.',
      'Label is properly associated via htmlFor/id connection.',
      'Disabled state is communicated via aria-disabled.',
    ],
    keyboard: [
      { key: 'Space', description: 'Toggles the switch on/off' },
      { key: 'Tab', description: 'Moves focus to the next focusable element' },
    ],
    focus: [
      'Focus ring is clearly visible around the switch track.',
      'Focus state uses primary color for visibility.',
    ],
  },

  // ─── IMPLEMENTATION ────────────────────────────────────────────────────────
  implementation: {
    description: 'Use controlled state to manage switch values.',
    code: `import { Switch } from "@/components/ui/switch";
import { useState } from "react";

function SettingsPanel() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoSave: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-4">
      <Switch
        label="Enable notifications"
        checked={settings.notifications}
        onChange={() => handleToggle("notifications")}
      />
      <Switch
        label="Dark mode"
        checked={settings.darkMode}
        onChange={() => handleToggle("darkMode")}
      />
      <Switch
        label="Auto-save"
        checked={settings.autoSave}
        onChange={() => handleToggle("autoSave")}
        showIcons
      />
    </div>
  );
}`,
  },

  // ─── RELATED COMPONENTS ─────────────────────────────────────────────────────
  related: [
    {
      slug: 'checkbox',
      reason: 'Use for multiple selections or when form submission is required.',
    },
    {
      slug: 'radio',
      reason: 'Use when only one option can be selected from a group.',
    },
    {
      slug: 'chip',
      reason: 'Use for filter selections with visual tags.',
    },
  ],
};
