"use client";
/* eslint-disable react/prop-types */

import type { PropDef } from "@/lib/docs/registry/types";
import { Surface, Typography } from "@unisane/ui";
import { cn } from "@unisane/ui/lib/utils";

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
    <div className={cn("w-full", className)}>
      <Surface
        tone="surfaceContainerLowest"
        rounded="sm"
        className="@2xl:hidden overflow-hidden"
      >
        {props.map((prop, index) => (
          <PropCard
            key={prop.name}
            prop={prop}
            isLast={index === props.length - 1}
          />
        ))}
      </Surface>

      {/* ─── Desktop: Table Layout ───────────────────────────────────────────── */}
      <Surface
        tone="surfaceContainerLowest"
        rounded="sm"
        className="hidden @2xl:block overflow-x-auto"
      >
        <table className="w-full text-body-small">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
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
                className="border-b border-outline-variant last:border-none hover:bg-surface-container-low transition-colors"
              >
                <td className="px-5 py-4 align-top">
                  <code className="text-primary font-mono text-body-small font-medium">
                    {prop.name}
                    {prop.required && <span className="text-error ml-1">*</span>}
                  </code>
                </td>
                <td className="px-5 py-4 align-top">
                  <code className="text-tertiary font-mono text-label-small bg-surface-variant px-2 py-1 rounded-sm break-all">
                    {prop.type}
                  </code>
                </td>
                <td className="px-5 py-4 align-top text-on-surface-variant">
                  {prop.default ? (
                    <code className="font-mono text-label-small">{prop.default}</code>
                  ) : (
                    <span className="text-on-surface-variant">—</span>
                  )}
                </td>
                <td className="px-5 py-4 align-top text-on-surface-variant font-medium">
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
function PropCard({
  prop,
  isLast,
}: {
  prop: PropDef;
  isLast: boolean;
}) {
  return (
    <div
      className={cn(
        "py-4 @sm:px-5 @sm:py-5",
        !isLast && "border-b border-outline-variant"
      )}
    >
      <div className="flex items-center gap-2 mb-2.5 @sm:mb-3">
        <code className="text-primary font-mono text-body-medium font-semibold">
          {prop.name}
        </code>
        {prop.required && (
          <span className="text-label-small text-error font-medium">required</span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3 @sm:mb-4">
        <code className="text-tertiary font-mono text-label-small bg-surface-variant px-2 py-1 rounded-sm">
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
