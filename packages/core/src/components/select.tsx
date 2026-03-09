'use client';

import React, { useRef, useEffect, useId, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@ui/lib/utils';
import { Icon } from '@ui/primitives/icon';
import { getFieldSizeStyles, type FieldSize } from '@ui/lib/field-size';
import { useControllableState } from '@ui/lib/use-controllable-state';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: 'filled' | 'outlined';
  size?: FieldSize;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  placeholder?: string;
  portal?: boolean;
}

type DropdownDirection = 'down' | 'up';

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  direction: DropdownDirection;
};

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen = false,
  onOpenChange,
  variant = 'outlined',
  size = 'md',
  error,
  disabled,
  className,
  labelClassName,
  placeholder = 'Select an option',
  portal = false,
}) => {
  const fieldSize = getFieldSizeStyles(size);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const [dropdownPosition, setDropdownPosition] = React.useState<DropdownPosition>({
    top: 0,
    left: 0,
    width: 0,
    maxHeight: 280,
    direction: 'down',
  });
  const [selectedValue, setSelectedValue] = useControllableState<string>({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const [openState, setOpenState] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const isOpen = openState ?? false;
  const listboxId = useId();
  const labelId = useId();
  const triggerId = useId();

  const selectedIndex = options.findIndex((option) => option.value === selectedValue);
  const selectedLabel = options[selectedIndex]?.label;
  const displayLabel = selectedLabel || (!label ? placeholder : '');

  const updateDropdownPosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const edgePadding = 8;
    const gap = 4;
    const optionHeight = fieldSize.optionHeightPx;
    const estimatedHeight = Math.min(Math.max(1, options.length) * optionHeight + 8, 280);
    const minHeight = 120;
    const spaceBelow = viewportHeight - rect.bottom - edgePadding;
    const spaceAbove = rect.top - edgePadding;
    const shouldOpenUp = spaceBelow < Math.min(estimatedHeight, 180) && spaceAbove > spaceBelow;
    const maxHeight = Math.max(
      minHeight,
      Math.min(280, (shouldOpenUp ? spaceAbove : spaceBelow) - gap),
    );
    const measuredHeight = dropdownRef.current?.offsetHeight ?? estimatedHeight;
    const placementHeight = Math.min(measuredHeight, maxHeight);
    const width = Math.min(rect.width, viewportWidth - edgePadding * 2);
    const left = Math.min(Math.max(rect.left, edgePadding), viewportWidth - width - edgePadding);
    const unclampedTop = shouldOpenUp ? rect.top - placementHeight - gap : rect.bottom + gap;
    const top = Math.min(
      Math.max(unclampedTop, edgePadding),
      viewportHeight - maxHeight - edgePadding,
    );

    setDropdownPosition({
      top,
      left,
      width,
      maxHeight,
      direction: shouldOpenUp ? 'up' : 'down',
    });
  }, [fieldSize.optionHeightPx, options.length]);

  useEffect(() => {
    if (portal && isOpen) {
      updateDropdownPosition();
      const raf = window.requestAnimationFrame(updateDropdownPosition);
      window.addEventListener('scroll', updateDropdownPosition, true);
      window.addEventListener('resize', updateDropdownPosition);
      return () => {
        window.cancelAnimationFrame(raf);
        window.removeEventListener('scroll', updateDropdownPosition, true);
        window.removeEventListener('resize', updateDropdownPosition);
      };
    }
  }, [isOpen, portal, updateDropdownPosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideContainer = containerRef.current && !containerRef.current.contains(target);
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target);

      if (portal) {
        if (isOutsideContainer && isOutsideDropdown) {
          setOpenState(false);
        }
        return;
      }

      if (isOutsideContainer) {
        setOpenState(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [portal, setOpenState]);

  const getNextEnabledIndex = useCallback(
    (startIndex: number, direction: 1 | -1) => {
      if (!options.length) return -1;

      let index = startIndex;
      for (let attempt = 0; attempt < options.length; attempt += 1) {
        index = (index + direction + options.length) % options.length;
        if (!options[index]?.disabled) return index;
      }

      return -1;
    },
    [options],
  );

  useEffect(() => {
    if (!isOpen) {
      setHighlightedIndex(-1);
      return;
    }

    const initialIndex =
      selectedIndex !== -1 && !options[selectedIndex]?.disabled
        ? selectedIndex
        : getNextEnabledIndex(-1, 1);

    setHighlightedIndex(initialIndex);
  }, [getNextEnabledIndex, isOpen, options, selectedIndex]);

  const handleSelect = (nextValue: string, isOptionDisabled?: boolean) => {
    if (isOptionDisabled) return;
    setSelectedValue(nextValue);
    setOpenState(false);
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!isOpen) setOpenState(true);
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      const baseIndex =
        highlightedIndex !== -1
          ? highlightedIndex
          : selectedIndex !== -1
            ? selectedIndex
            : direction === 1
              ? -1
              : 0;
      setHighlightedIndex(getNextEnabledIndex(baseIndex, direction));
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!isOpen) {
        setOpenState(true);
        return;
      }
      const option = options[highlightedIndex];
      if (option && !option.disabled) {
        handleSelect(option.value, option.disabled);
      }
      return;
    }

    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      setOpenState(false);
    }
  };

  const isFloating = Boolean(selectedValue) || isOpen;
  const activeDescendantId =
    highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined;
  const optionClass = cn(
    'flex cursor-pointer items-center font-medium transition-colors',
    fieldSize.optionHeight,
    fieldSize.optionPaddingX,
    fieldSize.optionText,
  );
  const emptyClass = cn(
    'text-on-surface-variant font-medium',
    size === 'sm' ? 'text-label-small py-2' : 'text-label-medium',
    size === 'lg' ? 'py-3.5' : size === 'md' ? 'py-3' : '',
    fieldSize.optionPaddingX,
  );

  const dropdown = (
    <div
      ref={dropdownRef}
      className={cn(
        'bg-surface border-outline-variant shadow-2 z-50 overflow-y-auto rounded-sm border',
        portal
          ? 'fixed'
          : cn(
              'absolute right-0 left-0',
              dropdownPosition.direction === 'up'
                ? 'bottom-[calc(100%+var(--unit))]'
                : 'top-[calc(100%+var(--unit))]',
            ),
      )}
      style={
        portal
          ? {
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              maxHeight: dropdownPosition.maxHeight,
            }
          : { maxHeight: dropdownPosition.maxHeight }
      }
      role="listbox"
      id={listboxId}
      aria-label={label || 'Options'}
    >
      <div className="py-1">
        {options.length > 0 ? (
          options.map((option, index) => (
            <div
              key={option.value}
              id={`${listboxId}-option-${index}`}
              className={cn(
                optionClass,
                'hover:bg-on-surface/6',
                selectedValue === option.value && 'bg-primary/10 text-primary',
                highlightedIndex === index && selectedValue !== option.value && 'bg-on-surface/6',
                option.disabled && 'cursor-not-allowed opacity-38',
              )}
              onClick={() => handleSelect(option.value, option.disabled)}
              role="option"
              aria-selected={selectedValue === option.value}
              aria-disabled={option.disabled}
            >
              {option.label}
            </div>
          ))
        ) : (
          <div className={emptyClass}>No options</div>
        )}
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-flex w-full min-w-40 flex-col', className)}
    >
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        onClick={() => !disabled && setOpenState(!isOpen)}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          'group relative flex w-full cursor-pointer items-center transition-colors select-none',
          fieldSize.containerHeight,
          variant === 'outlined'
            ? 'border-outline-variant bg-surface rounded-sm border'
            : 'border-outline bg-surface-container-low rounded-t-sm border-b',
          !disabled &&
            !isOpen &&
            (variant === 'outlined'
              ? 'hover:border-outline'
              : 'hover:bg-surface-container hover:border-outline'),
          isOpen && (variant === 'outlined' ? 'border-primary! border-2' : 'bg-surface'),
          error && 'border-error',
          disabled && 'cursor-not-allowed opacity-38',
        )}
        disabled={disabled}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={isOpen ? activeDescendantId : undefined}
        aria-labelledby={label ? labelId : undefined}
        aria-label={!label ? placeholder : undefined}
      >
        {variant === 'filled' && (
          <div
            className={cn(
              'duration-snappy absolute right-0 bottom-[calc(var(--unit)*-0.25)] left-0 h-0.5 origin-center scale-x-0 transition-transform ease-out',
              error ? 'bg-error scale-x-100' : 'bg-primary',
              isOpen && 'scale-x-100',
            )}
          />
        )}

        <div className={cn('relative flex h-full w-full items-center', fieldSize.horizontalPadding)}>
          <span
            className={cn(
              'text-on-surface w-full truncate font-medium',
              fieldSize.valueText,
              variant === 'filled' && fieldSize.filledInputPadding,
            )}
          >
            {displayLabel}
          </span>

          {label && (
            <label
              htmlFor={triggerId}
              id={labelId}
              className={cn(
                'duration-snappy ease-emphasized pointer-events-none absolute max-w-[calc(100%-calc(var(--unit)*12))] origin-left truncate transition-all',
                fieldSize.labelLeft,
                !isFloating && [
                  fieldSize.selectRestingLabelText,
                  'text-on-surface-variant top-1/2 -translate-y-1/2',
                ],
                isFloating && [
                  'text-label-small font-medium',
                  variant === 'outlined' && [
                    'bg-surface top-0 -ml-1 -translate-y-1/2 px-1',
                    labelClassName ? labelClassName : 'bg-surface',
                  ],
                  variant === 'filled' && fieldSize.filledFloatingLabel,
                  error ? 'text-error' : isOpen ? 'text-primary' : 'text-on-surface-variant',
                ],
              )}
            >
              {label}
            </label>
          )}

          <div className={cn('text-on-surface-variant absolute', fieldSize.chevronOffset)}>
            <Icon
              symbol="arrow_drop_down"
              size={size === 'sm' ? 'sm' : 'md'}
              className={cn(
                'duration-short ease-standard transition-transform',
                isOpen && 'rotate-180',
              )}
            />
          </div>
        </div>
      </button>

      {isOpen &&
        (portal && typeof document !== 'undefined'
          ? createPortal(dropdown, document.body)
          : dropdown)}
    </div>
  );
};
