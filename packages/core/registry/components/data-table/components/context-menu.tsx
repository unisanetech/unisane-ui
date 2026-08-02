'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import type { DataTableContextMenuAction, DataTableContextMenuContext } from '@/components/ui/data-table/types';
import { useContextMenuBehavior } from '@/components/ui/data-table/components/context-menu-behavior';

export type DataTableContextMenuState<T> = {
  open: boolean;
  context: DataTableContextMenuContext<T> | null;
  actions: DataTableContextMenuAction<T>[];
};

type DataTableContextMenuProps<T> = {
  state: DataTableContextMenuState<T>;
  onClose: () => void;
};

export function DataTableContextMenu<T>({ state, onClose }: DataTableContextMenuProps<T>) {
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMenuKeyDown = useContextMenuBehavior({ open: state.open, menuRef, onClose });

  useEffect(() => {
    if (!state.open || !state.context || !menuRef.current) return;

    const menu = menuRef.current;
    const rect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    let { x, y } = state.context.position;

    if (x + rect.width > viewportWidth - 8) x = viewportWidth - rect.width - 8;
    if (y + rect.height > viewportHeight - 8) y = viewportHeight - rect.height - 8;

    menu.style.left = `${Math.max(8, x)}px`;
    menu.style.top = `${Math.max(8, y)}px`;
  }, [state.context, state.open]);

  if (
    !state.open ||
    !state.context ||
    state.actions.length === 0 ||
    typeof document === 'undefined'
  ) {
    return null;
  }

  const visibleActions = state.actions.filter((action) => !action.hidden);
  if (!visibleActions.length) return null;

  return createPortal(
    <div
      ref={menuRef}
      className={cn(
        'fixed z-[var(--z-popover,2500)] min-w-56 overflow-hidden rounded-sm',
        'border-outline-soft bg-surface shadow-2 border py-2',
        'animate-in fade-in-0 zoom-in-95 duration-100',
      )}
      style={{
        left: state.context.position.x,
        top: state.context.position.y,
      }}
      role="menu"
      aria-orientation="vertical"
      tabIndex={-1}
      onKeyDown={handleMenuKeyDown}
    >
      {visibleActions.map((action, index) => (
        <React.Fragment key={action.key}>
          {action.separatorBefore || (index > 0 && visibleActions[index - 1]?.separatorAfter) ? (
            <DropdownMenuSeparator />
          ) : null}
          <DropdownMenuItem
            icon={action.icon}
            disabled={action.disabled}
            className={action.tone === 'danger' ? 'text-error' : undefined}
            onClick={() => {
              if (action.disabled) return;
              void action.onSelect(state.context!);
              onClose();
            }}
          >
            {action.label}
          </DropdownMenuItem>
        </React.Fragment>
      ))}
    </div>,
    document.body,
  );
}
