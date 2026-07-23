'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
import { useI18n } from '@/components/ui/data-table/i18n';

// ─── TYPES ───────────────────────────────────────────────────────────────────

export interface DragHandleProps extends React.HTMLAttributes<HTMLButtonElement> {
  /** Whether the row is currently being dragged */
  isDragging?: boolean;
  /** Whether the handle is disabled */
  disabled?: boolean;
  /** Size variant */
  size?: 'sm' | 'md';
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

/**
 * Drag handle component for row reordering.
 *
 * Renders a grip icon that users can drag to reorder rows.
 * Supports keyboard reordering with Alt+Arrow keys when focused.
 *
 * @example
 * ```tsx
 * <DragHandle
 *   {...getDragHandleProps(row.id, rowIndex)}
 *   isDragging={isDraggingRow(row.id)}
 * />
 * ```
 */
export const DragHandle = forwardRef<HTMLButtonElement, DragHandleProps>(
  ({ isDragging = false, disabled = false, size = 'md', className, ...props }, ref) => {
    const { t } = useI18n();

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center rounded transition-colors',
          'text-outline-variant hover:text-on-surface-variant',
          'hover:bg-state-hover active:bg-state-pressed',
          'focus-visible:ring-focus-ring focus-visible:ring-2 focus-visible:outline-none',
          'cursor-grab active:cursor-grabbing',
          'touch-none select-none',
          // Keep touch targets large on mobile, but let desktop density control row height.
          size === 'sm' &&
            'h-11 min-h-[44px] w-11 min-w-[44px] sm:h-6 sm:min-h-6 sm:w-6 sm:min-w-6',
          size === 'md' &&
            'h-11 min-h-[44px] w-11 min-w-[44px] sm:h-8 sm:min-h-8 sm:w-8 sm:min-w-8',
          isDragging && 'cursor-grabbing opacity-50',
          disabled && 'pointer-events-none cursor-not-allowed opacity-30',
          className,
        )}
        aria-label={t('dragRowHandle')}
        {...props}
      >
        <Icon
          symbol="drag_indicator"
          className={cn(size === 'sm' && 'text-[16px]', size === 'md' && 'text-[20px]')}
        />
      </button>
    );
  },
);

DragHandle.displayName = 'DragHandle';

export default DragHandle;
