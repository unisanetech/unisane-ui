'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@ui/lib/utils';

const paneVariants = cva(
  'relative h-full overflow-hidden transition-all duration-long ease-emphasized bg-surface',
  {
    variants: {
      role: {
        list: 'border-r border-outline-muted z-0',
        main: 'flex-1 z-0',
        supporting: 'border-l border-outline-muted z-10 bg-surface-container-low',
      },
      isActive: {
        true: 'block',
        false: 'hidden medium:block',
      },
    },
    defaultVariants: {
      role: 'main',
      isActive: true,
    },
  },
);

export interface PaneProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'role'>, VariantProps<typeof paneVariants> {
  width?: string | number;
  showScrollbar?: boolean;
  scrollable?: boolean;
}

export const Pane = React.forwardRef<HTMLDivElement, PaneProps>(
  (
    { className, role, isActive, width, style, children, showScrollbar, scrollable, ...props },
    ref,
  ) => {
    let widthClass = '';
    if (!width) {
      if (role === 'list')
        widthClass = 'w-full medium:w-(--width-pane-list,var(--spacing-90)) shrink-0';
      if (role === 'supporting')
        widthClass = 'w-full medium:w-(--width-pane-supporting,var(--spacing-100)) shrink-0';
      if (role === 'main') widthClass = 'w-full flex-1 min-w-0';
    }

    const shouldScroll = scrollable ?? true;
    const shouldShowScrollbar = shouldScroll ? (showScrollbar ?? role === 'main') : false;

    return (
      <div
        ref={ref}
        className={cn(paneVariants({ role, isActive }), widthClass, className)}
        style={{
          ...style,
          ...(width ? { width } : {}),
        }}
        {...props}
      >
        {shouldScroll ? (
          <div
            className={cn(
              'h-full overflow-y-auto',
              shouldShowScrollbar ? '[scrollbar-gutter:stable]' : 'no-scrollbar',
            )}
          >
            {children}
          </div>
        ) : (
          <div className="h-full overflow-hidden">{children}</div>
        )}
      </div>
    );
  },
);
Pane.displayName = 'Pane';

export type PaneDividerProps = React.HTMLAttributes<HTMLDivElement>;

export const PaneDivider: React.FC<PaneDividerProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'bg-outline-muted hover:bg-outline-strong medium:block z-20 hidden h-full w-px cursor-col-resize transition-colors',
        className,
      )}
      {...props}
    />
  );
};

export interface PaneLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

export const PaneLayout = React.forwardRef<HTMLDivElement, PaneLayoutProps>(
  ({ className, orientation = 'horizontal', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative isolate flex h-full w-full overflow-hidden',
          orientation === 'vertical' ? 'flex-col' : 'flex-row',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
PaneLayout.displayName = 'PaneLayout';
