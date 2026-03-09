import React, { forwardRef, cloneElement, isValidElement } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn, Slot } from "@ui/lib/utils";
import {
  NavigationDrawerItemContent,
  getNavigationDrawerItemClasses,
} from "@ui/lib/navigation-visuals";
import { Ripple } from "./ripple";

const navigationDrawerVariants = cva(
  "flex flex-col h-full bg-surface-container border-r border-outline-variant/30 transition-transform duration-emphasized ease-emphasized overflow-y-auto",
  {
    variants: {
      modal: {
        true: "fixed inset-y-0 left-0 z-60 shadow-3 rounded-e-[2rem] w-[300px] max-w-[85vw] border-none",
        false: "fixed inset-y-0 left-0 z-30 w-[300px] rounded-e-none border-r-0",
      },
      open: {
        true: "translate-x-0 visible",
        false: "-translate-x-full invisible",
      },
    },
    defaultVariants: {
      modal: false,
      open: true,
    },
  }
);

interface DrawerProps extends VariantProps<typeof navigationDrawerVariants> {
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
      open = true,
      onClose,
      children,
      className,
      modal = false,
      style,
      onMouseEnter,
      onMouseLeave,
    },
    ref
  ) => {
    return (
      <aside
        ref={ref}
        className={cn(navigationDrawerVariants({ modal, open }), className)}
        style={style}
        onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onMouseEnter}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          onClose?.();
        }
      }}
      >
        {children}
      </aside>
    );
  }
);

NavigationDrawer.displayName = "NavigationDrawer";

// NavigationDrawerItem
interface NavigationDrawerItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> {
  active?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode | string;
  badge?: string | number | React.ReactNode;
  activeIcon?: React.ReactNode | string;
  href?: string;
  asChild?: boolean;
}

export const NavigationDrawerItem = forwardRef<
  HTMLButtonElement,
  NavigationDrawerItemProps
>(({ active, icon, activeIcon, badge, children, disabled, className, href, asChild, ...props }, ref) => {
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

  // asChild pattern: render user's Link component with merged props
  if (asChild && isValidElement(children)) {
    return (
      <div className="px-4 w-full">
        <Slot className={itemClasses} {...props}>
          {cloneElement(children as React.ReactElement, {}, innerContent)}
        </Slot>
      </div>
    );
  }

  if (href && !disabled) {
    return (
      <div className="px-4 w-full">
        <a
          href={href}
          className={itemClasses}
          aria-current={active ? "page" : undefined}
        >
          {innerContent}
        </a>
      </div>
    );
  }

  return (
    <div className="px-4 w-full">
      <button
        ref={ref}
        disabled={disabled ?? false}
        className={itemClasses}
        {...props}
      >
        {innerContent}
      </button>
    </div>
  );
});

NavigationDrawerItem.displayName = "NavigationDrawerItem";

// NavigationDrawerHeadline
export const NavigationDrawerHeadline = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "px-5 pt-4 pb-2 text-title-small font-semibold text-on-surface-variant",
      className
    )}
  >
    {children}
  </div>
);

// NavigationDrawerDivider
export const NavigationDrawerDivider = ({ className }: { className?: string }) => (
  <div className={cn("h-px bg-outline-variant/30 my-2 mx-4", className)} />
);
