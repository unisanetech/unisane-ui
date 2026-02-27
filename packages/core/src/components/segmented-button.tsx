import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@ui/lib/utils';
import { Ripple } from './ripple';

interface SegmentedButtonOption {
  value: string;
  label?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedButtonProps {
  options?: SegmentedButtonOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiSelect?: boolean;
  className?: string;
  density?: 'default' | 'high';
  children?: React.ReactNode;
}

export const SegmentedButton: React.FC<SegmentedButtonProps> = ({
  options,
  value,
  onChange,
  multiSelect = false,
  className,
  density = 'default',
  children,
}) => {
  if (!options || !onChange || value === undefined) {
    return (
      <div
        className={cn(
          'border-outline-variant relative isolate inline-flex max-w-full overflow-hidden rounded-sm border',
          density === 'high' ? 'h-7' : 'h-9',
          className,
        )}
        role="group"
      >
        {children}
      </div>
    );
  }

  const isSelected = (val: string) => {
    if (multiSelect && Array.isArray(value)) {
      return value.includes(val);
    }
    return value === val;
  };

  const handleSelect = (val: string) => {
    const option = options.find((item) => item.value === val);
    if (option?.disabled) return;

    if (multiSelect && Array.isArray(value)) {
      const newValue = value.includes(val) ? value.filter((item) => item !== val) : [...value, val];
      onChange(newValue);
      return;
    }

    onChange(val);
  };

  return (
    <div
      className={cn(
        'border-outline-variant relative isolate inline-flex max-w-full overflow-hidden rounded-sm border',
        density === 'high' ? 'h-7' : 'h-9',
        className,
      )}
      role={multiSelect ? 'group' : 'radiogroup'}
      aria-multiselectable={multiSelect}
    >
      {options.map((option, index) => {
        const selected = isSelected(option.value);
        const isLast = index === options.length - 1;

        const sizing =
          density === 'high' ? 'gap-1.5 px-2.5 text-[11px]' : 'gap-2 px-3 text-label-medium';
        return (
          <button
            key={option.value}
            disabled={option.disabled}
            onClick={() => handleSelect(option.value)}
            role={multiSelect ? 'checkbox' : 'radio'}
            aria-checked={selected}
            aria-disabled={option.disabled}
            className={cn(
              'focus-visible:outline-primary relative flex h-full min-w-fit flex-1 items-center justify-center leading-none font-medium whitespace-nowrap transition-all select-none focus-visible:z-10 focus-visible:outline-2',
              sizing,
              !isLast && 'border-outline-variant/60 border-r',
              option.disabled && 'text-on-surface cursor-not-allowed bg-transparent opacity-38',
              selected && !option.disabled
                ? 'bg-secondary-container text-on-secondary-container'
                : 'text-on-surface-variant bg-surface hover:bg-surface-variant/40',
            )}
          >
            <Ripple disabled={option.disabled} />
            <div
              className={cn(
                'duration-medium ease-emphasized flex items-center justify-center overflow-hidden transition-all',
                selected
                  ? density === 'high'
                    ? 'w-4 opacity-100'
                    : 'w-5 opacity-100'
                  : 'w-0 opacity-0',
              )}
            >
              <svg
                width={density === 'high' ? 16 : 20}
                height={density === 'high' ? 16 : 20}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={density === 'high' ? 3 : 4}
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            {option.icon && !selected && (
              <span className="size-icon-sm relative z-10 flex items-center justify-center">
                {option.icon}
              </span>
            )}

            <span className="relative z-10 truncate leading-none">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};

const segmentedButtonItemVariants = cva(
  'flex-1 h-full px-3 min-w-fit whitespace-nowrap text-label-medium font-medium flex items-center justify-center gap-2 transition-all relative select-none leading-none',
  {
    variants: {
      active: {
        true: 'bg-secondary-container text-on-secondary-container',
        false: 'text-on-surface-variant bg-surface hover:bg-surface-variant/40',
      },
      disabled: {
        true: 'opacity-38 cursor-not-allowed',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: {
      active: false,
      disabled: false,
    },
  },
);

export type SegmentedButtonItemProps = VariantProps<typeof segmentedButtonItemVariants> & {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

export const SegmentedButtonItem: React.FC<SegmentedButtonItemProps> = ({
  children,
  active,
  disabled,
  onClick,
  className,
}) => {
  return (
    <button
      className={cn(segmentedButtonItemVariants({ active, disabled, className }))}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      role="button"
      aria-pressed={active}
    >
      <Ripple disabled={disabled} />
      <span className="relative z-10 inline-flex items-center justify-center gap-1.5 leading-none">
        {children}
      </span>
    </button>
  );
};
