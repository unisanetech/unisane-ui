'use client';

import React, { createContext, useContext, useId } from 'react';
import { cn } from '@/lib/utils';
import { useControllableState } from '@/lib/use-controllable-state';
import { Ripple } from '@/components/ui/ripple';

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

export interface TabsProps {
  id?: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  id,
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}) => {
  const [currentValue = '', setCurrentValue] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? '',
    onChange: onValueChange,
  });
  const generatedBaseId = useId();
  const baseId = id ?? generatedBaseId;

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: setCurrentValue, baseId }}>
      <div className={cn('flex w-full flex-col', className)}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsList must be used within Tabs');

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    if (!target || target.getAttribute('role') !== 'tab') return;

    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(event.key)) return;

    const tabs = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
    ).filter((tab) => !tab.disabled);

    if (tabs.length === 0) return;

    const currentIndex = tabs.indexOf(target as HTMLButtonElement);
    if (currentIndex === -1) return;

    event.preventDefault();

    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = tabs.length - 1;
    }

    const nextTab = tabs[nextIndex];
    if (!nextTab) return;
    const nextValue = nextTab.dataset.value;
    if (!nextValue) return;

    nextTab.focus();
    context.onValueChange(nextValue);
  };

  return (
    <div
      className={cn(
        'border-outline-variant bg-surface no-scrollbar flex w-full overflow-x-auto border-b',
        className,
      )}
      role="tablist"
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </div>
  );
};

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  icon?: React.ReactNode;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  icon,
  className,
  children,
  onClick,
  type = 'button',
  ...props
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');

  const isSelected = context.value === value;
  const triggerId = `${context.baseId}-trigger-${value}`;
  const panelId = `${context.baseId}-panel-${value}`;

  return (
    <button
      type={type}
      id={triggerId}
      data-value={value}
      role="tab"
      aria-selected={isSelected}
      aria-controls={panelId}
      tabIndex={isSelected ? 0 : -1}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          context.onValueChange(value);
        }
      }}
      className={cn(
        'group relative flex min-h-12 min-w-fit shrink-0 cursor-pointer items-center justify-center gap-2 overflow-hidden px-6 py-4 transition-all select-none focus-visible:outline-none',
        isSelected
          ? 'text-primary'
          : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low',
        className,
      )}
      {...props}
    >
      <Ripple disabled={props.disabled} />

      {icon && (
        <span
          className={cn(
            'size-icon-sm z-10 flex shrink-0 items-center justify-center transition-colors',
            isSelected ? 'text-primary' : 'text-on-surface-variant',
          )}
        >
          {icon}
        </span>
      )}
      <span
        className={cn(
          'text-label-medium z-10 inline-flex items-center gap-2 leading-none font-medium whitespace-nowrap transition-all',
          isSelected ? 'opacity-100' : 'opacity-60',
        )}
      >
        {children}
      </span>

      {isSelected && (
        <div className="bg-primary animate-in zoom-in-x duration-medium ease-emphasized absolute bottom-0 z-20 h-[calc(var(--unit)*0.75)] w-full rounded-t-full" />
      )}
    </button>
  );
};

export const TabsContent: React.FC<React.HTMLAttributes<HTMLDivElement> & { value: string }> = ({
  value,
  className,
  children,
  ...props
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');

  const triggerId = `${context.baseId}-trigger-${value}`;
  const panelId = `${context.baseId}-panel-${value}`;

  if (context.value !== value) return null;

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={triggerId}
      tabIndex={0}
      className={cn(
        'animate-in fade-in slide-in-from-bottom-1 duration-medium mt-4 focus-visible:outline-none',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
