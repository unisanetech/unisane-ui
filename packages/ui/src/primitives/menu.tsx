import React, { isValidElement, cloneElement } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { usePopupRowStyles } from '../lib/popup-row';
import type { FieldSize } from '../lib/field-size';
import { cn, Slot } from '../lib/utils';
import { Ripple } from '../components/ripple';

const MenuSizeContext = React.createContext<FieldSize>('md');
const menuRowSizes = {
  sm: 'min-h-[var(--size-action-sm)] py-1',
  md: 'min-h-[var(--size-action-md)] py-2',
  lg: 'min-h-[var(--size-action-lg)] py-3',
} as const;

const menuVariants = cva(
  'min-w-50 bg-surface shadow-2 border border-outline-soft overflow-hidden',
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

const menuIconSlotClasses =
  'relative z-10 flex size-icon-sm shrink-0 items-center justify-center leading-none text-[var(--icon-sm)] [&>.material-symbols-outlined]:size-icon-sm [&>.material-symbols-outlined]:text-[var(--icon-sm)] [&>svg]:size-icon-sm';

export interface MenuProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof menuVariants> {
  size?: FieldSize;
  open?: boolean;
  children: React.ReactNode;
}

export const Menu: React.FC<MenuProps> = ({
  open = true,
  size,
  rounded,
  className,
  children,
  ...props
}) => {
  const inheritedSize = React.useContext(MenuSizeContext);
  if (!open) return null;

  return (
    <MenuSizeContext.Provider value={size ?? inheritedSize}>
      <div className={cn(menuVariants({ rounded }), 'py-2', className)} role="menu" {...props}>
        {children}
      </div>
    </MenuSizeContext.Provider>
  );
};

export interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  disabled?: boolean;
  selected?: boolean;
  icon?: React.ReactNode;
  /** Decorative selection mark in the leading gutter, independent of content icons.
   * Pass an aria-hidden mark (including an invisible mark on unselected rows).
   * The row's role and checked state remain the caller's responsibility. */
  selectionIndicator?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  href?: string;
  asChild?: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  children,
  disabled = false,
  selected = false,
  icon,
  selectionIndicator,
  trailingIcon,
  className,
  href,
  asChild,
  ...props
}) => {
  const size = React.useContext(MenuSizeContext);
  const row = usePopupRowStyles({
    className: `text-body-medium ${menuRowSizes[size]}`,
    minHeightPx: { sm: 32, md: 40, lg: 48 }[size],
  });
  const label =
    asChild && isValidElement<{ children?: React.ReactNode }>(children)
      ? children.props.children
      : children;

  const itemClasses = cn(
    'text-body-medium relative flex w-full cursor-pointer items-center gap-[calc(var(--unit)*3)] overflow-hidden px-[var(--menu-item-content-inset,calc(var(--unit)*3))] text-left select-none',
    'text-on-surface transition-colors duration-short ease-standard',
    'hover:bg-state-hover focus-visible:bg-state-focus focus-visible:outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-[-2px]',
    // A selection mark occupies the inset rather than a content-icon column.
    // The public inset token aligns mixed plain, selectable and icon rows.
    selectionIndicator != null && 'px-[var(--menu-item-content-inset,calc(var(--unit)*8))]',
    row.className,
    disabled && 'opacity-38 cursor-not-allowed hover:bg-transparent',
    selected && 'bg-state-selected text-on-surface',
    className,
  );

  const innerContent = (
    <>
      <Ripple disabled={disabled} />
      {selectionIndicator != null && (
        <span
          data-slot="menu-item-selection-indicator"
          aria-hidden="true"
          className="size-icon-sm [&>svg]:size-icon-sm pointer-events-none absolute top-1/2 z-10 flex -translate-y-1/2 items-center justify-center"
          style={{
            insetInlineStart:
              'max(0px, calc(var(--menu-item-content-inset, calc(var(--unit) * 8)) - var(--size-icon-sm) - var(--menu-item-indicator-gap, var(--spacing-1))))',
          }}
        >
          {selectionIndicator}
        </span>
      )}
      {icon && <div className={menuIconSlotClasses}>{icon}</div>}
      <span className="relative z-10 flex min-w-0 flex-1 translate-y-px items-center truncate">
        {label}
      </span>
      {trailingIcon && (
        <div className={cn(menuIconSlotClasses, 'text-on-surface-variant')}>{trailingIcon}</div>
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
  return <div className={cn('bg-outline-soft my-1 h-px', className)} role="separator" {...props} />;
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
