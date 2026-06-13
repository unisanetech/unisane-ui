'use client';

import { cn, Icon, Badge, Button, IconButton } from '@unisane/ui';
import type { ToolbarAction } from './types';

// ─── TOOLBAR DROPDOWN BUTTON (Facebook Ads Manager style) ─────────────────

/** Dropdown button with icon, label, and dropdown arrow */
export function ToolbarDropdownButton({
  label,
  icon,
  onClick,
  active = false,
  disabled = false,
  className,
  as: Component = 'button',
  badge,
}: {
  label: string;
  icon?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  as?: 'button' | 'div';
  /** Badge count to show on the icon */
  badge?: number;
}) {
  return (
    <Component
      onClick={onClick}
      disabled={Component === 'button' ? disabled : undefined}
      className={cn(
        // Touch-friendly: min 44px on small containers, standard 36px on larger
        'inline-flex h-11 min-h-[44px] items-center gap-2 px-3 transition-colors @md:h-9 @md:min-h-[36px]',
        'text-body-medium border-outline-variant rounded border font-medium',
        'text-on-surface hover:bg-state-hover',
        'focus-visible:ring-focus-ring focus-visible:ring-2 focus-visible:outline-none',
        'disabled:pointer-events-none disabled:opacity-50',
        active && 'bg-primary-container text-on-primary-container border-primary-container',
        Component === 'div' && 'cursor-pointer',
        disabled && Component === 'div' && 'pointer-events-none opacity-50',
        className,
      )}
      aria-label={label}
    >
      {icon && (
        <span className="relative inline-flex">
          <Icon
            symbol={icon}
            className={cn(
              'h-5 w-5',
              active ? 'text-on-primary-container' : 'text-on-surface-variant',
            )}
          />
          {/* Badge count indicator - positioned at top-left of icon */}
          {badge !== undefined && badge > 0 && (
            <Badge
              size="sm"
              className="absolute -top-2 -left-2 z-10 h-[18px] min-w-[18px] !px-1 !py-0"
            >
              {badge}
            </Badge>
          )}
          {/* Active dot indicator (when active but no badge) */}
          {active && (badge === undefined || badge === 0) && (
            <span className="bg-primary ring-surface absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full ring-1" />
          )}
        </span>
      )}
      <span>{label}</span>
      <Icon
        symbol="arrow_drop_down"
        className={cn('h-5 w-5', active ? 'text-on-primary-container' : 'text-on-surface-variant')}
      />
    </Component>
  );
}

// ─── TOOLBAR TEXT BUTTON (simple action) ───────────────────────────────────

/** Simple text button for actions like Export - matches Facebook Ads Manager style */
export function ToolbarTextButton({
  label,
  icon,
  onClick,
  active = false,
  disabled = false,
  badge,
}: {
  label: string;
  icon?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  /** Badge count to show on the icon */
  badge?: number;
}) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant="outlined"
      size="sm"
      className={cn(
        // Touch-friendly: min 44px on small containers, standard 36px on larger
        'text-body-medium h-11 min-h-[44px] items-center gap-2 px-3 font-medium transition-colors @md:h-9 @md:min-h-[36px]',
        'text-on-surface hover:bg-state-hover',
        'disabled:pointer-events-none disabled:opacity-50',
        active && 'bg-primary-container text-on-primary-container border-primary-container',
      )}
      aria-label={label}
    >
      {icon && (
        <span className="relative inline-flex">
          <Icon
            symbol={icon}
            className={cn(
              'h-5 w-5',
              active ? 'text-on-primary-container' : 'text-on-surface-variant',
            )}
          />
          {/* Badge count indicator - positioned at top-left of icon */}
          {badge !== undefined && badge > 0 && (
            <Badge
              size="sm"
              className="absolute -top-2 -left-2 z-10 h-[18px] min-w-[18px] !px-1 !py-0"
            >
              {badge}
            </Badge>
          )}
          {/* Active dot indicator (when active but no badge) */}
          {active && (badge === undefined || badge === 0) && (
            <span className="bg-primary ring-surface absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full ring-1" />
          )}
        </span>
      )}
      <span>{label}</span>
    </Button>
  );
}

// ─── SEGMENTED DROPDOWN BUTTON ─────────────────────────────────────────────

/** Segmented button with icon on left and dropdown arrow on right */
export function SegmentedDropdownButton({
  icon,
  label,
  active = false,
  isFirst = false,
  isLast = false,
  badge,
}: {
  icon: string;
  label?: string;
  active?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  /** Badge count to show on the icon */
  badge?: number;
}) {
  return (
    <div
      className={cn(
        // Touch-friendly: min 44px on small containers, standard 40px on larger
        'border-outline-variant bg-surface flex h-11 min-h-[44px] items-center border transition-colors @md:h-10 @md:min-h-[40px]',
        'hover:bg-state-hover',
        active && 'bg-primary-container border-primary-container',
        isFirst && 'rounded-l-lg',
        isLast && 'rounded-r-lg',
        !isFirst && '-ml-px',
      )}
    >
      {/* Icon section */}
      <div
        className={cn(
          'flex h-full items-center justify-center px-3',
          'text-on-surface-variant',
          active && 'text-on-primary-container',
        )}
      >
        <span className="relative inline-flex">
          <Icon symbol={icon} className="h-5 w-5" />
          {/* Badge count indicator - positioned at top-left of icon */}
          {badge !== undefined && badge > 0 && (
            <Badge
              size="sm"
              className="absolute -top-2 -left-2 z-10 h-[18px] min-w-[18px] !px-1 !py-0"
            >
              {badge}
            </Badge>
          )}
          {/* Active dot indicator (when active but no badge) */}
          {active && (badge === undefined || badge === 0) && (
            <span className="bg-primary ring-surface absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full ring-1" />
          )}
        </span>
        {label && (
          <span
            className={cn(
              'text-label-large ml-2 font-medium',
              active ? 'text-on-primary-container' : 'text-on-surface',
            )}
          >
            {label}
          </span>
        )}
      </div>
      {/* Dropdown arrow section */}
      <div
        className={cn(
          'border-outline-variant flex h-full items-center justify-center border-l px-2',
          active ? 'text-on-primary-container' : 'text-on-surface-variant',
        )}
      >
        <Icon symbol="arrow_drop_down" className="h-5 w-5" />
      </div>
    </div>
  );
}

// ─── SEGMENTED ICON BUTTON (no dropdown) ───────────────────────────────────

/** Segmented button with just icon (for actions like export, refresh) */
export function SegmentedIconButton({
  icon,
  label,
  onClick,
  active = false,
  disabled = false,
  isFirst = false,
  isLast = false,
}: {
  icon: string;
  label: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      variant={active ? 'tonal' : 'standard'}
      size="md"
      className={cn(
        'border-outline-variant border',
        'disabled:pointer-events-none disabled:opacity-50',
        isFirst && 'rounded-l-lg',
        isLast && 'rounded-r-lg',
        !isFirst && '-ml-px',
      )}
      selected={active}
      icon={<Icon symbol={icon} />}
      aria-label={label}
    />
  );
}

// ─── ACTION BUTTON ─────────────────────────────────────────────────────────

export function ActionButton({ action }: { action: ToolbarAction }) {
  const isPrimary = action.variant === 'primary';
  const isDanger = action.variant === 'danger';

  return (
    <Button
      variant={isPrimary ? 'filled' : 'outlined'}
      size="sm"
      onClick={action.onClick}
      disabled={action.disabled}
      className={cn(
        // Touch-friendly: min 44px on small containers, standard 36px on larger
        'text-body-medium h-11 min-h-[44px] gap-2 rounded font-medium @md:h-9 @md:min-h-[36px]',
        isDanger && 'border-error text-error hover:bg-state-error',
        !isPrimary && !isDanger && 'border-outline-variant border',
      )}
    >
      {action.icon && <Icon symbol={action.icon} className="h-5 w-5" />}
      <span className={action.iconOnly ? 'hidden @md:inline' : undefined}>{action.label}</span>
    </Button>
  );
}

// ─── COMPACT ICON BUTTON ───────────────────────────────────────────────────

export function CompactIconButton({
  icon,
  label,
  onClick,
  active = false,
  disabled = false,
}: {
  icon: string;
  label: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      variant={active ? 'tonal' : 'standard'}
      size="md"
      className="disabled:pointer-events-none disabled:opacity-50"
      selected={active}
      icon={<Icon symbol={icon} />}
      aria-label={label}
    />
  );
}
