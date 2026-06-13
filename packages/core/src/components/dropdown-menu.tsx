'use client';

import React, { useState, useRef, useEffect, useLayoutEffect, useId, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { cn, Slot } from '../lib/utils';
import { useControllableState } from '../lib/use-controllable-state';
import { getPortalLayerStyle } from '../lib/portal-layer';
import { Icon } from '../primitives/icon';
import { Menu, MenuItem, MenuDivider, MenuCheckboxItem, MenuRadioItem } from '../primitives/menu';

export interface DropdownMenuProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type DropdownMenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  menuId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
};

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenuContext(componentName: string) {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error(`${componentName} must be used within a DropdownMenu.`);
  }
  return context;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
}) => {
  const [isOpen = false, setIsOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const menuId = useId();
  const triggerRef = useRef<HTMLElement | null>(null);
  const contextValue = useMemo(
    () => ({
      open: isOpen,
      setOpen: setIsOpen,
      menuId,
      triggerRef,
    }),
    [isOpen, menuId, setIsOpen],
  );

  return (
    <DropdownMenuContext.Provider value={contextValue}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownMenuContext.Provider>
  );
};

export interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
  children,
  asChild,
  className,
}) => {
  const { open, setOpen, menuId, triggerRef } = useDropdownMenuContext('DropdownMenuTrigger');
  const localRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (triggerRef) {
      const refToAssign = asChild ? wrapperRef.current : localRef.current;
      if (refToAssign) {
        (triggerRef as { current: HTMLElement | null }).current = refToAssign;
      }
    }
  }, [triggerRef, asChild]);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
        e.preventDefault();
        setOpen(true);
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
    }
  };

  const triggerProps = {
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    'aria-expanded': open,
    'aria-haspopup': 'menu' as const,
    'aria-controls': open ? menuId : undefined,
  };

  if (asChild && React.isValidElement(children)) {
    return (
      <div ref={wrapperRef} className="inline-flex">
        <Slot className={className} {...triggerProps}>
          {children}
        </Slot>
      </div>
    );
  }

  return (
    <button
      ref={localRef}
      type="button"
      className={cn('inline-flex cursor-pointer', className)}
      {...triggerProps}
    >
      {children}
    </button>
  );
};

export type Side = 'top' | 'bottom' | 'left' | 'right';
export type Align = 'start' | 'center' | 'end';

export interface DropdownMenuContentProps {
  children: React.ReactNode;

  align?: Align;

  side?: Side;

  sideOffset?: number;

  alignOffset?: number;

  avoidCollisions?: boolean;

  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  className?: string;

  portal?: boolean;

  closeOnSelect?: boolean;
}

function computePosition(
  triggerRect: DOMRect,
  menuRect: { width: number; height: number },
  options: {
    side: Side;
    align: Align;
    sideOffset: number;
    alignOffset: number;
    avoidCollisions: boolean;
    collisionPadding: { top: number; right: number; bottom: number; left: number };
  },
): { top: number; left: number; actualSide: Side; actualAlign: Align } {
  const { side, align, sideOffset, alignOffset, avoidCollisions, collisionPadding } = options;
  const { width: menuWidth, height: menuHeight } = menuRect;

  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const space = {
    top: triggerRect.top - collisionPadding.top,
    bottom: viewport.height - triggerRect.bottom - collisionPadding.bottom,
    left: triggerRect.left - collisionPadding.left,
    right: viewport.width - triggerRect.right - collisionPadding.right,
  };

  let actualSide = side;
  if (avoidCollisions) {
    const sideSpace = {
      top: space.top,
      bottom: space.bottom,
      left: space.left,
      right: space.right,
    };

    const neededSpace = {
      top: menuHeight + sideOffset,
      bottom: menuHeight + sideOffset,
      left: menuWidth + sideOffset,
      right: menuWidth + sideOffset,
    };

    if (sideSpace[side] < neededSpace[side]) {
      const oppositeSide: Record<Side, Side> = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left',
      };
      const opposite = oppositeSide[side];

      if (sideSpace[opposite] > sideSpace[side]) {
        actualSide = opposite;
      } else {
        const perpendicularSides: Record<Side, [Side, Side]> = {
          top: ['left', 'right'],
          bottom: ['left', 'right'],
          left: ['top', 'bottom'],
          right: ['top', 'bottom'],
        };
        const [perp1, perp2] = perpendicularSides[side];

        if (sideSpace[perp1] >= neededSpace[perp1] && sideSpace[perp1] > sideSpace[actualSide]) {
          actualSide = perp1;
        } else if (
          sideSpace[perp2] >= neededSpace[perp2] &&
          sideSpace[perp2] > sideSpace[actualSide]
        ) {
          actualSide = perp2;
        }
      }
    }
  }

  let top = 0;
  let left = 0;

  const isVertical = actualSide === 'top' || actualSide === 'bottom';

  if (actualSide === 'top') {
    top = triggerRect.top - menuHeight - sideOffset;
  } else if (actualSide === 'bottom') {
    top = triggerRect.bottom + sideOffset;
  } else if (actualSide === 'left') {
    left = triggerRect.left - menuWidth - sideOffset;
  } else if (actualSide === 'right') {
    left = triggerRect.right + sideOffset;
  }

  let actualAlign = align;

  if (isVertical) {
    if (align === 'start') {
      left = triggerRect.left + alignOffset;
    } else if (align === 'center') {
      left = triggerRect.left + (triggerRect.width - menuWidth) / 2 + alignOffset;
    } else {
      left = triggerRect.right - menuWidth - alignOffset;
    }

    if (avoidCollisions) {
      const minLeft = collisionPadding.left;
      const maxLeft = viewport.width - menuWidth - collisionPadding.right;

      if (left < minLeft) {
        left = minLeft;
        actualAlign = 'start';
      } else if (left > maxLeft) {
        left = maxLeft;
        actualAlign = 'end';
      }
    }
  } else {
    if (align === 'start') {
      top = triggerRect.top + alignOffset;
    } else if (align === 'center') {
      top = triggerRect.top + (triggerRect.height - menuHeight) / 2 + alignOffset;
    } else {
      top = triggerRect.bottom - menuHeight - alignOffset;
    }

    if (avoidCollisions) {
      const minTop = collisionPadding.top;
      const maxTop = viewport.height - menuHeight - collisionPadding.bottom;

      if (top < minTop) {
        top = minTop;
        actualAlign = 'start';
      } else if (top > maxTop) {
        top = maxTop;
        actualAlign = 'end';
      }
    }
  }

  return { top, left, actualSide, actualAlign };
}

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  children,
  align = 'start',
  side = 'bottom',
  sideOffset = 4,
  alignOffset = 0,
  avoidCollisions = true,
  collisionPadding = 8,
  className,
  portal = true,
  closeOnSelect = false,
}) => {
  const { open, setOpen, menuId, triggerRef } = useDropdownMenuContext('DropdownMenuContent');
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [computedPlacement, setComputedPlacement] = useState({ side, align });
  const [isPositioned, setIsPositioned] = useState(false);

  const normalizedPadding = useMemo(() => {
    if (typeof collisionPadding === 'number') {
      return {
        top: collisionPadding,
        right: collisionPadding,
        bottom: collisionPadding,
        left: collisionPadding,
      };
    }
    return {
      top: collisionPadding.top ?? 8,
      right: collisionPadding.right ?? 8,
      bottom: collisionPadding.bottom ?? 8,
      left: collisionPadding.left ?? 8,
    };
  }, [collisionPadding]);

  useLayoutEffect(() => {
    if (!open) {
      setIsPositioned(false);
      return;
    }

    if (!open || !triggerRef.current) return;

    const updatePosition = () => {
      const triggerRect = triggerRef.current!.getBoundingClientRect();
      const menuWidth = ref.current?.offsetWidth || 200;
      const menuHeight = ref.current?.offsetHeight || 200;

      const result = computePosition(
        triggerRect,
        { width: menuWidth, height: menuHeight },
        {
          side,
          align,
          sideOffset,
          alignOffset,
          avoidCollisions,
          collisionPadding: normalizedPadding,
        },
      );

      setPosition({ top: result.top, left: result.left });
      setComputedPlacement({ side: result.actualSide, align: result.actualAlign });
      setIsPositioned(true);
    };

    if (portal) {
      setIsPositioned(false);
    }

    updatePosition();

    if (portal) {
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [
    open,
    triggerRef,
    side,
    align,
    sideOffset,
    alignOffset,
    avoidCollisions,
    normalizedPadding,
    portal,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (ref.current && ref.current.contains(target)) return;
      if (triggerRef.current && triggerRef.current.contains(target)) return;
      if (target instanceof HTMLElement) {
        const subContent = target.closest('[data-dropdown-menu-subcontent-owner]');
        if (subContent?.getAttribute('data-dropdown-menu-subcontent-owner') === menuId) {
          return;
        }
      }
      setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, setOpen, triggerRef]);

  if (!open) return null;

  const handleContentClick = (event: React.MouseEvent) => {
    if (!closeOnSelect) return;
    const target = event.target as HTMLElement | null;
    if (!target) return;
    const item = target.closest('[role="menuitem"]');
    if (!item) return;
    if (item.getAttribute('aria-disabled') === 'true') return;
    setOpen(false);
  };

  const getPositionClasses = () => {
    if (portal) return 'fixed z-[var(--z-popover,2000)]';

    const classes = ['absolute z-[var(--z-popover,2000)]'];
    const actualSide = avoidCollisions ? computedPlacement.side : side;
    const actualAlign = avoidCollisions ? computedPlacement.align : align;

    switch (actualSide) {
      case 'top':
        classes.push('bottom-full mb-1');
        if (actualAlign === 'start') classes.push('left-0');
        else if (actualAlign === 'end') classes.push('right-0');
        else classes.push('left-1/2 -translate-x-1/2');
        break;
      case 'bottom':
        classes.push('top-full mt-1');
        if (actualAlign === 'start') classes.push('left-0');
        else if (actualAlign === 'end') classes.push('right-0');
        else classes.push('left-1/2 -translate-x-1/2');
        break;
      case 'left':
        classes.push('right-full mr-1');
        if (actualAlign === 'start') classes.push('top-0');
        else if (actualAlign === 'end') classes.push('bottom-0');
        else classes.push('top-1/2 -translate-y-1/2');
        break;
      case 'right':
        classes.push('left-full ml-1');
        if (actualAlign === 'start') classes.push('top-0');
        else if (actualAlign === 'end') classes.push('bottom-0');
        else classes.push('top-1/2 -translate-y-1/2');
        break;
    }

    return classes.join(' ');
  };

  const content = (
    <div
      ref={ref}
      id={menuId}
      role="menu"
      aria-orientation="vertical"
      data-side={computedPlacement.side}
      data-align={computedPlacement.align}
      className={cn(getPositionClasses(), portal && 'transition-none')}
      style={
        portal
          ? {
              top: position.top,
              left: position.left,
              visibility: isPositioned ? 'visible' : 'hidden',
              ...getPortalLayerStyle(triggerRef.current),
            }
          : undefined
      }
    >
      <Menu
        open={true}
        onClick={handleContentClick}
        className={cn(
          'animate-surface-enter shadow-2 border-outline-soft relative w-full overflow-visible border',
          className,
        )}
      >
        {children}
      </Menu>
    </div>
  );

  if (portal && typeof document !== 'undefined') {
    return createPortal(content, document.body);
  }

  return content;
};

export const DropdownMenuItem = MenuItem;
export const DropdownMenuCheckboxItem = MenuCheckboxItem;
export const DropdownMenuRadioItem = MenuRadioItem;
export const DropdownMenuSeparator = MenuDivider;

export interface DropdownMenuSubProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type DropdownMenuSubContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  menuId: string;
  parentMenuId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  openSubmenu: () => void;
  closeSubmenu: () => void;
};

const DropdownMenuSubContext = React.createContext<DropdownMenuSubContextValue | null>(null);

function useDropdownMenuSubContext(componentName: string) {
  const context = React.useContext(DropdownMenuSubContext);
  if (!context) {
    throw new Error(`${componentName} must be used within a DropdownMenuSub.`);
  }
  return context;
}

export const DropdownMenuSub: React.FC<DropdownMenuSubProps> = ({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
}) => {
  const { menuId: parentMenuId } = useDropdownMenuContext('DropdownMenuSub');
  const [isOpen = false, setIsOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const subMenuId = useId();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const openSubmenu = React.useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  }, [setIsOpen]);

  const closeSubmenu = React.useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  }, [setIsOpen]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
  const contextValue = useMemo(
    () => ({
      open: isOpen,
      setOpen: setIsOpen,
      menuId: subMenuId,
      parentMenuId,
      triggerRef,
      openSubmenu,
      closeSubmenu,
    }),
    [closeSubmenu, isOpen, openSubmenu, parentMenuId, setIsOpen, subMenuId],
  );

  return (
    <DropdownMenuSubContext.Provider value={contextValue}>
      <div className="relative">{children}</div>
    </DropdownMenuSubContext.Provider>
  );
};

export interface DropdownMenuSubTriggerProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const DropdownMenuSubTrigger: React.FC<DropdownMenuSubTriggerProps> = ({
  children,
  icon,
  className,
  disabled = false,
}) => {
  const { open, menuId, triggerRef, openSubmenu, closeSubmenu } =
    useDropdownMenuSubContext('DropdownMenuSubTrigger');
  const handleMouseEnter = () => {
    if (disabled) return;
    openSubmenu?.();
  };

  const handleMouseLeave = () => {
    closeSubmenu?.();
  };

  return (
    <div ref={triggerRef as React.RefObject<HTMLDivElement | null>}>
      <MenuItem
        icon={icon}
        trailingIcon={<Icon symbol="chevron_right" size="sm" />}
        className={className}
        disabled={disabled}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
      >
        {children}
      </MenuItem>
    </div>
  );
};

export interface DropdownMenuSubContentProps {
  children: React.ReactNode;
  className?: string;

  sideOffset?: number;

  avoidCollisions?: boolean;

  collisionPadding?: number;
}

function computeSubmenuPosition(
  triggerRect: DOMRect,
  menuRect: { width: number; height: number },
  options: {
    sideOffset: number;
    avoidCollisions: boolean;
    collisionPadding: number;
  },
): {
  top: number;
  left: number;
  side: 'left' | 'right';
} {
  const { sideOffset, avoidCollisions, collisionPadding } = options;
  const { width: menuWidth, height: menuHeight } = menuRect;

  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const spaceRight = viewport.width - triggerRect.right - collisionPadding;
  const spaceLeft = triggerRect.left - collisionPadding;

  let side: 'left' | 'right' = 'right';
  let left = triggerRect.right + sideOffset;

  if (avoidCollisions) {
    const neededWidth = menuWidth + sideOffset;

    if (spaceRight < neededWidth && spaceLeft > spaceRight) {
      side = 'left';
      left = triggerRect.left - menuWidth - sideOffset;
    }
  }

  let top = triggerRect.top;

  if (avoidCollisions) {
    const minTop = collisionPadding;
    const maxTop = viewport.height - menuHeight - collisionPadding;

    if (top < minTop) {
      top = minTop;
    } else if (top > maxTop) {
      top = maxTop;
    }

    if (top + menuHeight > viewport.height - collisionPadding) {
      top = Math.max(collisionPadding, triggerRect.bottom - menuHeight);
    }
  }

  return { top, left, side };
}

export const DropdownMenuSubContent: React.FC<DropdownMenuSubContentProps> = ({
  children,
  className,
  sideOffset = 4,
  avoidCollisions = true,
  collisionPadding = 8,
}) => {
  const { open, menuId, parentMenuId, triggerRef, openSubmenu, closeSubmenu } =
    useDropdownMenuSubContext('DropdownMenuSubContent');
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, side: 'right' as 'left' | 'right' });
  const [isPositioned, setIsPositioned] = useState(false);

  useLayoutEffect(() => {
    if (!open) {
      setIsPositioned(false);
      return;
    }

    if (!open || !triggerRef.current) return;

    const updatePosition = () => {
      const triggerRect = triggerRef.current!.getBoundingClientRect();
      const menuWidth = ref.current?.offsetWidth || 180;
      const menuHeight = ref.current?.offsetHeight || 150;

      const result = computeSubmenuPosition(
        triggerRect,
        { width: menuWidth, height: menuHeight },
        { sideOffset, avoidCollisions, collisionPadding },
      );

      setPosition(result);
      setIsPositioned(true);
    };

    setIsPositioned(false);
    updatePosition();

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open, triggerRef, sideOffset, avoidCollisions, collisionPadding]);

  if (!open) return null;

  const content = (
    <div
      ref={ref}
      id={menuId}
      role="menu"
      aria-orientation="vertical"
      data-dropdown-menu-subcontent-owner={parentMenuId}
      data-side={position.side}
      className={cn('fixed z-[var(--z-popover,2000)]', 'transition-none')}
      style={{
        top: position.top,
        left: position.left,
        visibility: isPositioned ? 'visible' : 'hidden',
        ...getPortalLayerStyle(triggerRef.current),
      }}
      onMouseEnter={openSubmenu}
      onMouseLeave={closeSubmenu}
    >
      <Menu
        open={true}
        className={cn(
          'animate-surface-enter shadow-2 border-outline-soft min-w-40 border',
          className,
        )}
      >
        {children}
      </Menu>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(content, document.body);
  }

  return content;
};
