'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent,
  type HTMLAttributes,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';

export type ToastTone = 'neutral' | 'success' | 'danger' | 'warning' | 'info';
export type ToastPriority = 'polite' | 'assertive';
export type ToastPosition =
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'top-right'
  | 'top-left'
  | 'top-center';

export interface ToastAction {
  label: ReactNode;
  onClick: () => void;
}

export interface ToastOptions {
  message: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  priority?: ToastPriority;
  icon?: ReactNode;
  action?: ToastAction;
  duration?: number;
  dismissible?: boolean;
}

export interface ToastProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'>, ToastOptions {
  onDismiss?: () => void;
}

interface ToastRecord extends ToastOptions {
  id: string;
}

const toastRecipe = cva(
  'pointer-events-auto flex w-full min-w-0 max-w-100 items-start gap-3 rounded-md border px-4 py-3 shadow-4 transition-all duration-medium ease-emphasized sm:min-w-72',
  {
    variants: {
      tone: {
        neutral: 'border-transparent bg-inverse-surface text-inverse-on-surface',
        success:
          'border-success bg-success-container text-on-success-container [&_.toast-icon]:text-on-success-container',
        danger:
          'border-error bg-error-container text-on-error-container [&_.toast-icon]:text-on-error-container',
        warning:
          'border-warning bg-warning-container text-on-warning-container [&_.toast-icon]:text-on-warning-container',
        info: 'border-info bg-info-container text-on-info-container [&_.toast-icon]:text-on-info-container',
      },
    },
    defaultVariants: {
      tone: 'neutral',
    },
  },
);

const positionClasses: Record<ToastPosition, string> = {
  'bottom-right':
    'inset-x-4 bottom-4 items-stretch sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end',
  'bottom-left':
    'inset-x-4 bottom-4 items-stretch sm:inset-x-auto sm:bottom-6 sm:left-6 sm:items-start',
  'bottom-center':
    'inset-x-4 bottom-4 items-stretch sm:inset-x-auto sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:items-center',
  'top-right': 'inset-x-4 top-4 items-stretch sm:inset-x-auto sm:top-6 sm:right-6 sm:items-end',
  'top-left': 'inset-x-4 top-4 items-stretch sm:inset-x-auto sm:top-6 sm:left-6 sm:items-start',
  'top-center':
    'inset-x-4 top-4 items-stretch sm:inset-x-auto sm:top-6 sm:left-1/2 sm:-translate-x-1/2 sm:items-center',
};

const defaultIcons: Record<ToastTone, ReactNode> = {
  neutral: null,
  success: <Icon symbol="check_circle" size="sm" />,
  danger: <Icon symbol="error" size="sm" />,
  warning: <Icon symbol="warning" size="sm" />,
  info: <Icon symbol="info" size="sm" />,
};

const emptySnapshot: readonly ToastRecord[] = [];
const listeners = new Set<() => void>();
let snapshot: readonly ToastRecord[] = emptySnapshot;
let nextToastId = 0;

function emitStoreChange() {
  for (const listener of listeners) {
    listener();
  }
}

const toastStore = {
  getSnapshot: () => snapshot,
  getServerSnapshot: () => emptySnapshot,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  show(options: ToastOptions) {
    nextToastId += 1;
    const id = `toast-${nextToastId}`;
    snapshot = [...snapshot, { id, ...options }];
    emitStoreChange();
    return id;
  },
  dismiss(id: string) {
    const nextSnapshot = snapshot.filter((item) => item.id !== id);
    if (nextSnapshot.length === snapshot.length) return;
    snapshot = nextSnapshot;
    emitStoreChange();
  },
  dismissAll() {
    if (snapshot.length === 0) return;
    snapshot = emptySnapshot;
    emitStoreChange();
  },
};

function useAutoDismiss(duration: number, onDismiss: () => void) {
  const onDismissRef = useRef(onDismiss);
  const remainingRef = useRef(duration);
  const startedAtRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pauseReasonsRef = useRef(new Set<'pointer' | 'focus' | 'visibility'>());

  onDismissRef.current = onDismiss;

  const clearTimer = useCallback(() => {
    if (timerRef.current === null) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
    remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startedAtRef.current));
  }, []);

  const startTimer = useCallback(() => {
    if (duration <= 0 || pauseReasonsRef.current.size > 0 || timerRef.current !== null) return;
    if (remainingRef.current <= 0) {
      onDismissRef.current();
      return;
    }
    startedAtRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      remainingRef.current = 0;
      onDismissRef.current();
    }, remainingRef.current);
  }, [duration]);

  const pause = useCallback(
    (reason: 'pointer' | 'focus' | 'visibility') => {
      pauseReasonsRef.current.add(reason);
      clearTimer();
    },
    [clearTimer],
  );

  const resume = useCallback(
    (reason: 'pointer' | 'focus' | 'visibility') => {
      pauseReasonsRef.current.delete(reason);
      startTimer();
    },
    [startTimer],
  );

  useEffect(() => {
    remainingRef.current = duration;
    pauseReasonsRef.current.clear();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        pause('visibility');
      } else {
        resume('visibility');
      }
    };

    if (document.hidden) {
      pauseReasonsRef.current.add('visibility');
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);
    startTimer();

    return () => {
      clearTimer();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [clearTimer, duration, pause, resume, startTimer]);

  return { pause, resume };
}

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      message,
      description,
      tone = 'neutral',
      priority = tone === 'danger' ? 'assertive' : 'polite',
      icon,
      action,
      duration = 5000,
      dismissible = true,
      onDismiss,
      className,
      onPointerEnter,
      onPointerLeave,
      onFocusCapture,
      onBlurCapture,
      ...props
    },
    ref,
  ) => {
    const dismiss = onDismiss ?? (() => undefined);
    const { pause, resume } = useAutoDismiss(duration, dismiss);
    const displayIcon = icon ?? defaultIcons[tone];
    const isNeutral = tone === 'neutral';

    const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
      onPointerEnter?.(event);
      if (!event.defaultPrevented) pause('pointer');
    };

    const handlePointerLeave = (event: PointerEvent<HTMLDivElement>) => {
      onPointerLeave?.(event);
      if (!event.defaultPrevented) resume('pointer');
    };

    const handleFocusCapture = (event: FocusEvent<HTMLDivElement>) => {
      onFocusCapture?.(event);
      if (!event.defaultPrevented) pause('focus');
    };

    const handleBlurCapture = (event: FocusEvent<HTMLDivElement>) => {
      onBlurCapture?.(event);
      if (
        !event.defaultPrevented &&
        !(event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget))
      ) {
        resume('focus');
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          toastRecipe({ tone }),
          'animate-toast-enter motion-reduce:animate-none',
          className,
        )}
        role={priority === 'assertive' ? 'alert' : 'status'}
        aria-live={priority}
        aria-atomic="true"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onFocusCapture={handleFocusCapture}
        onBlurCapture={handleBlurCapture}
        {...props}
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
              isNeutral ? 'text-inverse-on-surface' : 'text-inherit',
            )}
          >
            {message}
          </p>
          {description && (
            <p
              className={cn(
                'text-body-small mt-1 leading-snug',
                isNeutral ? 'text-inverse-on-surface opacity-70' : 'text-inherit opacity-80',
              )}
            >
              {description}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {action && (
            <Button
              variant="text"
              size="sm"
              onClick={() => {
                action.onClick();
                dismiss();
              }}
              className={cn(
                'h-8 px-3 font-medium',
                isNeutral
                  ? 'text-inverse-primary hover:bg-state-focus'
                  : 'hover:bg-state-hover text-inherit',
              )}
            >
              {action.label}
            </Button>
          )}

          {dismissible && onDismiss && (
            <IconButton
              aria-label="Dismiss notification"
              icon={<Icon symbol="close" />}
              size="sm"
              onClick={dismiss}
              className={cn(
                isNeutral
                  ? 'text-inverse-on-surface opacity-70 hover:opacity-100'
                  : 'text-inherit opacity-70 hover:opacity-100',
              )}
            />
          )}
        </div>
      </div>
    );
  },
);

Toast.displayName = 'Toast';

export interface ToasterProps {
  position?: ToastPosition;
  maxToasts?: number;
  className?: string;
}

export function Toaster({ position = 'bottom-right', maxToasts = 5, className }: ToasterProps) {
  const toasts = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getServerSnapshot,
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const visibleCount = Math.max(0, Math.floor(maxToasts));
  const visibleToasts = visibleCount === 0 ? [] : toasts.slice(-visibleCount);
  const orderedToasts = position.startsWith('top') ? [...visibleToasts].reverse() : visibleToasts;

  return createPortal(
    <div
      role="region"
      aria-label="Notifications"
      className={cn(
        'pointer-events-none fixed z-5000 flex flex-col gap-2',
        positionClasses[position],
        className,
      )}
    >
      {orderedToasts.map((item) => (
        <Toast key={item.id} {...item} onDismiss={() => toastStore.dismiss(item.id)} />
      ))}
    </div>,
    document.body,
  );
}

type ToastShortcutOptions = Omit<ToastOptions, 'message' | 'tone'>;

export const toast = {
  show: (options: ToastOptions) => toastStore.show(options),
  success: (message: ReactNode, options?: ToastShortcutOptions) =>
    toastStore.show({ message, tone: 'success', ...options }),
  error: (message: ReactNode, options?: ToastShortcutOptions) =>
    toastStore.show({ message, tone: 'danger', ...options }),
  warning: (message: ReactNode, options?: ToastShortcutOptions) =>
    toastStore.show({ message, tone: 'warning', ...options }),
  info: (message: ReactNode, options?: ToastShortcutOptions) =>
    toastStore.show({ message, tone: 'info', ...options }),
  dismiss: (id: string) => toastStore.dismiss(id),
  dismissAll: () => toastStore.dismissAll(),
};
