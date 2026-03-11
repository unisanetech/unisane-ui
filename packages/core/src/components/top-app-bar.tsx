import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ui/lib/utils";
import { Text } from "@ui/primitives/text";

const topAppBarVariants = cva(
  "relative z-20 flex w-full items-center border-b border-outline-subtle bg-surface px-4 text-on-surface transition-all duration-medium ease-standard",
  {
    variants: {
      variant: {
        center: "h-16 justify-between",
        small: "h-16 justify-between",
        medium: "h-28 flex-col items-start justify-end pb-6",
        large: "h-38 flex-col items-start justify-end pb-8",
      },
      scrolled: {
        true: "bg-surface-container shadow-2",
        false: "",
      },
    },
    defaultVariants: {
      variant: "small",
      scrolled: false,
    },
  }
);

export type TopAppBarProps = VariantProps<typeof topAppBarVariants> & {
  title: React.ReactNode;
  navigationIcon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, "children" | "title">;

export const TopAppBar = forwardRef<HTMLElement, TopAppBarProps>(
  (
    {
      variant,
      scrolled,
      title,
      navigationIcon,
      actions,
      className,
      ["aria-label"]: ariaLabel,
      ...props
    },
    ref
  ) => {
    const isTall = variant === "medium" || variant === "large";
    const isCenter = variant === "center";
    const titleString = typeof title === "string" ? title : undefined;

    return (
      <header
        ref={ref}
        {...props}
        className={cn(topAppBarVariants({ variant, scrolled, className }))}
        aria-label={ariaLabel || titleString}
      >
        <div
          className={cn(
            "flex w-full items-center",
            isTall ? "mb-auto h-16" : "h-full",
            isCenter ? "relative justify-center" : "justify-between"
          )}
        >
          {navigationIcon && (
            <div
              className={cn(
                "text-on-surface mr-4 z-10",
                isCenter ? "absolute left-0" : ""
              )}
            >
              {navigationIcon}
            </div>
          )}

          {!isTall && (
            <div
              className={cn(
                "truncate",
                isCenter ? "w-full px-12 text-center" : "flex-1 text-left"
              )}
            >
              <Text variant="titleLarge" className="truncate text-primary">
                {title}
              </Text>
            </div>
          )}

          <div
            className={cn(
              "z-10 flex items-center gap-2 text-on-surface-variant",
              isCenter && "absolute right-0"
            )}
          >
            {actions}
          </div>
        </div>

        {isTall && (
          <div
            className={cn(
              "w-full px-4 transition-opacity duration-short",
              scrolled ? "h-0 overflow-hidden opacity-0" : "opacity-100"
            )}
          >
            <Text
              variant={variant === "large" ? "headlineMedium" : "headlineSmall"}
              className="truncate"
            >
              {title}
            </Text>
          </div>
        )}
      </header>
    );
  }
);

TopAppBar.displayName = "TopAppBar";
