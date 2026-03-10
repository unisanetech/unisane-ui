"use client";
/* eslint-disable react/prop-types */

export type HeroTone =
  | "primary"
  | "secondary"
  | "tertiary"
  | "surface"
  | "error";

interface HeroBackgroundProps {
  tone?: HeroTone;
  children: React.ReactNode;
  className?: string;
  align?: "center" | "start" | "end";
  justify?: "center" | "start" | "end";
  padding?: "none" | "sm" | "md" | "lg";
  overflow?: "visible" | "hidden";
}

const toneClasses: Record<HeroTone, string> = {
  primary: "bg-primary-container/40",
  secondary: "bg-secondary-container/35",
  tertiary: "bg-tertiary-container/35",
  surface: "bg-surface-container/50",
  error: "bg-error-container/25",
};

const alignClasses: Record<string, string> = {
  center: "items-center",
  start: "items-start",
  end: "items-end",
};

const justifyClasses: Record<string, string> = {
  center: "justify-center",
  start: "justify-start",
  end: "justify-end",
};

const paddingClasses = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const overflowClasses = {
  visible: "overflow-visible",
  hidden: "overflow-hidden",
};

export const HeroBackground: React.FC<HeroBackgroundProps> = ({
  tone = "primary",
  children,
  className = "",
  align = "center",
  justify = "center",
  padding = "md",
  overflow = "visible",
}) => {
  return (
    <div
      className={`relative w-full h-full flex ${paddingClasses[padding]} ${overflowClasses[overflow]} ${toneClasses[tone]} ${alignClasses[align]} ${justifyClasses[justify]} ${className}`.trim()}
    >
      {children}
    </div>
  );
};
