'use client';

import React, { useRef, useEffect, useCallback, useId, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/utils';
import { Text } from '../primitives/text';
import { Icon } from './icon';
import { getFieldSizeStyles, type FieldSize } from '../lib/field-size';
import { useControllableState } from '../lib/use-controllable-state';
import { fieldContainerVariants, getFieldAffixClasses } from '../lib/field-shell';
import { getPortalLayerStyle } from '../lib/portal-layer';
import { Ripple } from './ripple';
import { useOverlayBehavior } from '../lib/use-overlay-behavior';

export type ComboboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type ComboboxProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSearchChange?: (query: string) => void;
  highlightSelected?: boolean;
  options: ComboboxOption[];
  placeholder?: string;
  label?: string;
  size?: FieldSize;
  disabled?: boolean;
  searchable?: boolean;
  portal?: boolean;
  className?: string;
};

export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      open,
      defaultOpen = false,
      onOpenChange,
      onSearchChange,
      highlightSelected = true,
      options,
      placeholder = 'Search or select...',
      label,
      size = 'md',
      disabled = false,
      searchable = true,
      portal = true,
      className,
    },
    ref,
  ) => {
    const [searchValue, setSearchValue] = React.useState('');
    const [isSearching, setIsSearching] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(-1);
    const comboboxRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const blurTimeoutRef = useRef<number | null>(null);
    const fieldSize = getFieldSizeStyles(size);
    const listboxId = useId();
    const inputId = useId();
    const [dropdownPosition, setDropdownPosition] = React.useState({
      top: 0,
      left: 0,
      width: 0,
      maxHeight: 240,
    });
    const [isPositioned, setIsPositioned] = React.useState(!portal);
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

    useOverlayBehavior({
      open: isOpen,
      contentRef: dropdownRef,
      rootRef: comboboxRef,
      triggerRef: inputRef,
      onDismiss: () => setOpenState(false),
      modal: false,
      dismissOnEscape: true,
      dismissOnInteractOutside: true,
      initialFocus: false,
      restoreFocus: false,
    });

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        comboboxRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    useEffect(() => {
      return () => {
        if (blurTimeoutRef.current) {
          clearTimeout(blurTimeoutRef.current);
        }
      };
    }, []);

    const selectedOption = options.find((option) => option.value === selectedValue);

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase()),
    );

    const updateDropdownPosition = useCallback(() => {
      if (!comboboxRef.current || typeof window === 'undefined') return;

      const rect = comboboxRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const edgePadding = 8;
      const gap = 4;
      const estimatedHeight = Math.min(
        Math.max(1, filteredOptions.length) * fieldSize.optionHeightPx + 8,
        240,
      );
      const measuredHeight = dropdownRef.current?.offsetHeight ?? estimatedHeight;
      const spaceBelow = viewportHeight - rect.bottom - edgePadding;
      const spaceAbove = rect.top - edgePadding;
      const shouldOpenUp = spaceBelow < Math.min(measuredHeight, 180) && spaceAbove > spaceBelow;
      const maxHeight = Math.max(
        120,
        Math.min(240, (shouldOpenUp ? spaceAbove : spaceBelow) - gap),
      );
      const width = Math.min(rect.width, viewportWidth - edgePadding * 2);
      const left = Math.min(Math.max(rect.left, edgePadding), viewportWidth - width - edgePadding);
      const top = shouldOpenUp
        ? Math.max(edgePadding, rect.top - Math.min(measuredHeight, maxHeight) - gap)
        : Math.min(rect.bottom + gap, viewportHeight - maxHeight - edgePadding);

      setDropdownPosition({
        top,
        left,
        width,
        maxHeight,
      });
    }, [fieldSize.optionHeightPx, filteredOptions.length]);

    React.useLayoutEffect(() => {
      if (!portal) {
        setIsPositioned(true);
        return;
      }

      if (!isOpen) {
        setIsPositioned(false);
        return;
      }

      const updatePosition = () => {
        updateDropdownPosition();
        setIsPositioned(true);
      };

      setIsPositioned(false);
      updatePosition();
      const raf = window.requestAnimationFrame(updatePosition);
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.cancelAnimationFrame(raf);
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }, [isOpen, portal, updateDropdownPosition]);

    useEffect(() => {
      if (!isOpen) {
        setActiveIndex(-1);
      }
    }, [isOpen]);

    const handleSelect = useCallback(
      (option: ComboboxOption) => {
        if (option.disabled) return;
        if (blurTimeoutRef.current) {
          clearTimeout(blurTimeoutRef.current);
          blurTimeoutRef.current = null;
        }
        setSelectedValue(option.value);
        setSearchValue('');
        onSearchChange?.('');
        setIsSearching(false);
        setOpenState(false);
        setActiveIndex(-1);
      },
      [onSearchChange, setOpenState, setSelectedValue],
    );

    const handleInputChange = (nextValue: string) => {
      setSearchValue(nextValue);
      onSearchChange?.(nextValue);
      setIsSearching(true);
      setActiveIndex(-1);
      if (!isOpen) {
        setOpenState(true);
      }
    };

    const handleBlur = useCallback(() => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
      blurTimeoutRef.current = window.setTimeout(() => {
        if (!comboboxRef.current?.contains(document.activeElement)) {
          setOpenState(false);
          setIsSearching(false);
          setSearchValue('');
          onSearchChange?.('');
        }
      }, 100);
    }, [onSearchChange, setOpenState]);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (disabled) return;

        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            if (!isOpen) {
              setOpenState(true);
            } else {
              setActiveIndex((previousIndex) => {
                const nextIndex = previousIndex + 1;
                return nextIndex < filteredOptions.length ? nextIndex : 0;
              });
            }
            break;
          case 'ArrowUp':
            event.preventDefault();
            if (isOpen) {
              setActiveIndex((previousIndex) => {
                const nextIndex = previousIndex - 1;
                return nextIndex >= 0 ? nextIndex : filteredOptions.length - 1;
              });
            }
            break;
          case 'Enter':
            event.preventDefault();
            if (isOpen && activeIndex >= 0 && filteredOptions[activeIndex]) {
              handleSelect(filteredOptions[activeIndex]);
            } else if (!isOpen) {
              setOpenState(true);
            }
            break;
          case 'Home':
            if (isOpen) {
              event.preventDefault();
              setActiveIndex(0);
            }
            break;
          case 'End':
            if (isOpen) {
              event.preventDefault();
              setActiveIndex(filteredOptions.length - 1);
            }
            break;
          default:
            break;
        }
      },
      [activeIndex, disabled, filteredOptions, handleSelect, isOpen, setOpenState],
    );

    return (
      <div className={cn('relative w-full', className)} ref={setRefs}>
        {label && (
          <Text
            as="label"
            htmlFor={inputId}
            variant={size === 'lg' ? 'labelLarge' : 'labelMedium'}
            className={cn(
              'text-on-surface-variant mb-2 block font-medium',
              fieldSize.externalLabelText,
            )}
          >
            {label}
          </Text>
        )}

        <div
          className={cn(
            fieldContainerVariants({ variant: 'outlined', disabled }),
            'relative w-full transition-all',
            fieldSize.containerHeight,
            isOpen && 'border-primary! ring-focus-ring ring-1',
            !searchable && 'cursor-pointer',
          )}
          onClick={() => {
            if (!disabled && !searchable) {
              setOpenState(!isOpen);
            }
          }}
          onKeyDown={!searchable ? handleKeyDown : undefined}
          role={!searchable ? 'combobox' : undefined}
          aria-expanded={!searchable ? isOpen : undefined}
          aria-haspopup={!searchable ? 'listbox' : undefined}
          aria-controls={!searchable ? listboxId : undefined}
          aria-activedescendant={
            !searchable && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          tabIndex={!searchable && !disabled ? 0 : -1}
        >
          {!searchable && <Ripple disabled={disabled} />}

          <div
            className={cn(
              'flex h-full min-w-0 items-center',
              fieldSize.horizontalPadding,
              size === 'lg' ? 'gap-3' : 'gap-2',
            )}
          >
            <div className="min-w-0 flex-1">
              {searchable ? (
                <input
                  ref={inputRef}
                  id={inputId}
                  type="text"
                  value={isSearching ? searchValue : selectedOption ? selectedOption.label : ''}
                  onChange={(event) => handleInputChange(event.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => {
                    if (!disabled) {
                      setOpenState(true);
                      setIsSearching(true);
                      setSearchValue('');
                      onSearchChange?.('');
                    }
                  }}
                  onBlur={handleBlur}
                  placeholder={placeholder}
                  disabled={disabled}
                  className={cn(
                    'text-on-surface placeholder:text-on-surface-variant block w-full cursor-text bg-transparent outline-none',
                    fieldSize.valueText,
                  )}
                  role="combobox"
                  aria-expanded={isOpen}
                  aria-haspopup="listbox"
                  aria-controls={listboxId}
                  aria-activedescendant={
                    activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
                  }
                  aria-autocomplete="list"
                />
              ) : (
                <span
                  className={cn(
                    'block truncate',
                    fieldSize.valueText,
                    !selectedOption && 'text-on-surface-variant',
                  )}
                >
                  {selectedOption ? selectedOption.label : placeholder}
                </span>
              )}
            </div>

            <span
              className={cn(
                getFieldAffixClasses({
                  size,
                  active: isOpen,
                  side: 'trailing',
                }),
                'ml-auto cursor-pointer',
              )}
              aria-hidden="true"
              onClick={() => {
                if (!disabled) {
                  const nextOpen = !isOpen;
                  setOpenState(nextOpen);
                  if (searchable && nextOpen && inputRef.current) {
                    inputRef.current.focus();
                  }
                }
              }}
            >
              <Icon
                symbol="arrow_drop_down"
                size="sm"
                className={cn(
                  'duration-short ease-standard transition-transform',
                  isOpen && 'rotate-180',
                )}
              />
            </span>
          </div>
        </div>

        {isOpen &&
          !disabled &&
          (() => {
            const dropdown = (
              <div
                ref={dropdownRef}
                className={cn(
                  'bg-surface border-outline-soft shadow-2 z-[var(--z-popover,2000)] overflow-y-auto rounded-sm border',
                  portal ? 'fixed' : 'absolute top-[calc(100%+var(--unit))] right-0 left-0',
                )}
                style={
                  portal
                    ? {
                        top: dropdownPosition.top,
                        left: dropdownPosition.left,
                        width: dropdownPosition.width,
                        maxHeight: dropdownPosition.maxHeight,
                        visibility: isPositioned ? 'visible' : 'hidden',
                        ...getPortalLayerStyle(comboboxRef.current),
                      }
                    : undefined
                }
                role="listbox"
                id={listboxId}
                aria-label={label || 'Options'}
              >
                <div className="py-1">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option, index) => (
                      <div
                        key={option.value}
                        id={`${listboxId}-option-${index}`}
                        className={cn(
                          'relative flex cursor-pointer items-center gap-3 transition-colors',
                          fieldSize.optionHeight,
                          fieldSize.optionPaddingX,
                          'hover:bg-state-hover',
                          highlightSelected &&
                            selectedValue === option.value &&
                            'bg-state-selected text-on-surface',
                          activeIndex === index &&
                            (!highlightSelected || selectedValue !== option.value) &&
                            'bg-state-hover',
                          option.disabled && 'cursor-not-allowed opacity-38',
                        )}
                        onClick={() => handleSelect(option)}
                        role="option"
                        aria-selected={selectedValue === option.value}
                        aria-disabled={option.disabled}
                      >
                        <Ripple disabled={option.disabled} />
                        <span className="relative z-10 flex-1 truncate font-medium">
                          {option.label}
                        </span>
                        {highlightSelected && selectedValue === option.value && (
                          <Icon symbol="check" size="sm" className="text-primary relative z-10" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div
                      className={cn(
                        'text-on-surface-variant font-medium',
                        size === 'sm' ? 'text-label-small py-2' : 'text-label-medium',
                        size === 'lg' ? 'py-3.5' : size === 'md' ? 'py-3' : '',
                        fieldSize.optionPaddingX,
                      )}
                    >
                      No results found
                    </div>
                  )}
                </div>
              </div>
            );

            if (portal && typeof document !== 'undefined') {
              return createPortal(dropdown, document.body);
            }

            return dropdown;
          })()}
      </div>
    );
  },
);

Combobox.displayName = 'Combobox';
