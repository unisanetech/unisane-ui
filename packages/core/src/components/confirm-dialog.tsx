'use client';

import React, { forwardRef, useState } from 'react';
import { Dialog, type DialogTitle } from './dialog';
import { Button } from './button';
import { Icon } from './icon';
import { useControllableState } from '../lib/use-controllable-state';

export interface ConfirmDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: DialogTitle;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'neutral' | 'danger' | 'warning';
  onConfirm: () => boolean | void | Promise<boolean | void>;
  onConfirmError?: (error: unknown) => void;
  onCancel?: () => void;
  loading?: boolean;
  confirmDisabled?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const toneConfig = {
  neutral: {
    icon: 'help',
    iconClass: 'text-primary',
    confirmClass: '',
  },
  danger: {
    icon: 'warning',
    iconClass: 'text-error',
    confirmClass: 'bg-error text-on-error',
  },
  warning: {
    icon: 'warning',
    iconClass: 'text-warning',
    confirmClass: 'bg-warning text-on-warning',
  },
} as const;

export const ConfirmDialog = forwardRef<HTMLDivElement, ConfirmDialogProps>(
  (
    {
      open,
      defaultOpen = false,
      onOpenChange,
      title,
      description,
      confirmLabel = 'Confirm',
      cancelLabel = 'Cancel',
      tone = 'neutral',
      onConfirm,
      onConfirmError,
      onCancel,
      loading = false,
      confirmDisabled = false,
      icon,
      children,
      className,
    },
    ref,
  ) => {
    const config = toneConfig[tone];
    const [isConfirming, setIsConfirming] = useState(false);
    const [isOpen = false, setIsOpen] = useControllableState<boolean>({
      value: open,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });
    const isLoading = loading || isConfirming;

    const handleCancel = () => {
      if (isLoading) return;
      try {
        onCancel?.();
      } finally {
        setIsOpen(false);
      }
    };

    const handleOpenChange = (nextOpen: boolean) => {
      if (nextOpen) {
        setIsOpen(true);
        return;
      }
      handleCancel();
    };

    const handleConfirm = async () => {
      if (isLoading || confirmDisabled) return;

      setIsConfirming(true);
      try {
        const result = await onConfirm();
        if (result !== false) {
          setIsOpen(false);
        }
      } catch (error) {
        onConfirmError?.(error);
      } finally {
        setIsConfirming(false);
      }
    };

    const dialogIcon = icon ?? <Icon symbol={config.icon} size="md" className={config.iconClass} />;

    return (
      <Dialog
        ref={ref}
        open={isOpen}
        onOpenChange={handleOpenChange}
        title={title}
        description={description}
        icon={dialogIcon}
        className={className}
        role="alertdialog"
        showCloseButton={false}
        actions={
          <>
            <Button variant="text" onClick={handleCancel} disabled={isLoading}>
              {cancelLabel}
            </Button>
            <Button
              variant="filled"
              onClick={() => void handleConfirm()}
              loading={isLoading}
              disabled={confirmDisabled || isLoading}
              className={config.confirmClass}
            >
              {confirmLabel}
            </Button>
          </>
        }
      >
        {children}
      </Dialog>
    );
  },
);

ConfirmDialog.displayName = 'ConfirmDialog';
