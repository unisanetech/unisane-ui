'use client';

import { useState, useEffect } from 'react';
import {
  useAppearance,
  type Density,
  type RadiusTheme,
  type ActionShape,
  type ContrastLevel,
  type Elevation,
} from '@unisane/ui/appearance-provider';
import { Popover } from '@unisane/ui/popover';
import { Slider } from '@unisane/ui/slider';

const DENSITY_OPTIONS: { value: Density; label: string }[] = [
  { value: 'dense', label: 'Dense' },
  { value: 'compact', label: 'Compact' },
  { value: 'standard', label: 'Standard' },
  { value: 'comfortable', label: 'Comfortable' },
];

const RADIUS_OPTIONS: { value: RadiusTheme; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'sharp', label: 'Sharp' },
  { value: 'standard', label: 'Standard' },
  { value: 'soft', label: 'Soft' },
];

const ACTION_SHAPE_OPTIONS: { value: ActionShape; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'full', label: 'Full' },
];

const CONTRAST_OPTIONS: { value: ContrastLevel; label: string; index: number }[] = [
  { value: 'standard', label: 'Standard', index: 0 },
  { value: 'medium', label: 'Medium', index: 1 },
  { value: 'high', label: 'High', index: 2 },
];

const ELEVATION_OPTIONS: { value: Elevation; label: string }[] = [
  { value: 'flat', label: 'Flat' },
  { value: 'subtle', label: 'Subtle' },
  { value: 'standard', label: 'Standard' },
  { value: 'pronounced', label: 'Pronounced' },
];

// Segmented button for appearance mode
function AppearanceToggle({
  value,
  onChange,
}: {
  value: 'light' | 'dark' | 'system';
  onChange: (value: 'light' | 'dark' | 'system') => void;
}) {
  const options = [
    { value: 'light' as const, label: 'Light', icon: 'light_mode' },
    { value: 'system' as const, label: 'System', icon: 'desktop_windows' },
    { value: 'dark' as const, label: 'Dark', icon: 'dark_mode' },
  ];

  return (
    <div className="bg-surface-container-high flex gap-1 rounded-lg p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-button text-label-large duration-short flex flex-1 items-center justify-center gap-2 px-3 py-2.5 font-medium transition-all ${
            value === opt.value
              ? 'bg-surface shadow-1 text-on-surface'
              : 'text-on-surface-variant hover:text-on-surface'
          } `}
        >
          <span className="material-symbols-outlined text-[18px]">{opt.icon}</span>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// Grid button for density options (2x2 grid)
function DensityButton({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-button text-label-large duration-short flex-1 px-4 py-3 font-medium transition-all ${
        selected
          ? 'bg-primary-container text-on-primary-container ring-primary ring-2'
          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
      } `}
    >
      {label}
    </button>
  );
}

// Pill button for inline options
function PillButton({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-button text-label-medium duration-short flex-1 px-3 py-2 text-center font-medium transition-all ${
        selected
          ? 'bg-primary-container text-on-primary-container'
          : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
      } `}
    >
      {label}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-label-medium text-on-surface-variant mb-3 font-medium tracking-wide uppercase">
      {children}
    </div>
  );
}

function SectionDescription({ children }: { children: React.ReactNode }) {
  return <div className="text-body-small text-on-surface-variant mt-2">{children}</div>;
}

export function AppearanceSettings() {
  const { preferences, setPreference } = useAppearance();
  const { mode, density, radius, actionShape, contrast, elevation } = preferences;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get contrast slider value
  const contrastIndex = CONTRAST_OPTIONS.find((c) => c.value === contrast)?.index ?? 0;
  const contrastLabel = CONTRAST_OPTIONS.find((c) => c.value === contrast)?.label ?? 'Standard';

  const handleContrastChange = (value: number) => {
    const option = CONTRAST_OPTIONS.find((c) => c.index === value);
    if (option) {
      setPreference('contrast', option.value);
    }
  };

  // Prevent hydration mismatch - use same span as mounted state for consistency
  if (!mounted) {
    return (
      <span
        className="rounded-icon-button hover:bg-state-hover inline-flex h-10 w-10 cursor-pointer items-center justify-center transition-colors"
        aria-label="Appearance settings"
      >
        <span className="material-symbols-outlined text-[24px]">tune</span>
      </span>
    );
  }

  const content = (
    <div className="max-h-[85vh] w-[420px] space-y-6 overflow-y-auto p-6">
      {/* Header */}
      <div>
        <h2 className="text-headline-small text-on-surface font-semibold">Appearance Settings</h2>
        <p className="text-body-medium text-on-surface-variant mt-1">
          Customize the look and feel of your interface.
        </p>
      </div>

      {/* Appearance Mode */}
      <div>
        <AppearanceToggle value={mode} onChange={(value) => setPreference('mode', value)} />
      </div>

      {/* Density - 2x2 grid */}
      <div>
        <SectionLabel>Density</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          {DENSITY_OPTIONS.map((d) => (
            <DensityButton
              key={d.value}
              selected={density === d.value}
              onClick={() => setPreference('density', d.value)}
              label={d.label}
            />
          ))}
        </div>
        <SectionDescription>Controls spacing and padding throughout the UI.</SectionDescription>
      </div>

      {/* Corner Radius */}
      <div>
        <SectionLabel>Corner Radius</SectionLabel>
        <div className="flex gap-1.5">
          {RADIUS_OPTIONS.map((r) => (
            <PillButton
              key={r.value}
              selected={radius === r.value}
              onClick={() => setPreference('radius', r.value)}
              label={r.label}
            />
          ))}
        </div>
      </div>

      {/* Action Shape */}
      <div>
        <SectionLabel>Action Shape</SectionLabel>
        <div className="flex gap-2">
          {ACTION_SHAPE_OPTIONS.map((shape) => (
            <PillButton
              key={shape.value}
              selected={actionShape === shape.value}
              onClick={() => setPreference('actionShape', shape.value)}
              label={shape.label}
            />
          ))}
        </div>
        <SectionDescription>
          Controls the global shape for button-family actions.
        </SectionDescription>
      </div>

      {/* Elevation */}
      <div>
        <SectionLabel>Elevation</SectionLabel>
        <div className="flex gap-1.5">
          {ELEVATION_OPTIONS.map((e) => (
            <PillButton
              key={e.value}
              selected={elevation === e.value}
              onClick={() => setPreference('elevation', e.value)}
              label={e.label}
            />
          ))}
        </div>
      </div>

      {/* Contrast - Slider */}
      <div>
        <SectionLabel>Contrast</SectionLabel>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Slider
              value={contrastIndex}
              onValueChange={handleContrastChange}
              min={0}
              max={2}
              step={1}
            />
          </div>
          <span className="text-label-large text-on-surface min-w-[72px] text-right font-medium">
            {contrastLabel}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <Popover
      trigger={
        <span
          className="rounded-icon-button hover:bg-state-hover inline-flex h-10 w-10 cursor-pointer items-center justify-center transition-colors"
          aria-label="Appearance settings"
        >
          <span className="material-symbols-outlined text-[24px]">tune</span>
        </span>
      }
      content={content}
      side="right"
      align="end"
      className="!min-w-0 !p-0"
    />
  );
}
