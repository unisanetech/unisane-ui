'use client';

import type { AccessibilityDef } from '@/lib/docs/registry/types';
import { Surface } from '@unisane/ui/surface';
import { Typography } from '@unisane/ui/typography';
import { cn } from '@unisane/ui/utils';

interface AccessibilityInfoProps {
  accessibility: AccessibilityDef;
  className?: string;
}

export function AccessibilityInfo({ accessibility, className }: AccessibilityInfoProps) {
  const hasContent =
    accessibility.keyboard?.length ||
    accessibility.screenReader?.length ||
    accessibility.focus?.length ||
    accessibility.aria?.length;

  if (!hasContent) return null;

  // For simple text-based accessibility info (like reference design)
  const isSimpleFormat = !accessibility.keyboard?.length && !accessibility.focus?.length;

  if (isSimpleFormat && accessibility.screenReader?.length) {
    return (
      <div className={cn('space-y-4', className)}>
        <Typography
          variant="bodyLarge"
          component="p"
          className="text-on-surface-variant leading-relaxed"
        >
          {accessibility.screenReader[0]}
        </Typography>
        {accessibility.screenReader.length > 1 && (
          <ul className="list-disc space-y-2 pl-6">
            {accessibility.screenReader.slice(1).map((item, index) => (
              <li key={index} className="text-body-medium text-on-surface-variant leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-8', className)}>
      {/* Keyboard Navigation */}
      {accessibility.keyboard?.length && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]!">keyboard</span>
            <Typography variant="titleMedium" component="h4">
              Keyboard Navigation
            </Typography>
          </div>
          <Surface tone="surfaceContainerLow" rounded="sm" className="overflow-x-auto">
            <table className="text-body-small w-full">
              <thead>
                <tr className="bg-surface-container-low border-outline-variant border-b">
                  <th className="text-label-medium text-on-surface w-1/3 px-5 py-4 text-left font-semibold">
                    Key
                  </th>
                  <th className="text-label-medium text-on-surface px-5 py-4 text-left font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {accessibility.keyboard.map((item, index) => (
                  <tr key={index} className="border-outline-variant border-b last:border-none">
                    <td className="px-5 py-4">
                      <kbd className="bg-surface-container text-label-medium text-on-surface border-outline-variant inline-flex items-center gap-1 rounded-sm border px-2 py-1 font-mono font-medium">
                        {item.key}
                      </kbd>
                    </td>
                    <td className="text-on-surface-variant px-5 py-4 font-medium">
                      {item.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Surface>
        </div>
      )}

      {/* Screen Reader */}
      {accessibility.screenReader?.length && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]!">hearing</span>
            <Typography variant="titleMedium" component="h4">
              Screen Reader Support
            </Typography>
          </div>
          <ul className="space-y-2">
            {accessibility.screenReader.map((item, index) => (
              <li key={index} className="list-none">
                <Surface
                  tone="surfaceContainerLow"
                  rounded="sm"
                  className="flex items-start gap-3 p-5"
                >
                  <span className="material-symbols-outlined text-primary mt-0.5 shrink-0 text-[16px]!">
                    check
                  </span>
                  <Typography
                    variant="bodyMedium"
                    component="span"
                    className="text-on-surface-variant"
                  >
                    {item}
                  </Typography>
                </Surface>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Focus Management */}
      {accessibility.focus?.length && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]!">
              center_focus_strong
            </span>
            <Typography variant="titleMedium" component="h4">
              Focus Management
            </Typography>
          </div>
          <ul className="space-y-2">
            {accessibility.focus.map((item, index) => (
              <li key={index} className="list-none">
                <Surface
                  tone="surfaceContainerLow"
                  rounded="sm"
                  className="flex items-start gap-3 p-5"
                >
                  <span className="material-symbols-outlined text-primary mt-0.5 shrink-0 text-[16px]!">
                    check
                  </span>
                  <Typography
                    variant="bodyMedium"
                    component="span"
                    className="text-on-surface-variant"
                  >
                    {item}
                  </Typography>
                </Surface>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
