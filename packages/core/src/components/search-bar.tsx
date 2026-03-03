import React, { useMemo, useRef, useState } from 'react';
import { cn } from '@ui/lib/utils';
import { Icon } from '@ui/primitives/icon';

export interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  onTrailingIconClick?: () => void;
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
    trailingIcon ?? (shouldShowDefaultClear ? <Icon symbol="close" size="sm" /> : null);
  const trailingIsAction = Boolean(onTrailingIconClick || shouldShowDefaultClear);

  return (
    <div
      role="search"
      className={cn(
        'group bg-surface-container border-outline-variant hover:bg-surface-container-high focus-within:bg-surface-container-high duration-medium ease-standard relative h-14 w-full cursor-text rounded-sm border transition-all',
        className,
      )}
    >
      <div className="text-on-surface pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        {leadingIcon || <Icon symbol="search" size="sm" />}
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
          'text-on-surface placeholder:text-on-surface-variant text-body-medium h-full w-full [appearance:textfield] border-none bg-transparent outline-none [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none',
          'pl-10',
          trailing ? 'pr-11' : 'pr-3',
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
            className="text-on-surface-variant hover:bg-on-surface/8 hover:text-on-surface focus-visible:outline-primary absolute top-1/2 right-1 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2"
          >
            {trailing}
          </button>
        ) : (
          <div className="text-on-surface-variant pointer-events-none absolute top-1/2 right-2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center">
            {trailing}
          </div>
        )
      ) : null}
    </div>
  );
};
