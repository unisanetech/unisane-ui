import React, { useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/primitives/icon';
import { getFieldSizeStyles, type FieldSize } from '@/lib/field-size';

export interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  onTrailingIconClick?: () => void;
  size?: FieldSize;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  leadingIcon,
  trailingIcon,
  onTrailingIconClick,
  className,
  placeholder = 'Search',
  value,
  defaultValue,
  onChange,
  disabled,
  readOnly,
  type,
  size = 'md',
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(() => {
    if (typeof defaultValue === 'string') return defaultValue;
    if (typeof defaultValue === 'number') return String(defaultValue);
    return '';
  });

  const currentValue = useMemo(() => {
    if (!isControlled) return internalValue;
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    return '';
  }, [internalValue, isControlled, value]);

  const canClear = !disabled && !readOnly;
  const shouldShowDefaultClear = !trailingIcon && canClear && currentValue.length > 0;
  const fieldSize = getFieldSizeStyles(size);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(event.target.value);
    }
    onChange?.(event);
  };

  const handleTrailingAction = () => {
    if (onTrailingIconClick) {
      onTrailingIconClick();
      return;
    }
    if (!shouldShowDefaultClear) return;
    const input = inputRef.current;
    if (!input) return;
    if (!isControlled) {
      setInternalValue('');
    }
    const valueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    )?.set;
    valueSetter?.call(input, '');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();
  };

  const trailing =
    trailingIcon ??
    (shouldShowDefaultClear ? <Icon symbol="close" size={size === 'lg' ? 'md' : 'sm'} /> : null);
  const trailingIsAction = Boolean(onTrailingIconClick || shouldShowDefaultClear);

  return (
    <div
      role="search"
      className={cn(
        'group bg-surface-container border-outline-variant hover:bg-surface-container-high focus-within:bg-surface-container-high duration-medium ease-standard relative w-full cursor-text rounded-sm border transition-all',
        fieldSize.containerHeight,
        className,
      )}
    >
      <div
        className={cn(
          'text-on-surface pointer-events-none absolute inset-y-0 left-0 flex items-center',
          fieldSize.searchTriggerPadding,
        )}
      >
        {leadingIcon || <Icon symbol="search" size={size === 'lg' ? 'md' : 'sm'} />}
      </div>

      <input
        ref={inputRef}
        type={type ?? 'search'}
        value={value}
        defaultValue={defaultValue}
        onChange={handleInputChange}
        disabled={disabled}
        readOnly={readOnly}
        className={cn(
          'text-on-surface placeholder:text-on-surface-variant h-full w-full [appearance:textfield] border-none bg-transparent outline-none [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none',
          fieldSize.searchText,
          fieldSize.searchInputPaddingLeft,
          trailing
            ? fieldSize.searchInputPaddingRightWithTrailing
            : fieldSize.searchInputPaddingRightWithoutTrailing,
        )}
        placeholder={placeholder}
        {...props}
      />

      {trailing ? (
        trailingIsAction ? (
          <button
            type="button"
            onClick={handleTrailingAction}
            aria-label={shouldShowDefaultClear ? 'Clear search' : 'Search action'}
            className={cn(
              'text-on-surface-variant hover:bg-on-surface/8 hover:text-on-surface focus-visible:outline-primary absolute top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2',
              fieldSize.actionInset,
              fieldSize.actionSize,
            )}
          >
            {trailing}
          </button>
        ) : (
          <div
            className={cn(
              'text-on-surface-variant pointer-events-none absolute top-1/2 inline-flex -translate-y-1/2 items-center justify-center',
              fieldSize.passiveTrailingInset,
              fieldSize.passiveTrailingSize,
            )}
          >
            {trailing}
          </div>
        )
      ) : null}
    </div>
  );
};
