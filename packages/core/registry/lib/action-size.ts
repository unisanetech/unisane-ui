export const actionFrameSizeClasses = {
  sm: 'h-[var(--size-action-sm)] px-[var(--space-action-padding-x-sm)]',
  md: 'h-[var(--size-action-md)] px-[var(--space-action-padding-x-md)]',
  lg: 'h-[var(--size-action-lg)] px-[var(--space-action-padding-x-lg)]',
} as const;

export const actionButtonSizeClasses = {
  sm: `${actionFrameSizeClasses.sm} text-label-medium`,
  md: `${actionFrameSizeClasses.md} text-label-large`,
  lg: `${actionFrameSizeClasses.lg} text-label-large`,
} as const;

export const iconButtonSizeClasses = {
  sm: 'h-[var(--size-icon-button-sm)] w-[var(--size-icon-button-sm)]',
  md: 'h-[var(--size-icon-button-md)] w-[var(--size-icon-button-md)]',
  lg: 'h-[var(--size-icon-button-lg)] w-[var(--size-icon-button-lg)]',
} as const;

export const fabSizeClasses = {
  sm: 'h-[var(--size-fab-sm)] w-[var(--size-fab-sm)]',
  md: 'h-[var(--size-fab-md)] w-[var(--size-fab-md)]',
  lg: 'h-[var(--size-fab-lg)] w-[var(--size-fab-lg)]',
  extended:
    'h-[var(--size-fab-md)] min-w-[var(--size-fab-extended-min)] w-auto px-[var(--space-fab-extended-x)]',
} as const;

export const avatarSizeClasses = {
  sm: 'h-[var(--size-avatar-sm)] w-[var(--size-avatar-sm)] text-label-small',
  md: 'h-[var(--size-avatar-md)] w-[var(--size-avatar-md)] text-body-small',
  lg: 'h-[var(--size-avatar-lg)] w-[var(--size-avatar-lg)] text-body-medium',
  xl: 'h-[var(--size-avatar-xl)] w-[var(--size-avatar-xl)] text-body-large',
} as const;

export const paginationButtonClass =
  'relative h-[var(--size-pagination-button)] w-[var(--size-pagination-button)] rounded-button flex items-center justify-center overflow-hidden transition-colors';
