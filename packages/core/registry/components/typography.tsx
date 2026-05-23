import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  typographyRoleClasses,
  typographyRoleDefaultTags,
  type TypographyRole,
} from '@/lib/typography-roles';
import { cn } from '@/lib/utils';

const typographyVariants = cva('text-on-surface', {
  variants: {
    variant: {
      displayLarge: 'text-display-large',
      displayMedium: 'text-display-medium',
      displaySmall: 'text-display-small',
      headlineLarge: 'text-headline-large',
      headlineMedium: 'text-headline-medium',
      headlineSmall: 'text-headline-small',
      titleLarge: 'text-title-large',
      titleMedium: 'text-title-medium',
      titleSmall: 'text-title-small',
      bodyLarge: 'text-body-large',
      bodyMedium: 'text-body-medium',
      bodySmall: 'text-body-small',
      labelLarge: 'text-label-large',
      labelMedium: 'text-label-medium',
      labelSmall: 'text-label-small',
    },
  },
  defaultVariants: {
    variant: 'bodyLarge',
  },
});

export type TypographyVariant = NonNullable<VariantProps<typeof typographyVariants>['variant']>;

type BaseTypographyProps = React.HTMLAttributes<HTMLElement> & {
  component?: React.ElementType;
};

type VariantTypographyProps = BaseTypographyProps & {
  variant?: TypographyVariant;
  typeRole?: never;
};

type RoleTypographyProps = BaseTypographyProps & {
  typeRole: TypographyRole;
  variant?: never;
};

export type TypographyProps = VariantTypographyProps | RoleTypographyProps;

const defaultTags: Record<TypographyVariant, React.ElementType> = {
  displayLarge: 'h1',
  displayMedium: 'h2',
  displaySmall: 'h3',
  headlineLarge: 'h4',
  headlineMedium: 'h5',
  headlineSmall: 'h6',
  titleLarge: 'p',
  titleMedium: 'p',
  titleSmall: 'p',
  bodyLarge: 'p',
  bodyMedium: 'p',
  bodySmall: 'p',
  labelLarge: 'span',
  labelMedium: 'span',
  labelSmall: 'span',
};

export const Typography: React.FC<TypographyProps> = ({
  variant,
  typeRole,
  component,
  className,
  children,
  ...props
}) => {
  const resolvedVariant = variant ?? 'bodyLarge';
  const Component =
    component ||
    (typeRole
      ? typographyRoleDefaultTags[typeRole]
      : defaultTags[resolvedVariant as TypographyVariant]) ||
    'p';
  return (
    <Component
      className={cn(
        typeRole ? 'text-on-surface' : typographyVariants({ variant: resolvedVariant }),
        typeRole && typographyRoleClasses[typeRole],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export type { TypographyRole };
