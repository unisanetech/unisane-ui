'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { actionFrameHeightClasses, actionFramePaddingXClasses } from '@/lib/action-size';
import { useControllableState } from '@/lib/use-controllable-state';
import { Icon, type IconProps } from '@/primitives/icon';
import { Ripple } from '@/components/ui/ripple';

export interface SegmentedButtonOption {
  value: string;
  label?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

type SegmentedButtonValue = string | string[];
type SegmentedButtonSize = 'sm' | 'md' | 'lg';

const SegmentedButtonSizeContext = React.createContext<SegmentedButtonSize>('md');
const SegmentedButtonIconSizeContext =
  React.createContext<NonNullable<IconProps['size']>>('sm');

function isIconElement(node: React.ReactNode): node is React.ReactElement<IconProps> {
  return React.isValidElement(node) && node.type === Icon;
}

function getDefaultIconSize(size: SegmentedButtonSize): NonNullable<IconProps['size']> {
  switch (size) {
    case 'lg':
      return 'md';
    case 'sm':
    case 'md':
    default:
      return 'sm';
  }
}

function normalizeIconNode(
  node: React.ReactNode,
  size: NonNullable<IconProps['size']>,
): React.ReactNode {
  if (!isIconElement(node) || node.props.size !== undefined) {
    return node;
  }
  return React.cloneElement(node, { size });
}

function normalizeIconChildren(
  children: React.ReactNode,
  size: NonNullable<IconProps['size']>,
): React.ReactNode {
  return React.Children.map(children, (child) => normalizeIconNode(child, size));
}

function getSegmentedButtonSizeStyles(size: SegmentedButtonSize) {
  return {
    containerHeight: actionFrameHeightClasses[size],
    itemGap: 'gap-2.5',
    itemPaddingX: actionFramePaddingXClasses[size],
    itemText: size === 'sm' ? 'text-label-medium' : 'text-label-large',
    iconClass: size === 'lg' ? 'size-icon-md' : 'size-icon-sm',
    checkWidth: size === 'lg' ? 'w-[var(--icon-md)]' : 'w-[var(--icon-sm)]',
    checkClass: size === 'lg' ? 'size-icon-md' : 'size-icon-sm',
    checkStrokeWidth: size === 'sm' ? 3 : 4,
  };
}

export interface SegmentedButtonProps {
  options?: SegmentedButtonOption[];
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  multiSelect?: boolean;
  className?: string;
  'aria-label'?: string;
  size?: SegmentedButtonSize;
  iconSize?: NonNullable<IconProps['size']>;
  children?: React.ReactNode;
}

export const SegmentedButton: React.FC<SegmentedButtonProps> = ({
  options,
  value,
  defaultValue,
  onValueChange,
  multiSelect = false,
  className,
  'aria-label': ariaLabel,
  size = 'md',
  iconSize,
  children,
}) => {
  const sizeStyles = getSegmentedButtonSizeStyles(size);
  const resolvedIconSize = iconSize ?? getDefaultIconSize(size);
  const [currentValue, setCurrentValue] = useControllableState<SegmentedButtonValue>({
    value,
    defaultValue: multiSelect ? (defaultValue ?? []) : defaultValue,
    onChange: onValueChange,
  });
  const buttonRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  if (!options) {
    return (
      <SegmentedButtonSizeContext.Provider value={size}>
        <SegmentedButtonIconSizeContext.Provider value={resolvedIconSize}>
          <div
            className={cn(
              'border-outline-variant rounded-button relative isolate inline-flex max-w-full overflow-hidden border',
              sizeStyles.containerHeight,
              className,
            )}
            aria-label={ariaLabel}
            role="group"
          >
            {children}
          </div>
        </SegmentedButtonIconSizeContext.Provider>
      </SegmentedButtonSizeContext.Provider>
    );
  }

  const selectedValue = currentValue ?? (multiSelect ? [] : undefined);

  const isSelected = (optionValue: string) => {
    if (multiSelect) {
      return Array.isArray(selectedValue) && selectedValue.includes(optionValue);
    }
    return selectedValue === optionValue;
  };

  const focusItem = (index: number) => {
    buttonRefs.current[index]?.focus();
  };

  const getNextEnabledIndex = (startIndex: number, direction: 1 | -1) => {
    if (!options.length) return -1;

    let index = startIndex;
    for (let attempt = 0; attempt < options.length; attempt += 1) {
      index = (index + direction + options.length) % options.length;
      if (!options[index]?.disabled) return index;
    }

    return -1;
  };

  const handleSelect = (optionValue: string) => {
    const option = options.find((item) => item.value === optionValue);
    if (option?.disabled) return;

    if (multiSelect) {
      const values = Array.isArray(selectedValue) ? selectedValue : [];
      const nextValue = values.includes(optionValue)
        ? values.filter((item) => item !== optionValue)
        : [...values, optionValue];
      setCurrentValue(nextValue);
      return;
    }

    setCurrentValue(optionValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown': {
        event.preventDefault();
        const nextIndex = getNextEnabledIndex(index, 1);
        if (nextIndex !== -1) focusItem(nextIndex);
        break;
      }
      case 'ArrowLeft':
      case 'ArrowUp': {
        event.preventDefault();
        const nextIndex = getNextEnabledIndex(index, -1);
        if (nextIndex !== -1) focusItem(nextIndex);
        break;
      }
      case 'Home': {
        event.preventDefault();
        const nextIndex = getNextEnabledIndex(-1, 1);
        if (nextIndex !== -1) focusItem(nextIndex);
        break;
      }
      case 'End': {
        event.preventDefault();
        const nextIndex = getNextEnabledIndex(0, -1);
        if (nextIndex !== -1) focusItem(nextIndex);
        break;
      }
      case ' ':
      case 'Enter': {
        event.preventDefault();
        handleSelect(options[index]?.value ?? '');
        break;
      }
      default:
        break;
    }
  };

  return (
    <SegmentedButtonSizeContext.Provider value={size}>
      <SegmentedButtonIconSizeContext.Provider value={resolvedIconSize}>
        <div
          className={cn(
            'border-outline-variant rounded-button relative isolate inline-flex max-w-full overflow-hidden border',
            sizeStyles.containerHeight,
            className,
          )}
          aria-label={ariaLabel}
          role={multiSelect ? 'group' : 'radiogroup'}
          aria-multiselectable={multiSelect}
        >
          {options.map((option, index) => {
            const selected = isSelected(option.value);
            const isLast = index === options.length - 1;

            return (
              <button
                key={option.value}
                ref={(node) => {
                  buttonRefs.current[index] = node;
                }}
                type="button"
                disabled={option.disabled}
                onClick={() => handleSelect(option.value)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                role={multiSelect ? 'checkbox' : 'radio'}
                aria-checked={selected}
                aria-disabled={option.disabled}
                className={cn(
                  'focus-visible:outline-primary relative flex h-full min-w-fit flex-1 items-center justify-center leading-none font-medium whitespace-nowrap transition-all select-none focus-visible:z-10 focus-visible:outline-2',
                  sizeStyles.itemGap,
                  sizeStyles.itemPaddingX,
                  sizeStyles.itemText,
                  !isLast && 'border-outline-strong border-r',
                  option.disabled && 'text-on-surface cursor-not-allowed bg-transparent opacity-38',
                  selected && !option.disabled
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'text-on-surface-variant bg-surface hover:bg-surface-container-high',
                )}
              >
                <Ripple disabled={option.disabled} />
                <div
                  className={cn(
                    'duration-medium ease-emphasized flex items-center justify-center overflow-hidden transition-all',
                    selected ? `${sizeStyles.checkWidth} opacity-100` : 'w-0 opacity-0',
                  )}
                >
                  <svg
                    className={sizeStyles.checkClass}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={sizeStyles.checkStrokeWidth}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                {option.icon && !selected && (
                  <span
                    className={cn(
                      'relative z-10 flex items-center justify-center',
                      sizeStyles.iconClass,
                    )}
                  >
                    {normalizeIconNode(option.icon, resolvedIconSize)}
                  </span>
                )}

                <span className="relative z-10 truncate leading-none">{option.label}</span>
              </button>
            );
          })}
        </div>
      </SegmentedButtonIconSizeContext.Provider>
    </SegmentedButtonSizeContext.Provider>
  );
};

const segmentedButtonItemVariants = cva(
  'relative flex h-full min-w-fit flex-1 items-center justify-center whitespace-nowrap font-medium leading-none transition-all select-none',
  {
    variants: {
      active: {
        true: 'bg-secondary-container text-on-secondary-container',
        false: 'text-on-surface-variant bg-surface hover:bg-surface-container-high',
      },
      disabled: {
        true: 'opacity-38 cursor-not-allowed',
        false: 'cursor-pointer',
      },
      size: {
        sm: `${getSegmentedButtonSizeStyles('sm').itemGap} ${getSegmentedButtonSizeStyles('sm').itemPaddingX} ${getSegmentedButtonSizeStyles('sm').itemText}`,
        md: `${getSegmentedButtonSizeStyles('md').itemGap} ${getSegmentedButtonSizeStyles('md').itemPaddingX} ${getSegmentedButtonSizeStyles('md').itemText}`,
        lg: `${getSegmentedButtonSizeStyles('lg').itemGap} ${getSegmentedButtonSizeStyles('lg').itemPaddingX} ${getSegmentedButtonSizeStyles('lg').itemText}`,
      },
    },
    defaultVariants: {
      active: false,
      disabled: false,
      size: 'md',
    },
  },
);

export type SegmentedButtonItemProps = VariantProps<typeof segmentedButtonItemVariants> & {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  size?: SegmentedButtonSize;
  iconSize?: NonNullable<IconProps['size']>;
};

export const SegmentedButtonItem: React.FC<SegmentedButtonItemProps> = ({
  children,
  active,
  disabled,
  onClick,
  className,
  size,
  iconSize,
}) => {
  const groupSize = React.useContext(SegmentedButtonSizeContext);
  const groupIconSize = React.useContext(SegmentedButtonIconSizeContext);
  const resolvedSize = size ?? groupSize;
  const resolvedIconSize = iconSize ?? groupIconSize;

  return (
    <button
      type="button"
      className={cn(
        segmentedButtonItemVariants({ active, disabled, size: resolvedSize, className }),
      )}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      role="button"
      aria-pressed={active}
    >
      <Ripple disabled={disabled} />
      <span className="relative z-10 inline-flex items-center justify-center gap-1.5 leading-none">
        {normalizeIconChildren(children, resolvedIconSize)}
      </span>
    </button>
  );
};
