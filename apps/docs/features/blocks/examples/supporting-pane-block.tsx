'use client';

import { Button, Surface, Typography } from '@unisane/ui';

export function SupportingPaneBlock() {
  return (
    <Surface
      tone="surface"
      rounded="sm"
      className="border-outline-variant/15 h-full w-full overflow-hidden border"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_240px]">
        <div className="space-y-4 p-4">
          <div className="flex items-center justify-between gap-3">
            <Typography variant="titleLarge">Document review</Typography>
            <Button variant="tonal" size="sm" className="pointer-events-none">
              Add comment
            </Button>
          </div>
          <Surface tone="surfaceContainerLow" rounded="sm" className="h-16 p-4" />
          <Surface tone="surfaceContainerLow" rounded="sm" className="h-44 p-4" />
          <Surface tone="surfaceContainerLow" rounded="sm" className="h-24 p-4" />
        </div>

        <Surface tone="surfaceContainerLow" className="border-outline-variant/10 border-l p-4">
          <div className="space-y-3">
            <Typography variant="titleMedium">Properties</Typography>
            {[
              ['Owner', 'Operations'],
              ['Priority', 'Medium'],
              ['Status', 'Ready'],
            ].map(([label, value]) => (
              <Surface key={label} tone="surface" rounded="sm" className="p-3">
                <Typography variant="labelMedium">{label}</Typography>
                <Typography variant="bodyMedium" className="text-on-surface-variant mt-1">
                  {value}
                </Typography>
              </Surface>
            ))}
          </div>
        </Surface>
      </div>
    </Surface>
  );
}
