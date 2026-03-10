"use client";
/* eslint-disable react/prop-types */

import type { PropDef } from "@/lib/docs/registry/types";
import { Surface, Typography } from "@unisane/ui";
import { cn } from "@unisane/ui/lib/utils";

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
export function SubComponentsSection({
  subComponents,
  className,
}: SubComponentsSectionProps) {
  if (!subComponents.length) return null;

  return (
    <div className={cn("space-y-4 @sm:space-y-6", className)}>
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
    <Surface tone="surfaceContainerLowest" rounded="sm" className="overflow-hidden">
      <div className="flex flex-col @lg:flex-row @lg:items-center @lg:justify-between gap-1.5 @sm:gap-2 py-3 @sm:px-5 @sm:py-4 bg-surface-container-low">
        <code className="text-body-large font-semibold text-primary font-mono">
          {"<"}{name} {"/>"}
        </code>
        <Typography
          variant="bodySmall"
          component="span"
          className="text-on-surface-variant"
        >
          {description}
        </Typography>
      </div>

      {/* Props */}
      {props && props.length > 0 && (
        <div>
          {/* ─── Mobile: Card Layout ───────────────────────────────────────── */}
          <div className="@2xl:hidden flex flex-col">
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
            <table className="w-full text-body-small">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-lowest">
                  <th className="px-5 py-4 text-left text-label-medium font-semibold text-on-surface">
                    Prop
                  </th>
                  <th className="px-5 py-4 text-left text-label-medium font-semibold text-on-surface">
                    Type
                  </th>
                  <th className="px-5 py-4 text-left text-label-medium font-semibold text-on-surface">
                    Default
                  </th>
                  <th className="px-5 py-4 text-left text-label-medium font-semibold text-on-surface">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {props.map((prop) => (
                  <tr
                    key={prop.name}
                    className="border-b border-outline-variant last:border-none hover:bg-surface-container-low/50 transition-colors"
                  >
                    <td className="px-5 py-4 align-top">
                      <code className="text-primary font-mono font-medium">
                        {prop.name}
                        {prop.required && <span className="text-error ml-1">*</span>}
                      </code>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <code className="text-tertiary font-mono text-label-small bg-surface-variant/40 px-2 py-1 rounded-sm">
                        {prop.type}
                      </code>
                    </td>
                    <td className="px-5 py-4 align-top text-on-surface-variant">
                      {prop.default ? (
                        <code className="font-mono text-label-small">{prop.default}</code>
                      ) : (
                        <span className="text-on-surface-variant/50">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 align-top text-on-surface-variant font-medium">
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
function SubComponentPropCard({
  prop,
  isLast,
}: {
  prop: PropDef;
  isLast: boolean;
}) {
  return (
    <div
      className={cn(
        "py-3 @sm:px-5 @sm:py-4 bg-surface-container-lowest",
        !isLast && "border-b border-outline-variant"
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <code className="text-primary font-mono text-body-medium font-semibold">
          {prop.name}
        </code>
        {prop.required && (
          <span className="text-label-small text-error font-medium">required</span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-2.5 @sm:mb-3">
        <code className="text-tertiary font-mono text-label-small bg-surface-variant/40 px-2 py-1 rounded-sm">
          {prop.type}
        </code>
        {prop.default && (
          <Typography
            variant="labelSmall"
            component="span"
            className="text-on-surface-variant"
          >
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
