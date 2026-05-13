'use client';

import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Icon } from '@/primitives/icon';
import { Button } from '@/components/ui/button';
import { Ripple } from '@/components/ui/ripple';

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';
export type ToastPosition =
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'top-right'
  | 'top-left'
  | 'top-center';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface Toast {
  id: string;
  message: string;
  description?: string;
  variant?: ToastVariant;
  icon?: React.ReactNode;
  action?: ToastAction;
  duration?: number;
  dismissible?: boolean;
}

export interface ToastOptions {
  message: string;
  description?: string | undefined;
  variant?: ToastVariant;
  icon?: React.ReactNode;
  action?: ToastAction;
  duration?: number | undefined;
  dismissible?: boolean | undefined;
}

const toastVariants = cva(
  'pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-md shadow-4 min-w-72 max-w-100 border transition-all duration-medium ease-emphasized',
  {
    variants: {
      variant: {
        default: 'bg-inverse-surface text-inverse-on-surface border-transparent',
        success:
          'bg-success-container text-on-success-container border-success [&_.toast-icon]:text-on-success-container',
        error:
          'bg-error-container text-on-error-container border-error [&_.toast-icon]:text-on-error-container',
        warning:
          'bg-warning-container text-on-warning-container border-warning [&_.toast-icon]:text-on-warning-container',
        info: 'bg-info-container text-on-info-container border-info [&_.toast-icon]:text-on-info-container',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const positionClasses: Record<ToastPosition, string> = {
  'bottom-right': 'bottom-6 right-6 items-end',
  'bottom-left': 'bottom-6 left-6 items-start',
  'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2 items-center',
  'top-right': 'top-6 right-6 items-end',
  'top-left': 'top-6 left-6 items-start',
  'top-center': 'top-6 left-1/2 -translate-x-1/2 items-center',
};

const defaultIcons: Record<ToastVariant, React.ReactNode> = {
  default: null,
  success: <Icon symbol="check_circle" size="sm" />,
  error: <Icon symbol="error" size="sm" />,
  warning: <Icon symbol="warning" size="sm" />,
  info: <Icon symbol="info" size="sm" />,
};

interface ToastContextValue {
  toasts: Toast[];
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const {
    id,
    message,
    description,
    variant = 'default',
    icon,
    action,
    duration = 5000,
    dismissible = true,
  } = toast;

  useEffect(() => {
    if (duration <= 0) return;

    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  const displayIcon = icon ?? defaultIcons[variant];
  const isInverse = variant === 'default';
  const isAlert = variant === 'error' || variant === 'warning';

  return (
    <div
      className={cn(toastVariants({ variant }), 'animate-toast-enter')}
      role={isAlert ? 'alert' : 'status'}
      aria-live={isAlert ? 'assertive' : 'polite'}
    >
      {displayIcon && (
        <div className="toast-icon size-icon-sm flex shrink-0 items-center justify-center">
          {displayIcon}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'text-body-medium leading-tight font-medium',
            isInverse ? 'text-inverse-on-surface' : 'text-inherit',
          )}
        >
          {message}
        </p>
        {description && (
          <p
            className={cn(
              'text-body-small mt-1 leading-snug',
              isInverse ? 'text-inverse-on-surface opacity-70' : 'text-inherit opacity-80',
            )}
          >
            {description}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {action && (
          <Button
            variant="text"
            size="sm"
            onClick={() => {
              action.onClick();
              onDismiss(id);
            }}
            className={cn(
              'h-8 px-3 font-medium',
              isInverse
                ? 'text-inverse-primary hover:bg-state-focus'
                : 'hover:bg-state-hover text-inherit',
            )}
          >
            {action.label}
          </Button>
        )}

        {dismissible && (
          <button
            onClick={() => onDismiss(id)}
            className={cn(
              'group rounded-icon-button relative overflow-hidden p-1 transition-colors',
              isInverse
                ? 'text-inverse-on-surface opacity-50 hover:opacity-100'
                : 'text-inherit opacity-70 hover:opacity-100',
            )}
            aria-label="Dismiss"
          >
            <Ripple />
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="relative z-10"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export interface ToasterProps {
  position?: ToastPosition;
  maxToasts?: number;
}

function ToasterPortal({ position = 'bottom-right', maxToasts = 5 }: ToasterProps) {
  const { toasts, dismiss } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const visibleToasts = toasts.slice(-maxToasts);
  const isTop = position.startsWith('top');

  return createPortal(
    <div
      className={cn(
        'pointer-events-none fixed z-5000 flex flex-col gap-2',
        positionClasses[position],
      )}
    >
      {(isTop ? visibleToasts.reverse() : visibleToasts).map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>,
    document.body,
  );
}

export interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
}

export function ToastProvider({
  children,
  position = 'bottom-right',
  maxToasts = 5,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((options: ToastOptions): string => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      id,
      ...options,
    };
    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  useEffect(() => {
    const host = { toastFunc: toast, dismissFunc: dismiss, dismissAllFunc: dismissAll };
    activeToastHost = host;
    setToastFunctions(host.toastFunc, host.dismissFunc, host.dismissAllFunc);
    return () => {
      if (activeToastHost === host) {
        activeToastHost = null;
        toastFn = null;
        dismissFn = null;
        dismissAllFn = null;
      }
    };
  }, [toast, dismiss, dismissAll]);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss, dismissAll }}>
      {children}
      <ToasterPortal position={position} maxToasts={maxToasts} />
    </ToastContext.Provider>
  );
}

let toastFn: ((options: ToastOptions) => string) | null = null;
let dismissFn: ((id: string) => void) | null = null;
let dismissAllFn: (() => void) | null = null;
let activeToastHost: {
  toastFunc: (options: ToastOptions) => string;
  dismissFunc: (id: string) => void;
  dismissAllFunc: () => void;
} | null = null;

export function setToastFunctions(
  toastFunc: (options: ToastOptions) => string,
  dismissFunc: (id: string) => void,
  dismissAllFunc: () => void,
) {
  toastFn = toastFunc;
  dismissFn = dismissFunc;
  dismissAllFn = dismissAllFunc;
}

export const toast = {
  show: (options: ToastOptions) => {
    if (!toastFn) {
      console.warn('Toast: no host mounted. Mount <Toaster /> or <ToastProvider>.');
      return '';
    }
    return toastFn(options);
  },
  success: (message: string, options?: Omit<ToastOptions, 'message' | 'variant'>) => {
    return toast.show({ message, variant: 'success', ...options });
  },
  error: (message: string, options?: Omit<ToastOptions, 'message' | 'variant'>) => {
    return toast.show({ message, variant: 'error', ...options });
  },
  warning: (message: string, options?: Omit<ToastOptions, 'message' | 'variant'>) => {
    return toast.show({ message, variant: 'warning', ...options });
  },
  info: (message: string, options?: Omit<ToastOptions, 'message' | 'variant'>) => {
    return toast.show({ message, variant: 'info', ...options });
  },
  dismiss: (id: string) => {
    dismissFn?.(id);
  },
  dismissAll: () => {
    dismissAllFn?.();
  },
};

export function Toaster({ position = 'bottom-right', maxToasts = 5 }: ToasterProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toastFnInternal = useCallback((options: ToastOptions): string => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, ...options };
    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const dismissInternal = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAllInternal = useCallback(() => {
    setToasts([]);
  }, []);

  useEffect(() => {
    const host = {
      toastFunc: toastFnInternal,
      dismissFunc: dismissInternal,
      dismissAllFunc: dismissAllInternal,
    };
    activeToastHost = host;
    setToastFunctions(host.toastFunc, host.dismissFunc, host.dismissAllFunc);
    return () => {
      if (activeToastHost === host) {
        activeToastHost = null;
        toastFn = null;
        dismissFn = null;
        dismissAllFn = null;
      }
    };
  }, [toastFnInternal, dismissInternal, dismissAllInternal]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const visibleToasts = toasts.slice(-maxToasts);
  const isTop = position.startsWith('top');

  return createPortal(
    <div
      className={cn(
        'pointer-events-none fixed z-5000 flex flex-col gap-2',
        positionClasses[position],
      )}
    >
      {(isTop ? visibleToasts.reverse() : visibleToasts).map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={dismissInternal} />
      ))}
    </div>,
    document.body,
  );
}
