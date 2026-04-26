import React, {
  Fragment,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

export interface TooltipProps {
  label: string;
  subhead?: string;
  children: React.ReactNode;
  variant?: 'plain' | 'rich';
  className?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

const VIEWPORT_MARGIN = 8;
const TOOLTIP_GAP = 8;
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export const Tooltip: React.FC<TooltipProps> = ({
  label,
  subhead,
  children,
  variant = 'plain',
  className,
  side = 'top',
}) => {
  const tooltipId = useId();
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = useCallback(() => {
    if (typeof window === 'undefined') return;
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;
    if (!trigger || !tooltip) return;

    const triggerRect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const width = tooltipRect.width;
    const height = tooltipRect.height;
    let top = triggerRect.top - height - TOOLTIP_GAP;
    let left = triggerRect.left + triggerRect.width / 2 - width / 2;

    if (side === 'bottom') {
      top = triggerRect.bottom + TOOLTIP_GAP;
    } else if (side === 'left') {
      top = triggerRect.top + triggerRect.height / 2 - height / 2;
      left = triggerRect.left - width - TOOLTIP_GAP;
    } else if (side === 'right') {
      top = triggerRect.top + triggerRect.height / 2 - height / 2;
      left = triggerRect.right + TOOLTIP_GAP;
    }

    setPosition({
      top: Math.max(VIEWPORT_MARGIN, Math.min(top, window.innerHeight - height - VIEWPORT_MARGIN)),
      left: Math.max(VIEWPORT_MARGIN, Math.min(left, window.innerWidth - width - VIEWPORT_MARGIN)),
    });
  }, [side]);

  useIsomorphicLayoutEffect(() => {
    if (!mounted) return;
    updatePosition();
  }, [mounted, label, subhead, side, variant, updatePosition]);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, { capture: true, passive: true });
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, { capture: true });
    };
  }, [open, updatePosition]);

  const trigger =
    isValidElement<{ 'aria-describedby'?: string }>(children) && children.type !== Fragment ? (
      cloneElement(children, {
        'aria-describedby': [children.props['aria-describedby'], tooltipId]
          .filter(Boolean)
          .join(' '),
      })
    ) : (
      <span aria-describedby={tooltipId}>{children}</span>
    );

  const tooltip = (
    <div
      ref={tooltipRef}
      id={tooltipId}
      role="tooltip"
      data-side={side}
      className={cn(
        'duration-snappy ease-emphasized pointer-events-none fixed z-[var(--z-popover,2000)] max-w-[min(22rem,calc(100vw-1rem))] scale-95 opacity-0 transition-all',
        open && 'scale-100 opacity-100',
        variant === 'plain'
          ? 'bg-inverse-surface text-inverse-on-surface text-label-medium shadow-2 rounded-sm px-2 py-1.5 font-medium whitespace-normal'
          : 'bg-surface-container text-on-surface shadow-2 border-outline-soft flex min-w-50 flex-col gap-1 rounded-sm border p-4 whitespace-normal',
        className,
      )}
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {variant === 'rich' && subhead && (
        <span className="text-primary text-label-small font-medium opacity-70">{subhead}</span>
      )}
      <span className={cn(variant === 'rich' ? 'text-body-small font-medium' : '')}>{label}</span>
    </div>
  );

  return (
    <div
      ref={triggerRef}
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget)) return;
        setOpen(false);
      }}
    >
      {trigger}
      {mounted ? createPortal(tooltip, document.body) : null}
    </div>
  );
};
