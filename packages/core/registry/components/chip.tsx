import {
  type ButtonHTMLAttributes,
  type ForwardedRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  forwardRef,
} from 'react';
import { Ripple } from './ripple';
import { CloseIcon } from '@/primitives/icon';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const chipVariants = cva(
  'relative inline-flex h-8 items-center gap-2 overflow-hidden rounded-sm border px-3 text-label-small font-medium leading-none transition-all group select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
  {
    variants: {
      variant: {
        assist: 'bg-surface border-outline text-on-surface',
        filter: 'bg-surface border-outline text-on-surface-variant',
        input: 'bg-surface border-outline text-on-surface',
        suggestion: 'bg-surface border-outline-variant text-on-surface-variant',
      },
      selected: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'filter',
        selected: true,
        className: 'bg-primary-container text-on-primary-container border-primary/20',
      },
    ],
    defaultVariants: {
      variant: 'assist',
      selected: false,
    },
  },
);

export type ChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onSelect'> &
  VariantProps<typeof chipVariants> & {
    label: string;
    icon?: ReactNode;
    onDelete?: () => void;
    disabled?: boolean;
  };

export const Chip = forwardRef<HTMLButtonElement | HTMLDivElement, ChipProps>(
  (
    {
      label,
      variant,
      selected,
      disabled = false,
      onDelete,
      icon,
      className,
      onClick,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const isFilterChip = variant === 'filter';
    const isSelectedFilter = isFilterChip && !!selected;
    const hasRemoveAction = !!onDelete;
    const hasPrimaryAction = !!onClick;
    const isPressable = hasPrimaryAction && !disabled;
    const rootClasses = cn(
      chipVariants({ variant, selected }),
      className,
      disabled && 'opacity-38 pointer-events-none',
      isPressable && 'cursor-pointer',
    );

    const renderChipBody = () => (
      <>
        {isSelectedFilter ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="animate-in zoom-in duration-medium ease-emphasized relative z-10"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : icon ? (
          <span
            className="size-icon-xs relative z-10 flex items-center justify-center"
            aria-hidden="true"
          >
            {icon}
          </span>
        ) : null}
        <span className="relative z-10 truncate leading-none pt-0.5">{label}</span>
      </>
    );

    const renderStateLayer = () => {
      if (!isPressable) {
        return null;
      }

      return (
        <>
          <Ripple disabled={disabled} />
          <div
            className={cn(
              'pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-hover group-focus-visible:opacity-focus group-active:opacity-pressed transition-opacity duration-medium',
              isSelectedFilter ? 'bg-on-primary-container' : 'bg-on-surface-variant',
            )}
          />
        </>
      );
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (!isPressable) {
        return;
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.currentTarget.click();
      }
      if (onDelete && (event.key === 'Delete' || event.key === 'Backspace')) {
        event.preventDefault();
        onDelete();
      }
    };

    if (!hasRemoveAction && hasPrimaryAction) {
      return (
        <button
          ref={ref as ForwardedRef<HTMLButtonElement>}
          type={type}
          className={rootClasses}
          onClick={onClick}
          aria-pressed={isSelectedFilter || undefined}
          disabled={disabled}
          {...props}
        >
          {renderStateLayer()}
          {renderChipBody()}
        </button>
      );
    }

    return (
        <div
        ref={ref as ForwardedRef<HTMLDivElement>}
        className={cn(rootClasses, hasRemoveAction && 'pr-2')}
        onClick={
          hasRemoveAction && isPressable
            ? (onClick as unknown as HTMLAttributes<HTMLDivElement>['onClick'])
            : undefined
        }
        onKeyDown={hasRemoveAction && isPressable ? handleKeyDown : undefined}
        role={hasRemoveAction && isPressable ? 'button' : undefined}
        tabIndex={hasRemoveAction && isPressable ? 0 : undefined}
        aria-pressed={hasRemoveAction && isSelectedFilter ? true : undefined}
        {...(props as HTMLAttributes<HTMLDivElement>)}
      >
        {renderStateLayer()}
        <div className="pointer-events-none flex min-w-0 items-center gap-2">{renderChipBody()}</div>
        {onDelete && (
          <button
            type="button"
            className="relative z-10 -mr-1 ml-1 rounded-sm p-0.5 transition-colors hover:bg-on-surface/10 hover:text-on-surface focus-visible:ring-2 focus-visible:ring-primary"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            aria-label={`Remove ${label}`}
            disabled={disabled}
          >
            <CloseIcon size={12} />
          </button>
        )}
      </div>
    );
  },
);

Chip.displayName = 'Chip';
