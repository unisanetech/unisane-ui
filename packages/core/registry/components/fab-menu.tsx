'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Fab } from './fab';
import { Icon } from '@/primitives/icon';
import { useControllableState } from '@/lib/use-controllable-state';

export interface FabAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export interface FabMenuProps {
  mainIcon?: React.ReactNode;
  activeIcon?: React.ReactNode;
  actions: FabAction[];
  className?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  'aria-label'?: string;
}

export const FabMenu: React.FC<FabMenuProps> = ({
  mainIcon = <Icon symbol="add" />,
  activeIcon = <Icon symbol="close" />,
  actions,
  className,
  open,
  defaultOpen = false,
  onOpenChange,
  'aria-label': ariaLabel = 'Actions menu',
}) => {
  const [openState, setOpenState] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const isOpen = openState ?? false;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenState(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpenState(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, setOpenState]);

  return (
    <div
      ref={containerRef}
      className={cn('relative z-50 flex flex-col items-end gap-4', className)}
    >
      <div
        className={cn(
          'duration-medium ease-emphasized flex flex-col items-end gap-3 transition-all',
          isOpen
            ? 'visible translate-y-0 opacity-100'
            : 'pointer-events-none invisible translate-y-10 opacity-0',
        )}
        role="menu"
        aria-label={ariaLabel}
        aria-hidden={!isOpen}
      >
        {actions.map((action, index) => (
          <div key={index} className="group flex items-center gap-3" role="none">
            <span
              className="bg-inverse-surface text-inverse-on-surface text-label-small shadow-1 rounded-sm px-2 py-1 font-medium whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            >
              {action.label}
            </span>
            <Fab
              size="sm"
              variant="secondary"
              icon={action.icon}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
                setOpenState(false);
              }}
              aria-label={action.label}
              role="menuitem"
              tabIndex={isOpen ? 0 : -1}
            />
          </div>
        ))}
      </div>

      <Fab
        variant={isOpen ? 'tertiary' : 'primary'}
        size="md"
        className={cn(
          'duration-emphasized transition-transform',
          isOpen ? 'rotate-90' : 'rotate-0',
        )}
        onClick={() => setOpenState(!isOpen)}
        icon={isOpen ? activeIcon : mainIcon}
        aria-label={isOpen ? 'Close menu' : ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      />
    </div>
  );
};
