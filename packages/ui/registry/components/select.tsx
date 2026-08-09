'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { getFieldSizeStyles, type FieldSize } from '@/lib/field-size';
import { fieldContainerVariants, type FieldShellVariant } from '@/lib/field-shell';
import { getPortalLayerStyle } from '@/lib/portal-layer';
import { useControllableState } from '@/lib/use-controllable-state';
import { useOverlayBehavior } from '@/lib/use-overlay-behavior';
import { Icon } from '@/components/ui/icon';

type SelectItemRecord = {
  id: string;
  value: string;
  disabled: boolean;
  textValue: string;
  content: React.ReactNode;
  order: number;
};

type SelectContextValue = {
  disabled: boolean;
  required: boolean;
  open: boolean;
  value: string | undefined;
  contentId: string;
  triggerId: string;
  highlightedItem: SelectItemRecord | undefined;
  selectedItem: SelectItemRecord | undefined;
  rootRef: React.RefObject<HTMLDivElement | null>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  registerItem: (item: Omit<SelectItemRecord, 'order'>) => () => void;
  setOpen: (open: boolean) => void;
  setHighlightedValue: (value: string | undefined) => void;
  selectValue: (value: string) => void;
  moveHighlight: (direction: 1 | -1) => void;
  moveHighlightToEdge: (edge: 'first' | 'last') => void;
  searchByText: (character: string) => void;
};

const SelectContext = React.createContext<SelectContextValue | null>(null);

export interface SelectProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      children,
      className,
      defaultOpen = false,
      defaultValue,
      disabled = false,
      name,
      onOpenChange,
      onValueChange,
      open,
      required = false,
      value,
      ...props
    },
    forwardedRef,
  ) => {
    const rootRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const nextItemOrderRef = React.useRef(0);
    const typeaheadRef = React.useRef('');
    const typeaheadTimerRef = React.useRef<number | undefined>(undefined);
    const generatedId = React.useId();
    const contentId = `select-${generatedId}-content`;
    const triggerId = `select-${generatedId}-trigger`;
    const [items, setItems] = React.useState<SelectItemRecord[]>([]);
    const [highlightedValue, setHighlightedValue] = React.useState<string>();
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
    const enabledItems = React.useMemo(
      () => items.filter((item) => !item.disabled).sort((a, b) => a.order - b.order),
      [items],
    );
    const selectedItem = items.find((item) => item.value === selectedValue);
    const highlightedItem = items.find((item) => item.value === highlightedValue);

    React.useImperativeHandle(forwardedRef, () => rootRef.current as HTMLDivElement, []);

    React.useEffect(
      () => () => {
        if (typeaheadTimerRef.current !== undefined) {
          window.clearTimeout(typeaheadTimerRef.current);
        }
      },
      [],
    );

    React.useEffect(() => {
      if (!isOpen) {
        setHighlightedValue(undefined);
        return;
      }

      setHighlightedValue((currentValue) => {
        if (currentValue && enabledItems.some((item) => item.value === currentValue)) {
          return currentValue;
        }
        if (selectedValue && enabledItems.some((item) => item.value === selectedValue)) {
          return selectedValue;
        }
        return enabledItems[0]?.value;
      });
    }, [enabledItems, isOpen, selectedValue]);

    const registerItem = React.useCallback((item: Omit<SelectItemRecord, 'order'>) => {
      const record = { ...item, order: nextItemOrderRef.current++ };
      setItems((currentItems) => [...currentItems.filter(({ id }) => id !== item.id), record]);
      return () => {
        setItems((currentItems) => currentItems.filter(({ id }) => id !== item.id));
      };
    }, []);

    const setOpen = React.useCallback(
      (nextOpen: boolean) => {
        if (!disabled) setOpenState(nextOpen);
      },
      [disabled, setOpenState],
    );

    const selectValue = React.useCallback(
      (nextValue: string) => {
        const item = items.find((candidate) => candidate.value === nextValue);
        if (!item || item.disabled || disabled) return;
        setSelectedValue(nextValue);
        setOpenState(false);
      },
      [disabled, items, setOpenState, setSelectedValue],
    );

    const moveHighlight = React.useCallback(
      (direction: 1 | -1) => {
        if (enabledItems.length === 0) return;
        const currentIndex = enabledItems.findIndex((item) => item.value === highlightedValue);
        const selectedIndex = enabledItems.findIndex((item) => item.value === selectedValue);
        const baseIndex = currentIndex >= 0 ? currentIndex : selectedIndex;
        const nextIndex =
          baseIndex < 0
            ? direction === 1
              ? 0
              : enabledItems.length - 1
            : (baseIndex + direction + enabledItems.length) % enabledItems.length;
        setHighlightedValue(enabledItems[nextIndex]?.value);
      },
      [enabledItems, highlightedValue, selectedValue],
    );

    const moveHighlightToEdge = React.useCallback(
      (edge: 'first' | 'last') => {
        const item = edge === 'first' ? enabledItems[0] : enabledItems[enabledItems.length - 1];
        setHighlightedValue(item?.value);
      },
      [enabledItems],
    );

    const searchByText = React.useCallback(
      (character: string) => {
        if (typeaheadTimerRef.current !== undefined) {
          window.clearTimeout(typeaheadTimerRef.current);
        }
        typeaheadRef.current += character.toLocaleLowerCase();
        typeaheadTimerRef.current = window.setTimeout(() => {
          typeaheadRef.current = '';
        }, 700);

        const query = typeaheadRef.current;
        const currentIndex = enabledItems.findIndex((item) => item.value === highlightedValue);
        const orderedItems = [
          ...enabledItems.slice(currentIndex + 1),
          ...enabledItems.slice(0, currentIndex + 1),
        ];
        const match = orderedItems.find((item) =>
          item.textValue.toLocaleLowerCase().startsWith(query),
        );
        if (match) setHighlightedValue(match.value);
      },
      [enabledItems, highlightedValue],
    );

    const contextValue = React.useMemo<SelectContextValue>(
      () => ({
        disabled,
        required,
        open: isOpen,
        value: selectedValue,
        contentId,
        triggerId,
        highlightedItem,
        selectedItem,
        rootRef,
        triggerRef,
        contentRef,
        registerItem,
        setOpen,
        setHighlightedValue,
        selectValue,
        moveHighlight,
        moveHighlightToEdge,
        searchByText,
      }),
      [
        disabled,
        contentId,
        highlightedItem,
        isOpen,
        moveHighlight,
        moveHighlightToEdge,
        registerItem,
        required,
        searchByText,
        selectedItem,
        selectedValue,
        selectValue,
        setOpen,
        triggerId,
      ],
    );

    return (
      <SelectContext.Provider value={contextValue}>
        <div
          {...props}
          ref={rootRef}
          className={cn('relative inline-flex w-full min-w-40 flex-col', className)}
          data-disabled={disabled || undefined}
          data-state={isOpen ? 'open' : 'closed'}
        >
          {children}
          {name ? (
            <input
              type="hidden"
              name={name}
              value={selectedValue ?? ''}
              disabled={disabled}
              required={required}
            />
          ) : null}
        </div>
      </SelectContext.Provider>
    );
  },
);
Select.displayName = 'Select';

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  invalid?: boolean;
  size?: FieldSize;
  trailingIcon?: React.ReactNode;
  variant?: FieldShellVariant;
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  (
    {
      children,
      className,
      disabled,
      invalid = false,
      onClick,
      onKeyDown,
      size = 'md',
      trailingIcon,
      variant = 'outlined',
      ...props
    },
    forwardedRef,
  ) => {
    const context = useSelectContext('SelectTrigger');
    const fieldSize = getFieldSizeStyles(size);
    const resolvedDisabled = context.disabled || disabled;

    function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
      onKeyDown?.(event);
      if (event.defaultPrevented || resolvedDisabled) return;

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        context.setOpen(true);
        context.moveHighlight(event.key === 'ArrowDown' ? 1 : -1);
        return;
      }
      if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        context.setOpen(true);
        context.moveHighlightToEdge(event.key === 'Home' ? 'first' : 'last');
        return;
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (context.open && context.highlightedItem) {
          context.selectValue(context.highlightedItem.value);
        } else {
          context.setOpen(true);
        }
        return;
      }
      if (event.key === 'Escape' && context.open) {
        event.preventDefault();
        context.setOpen(false);
        return;
      }
      if (event.key === 'Tab' && context.open) {
        context.setOpen(false);
        return;
      }
      if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
        context.setOpen(true);
        context.searchByText(event.key);
      }
    }

    return (
      <button
        {...props}
        ref={mergeRefs(forwardedRef, context.triggerRef)}
        id={props.id ?? context.triggerId}
        type="button"
        role="combobox"
        aria-activedescendant={context.open ? context.highlightedItem?.id : undefined}
        aria-controls={context.contentId}
        aria-expanded={context.open}
        aria-haspopup="listbox"
        aria-invalid={invalid || undefined}
        aria-required={context.required || undefined}
        data-placeholder={!context.selectedItem || undefined}
        data-state={context.open ? 'open' : 'closed'}
        disabled={resolvedDisabled}
        className={cn(
          'group relative flex w-full cursor-pointer items-center transition-colors select-none',
          fieldSize.containerHeight,
          fieldContainerVariants({ variant, error: invalid, disabled: resolvedDisabled }),
          'focus-within:ring-0',
          !resolvedDisabled &&
            variant === 'filled' &&
            !context.open &&
            'hover:border-outline-medium',
          context.open && (variant === 'outlined' ? 'border-primary! border-2' : 'bg-surface'),
          className,
        )}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented && !resolvedDisabled) context.setOpen(!context.open);
        }}
        onKeyDown={handleKeyDown}
      >
        {variant === 'filled' ? (
          <span
            className={cn(
              'duration-snappy absolute right-0 bottom-[calc(var(--unit)*-0.25)] left-0 h-0.5 origin-center scale-x-0 transition-transform ease-out',
              invalid ? 'bg-error scale-x-100' : 'bg-primary',
              context.open && 'scale-x-100',
            )}
          />
        ) : null}
        <span className="min-w-0 flex-1 text-left">{children}</span>
        <span className={cn('text-on-surface-variant shrink-0', fieldSize.chevronOffset)}>
          {trailingIcon ?? (
            <Icon
              symbol="arrow_drop_down"
              size={size === 'sm' ? 'sm' : 'md'}
              className={cn(
                'duration-short ease-standard transition-transform',
                context.open && 'rotate-180',
              )}
            />
          )}
        </span>
      </button>
    );
  },
);
SelectTrigger.displayName = 'SelectTrigger';

export interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: React.ReactNode;
}

export const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className, placeholder, ...props }, ref) => {
    const context = useSelectContext('SelectValue');
    const content = context.selectedItem?.content ?? placeholder;
    return (
      <span
        ref={ref}
        className={cn(
          'block min-w-0 truncate',
          !context.selectedItem && 'text-on-surface-variant',
          className,
        )}
        {...props}
      >
        {content}
      </span>
    );
  },
);
SelectValue.displayName = 'SelectValue';

type SelectContentPosition = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  direction: 'down' | 'up';
};

export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  portal?: boolean;
  maxHeight?: number;
  sideOffset?: number;
}

export const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  (
    {
      children,
      className,
      maxHeight: preferredMaxHeight = 280,
      portal = true,
      sideOffset = 4,
      style,
      ...props
    },
    forwardedRef,
  ) => {
    const context = useSelectContext('SelectContent');
    const [isPositioned, setIsPositioned] = React.useState(!portal);
    const [position, setPosition] = React.useState<SelectContentPosition>({
      top: 0,
      left: 0,
      width: 0,
      maxHeight: preferredMaxHeight,
      direction: 'down',
    });

    const updatePosition = React.useCallback(() => {
      const trigger = context.triggerRef.current;
      if (!trigger || typeof window === 'undefined') return;

      const rect = trigger.getBoundingClientRect();
      const edgePadding = 8;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const measuredHeight = context.contentRef.current?.scrollHeight ?? preferredMaxHeight;
      const spaceBelow = viewportHeight - rect.bottom - edgePadding;
      const spaceAbove = rect.top - edgePadding;
      const direction =
        spaceBelow < Math.min(measuredHeight, 180) && spaceAbove > spaceBelow ? 'up' : 'down';
      const availableSpace = direction === 'up' ? spaceAbove : spaceBelow;
      const maxHeight = Math.max(120, Math.min(preferredMaxHeight, availableSpace - sideOffset));
      const width = Math.min(rect.width, viewportWidth - edgePadding * 2);
      const left = Math.min(Math.max(rect.left, edgePadding), viewportWidth - width - edgePadding);
      const contentHeight = Math.min(measuredHeight, maxHeight);
      const top =
        direction === 'up'
          ? Math.max(edgePadding, rect.top - contentHeight - sideOffset)
          : Math.min(rect.bottom + sideOffset, viewportHeight - maxHeight - edgePadding);

      setPosition({ top, left, width, maxHeight, direction });
    }, [context.contentRef, context.triggerRef, preferredMaxHeight, sideOffset]);

    React.useLayoutEffect(() => {
      if (!portal) {
        setIsPositioned(true);
        return;
      }
      if (!context.open) {
        setIsPositioned(false);
        return;
      }

      const update = () => {
        updatePosition();
        setIsPositioned(true);
      };
      update();
      const frame = window.requestAnimationFrame(update);
      window.addEventListener('scroll', update, true);
      window.addEventListener('resize', update);
      return () => {
        window.cancelAnimationFrame(frame);
        window.removeEventListener('scroll', update, true);
        window.removeEventListener('resize', update);
      };
    }, [context.open, portal, updatePosition]);

    useOverlayBehavior({
      open: context.open,
      contentRef: context.contentRef,
      rootRef: context.rootRef,
      triggerRef: context.triggerRef,
      onDismiss: () => context.setOpen(false),
      modal: false,
      dismissOnEscape: true,
      dismissOnInteractOutside: true,
      initialFocus: false,
      restoreFocus: false,
    });

    const content = (
      <div
        {...props}
        ref={mergeRefs(forwardedRef, context.contentRef)}
        id={context.contentId}
        role="listbox"
        aria-labelledby={
          props['aria-label'] ? undefined : (context.triggerRef.current?.id ?? context.triggerId)
        }
        hidden={!context.open}
        data-state={context.open ? 'open' : 'closed'}
        data-side={position.direction === 'up' ? 'top' : 'bottom'}
        className={cn(
          'bg-surface border-outline-soft shadow-2 z-[var(--z-popover,2000)] overflow-y-auto rounded-sm border py-1',
          portal
            ? 'fixed'
            : cn(
                'absolute right-0 left-0',
                position.direction === 'up'
                  ? 'bottom-[calc(100%+var(--unit))]'
                  : 'top-[calc(100%+var(--unit))]',
              ),
          className,
        )}
        style={
          portal
            ? {
                top: position.top,
                left: position.left,
                width: position.width,
                maxHeight: position.maxHeight,
                visibility: isPositioned ? 'visible' : 'hidden',
                ...getPortalLayerStyle(context.triggerRef.current),
                ...style,
              }
            : { maxHeight: preferredMaxHeight, ...style }
        }
      >
        {children}
      </div>
    );

    return portal && context.open && typeof document !== 'undefined'
      ? createPortal(content, document.body)
      : content;
  },
);
SelectContent.displayName = 'SelectContent';

export interface SelectItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  value: string;
  disabled?: boolean;
  textValue?: string;
}

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  (
    {
      children,
      className,
      disabled = false,
      onClick,
      onMouseDown,
      onPointerMove,
      textValue,
      value,
      ...props
    },
    ref,
  ) => {
    const context = useSelectContext('SelectItem');
    const { registerItem } = context;
    const generatedId = React.useId();
    const id = `select-item-${generatedId}`;
    const resolvedTextValue = textValue ?? getTextValue(children, value);
    const resolvedDisabled = context.disabled || disabled;
    const selected = context.value === value;
    const highlighted = context.highlightedItem?.value === value;

    React.useLayoutEffect(
      () =>
        registerItem({
          id,
          value,
          disabled: resolvedDisabled,
          textValue: resolvedTextValue,
          content: children,
        }),
      [children, id, registerItem, resolvedDisabled, resolvedTextValue, value],
    );

    return (
      <div
        {...props}
        ref={ref}
        id={id}
        role="option"
        aria-disabled={resolvedDisabled || undefined}
        aria-selected={selected}
        data-disabled={resolvedDisabled || undefined}
        data-highlighted={highlighted || undefined}
        data-state={selected ? 'checked' : 'unchecked'}
        className={cn(
          'text-label-medium relative flex min-h-[calc(var(--unit)*10)] cursor-pointer items-center rounded-xs py-2 pr-[calc(var(--unit)*10)] pl-3 font-medium transition-colors outline-none',
          'hover:bg-state-hover data-[highlighted=true]:bg-state-hover',
          selected && 'bg-state-selected text-on-surface',
          resolvedDisabled && 'cursor-not-allowed opacity-38',
          className,
        )}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented && !resolvedDisabled) context.selectValue(value);
        }}
        onMouseDown={(event) => {
          onMouseDown?.(event);
          if (!event.defaultPrevented) event.preventDefault();
        }}
        onPointerMove={(event) => {
          onPointerMove?.(event);
          if (!event.defaultPrevented && !resolvedDisabled) context.setHighlightedValue(value);
        }}
      >
        <span className="min-w-0 flex-1">{children}</span>
        {selected ? (
          <Icon
            symbol="check"
            size="sm"
            className="text-primary absolute right-3"
            aria-hidden="true"
          />
        ) : null}
      </div>
    );
  },
);
SelectItem.displayName = 'SelectItem';

export type SelectGroupProps = React.HTMLAttributes<HTMLDivElement>;

export const SelectGroup = React.forwardRef<HTMLDivElement, SelectGroupProps>((props, ref) => (
  <div ref={ref} role="group" {...props} />
));
SelectGroup.displayName = 'SelectGroup';

export type SelectLabelProps = React.HTMLAttributes<HTMLDivElement>;

export const SelectLabel = React.forwardRef<HTMLDivElement, SelectLabelProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-label-small text-on-surface-variant px-3 py-2 font-semibold', className)}
      {...props}
    />
  ),
);
SelectLabel.displayName = 'SelectLabel';

export type SelectSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

export const SelectSeparator = React.forwardRef<HTMLDivElement, SelectSeparatorProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      className={cn('bg-outline-soft my-1 h-px', className)}
      {...props}
    />
  ),
);
SelectSeparator.displayName = 'SelectSeparator';

function useSelectContext(component: string) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error(`${component} must be used inside Select.`);
  return context;
}

function mergeRefs<T>(
  ...refs: Array<React.ForwardedRef<T> | React.RefObject<T | null>>
): React.RefCallback<T> {
  return (node) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    });
  };
}

function getTextValue(content: React.ReactNode, fallback: string) {
  if (typeof content === 'string' || typeof content === 'number') return String(content);
  return fallback;
}
