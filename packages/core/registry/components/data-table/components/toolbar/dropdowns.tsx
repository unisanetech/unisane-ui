'use client';

import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import type { Density } from '@/components/ui/data-table/types';
import { useColumns } from '@/components/ui/data-table/context';
import { ToolbarDropdownButton, SegmentedDropdownButton } from '@/components/ui/data-table/components/toolbar/buttons';
import type { ToolbarAction, ToolbarDropdown } from '@/components/ui/data-table/components/toolbar/types';
import { useI18n } from '@/components/ui/data-table/i18n';

// ─── DENSITY OPTIONS ────────────────────────────────────────────────────────

type DensityLabelKey = 'densityCompact' | 'densityDense' | 'densityStandard' | 'densityComfortable';

const densityOptions: { value: Density; labelKey: DensityLabelKey; icon: string }[] = [
  { value: 'dense', labelKey: 'densityDense', icon: 'density_small' },
  { value: 'compact', labelKey: 'densityCompact', icon: 'density_medium' },
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
    <IconButton
      variant={hasHiddenColumns ? 'tonal' : 'standard'}
      size="md"
      aria-label={t('columns')}
      className="relative"
      selected={hasHiddenColumns}
      icon={
        <>
          <Icon symbol="view_column" />
          {hasHiddenColumns && hiddenColumns.size > 0 && (
            <span className="bg-primary text-on-primary absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium">
              {hiddenColumns.size}
            </span>
          )}
        </>
      }
    />
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
    <IconButton
      variant={isActive ? 'tonal' : 'standard'}
      size="md"
      aria-label={t('density')}
      selected={isActive}
      icon={<Icon symbol={currentIcon} />}
    />
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
    <IconButton
      variant="standard"
      size="md"
      aria-label={t('moreActions')}
      icon={<Icon symbol="more_vert" />}
    />
  ) : (
    <Button variant="outlined" size="sm" className="gap-2">
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
        <Button
          variant="outlined"
          size="sm"
          className={cn(
            'items-center gap-2',
            'text-body-medium font-medium',
            'hover:bg-state-hover focus-visible:ring-focus-ring transition-colors focus-visible:ring-2 focus-visible:outline-none',
          )}
        >
          {dropdown.icon && (
            <Icon symbol={dropdown.icon} className="text-on-surface-variant h-5 w-5" />
          )}
          {dropdown.label && <span className="text-on-surface-variant">{dropdown.label}</span>}
          <span className="text-on-surface">{selectedLabel}</span>
          <Icon symbol="arrow_drop_down" className="text-on-surface-variant h-5 w-5" />
        </Button>
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
