'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { getPortalLayerStyle } from '@/lib/portal-layer';
import { useAnchoredOverlayPosition } from '@/lib/use-anchored-overlay-position';
import { useControllableState } from '@/lib/use-controllable-state';
import { useOverlayBehavior } from '@/lib/use-overlay-behavior';
import { Calendar } from '@/components/ui/calendar';
import { DateInput, type DateInputProps } from '@/components/ui/date-input';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';

export interface DatePickerProps extends Omit<DateInputProps, 'onKeyDown' | 'trailingIcon'> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showCalendarButton?: boolean;
  portal?: boolean;
  calendarLabel?: string;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      open,
      defaultOpen = false,
      onOpenChange,
      label,
      hideLabel = false,
      disabled = false,
      required = false,
      invalid = false,
      description,
      errorMessage,
      className,
      variant = 'outlined',
      locale,
      format,
      min,
      max,
      name,
      showCalendarButton = true,
      portal = true,
      calendarLabel = 'Choose date',
      weekStartsOn = 0,
      onFocus,
      onBlur,
      id,
      size = 'md',
    },
    forwardedRef,
  ) => {
    const [selectedValue, setSelectedValue] = useControllableState<Date | undefined>({
      value,
      defaultValue,
      onChange: onValueChange,
    });
    const [openState, setOpenState] = useControllableState<boolean>({
      value: open,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });
    const isOpen = Boolean(openState) && !disabled;
    const containerRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const popoverId = React.useId();
    const position = useAnchoredOverlayPosition({
      open: isOpen,
      anchorRef: containerRef,
      contentRef,
      portal,
      minimumWidth: 320,
      estimatedHeight: 360,
    });

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef],
    );
    const closePicker = React.useCallback(() => setOpenState(false), [setOpenState]);
    const openPicker = React.useCallback(() => {
      if (!disabled) setOpenState(true);
    }, [disabled, setOpenState]);

    useOverlayBehavior({
      open: isOpen,
      contentRef,
      rootRef: containerRef,
      triggerRef,
      onDismiss: closePicker,
      modal: false,
      dismissOnEscape: true,
      dismissOnInteractOutside: true,
      initialFocus: false,
      restoreFocus: true,
    });

    React.useEffect(() => {
      if (disabled && openState) setOpenState(false);
    }, [disabled, openState, setOpenState]);

    const calendarButton = showCalendarButton ? (
      <IconButton
        ref={triggerRef}
        type="button"
        size="sm"
        icon={<Icon symbol="calendar_today" />}
        disabled={disabled}
        aria-label="Open calendar"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls={isOpen ? popoverId : undefined}
        className="-mr-1"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpenState(!isOpen);
        }}
      />
    ) : undefined;

    const content = isOpen ? (
      <div
        ref={contentRef}
        id={popoverId}
        role="dialog"
        aria-label={calendarLabel}
        data-side={position.side}
        className={cn(
          'z-[var(--z-popover,2000)] transition-none',
          portal ? 'fixed' : 'absolute top-[calc(100%+var(--spacing-2))] left-0 w-full min-w-80',
        )}
        style={
          portal
            ? {
                top: position.top,
                left: position.left,
                width: position.width,
                visibility: position.positioned ? 'visible' : 'hidden',
                ...getPortalLayerStyle(containerRef.current),
              }
            : undefined
        }
      >
        <div className="animate-surface-enter">
          <Calendar
            selectedDate={selectedValue}
            onDateSelect={(date) => {
              setSelectedValue(date);
              closePicker();
            }}
            min={min}
            max={max}
            locale={locale}
            weekStartsOn={weekStartsOn}
            autoFocus
            aria-label={calendarLabel}
            className="max-w-none"
          />
        </div>
      </div>
    ) : null;

    return (
      <div ref={setRefs} className={cn('relative w-full', className)}>
        <DateInput
          value={selectedValue}
          onValueChange={setSelectedValue}
          label={label}
          hideLabel={hideLabel}
          disabled={disabled}
          required={required}
          invalid={invalid}
          description={description}
          errorMessage={errorMessage}
          variant={variant}
          locale={locale}
          format={format}
          min={min}
          max={max}
          name={name}
          trailingIcon={calendarButton}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={(event) => {
            if (event.altKey && event.key === 'ArrowDown') {
              event.preventDefault();
              openPicker();
            }
          }}
          id={id}
          size={size}
        />

        {portal && content && typeof document !== 'undefined'
          ? createPortal(content, document.body)
          : content}
      </div>
    );
  },
);

DatePicker.displayName = 'DatePicker';
