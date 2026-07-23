'use client';

import type { PropDef } from '@/lib/docs/registry/types';
import { Surface } from '@unisane/ui/surface';
import { Typography } from '@unisane/ui/typography';
import { cn } from '@unisane/ui/utils';

interface SubComponent {
  name: string;
  description: string;
  props?: PropDef[];
}

interface SubComponentsSectionProps {
  subComponents: SubComponent[];
  className?: string;
}

/**
 * Responsive sub-components section that displays props as:
 * - Cards on mobile (< @2xl / 672px)
 * - Tables on larger screens
 */
export function SubComponentsSection({ subComponents, className }: SubComponentsSectionProps) {
  if (!subComponents.length) return null;

  return (
    <div className={cn('space-y-4 @sm:space-y-6', className)}>
      {subComponents.map((sub) => (
        <SubComponentCard key={sub.name} subComponent={sub} />
      ))}
    </div>
  );
}

/**
 * Individual sub-component card with responsive props display
 */
function SubComponentCard({ subComponent }: { subComponent: SubComponent }) {
  const { name, description, props } = subComponent;

  return (
    <Surface tone="surfaceContainerLow" rounded="sm" className="overflow-hidden">
      <div className="bg-surface-container-low flex flex-col gap-1.5 py-3 @sm:gap-2 @sm:px-5 @sm:py-4 @lg:flex-row @lg:items-center @lg:justify-between">
        <code className="text-body-large text-primary font-mono font-semibold">
          {'<'}
          {name} {'/>'}
        </code>
        <Typography variant="bodySmall" component="span" className="text-on-surface-variant">
          {description}
        </Typography>
      </div>

      {/* Props */}
      {props && props.length > 0 && (
        <div>
          {/* ─── Mobile: Card Layout ───────────────────────────────────────── */}
          <div className="flex flex-col @2xl:hidden">
            {props.map((prop, index) => (
              <SubComponentPropCard
                key={prop.name}
                prop={prop}
                isLast={index === props.length - 1}
              />
            ))}
          </div>

          {/* ─── Desktop: Table Layout ─────────────────────────────────────── */}
          <div className="hidden @2xl:block">
            <table className="text-body-small w-full">
              <thead>
                <tr className="border-outline-variant bg-surface-container-low border-b">
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
                      <code className="text-primary font-mono font-medium">
                        {prop.name}
                        {prop.required && <span className="text-error ml-1">*</span>}
                      </code>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <code className="text-tertiary text-label-small bg-surface-variant rounded-sm px-2 py-1 font-mono">
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
          </div>
        </div>
      )}
    </Surface>
  );
}

/**
 * Individual prop card for mobile view within sub-component
 */
function SubComponentPropCard({ prop, isLast }: { prop: PropDef; isLast: boolean }) {
  return (
    <div
      className={cn(
        'bg-surface-container-low py-3 @sm:px-5 @sm:py-4',
        !isLast && 'border-outline-variant border-b',
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        <code className="text-primary text-body-medium font-mono font-semibold">{prop.name}</code>
        {prop.required && <span className="text-label-small text-error font-medium">required</span>}
      </div>

      <div className="mb-2.5 flex flex-wrap items-center gap-2 @sm:mb-3">
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
