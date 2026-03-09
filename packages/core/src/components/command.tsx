'use client';

import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { cn } from '@ui/lib/utils';
import { Icon } from '@ui/primitives/icon';
import { Dialog } from './dialog';

// ─── COMMAND ROOT ─────────────────────────────────────────────────────────────

const Command = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'bg-surface-container text-on-surface flex h-full w-full flex-col overflow-hidden rounded-sm',
      className,
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

// ─── COMMAND DIALOG ───────────────────────────────────────────────────────────

export interface CommandDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

const CommandDialog = ({ children, open, defaultOpen, onOpenChange }: CommandDialogProps) => {
  return (
    <Dialog
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      className="overflow-hidden p-0 shadow-lg"
    >
      <Command className="[&_[cmdk-group-heading]]:text-on-surface-variant [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[data-cmdk-input-wrapper]_svg]:h-5 [&_[data-cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
        {children}
      </Command>
    </Dialog>
  );
};

// ─── COMMAND INPUT ────────────────────────────────────────────────────────────

const CommandInput = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="border-outline-variant flex items-center border-b px-4" data-cmdk-input-wrapper="">
    <Icon symbol="search" size="sm" className="mr-2 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'text-body-medium placeholder:text-on-surface-variant flex h-10 w-full bg-transparent outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

// ─── COMMAND LIST ─────────────────────────────────────────────────────────────

const CommandList = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn('max-h-[300px] overflow-x-hidden overflow-y-auto', className)}
    {...props}
  />
));
CommandList.displayName = CommandPrimitive.List.displayName;

// ─── COMMAND EMPTY ────────────────────────────────────────────────────────────

const CommandEmpty = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="text-body-medium text-on-surface-variant py-6 text-center"
    {...props}
  />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

// ─── COMMAND GROUP ────────────────────────────────────────────────────────────

const CommandGroup = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'text-on-surface [&_[cmdk-group-heading]]:text-label-small [&_[cmdk-group-heading]]:text-on-surface-variant overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-medium',
      className,
    )}
    {...props}
  />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

// ─── COMMAND SEPARATOR ────────────────────────────────────────────────────────

const CommandSeparator = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('bg-outline-variant -mx-1 h-px', className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

// ─── COMMAND ITEM ─────────────────────────────────────────────────────────────

const CommandItem = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      'text-body-medium data-[selected=true]:bg-on-surface/6 data-[selected=true]:text-on-surface relative flex h-10 cursor-default items-center rounded-sm px-3 outline-none select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
      className,
    )}
    {...props}
  />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

// ─── COMMAND SHORTCUT ─────────────────────────────────────────────────────────

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn('text-label-small text-on-surface-variant ml-auto tracking-widest', className)}
      {...props}
    />
  );
};
CommandShortcut.displayName = 'CommandShortcut';

// ─── EXPORTS ──────────────────────────────────────────────────────────────────

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
