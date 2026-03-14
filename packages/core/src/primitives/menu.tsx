import React, { isValidElement, cloneElement } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, Slot } from '@ui/lib/utils';
import { actionFrameSizeClasses } from '@ui/lib/action-size';
import { Ripple } from '../components/ripple';

const menuVariants = cva(
  'min-w-50 bg-surface shadow-2 border border-outline-muted overflow-hidden',
  {
    variants: {
      rounded: {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
      },
    },
    defaultVariants: {
      rounded: 'sm',
    },
  },
);

export interface MenuProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof menuVariants> {
  open?: boolean;
  children: React.ReactNode;
}

export const Menu: React.FC<MenuProps> = ({
  open = true,
  rounded,
  className,
  children,
  ...props
}) => {
  if (!open) return null;

  return (
    <div className={cn(menuVariants({ rounded }), 'py-2', className)} role="menu" {...props}>
      {children}
    </div>
  );
};

export interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  disabled?: boolean;
  selected?: boolean;
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  href?: string;
  asChild?: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  children,
  disabled = false,
  selected = false,
  icon,
  trailingIcon,
  className,
  href,
  asChild,
  ...props
}) => {
  const label =
    asChild && isValidElement<{ children?: React.ReactNode }>(children)
      ? children.props.children
      : children;

  const itemClasses = cn(
    `relative w-full text-left ${actionFrameSizeClasses.md} flex items-center gap-3 cursor-pointer select-none overflow-hidden`,
    'text-on-surface transition-colors duration-short ease-standard',
    'hover:bg-state-hover focus-visible:bg-state-focus focus-visible:outline-none',
    disabled && 'opacity-38 cursor-not-allowed hover:bg-transparent',
    selected && 'bg-secondary-container text-on-secondary-container',
    className,
  );

  const innerContent = (
    <>
      <Ripple disabled={disabled} />
      {icon && (
        <div className="relative z-10 flex min-h-[var(--size-icon-sm)] min-w-[var(--size-icon-sm)] shrink-0 items-center justify-center">
          {icon}
        </div>
      )}
      <span className="text-body-large relative z-10 flex-1 font-medium">{label}</span>
      {trailingIcon && (
        <div className="text-on-surface-variant relative z-10 flex shrink-0 items-center justify-center">
          {trailingIcon}
        </div>
      )}
    </>
  );

  // asChild pattern: render user's Link component
  if (asChild && isValidElement(children)) {
    return (
      <Slot className={itemClasses} role="menuitem">
        {cloneElement(children as React.ReactElement, {}, innerContent)}
      </Slot>
    );
  }

  if (href && !disabled) {
    return (
      <a
        href={href}
        className={itemClasses}
        role="menuitem"
        aria-disabled={disabled}
        aria-selected={selected}
      >
        {innerContent}
      </a>
    );
  }

  return (
    <button
      className={itemClasses}
      role="menuitem"
      disabled={disabled}
      aria-disabled={disabled}
      aria-selected={selected}
      {...props}
    >
      {innerContent}
    </button>
  );
};

export type MenuDividerProps = React.HTMLAttributes<HTMLDivElement>;

export const MenuDivider: React.FC<MenuDividerProps> = ({ className, ...props }) => {
  return (
    <div className={cn('bg-outline-medium my-1 h-px', className)} role="separator" {...props} />
  );
};

export interface MenuCheckboxItemProps extends Omit<MenuItemProps, 'selected'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const MenuCheckboxItem: React.FC<MenuCheckboxItemProps> = ({
  checked = false,
  onCheckedChange,
  children,
  ...props
}) => {
  return (
    <MenuItem
      selected={checked}
      onClick={(e) => {
        onCheckedChange?.(!checked);
        props.onClick?.(e);
      }}
      icon={
        <div
          className={cn(
            'size-icon-sm rounded-xs border-2 border-current',
            checked && 'bg-primary border-primary text-on-primary',
          )}
        >
          {checked && (
            <svg className="h-full w-full" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      }
      {...props}
    >
      {children}
    </MenuItem>
  );
};

export interface MenuRadioItemProps extends Omit<MenuItemProps, 'selected'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const MenuRadioItem: React.FC<MenuRadioItemProps> = ({
  checked = false,
  onCheckedChange,
  children,
  ...props
}) => {
  return (
    <MenuItem
      selected={checked}
      onClick={(e) => {
        onCheckedChange?.(!checked);
        props.onClick?.(e);
      }}
      icon={
        <div
          className={cn(
            'size-icon-sm flex items-center justify-center rounded-full border-2 border-current',
            checked && 'bg-primary border-primary',
          )}
        >
          {checked && <div className="bg-on-primary h-2.5 w-2.5 rounded-full" />}
        </div>
      }
      {...props}
    >
      {children}
    </MenuItem>
  );
};
