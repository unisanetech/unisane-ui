import React, { forwardRef, cloneElement, isValidElement } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, Slot } from '../lib/utils';
import { useControllableState } from '../lib/use-controllable-state';
import {
  NavigationDrawerItemContent,
  getNavigationDrawerItemClasses,
} from '../lib/navigation-visuals';
import { Ripple } from './ripple';

const navigationDrawerVariants = cva(
  'flex flex-col h-full bg-surface-container-low border-r border-outline-subtle transition-transform duration-emphasized ease-emphasized overflow-y-auto',
  {
    variants: {
      modal: {
        true: 'fixed inset-y-0 left-0 z-60 shadow-3 rounded-e-[2rem] w-navigation-drawer max-w-[85vw] border-none',
        false: 'fixed inset-y-0 left-0 z-30 w-navigation-drawer rounded-e-none border-r-0',
      },
      open: {
        true: 'translate-x-0 visible',
        false: '-translate-x-full invisible',
      },
    },
    defaultVariants: {
      modal: false,
      open: true,
    },
  },
);

interface DrawerProps extends Omit<VariantProps<typeof navigationDrawerVariants>, 'open'> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const NavigationDrawer = forwardRef<HTMLElement, DrawerProps>(
  (
    {
      open,
      defaultOpen = true,
      onOpenChange,
      onClose,
      children,
      className,
      modal = false,
      style,
      onMouseEnter,
      onMouseLeave,
    },
    ref,
  ) => {
    const [openState = true, setOpenState] = useControllableState<boolean>({
      value: open,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });

    const handleClose = () => {
      if (!openState) return;
      setOpenState(false);
      onClose?.();
    };

    return (
      <aside
        ref={ref}
        className={cn(navigationDrawerVariants({ modal, open: openState }), className)}
        style={style}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onMouseEnter}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            handleClose();
          }
        }}
      >
        {children}
      </aside>
    );
  },
);

NavigationDrawer.displayName = 'NavigationDrawer';

interface NavigationDrawerItemProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'disabled'
> {
  active?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode | string;
  badge?: string | number | React.ReactNode;
  activeIcon?: React.ReactNode | string;
  href?: string;
  asChild?: boolean;
}

export const NavigationDrawerItem = forwardRef<HTMLButtonElement, NavigationDrawerItemProps>(
  (
    { active, icon, activeIcon, badge, children, disabled, className, href, asChild, ...props },
    ref,
  ) => {
    const innerContent = (
      <NavigationDrawerItemContent
        icon={icon}
        activeIcon={activeIcon}
        badge={badge}
        active={active}
        disabled={disabled}
        ripple={<Ripple disabled={disabled ?? false} />}
      >
        {children}
      </NavigationDrawerItemContent>
    );

    const itemClasses = getNavigationDrawerItemClasses({
      active,
      disabled,
      className,
    });

    if (asChild && isValidElement(children)) {
      return (
        <div className="w-full px-4">
          <Slot className={itemClasses} {...props}>
            {cloneElement(children as React.ReactElement, {}, innerContent)}
          </Slot>
        </div>
      );
    }

    if (href && !disabled) {
      return (
        <div className="w-full px-4">
          <a href={href} className={itemClasses} aria-current={active ? 'page' : undefined}>
            {innerContent}
          </a>
        </div>
      );
    }

    return (
      <div className="w-full px-4">
        <button ref={ref} disabled={disabled ?? false} className={itemClasses} {...props}>
          {innerContent}
        </button>
      </div>
    );
  },
);

NavigationDrawerItem.displayName = 'NavigationDrawerItem';

export const NavigationDrawerHeadline = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      'text-title-small text-on-surface-variant px-5 pt-4 pb-2 font-semibold',
      className,
    )}
  >
    {children}
  </div>
);

export const NavigationDrawerDivider = ({ className }: { className?: string }) => (
  <div className={cn('bg-outline-subtle mx-4 my-2 h-px', className)} />
);
