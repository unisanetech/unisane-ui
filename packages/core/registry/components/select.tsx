'use client';

import React, { useState, useRef, useEffect, useId, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { Icon } from '@/primitives/icon';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  variant?: 'filled' | 'outlined';
  size?: 'sm' | 'md';
  error?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  placeholder?: string;
  /** Use portal to render dropdown outside DOM hierarchy (escapes overflow:hidden) */
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
  onChange,
  variant = 'outlined',
  size = 'md',
  error,
  disabled,
  className,
  labelClassName,
  placeholder = 'Select an option',
  portal = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({
    top: 0,
    left: 0,
    width: 0,
    maxHeight: 280,
    direction: 'down',
  });
  const listboxId = useId();
  const labelId = useId();
  const triggerId = useId();

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedLabel = options[selectedIndex]?.label;
  const displayLabel = selectedLabel || (!label ? placeholder : '');

  // Calculate dropdown position for portal mode
  const updateDropdownPosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const edgePadding = 8;
    const gap = 4;
    const optionHeight = size === 'sm' ? 32 : 40;
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
  }, [options.length, size]);

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
  }, [portal, isOpen, updateDropdownPosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideContainer = containerRef.current && !containerRef.current.contains(target);
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target);

      if (portal) {
        // In portal mode, check both container and dropdown
        if (isOutsideContainer && isOutsideDropdown) {
          setIsOpen(false);
        }
      } else {
        // In non-portal mode, just check container
        if (isOutsideContainer) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [portal]);

  const getNextEnabledIndex = useCallback(
    (startIndex: number, direction: 1 | -1) => {
      if (!options.length) return -1;
      let index = startIndex;
      for (let i = 0; i < options.length; i += 1) {
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
  }, [isOpen, options, selectedIndex, getNextEnabledIndex]);

  const handleSelect = (val: string, isDisabled?: boolean) => {
    if (isDisabled) return;
    onChange?.(val);
    setIsOpen(false);
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!isOpen) setIsOpen(true);
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
        setIsOpen(true);
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
      setIsOpen(false);
    }
  };

  const isFloating = Boolean(value) || isOpen;
  const activeDescendantId =
    highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined;
  const triggerHeightClass = size === 'sm' ? 'h-8' : 'h-10';
  const triggerPaddingClass = size === 'sm' ? 'px-3' : 'px-4';
  const triggerValueClass = size === 'sm' ? 'text-label-medium' : 'text-body-large';
  const triggerRestLabelClass = size === 'sm' ? 'text-label-medium' : 'text-body-medium';
  const triggerChevronOffsetClass = size === 'sm' ? 'right-2.5' : 'right-3';
  const optionClass =
    size === 'sm'
      ? 'text-label-medium flex h-8 cursor-pointer items-center px-3 font-medium transition-colors'
      : 'text-body-large flex h-10 cursor-pointer items-center px-4 font-medium transition-colors';
  const emptyClass =
    size === 'sm'
      ? 'text-label-small text-on-surface-variant px-3 py-2.5 font-medium'
      : 'text-label-medium text-on-surface-variant px-4 py-3 font-medium';

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-flex w-full min-w-40 flex-col', className)}
    >
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          'group relative flex w-full cursor-pointer items-center transition-colors select-none',
          triggerHeightClass,
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

        <div className={cn('relative flex h-full w-full items-center', triggerPaddingClass)}>
          <span
            className={cn(
              'text-on-surface w-full truncate font-medium',
              triggerValueClass,
              variant === 'filled' && 'pt-4 pb-0.5',
            )}
          >
            {displayLabel}
          </span>

          {label && (
            <label
              htmlFor={triggerId}
              id={labelId}
              className={cn(
                'duration-snappy ease-emphasized pointer-events-none absolute left-4 max-w-[calc(100%-calc(var(--unit)*12))] origin-left truncate transition-all',
                !isFloating && [
                  triggerRestLabelClass,
                  'text-on-surface-variant top-1/2 -translate-y-1/2',
                ],
                isFloating && [
                  'text-label-small font-medium',
                  variant === 'outlined' && [
                    'bg-surface top-0 -ml-1 -translate-y-1/2 px-1',
                    labelClassName ? labelClassName : 'bg-surface',
                  ],
                  variant === 'filled' && 'top-1 translate-y-0',
                  error ? 'text-error' : isOpen ? 'text-primary' : 'text-on-surface-variant',
                ],
              )}
            >
              {label}
            </label>
          )}

          <div className={cn('text-on-surface-variant absolute', triggerChevronOffsetClass)}>
            <Icon
              symbol="keyboard_arrow_down"
              size="sm"
              className={cn('duration-snappy transition-transform', isOpen && 'rotate-180')}
            />
          </div>
        </div>
      </button>

      {isOpen && !disabled && !portal && (
        <div
          ref={dropdownRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={label ? labelId : undefined}
          className="bg-surface border-outline-variant shadow-2 animate-in fade-in zoom-in-95 duration-snappy absolute top-[calc(100%+var(--unit))] left-0 z-100 max-h-70 w-full overflow-y-auto rounded-sm border py-1"
        >
          {options.length > 0 ? (
            options.map((option, index) => {
              const isDisabled = Boolean(option.disabled);
              const isHighlighted = index === highlightedIndex;
              return (
                <div
                  key={option.value}
                  id={`${listboxId}-option-${index}`}
                  onClick={() => handleSelect(option.value, isDisabled)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn(
                    optionClass,
                    isHighlighted && !isDisabled && 'bg-on-surface/6',
                    value === option.value
                      ? 'bg-primary/10 text-primary'
                      : 'text-on-surface hover:bg-on-surface/6',
                    isDisabled && 'cursor-not-allowed opacity-38',
                  )}
                  role="option"
                  aria-selected={value === option.value}
                  aria-disabled={isDisabled}
                >
                  {option.label}
                </div>
              );
            })
          ) : (
            <div className={emptyClass}>No Options Available</div>
          )}
        </div>
      )}

      {/* Portal mode dropdown */}
      {isOpen &&
        !disabled &&
        portal &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={dropdownRef}
            id={listboxId}
            role="listbox"
            aria-labelledby={label ? labelId : undefined}
            className={cn(
              'bg-surface border-outline-variant shadow-2 animate-in fade-in zoom-in-95 duration-snappy fixed z-9999 overflow-y-auto rounded-sm border py-1',
              dropdownPosition.direction === 'up' ? 'origin-bottom' : 'origin-top',
            )}
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              maxHeight: dropdownPosition.maxHeight,
            }}
          >
            {options.length > 0 ? (
              options.map((option, index) => {
                const isDisabled = Boolean(option.disabled);
                const isHighlighted = index === highlightedIndex;
                return (
                  <div
                    key={option.value}
                    id={`${listboxId}-option-${index}`}
                    onClick={() => handleSelect(option.value, isDisabled)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      optionClass,
                      isHighlighted && !isDisabled && 'bg-on-surface/6',
                      value === option.value
                        ? 'bg-primary/10 text-primary'
                        : 'text-on-surface hover:bg-on-surface/6',
                      isDisabled && 'cursor-not-allowed opacity-38',
                    )}
                    role="option"
                    aria-selected={value === option.value}
                    aria-disabled={isDisabled}
                  >
                    {option.label}
                  </div>
                );
              })
            ) : (
              <div className={emptyClass}>No Options Available</div>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
};
