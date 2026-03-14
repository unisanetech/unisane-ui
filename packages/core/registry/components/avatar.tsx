import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { avatarSizeClasses } from '@/lib/action-size';
import { Surface } from '@/primitives/surface';
import { Text } from '@/primitives/text';

const avatarVariants = cva(
  'relative inline-flex items-center justify-center overflow-hidden rounded-full',
  {
    variants: {
      size: {
        sm: avatarSizeClasses.sm,
        md: avatarSizeClasses.md,
        lg: avatarSizeClasses.lg,
        xl: avatarSizeClasses.xl,
      },
      variant: {
        circular: 'rounded-full',
        rounded: 'rounded-sm',
        square: 'rounded-none',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'circular',
    },
  },
);

export type AvatarProps = VariantProps<typeof avatarVariants> & {
  src?: string | undefined;
  alt?: string | undefined;
  fallback?: string | undefined;
  className?: string | undefined;
};

export const Avatar: React.FC<AvatarProps> = ({ src, alt, fallback, size, variant, className }) => {
  const fallbackChar = fallback?.charAt(0).toUpperCase() || '?';
  const fallbackLabel = fallback || alt || 'Avatar';

  return (
    <Surface
      tone="surfaceVariant"
      className={cn(avatarVariants({ size, variant, className }))}
      role="img"
      aria-label={src ? alt : fallbackLabel}
    >
      {src ? (
        <img src={src} alt={alt || 'Avatar'} className="h-full w-full object-cover" />
      ) : (
        <Text variant="labelLarge" className="text-inherit" aria-hidden="true">
          {fallbackChar}
        </Text>
      )}
    </Surface>
  );
};

export const AvatarGroup: React.FC<{
  children: React.ReactNode;
  max?: number;
  className?: string;
}> = ({ children, max = 5, className }) => {
  const childrenArray = React.Children.toArray(children);
  const visibleChildren = childrenArray.slice(0, max);
  const remainingCount = childrenArray.length - max;

  return (
    <div className={cn('flex -space-x-2', className)} role="group" aria-label="Avatar group">
      {visibleChildren}
      {remainingCount > 0 && (
        <Surface
          tone="surfaceVariant"
          className="border-surface flex h-[var(--size-avatar-md)] w-[var(--size-avatar-md)] items-center justify-center rounded-full border-2"
          role="img"
          aria-label={`${remainingCount} more`}
        >
          <Text variant="labelSmall" className="text-on-surface-variant" aria-hidden="true">
            +{remainingCount}
          </Text>
        </Surface>
      )}
    </div>
  );
};
