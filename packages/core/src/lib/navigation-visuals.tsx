import React from "react";
import { cn } from "./utils";

export interface NavigationIconProps {
  icon: React.ReactNode | string;
  active?: boolean;
  size?: number;
  className?: string;
}

export function NavigationIcon({
  icon,
  active = false,
  size = 20,
  className,
}: NavigationIconProps) {
  if (typeof icon === "string") {
    return (
      <span
        className={cn("material-symbols-outlined transition-all duration-short", className)}
        style={{
          fontSize: size,
          fontVariationSettings: active ? "'FILL' 1, 'wght' 500" : "'wght' 400",
        }}
      >
        {icon}
      </span>
    );
  }

  return <>{icon}</>;
}

export function getNavigationRailItemClasses(disabled?: boolean, className?: string) {
  return cn(
    "group relative flex min-h-12 w-full cursor-pointer flex-col items-center gap-0.5 rounded-sm py-1 outline-none select-none",
    "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
    disabled && "pointer-events-none cursor-not-allowed opacity-38",
    className,
  );
}

interface NavigationRailItemContentProps {
  icon: React.ReactNode | string;
  activeIcon?: React.ReactNode | string;
  badge?: string | number;
  label: string;
  active: boolean;
  disabled?: boolean;
  ripple?: React.ReactNode;
}

export function NavigationRailItemContent({
  icon,
  activeIcon,
  badge,
  label,
  active,
  disabled,
  ripple,
}: NavigationRailItemContentProps) {
  return (
    <>
      <div className="relative flex items-center justify-center">
        <div
          className={cn(
            "relative flex h-8 w-14 items-center justify-center overflow-hidden rounded-full transition-all duration-medium ease-emphasized",
            active
              ? "bg-secondary-container text-on-secondary-container"
              : "bg-transparent text-on-surface-variant hover:bg-state-hover",
          )}
        >
          {ripple}
          <span className="relative z-10 flex items-center justify-center">
            <NavigationIcon
              icon={active && activeIcon ? activeIcon : icon}
              active={active}
              size={22}
            />
          </span>
        </div>

        {badge !== undefined && (
          <span
            className={cn(
              "absolute -top-0.5 -right-0.5 z-20 flex h-3 min-w-3 items-center justify-center rounded-full bg-error px-0.5 text-[10px] leading-none font-medium text-on-error pointer-events-none ring-1 ring-surface",
              typeof badge === "number" && badge < 10 && "h-2 min-w-2 p-0.5",
            )}
            role="status"
            aria-label={typeof badge === "number" ? `${badge} notifications` : String(badge)}
          >
            {badge}
          </span>
        )}
      </div>

      <span
        className={cn(
          "max-w-full px-0.5 text-center text-label-small transition-colors duration-short",
          active
            ? "font-bold text-on-secondary-container"
            : "font-medium text-on-surface-variant group-hover:text-on-surface",
          disabled && "group-hover:text-on-surface-variant",
        )}
      >
        {label}
      </span>
    </>
  );
}

export function getNavigationDrawerItemClasses(args: {
  active?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const { active, disabled, className } = args;

  return cn(
    "group relative flex w-full min-h-10 items-center justify-start gap-3 rounded-sm px-4 py-2",
    "text-body-medium text-left transition-colors duration-short select-none overflow-hidden outline-none",
    "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
    active
      ? "bg-secondary-container text-on-secondary-container font-medium"
      : "text-on-surface-variant font-medium hover:bg-state-hover hover:text-on-surface",
    disabled && "opacity-38 cursor-not-allowed pointer-events-none",
    className,
  );
}

interface NavigationDrawerItemContentProps {
  icon?: React.ReactNode | string;
  activeIcon?: React.ReactNode | string;
  badge?: React.ReactNode | string | number;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  ripple?: React.ReactNode;
}

export function NavigationDrawerItemContent({
  icon,
  activeIcon,
  badge,
  active,
  children,
  ripple,
}: NavigationDrawerItemContentProps) {
  return (
    <>
      <span
        className={cn(
          "absolute inset-0 pointer-events-none transition-opacity duration-short",
          active
            ? "bg-primary opacity-0 group-hover:opacity-[0.08] group-focus-visible:opacity-[0.12] group-active:opacity-[0.12]"
            : "",
        )}
      />
      {ripple}

      {icon && (
        <span className="relative z-10 shrink-0">
          <NavigationIcon
            icon={active && activeIcon ? activeIcon : icon}
            active={!!active}
            size={20}
          />
        </span>
      )}

      <span className="relative z-10 flex-1 truncate text-left">{children}</span>

      {badge && (
        <span className="relative z-10 ml-auto">
          {typeof badge === "string" || typeof badge === "number" ? (
            <span className="inline-block min-w-5 px-1.5 py-0.5 text-center text-label-small font-medium text-on-surface-variant">
              {badge}
            </span>
          ) : (
            badge
          )}
        </span>
      )}
    </>
  );
}
