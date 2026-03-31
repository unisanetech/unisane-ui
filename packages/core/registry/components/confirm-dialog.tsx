'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

export interface ConfirmDialogProps {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  title: string;

  description?: string;

  confirmLabel?: string;

  cancelLabel?: string;

  variant?: 'default' | 'danger' | 'warning';

  onConfirm: () => void | Promise<void>;

  onCancel?: () => void;

  loading?: boolean;

  disabled?: boolean;

  icon?: React.ReactNode;

  children?: React.ReactNode;

  className?: string;
}

const variantConfig = {
  default: {
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
      onOpenChange,
      title,
      description,
      confirmLabel = 'Confirm',
      cancelLabel = 'Cancel',
      variant = 'default',
      onConfirm,
      onCancel,
      loading = false,
      disabled = false,
      icon,
      children,
      className,
    },
    ref,
  ) => {
    const config = variantConfig[variant];

    const handleOpenChange = (nextOpen: boolean) => {
      if (!nextOpen && loading) {
        return;
      }
      onOpenChange(nextOpen);
    };

    const handleClose = () => {
      handleOpenChange(false);
    };

    const handleCancel = () => {
      if (onCancel) {
        onCancel();
      } else {
        handleClose();
      }
    };

    const handleConfirm = async () => {
      await onConfirm();
    };

    const dialogIcon = icon ?? <Icon symbol={config.icon} size="md" className={config.iconClass} />;

    return (
      <Dialog
        ref={ref}
        open={open}
        onOpenChange={handleOpenChange}
        title={title}
        description={description}
        icon={dialogIcon}
        className={className}
        actions={
          <>
            <Button variant="text" onClick={handleCancel} disabled={loading}>
              {cancelLabel}
            </Button>
            <Button
              variant="filled"
              onClick={handleConfirm}
              loading={loading}
              disabled={disabled || loading}
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

export default ConfirmDialog;
