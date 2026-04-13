import React, { isValidElement, cloneElement } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, focusRing, Slot } from '../lib/utils';
import { Ripple } from './ripple';

const navigationBarVariants = cva(
  'absolute bottom-0 left-0 right-0 h-20 bg-surface-container-low border-t border-outline-soft flex items-center justify-around px-4 pb-4 z-30',
  {
    variants: {
      variant: {
        default: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface NavigationBarProps extends VariantProps<typeof navigationBarVariants> {
  children: React.ReactNode;
  className?: string;
}

const NavigationBarRoot: React.FC<NavigationBarProps> = ({ variant, children, className }) => {
  return <nav className={cn(navigationBarVariants({ variant, className }))}>{children}</nav>;
};

export interface NavigationBarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  href?: string;
  asChild?: boolean;
  children?: React.ReactNode;
}

const NavigationBarItem: React.FC<NavigationBarItemProps> = ({
  icon,
  label,
  active,
  onClick,
  className,
  href,
  asChild,
  children,
}) => {
  const itemClasses = cn(
    'relative flex h-full min-w-16 flex-col items-center justify-center gap-1 px-2 group select-none focus-visible:outline-none',
    focusRing,
    className,
  );

  const innerContent = (
    <>
      <div className="relative mb-1 h-8 w-16">
        <div
          className={cn(
            'duration-medium ease-standard absolute inset-0 overflow-hidden rounded-button transition-all',
            active
              ? 'bg-secondary-container scale-x-100 opacity-100'
              : 'group-hover:bg-state-hover scale-x-50 bg-transparent opacity-0',
          )}
        >
          <Ripple center />
        </div>
        <div
          className={cn(
            'relative z-10 flex h-full w-full items-center justify-center transition-colors',
            active
              ? 'text-on-secondary-container'
              : 'text-on-surface-variant group-hover:text-on-surface',
          )}
        >
          {icon}
        </div>
      </div>
      <span
        className={cn(
          'text-label-medium font-medium transition-colors',
          active ? 'text-on-surface' : 'text-on-surface-variant group-hover:text-on-surface',
        )}
      >
        {label}
      </span>
    </>
  );

  if (asChild && children && isValidElement(children)) {
    return (
      <Slot className={itemClasses} aria-pressed={active}>
        {cloneElement(children as React.ReactElement, {}, innerContent)}
      </Slot>
    );
  }

  if (href) {
    return (
      <a href={href} className={itemClasses} aria-current={active ? 'page' : undefined}>
        {innerContent}
      </a>
    );
  }

  return (
    <button type="button" className={itemClasses} onClick={onClick} aria-pressed={active}>
      {innerContent}
    </button>
  );
};

export const NavigationBar = Object.assign(NavigationBarRoot, {
  Item: NavigationBarItem,
});
