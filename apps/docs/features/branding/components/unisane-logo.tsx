"use client";

import React, { forwardRef } from "react";

export interface UnisaneLogoProps
  extends Omit<React.SVGProps<SVGSVGElement>, "width" | "height"> {
  size?: number | string;
  title?: string;
}

export const UnisaneLogo = forwardRef<SVGSVGElement, UnisaneLogoProps>(
  (
    {
      className,
      title = "Unisane UI logo",
      size = 32,
      style,
      "aria-hidden": ariaHidden,
      ...props
    },
    ref
  ) => {
    const dimension = typeof size === "number" ? size : undefined;
    const sizeStyle = typeof size === "string" ? size : undefined;

    return (
      <svg
        ref={ref}
        viewBox="0 0 32 32"
        role={ariaHidden ? "presentation" : "img"}
        aria-hidden={ariaHidden}
        width={dimension}
        height={dimension}
        className={`shrink-0 select-none ${className || ""}`}
        style={
          sizeStyle ? { width: sizeStyle, height: sizeStyle, ...style } : style
        }
        {...props}
      >
        {!ariaHidden && <title>{title}</title>}

        <g shapeRendering="geometricPrecision">
          <path
            d="M10 3.5H28L22.5 21.5H5L10 3.5Z"
            fill="color-mix(in oklab, var(--color-tertiary) 82%, var(--color-surface) 18%)"
          />
          <path d="M6.5 7.5H24.5L19.2 24.2H2L6.5 7.5Z" fill="var(--color-primary-container)" />
          <path d="M3.5 11H20.5L15.8 28.5H0.5L3.5 11Z" fill="var(--color-primary)" />
        </g>
      </svg>
    );
  }
);

UnisaneLogo.displayName = "UnisaneLogo";
