'use client';

import React, { forwardRef, useEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import {
  getVisibleNavigationItems,
  NavigationAction,
  useNavigationSelection,
} from '@/lib/navigation-action';
import {
  NavigationDrawerItemContent,
  getNavigationDrawerItemClasses,
} from '@/lib/navigation-visuals';
import { useControllableState } from '@/lib/use-controllable-state';
import { useOverlayBehavior } from '@/lib/use-overlay-behavior';
import { useScrollLock } from '@/hooks/use-scroll-lock';
import type { NavigationPresentationProps } from '@/types/navigation';
import { Ripple } from '@/components/ui/ripple';

export type NavigationDrawerVariant = 'persistent' | 'modal';
export type NavigationDrawerSide = 'start' | 'end';

export interface NavigationDrawerProps
  extends
    NavigationPresentationProps,
    Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'defaultValue' | 'onSelect'> {
  'aria-label': string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: NavigationDrawerVariant;
  side?: NavigationDrawerSide;
  headline?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  triggerRef?: RefObject<HTMLElement | null>;
}

export const NavigationDrawer = forwardRef<HTMLElement, NavigationDrawerProps>(
  (
    {
      items,
      value,
      defaultValue,
      onValueChange,
      onItemSelect,
      renderLink,
      open,
      defaultOpen = true,
      onOpenChange,
      variant = 'persistent',
      side = 'start',
      headline,
      header,
      footer,
      className,
      triggerRef,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const panelRef = useRef<HTMLElement | null>(null);
    const overlayRootRef = useRef<HTMLDivElement | null>(null);
    const [mounted, setMounted] = useState(false);
    const [isOpen = true, setIsOpen] = useControllableState<boolean>({
      value: open,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });
    const { currentValue, selectItem } = useNavigationSelection({
      value,
      defaultValue,
      onValueChange,
      onItemSelect,
    });
    const isModal = variant === 'modal';

    useEffect(() => setMounted(true), []);

    useScrollLock(isModal && isOpen);
    useOverlayBehavior({
      open: isModal && isOpen && mounted,
      contentRef: panelRef,
      rootRef: overlayRootRef,
      triggerRef,
      onDismiss: () => setIsOpen(false),
      modal: true,
      dismissOnInteractOutside: true,
    });

    const setPanelRef = (node: HTMLElement | null) => {
      panelRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    const panel = (
      <nav
        ref={setPanelRef}
        className={cn(
          'bg-surface-container-low border-outline-soft duration-emphasized ease-emphasized w-navigation-drawer flex h-full max-w-[85vw] flex-col overflow-y-auto border-r transition-transform',
          side === 'end' && 'border-r-0 border-l',
          !isOpen && side === 'start' && 'invisible -translate-x-full',
          !isOpen && side === 'end' && 'invisible translate-x-full',
          isModal && 'shadow-3 relative z-10',
          isModal && side === 'start' && 'rounded-e-[2rem] border-none',
          isModal && side === 'end' && 'rounded-s-[2rem] border-none',
          className,
        )}
        aria-label={ariaLabel}
        {...props}
      >
        {header ? <div className="px-4 pt-4">{header}</div> : null}
        {headline ? (
          <div className="text-title-small text-on-surface-variant px-5 pt-4 pb-2 font-semibold">
            {headline}
          </div>
        ) : null}
        <div className="flex flex-1 flex-col gap-1 py-2">
          {getVisibleNavigationItems(items).map((item) => {
            const active = currentValue === item.id;
            return (
              <div key={item.id} className="w-full px-4">
                <NavigationAction
                  item={item}
                  active={active}
                  onActivate={(selectedItem) => {
                    selectItem(selectedItem);
                    if (isModal) setIsOpen(false);
                  }}
                  renderLink={renderLink}
                  className={getNavigationDrawerItemClasses({
                    active,
                    disabled: item.disabled,
                  })}
                >
                  <NavigationDrawerItemContent
                    icon={item.icon}
                    activeIcon={item.activeIcon}
                    badge={item.badge}
                    active={active}
                    disabled={item.disabled}
                    ripple={<Ripple disabled={item.disabled ?? false} />}
                  >
                    {item.label}
                  </NavigationDrawerItemContent>
                </NavigationAction>
              </div>
            );
          })}
        </div>
        {footer ? <div className="mt-auto px-4 py-4">{footer}</div> : null}
      </nav>
    );

    if (!isModal) return panel;
    if (!isOpen || !mounted || typeof document === 'undefined') return null;

    return createPortal(
      <div
        ref={overlayRootRef}
        className={cn(
          'fixed inset-0 z-[var(--z-modal,3000)] flex',
          side === 'end' ? 'justify-end' : 'justify-start',
        )}
        role="presentation"
      >
        <div
          className="bg-scrim absolute inset-0"
          aria-hidden="true"
          onMouseDown={() => setIsOpen(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          className="relative z-10 h-full"
        >
          {panel}
        </div>
      </div>,
      document.body,
    );
  },
);

NavigationDrawer.displayName = 'NavigationDrawer';
