'use client';

import type { PropDef } from '@/lib/docs/registry/types';
import { Surface } from '@unisane/ui/surface';
import { Typography } from '@unisane/ui/typography';
import { cn } from '@unisane/ui/utils';

interface PropsTableProps {
  props: PropDef[];
  className?: string;
}

/**
 * Responsive props table that displays as:
 * - Cards on mobile (< @2xl / 672px)
 * - Traditional table on larger screens
 */
export function PropsTable({ props, className }: PropsTableProps) {
  if (!props.length) return null;

  return (
    <div className={cn('w-full', className)}>
      <Surface tone="surfaceContainerLow" rounded="sm" className="overflow-hidden @2xl:hidden">
        {props.map((prop, index) => (
          <PropCard key={prop.name} prop={prop} isLast={index === props.length - 1} />
        ))}
      </Surface>

      {/* ─── Desktop: Table Layout ───────────────────────────────────────────── */}
      <Surface
        tone="surfaceContainerLow"
        rounded="sm"
        className="hidden overflow-x-auto @2xl:block"
      >
        <table className="text-body-small w-full">
          <thead>
            <tr className="bg-surface-container-low border-outline-variant border-b">
              <th className="text-label-medium text-on-surface px-5 py-4 text-left font-semibold">
                Prop
              </th>
              <th className="text-label-medium text-on-surface px-5 py-4 text-left font-semibold">
                Type
              </th>
              <th className="text-label-medium text-on-surface px-5 py-4 text-left font-semibold">
                Default
              </th>
              <th className="text-label-medium text-on-surface px-5 py-4 text-left font-semibold">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {props.map((prop) => (
              <tr
                key={prop.name}
                className="border-outline-variant hover:bg-surface-container-low border-b transition-colors last:border-none"
              >
                <td className="px-5 py-4 align-top">
                  <code className="text-primary text-body-small font-mono font-medium">
                    {prop.name}
                    {prop.required && <span className="text-error ml-1">*</span>}
                  </code>
                </td>
                <td className="px-5 py-4 align-top">
                  <code className="text-tertiary text-label-small bg-surface-variant rounded-sm px-2 py-1 font-mono break-all">
                    {prop.type}
                  </code>
                </td>
                <td className="text-on-surface-variant px-5 py-4 align-top">
                  {prop.default ? (
                    <code className="text-label-small font-mono">{prop.default}</code>
                  ) : (
                    <span className="text-on-surface-variant">—</span>
                  )}
                </td>
                <td className="text-on-surface-variant px-5 py-4 align-top font-medium">
                  {prop.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Surface>
    </div>
  );
}

/**
 * Individual prop card for mobile view
 */
function PropCard({ prop, isLast }: { prop: PropDef; isLast: boolean }) {
  return (
    <div className={cn('py-4 @sm:px-5 @sm:py-5', !isLast && 'border-outline-variant border-b')}>
      <div className="mb-2.5 flex items-center gap-2 @sm:mb-3">
        <code className="text-primary text-body-medium font-mono font-semibold">{prop.name}</code>
        {prop.required && <span className="text-label-small text-error font-medium">required</span>}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2 @sm:mb-4">
        <code className="text-tertiary text-label-small bg-surface-variant rounded-sm px-2 py-1 font-mono">
          {prop.type}
        </code>
        {prop.default && (
          <Typography variant="labelSmall" component="span" className="text-on-surface-variant">
            = <code className="font-mono">{prop.default}</code>
          </Typography>
        )}
      </div>

      {prop.description && (
        <Typography
          variant="bodySmall"
          component="p"
          className="text-on-surface-variant leading-relaxed"
        >
          {prop.description}
        </Typography>
      )}
    </div>
  );
}
