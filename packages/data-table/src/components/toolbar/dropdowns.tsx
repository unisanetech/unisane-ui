'use client';

import {
  cn,
  Icon,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
} from '@unisane/ui';
import type { Density } from '../../types';
import { useColumns } from '../../context';
import { ToolbarDropdownButton, SegmentedDropdownButton } from './buttons';
import type { ToolbarAction, ToolbarDropdown } from './types';
import { useI18n } from '../../i18n';

// ─── DENSITY OPTIONS ────────────────────────────────────────────────────────

type DensityLabelKey = 'densityCompact' | 'densityDense' | 'densityStandard' | 'densityComfortable';

const densityOptions: { value: Density; labelKey: DensityLabelKey; icon: string }[] = [
  { value: 'compact', labelKey: 'densityCompact', icon: 'density_small' },
  { value: 'dense', labelKey: 'densityDense', icon: 'density_medium' },
  { value: 'standard', labelKey: 'densityStandard', icon: 'density_medium' },
  { value: 'comfortable', labelKey: 'densityComfortable', icon: 'density_large' },
];

// ─── COLUMN VISIBILITY DROPDOWN ─────────────────────────────────────────────

export function ColumnVisibilityDropdown<T>({
  segmented = false,
  compact = false,
  isFirst = false,
  isLast = false,
}: {
  segmented?: boolean;
  /** Icon-only mode for mobile */
  compact?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  const { t } = useI18n();
  const { columns, hiddenColumns, toggleVisibility } = useColumns<T>();

  const hasHiddenColumns = hiddenColumns.size > 0;

  const trigger = segmented ? (
    <SegmentedDropdownButton
      icon="view_column"
      active={hasHiddenColumns}
      badge={hiddenColumns.size}
      isFirst={isFirst}
      isLast={isLast}
    />
  ) : compact ? (
    <button
      className={cn(
        // Touch-friendly: 44px on mobile
        'relative flex h-11 w-11 items-center justify-center rounded-lg transition-colors',
        'text-on-surface-variant hover:text-on-surface hover:bg-on-surface/8',
        'focus-visible:ring-primary focus-visible:ring-2 focus-visible:outline-none',
        hasHiddenColumns && 'bg-primary-container text-on-primary-container',
      )}
      aria-label={t('columns')}
      title={t('columns')}
    >
      <Icon symbol="view_column" className="h-5 w-5" />
      {hasHiddenColumns && hiddenColumns.size > 0 && (
        <span className="bg-primary text-on-primary absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium">
          {hiddenColumns.size}
        </span>
      )}
    </button>
  ) : (
    <ToolbarDropdownButton
      label={t('columns')}
      icon="view_column"
      active={hasHiddenColumns}
      badge={hiddenColumns.size}
      as="div"
    />
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        {columns.map((col) => {
          const key = String(col.key);
          const isVisible = !hiddenColumns.has(key);
          return (
            <DropdownMenuCheckboxItem
              key={key}
              checked={isVisible}
              onCheckedChange={() => toggleVisibility(key)}
            >
              {col.header}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── DENSITY DROPDOWN ───────────────────────────────────────────────────────

export function DensityDropdown({
  density,
  onDensityChange,
  segmented = false,
  compact = false,
  isFirst = false,
  isLast = false,
}: {
  density: Density;
  onDensityChange?: (density: Density) => void;
  segmented?: boolean;
  /** Icon-only mode for mobile */
  compact?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  const { t } = useI18n();
  const isActive = density !== 'standard';

  // Get the icon for the current density
  const currentIcon = densityOptions.find((o) => o.value === density)?.icon ?? 'density_medium';

  const trigger = segmented ? (
    <SegmentedDropdownButton
      icon={currentIcon}
      active={isActive}
      isFirst={isFirst}
      isLast={isLast}
    />
  ) : compact ? (
    <button
      className={cn(
        // Touch-friendly: 44px on mobile
        'flex h-11 w-11 items-center justify-center rounded-lg transition-colors',
        'text-on-surface-variant hover:text-on-surface hover:bg-on-surface/8',
        'focus-visible:ring-primary focus-visible:ring-2 focus-visible:outline-none',
        isActive && 'bg-primary-container text-on-primary-container',
      )}
      aria-label={t('density')}
      title={t('density')}
    >
      <Icon symbol={currentIcon} className="h-5 w-5" />
    </button>
  ) : (
    <ToolbarDropdownButton label={t('density')} icon={currentIcon} active={isActive} as="div" />
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {densityOptions.map((option) => (
          <DropdownMenuRadioItem
            key={option.value}
            checked={density === option.value}
            onCheckedChange={() => onDensityChange?.(option.value)}
          >
            {t(option.labelKey)}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── MORE ACTIONS DROPDOWN ─────────────────────────────────────────────────

export function MoreActionsDropdown({
  actions,
  compact = false,
}: {
  actions: ToolbarAction[];
  /** Icon-only mode (vertical ellipsis) for mobile */
  compact?: boolean;
}) {
  const { t } = useI18n();

  if (actions.length === 0) return null;

  const trigger = compact ? (
    <button
      className={cn(
        // Touch-friendly: 44px on mobile
        'flex h-11 w-11 items-center justify-center rounded-lg transition-colors',
        'text-on-surface-variant hover:text-on-surface hover:bg-on-surface/8',
        'focus-visible:ring-primary focus-visible:ring-2 focus-visible:outline-none',
      )}
      aria-label={t('moreActions')}
      title={t('moreActions')}
    >
      <Icon symbol="more_vert" className="h-5 w-5" />
    </button>
  ) : (
    <Button
      variant="outlined"
      size="sm"
      className="border-outline-variant h-9 gap-2 rounded border"
    >
      <span>{t('moreActions')}</span>
      <Icon symbol="arrow_drop_down" className="text-on-surface-variant h-5 w-5" />
    </Button>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {actions.map((action) => {
          const isDanger = action.variant === 'danger';
          return (
            <DropdownMenuItem
              key={action.key}
              onClick={action.onClick}
              disabled={action.disabled}
              icon={action.icon ? <Icon symbol={action.icon} className="h-5 w-5" /> : undefined}
              className={isDanger ? 'text-error' : undefined}
            >
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── LABELED DROPDOWN BUTTON ───────────────────────────────────────────────

export function LabeledDropdown({ dropdown }: { dropdown: ToolbarDropdown }) {
  const selectedLabel =
    dropdown.options.find((o) => o.value === dropdown.value)?.label ?? dropdown.value;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'inline-flex h-9 items-center gap-2 rounded px-3',
            'text-body-medium font-medium',
            'border-outline-variant bg-surface border',
            'hover:bg-on-surface/5 focus-visible:ring-primary transition-colors focus-visible:ring-2 focus-visible:outline-none',
          )}
        >
          {dropdown.icon && (
            <Icon symbol={dropdown.icon} className="text-on-surface-variant h-5 w-5" />
          )}
          {dropdown.label && <span className="text-on-surface-variant">{dropdown.label}</span>}
          <span className="text-on-surface">{selectedLabel}</span>
          <Icon symbol="arrow_drop_down" className="text-on-surface-variant h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        {dropdown.options.map((option) => (
          <DropdownMenuRadioItem
            key={option.value}
            checked={option.value === dropdown.value}
            onCheckedChange={() => dropdown.onChange(option.value)}
          >
            {option.label}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
