import React, { isValidElement, cloneElement } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, focusRing, Slot } from '@/lib/utils';
import { Typography } from './typography';
import { Ripple } from './ripple';

export const List: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('bg-surface flex flex-col py-2', className)} role="list" {...props}>
      {children}
    </div>
  );
};

export const ListSubheader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div
    className={cn('text-label-medium text-on-surface-variant/70 px-4 py-2 font-medium', className)}
  >
    {children}
  </div>
);

const listItemVariants = cva(
  'relative flex min-h-10 items-center px-4 py-2 gap-3 text-left transition-all duration-snappy ease-emphasized group overflow-hidden select-none',
  {
    variants: {
      active: {
        true: 'bg-primary/8 text-primary',
        false: 'text-on-surface hover:bg-on-surface/6',
      },
      disabled: {
        true: 'opacity-38 pointer-events-none grayscale',
        false: '',
      },
    },
    defaultVariants: {
      active: false,
      disabled: false,
    },
  },
);

export interface ListItemProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof listItemVariants> {
  headline?: string;
  supportingText?: React.ReactNode;
  trailingSupportingText?: React.ReactNode;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  asChild?: boolean;
}

export const ListItem: React.FC<ListItemProps> = ({
  headline,
  supportingText,
  trailingSupportingText,
  leadingIcon,
  trailingIcon,
  active,
  disabled,
  className,
  onClick,
  children,
  href,
  asChild,
  ...props
}) => {
  const isInteractive = (!!onClick || !!href || asChild) && !disabled;
  const itemClasses = cn(
    listItemVariants({ active, disabled, className }),
    isInteractive && focusRing
  );

  // Build content for headline-based items
  const headlineContent = headline ? (
    <>
      {isInteractive && <Ripple />}

      {leadingIcon && (
        <div className="size-icon-sm relative z-10 flex shrink-0 items-center justify-center text-inherit">
          {leadingIcon}
        </div>
      )}

      <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-center">
        <Typography variant="bodyLarge" className="truncate leading-none font-medium text-inherit">
          {headline}
        </Typography>
        {supportingText && (
          <Typography
            variant="labelSmall"
            className="text-on-surface-variant mt-1.5 truncate leading-none opacity-60"
          >
            {supportingText}
          </Typography>
        )}
      </div>

      {(trailingSupportingText || trailingIcon) && (
        <div className="text-on-surface-variant relative z-10 flex shrink-0 items-center gap-2">
          {trailingSupportingText && (
            <Typography variant="labelSmall" className="font-medium tabular-nums">
              {trailingSupportingText}
            </Typography>
          )}
          {trailingIcon && (
            <div className="size-icon-sm flex items-center justify-center">{trailingIcon}</div>
          )}
        </div>
      )}
    </>
  ) : (
    <>
      {isInteractive && <Ripple />}
      {children}
    </>
  );

  // asChild pattern: render user's Link component
  if (asChild && children && isValidElement(children)) {
    return (
      <div role="listitem">
        <Slot className={itemClasses}>
          {cloneElement(children as React.ReactElement, {}, headlineContent)}
        </Slot>
      </div>
    );
  }

  if (href && !disabled) {
    return (
      <div role="listitem">
        <a href={href} className={itemClasses}>
          {headlineContent}
        </a>
      </div>
    );
  }

  if (onClick && !disabled) {
    return (
      <div role="listitem">
        <button
          type="button"
          className={itemClasses}
          onClick={onClick}
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {headlineContent}
        </button>
      </div>
    );
  }

  return (
    <div
      className={itemClasses}
      role="listitem"
      {...props}
    >
      {headlineContent}
    </div>
  );
};

export type ListItemContentProps = {
  leading?: React.ReactNode;
  children: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
};

export const ListItemContent: React.FC<ListItemContentProps> = ({
  leading,
  children,
  trailing,
  className,
}) => {
  return (
    <div className={cn('flex min-w-0 flex-1 items-center gap-3', className)}>
      {leading && <div className="size-icon-sm flex items-center justify-center">{leading}</div>}
      <div className="min-w-0 flex-1">{children}</div>
      {trailing && <div className="flex items-center gap-2">{trailing}</div>}
    </div>
  );
};

export type ListItemTextProps = {
  primary: React.ReactNode;
  secondary?: React.ReactNode;
  className?: string;
};

export const ListItemText: React.FC<ListItemTextProps> = ({ primary, secondary, className }) => {
  return (
    <div className={cn('flex flex-col', className)}>
      <Typography variant="bodyLarge">{primary}</Typography>
      {secondary && (
        <Typography variant="bodyMedium" className="text-on-surface-variant">
          {secondary}
        </Typography>
      )}
    </div>
  );
};
