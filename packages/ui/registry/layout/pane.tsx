'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const paneVariants = cva(
  'relative h-full overflow-hidden transition-all duration-long ease-emphasized bg-surface',
  {
    variants: {
      kind: {
        list: 'border-r border-outline-weak z-0',
        main: 'flex-1 z-0',
        supporting: 'border-l border-outline-weak z-10 bg-surface-container-low',
      },
      isActive: {
        true: 'block',
        false: 'hidden medium:block',
      },
    },
    defaultVariants: {
      kind: 'main',
      isActive: true,
    },
  },
);

export interface PaneProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof paneVariants> {
  width?: string | number;
  showScrollbar?: boolean;
  scrollable?: boolean;
}

export const Pane = React.forwardRef<HTMLDivElement, PaneProps>(
  (
    {
      className,
      kind = 'main',
      isActive,
      width,
      style,
      children,
      showScrollbar,
      scrollable,
      ...props
    },
    ref,
  ) => {
    let widthClass = '';
    if (!width) {
      if (kind === 'list')
        widthClass = 'w-full medium:w-(--width-pane-list,var(--spacing-90)) shrink-0';
      if (kind === 'supporting')
        widthClass = 'w-full medium:w-(--width-pane-supporting,var(--spacing-100)) shrink-0';
      if (kind === 'main') widthClass = 'w-full flex-1 min-w-0';
    }

    const shouldScroll = scrollable ?? true;
    const shouldShowScrollbar = shouldScroll ? (showScrollbar ?? kind === 'main') : false;

    return (
      <div
        ref={ref}
        className={cn(paneVariants({ kind, isActive }), widthClass, className)}
        data-pane={kind}
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
