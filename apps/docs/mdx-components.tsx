import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import { Typography } from '@unisane/ui/typography';
import { cn } from '@unisane/ui/utils';
import { ComponentPreview } from '@/features/docs-page';
import React from 'react';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <Typography
        variant="displaySmall"
        component="h1"
        className={cn('mt-4', className)}
        {...props}
      />
    ),
    h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <Typography
        variant="headlineMedium"
        component="h2"
        className={cn('mt-8', className)}
        {...props}
      />
    ),
    h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <Typography
        variant="titleLarge"
        component="h3"
        className={cn('mt-6', className)}
        {...props}
      />
    ),
    p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <Typography
        variant="bodyLarge"
        component="p"
        className={cn('text-on-surface-variant', className)}
        {...props}
      />
    ),
    a: ({ className, href = '', ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
      if (href.startsWith('/')) {
        return (
          <Link
            href={href}
            className={cn('text-primary hover:text-primary font-bold transition-colors', className)}
            {...props}
          />
        );
      }
      return (
        <a
          className={cn('text-primary hover:text-primary font-bold transition-colors', className)}
          href={href}
          {...props}
        />
      );
    },
    ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul
        className={cn('text-on-surface-variant list-disc space-y-2 pl-6', className)}
        {...props}
      />
    ),
    ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
      <ol
        className={cn('text-on-surface-variant list-decimal space-y-2 pl-6', className)}
        {...props}
      />
    ),
    li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
      <li className={cn('text-[14px] leading-relaxed', className)} {...props} />
    ),
    pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
      <div className="my-6">
        <pre
          className={cn(
            'bg-surface-container-low text-on-surface-variant border-outline-variant overflow-x-auto rounded-xs border p-4 font-mono text-[12px]',
            className,
          )}
          {...props}
        />
      </div>
    ),
    code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
      const isBlock = className?.includes('language-');
      return (
        <code
          className={cn(
            'font-mono',
            isBlock
              ? 'text-[12px]'
              : 'text-body-small bg-surface-variant text-on-surface rounded-xs px-2 py-0.5',
            className,
          )}
          {...props}
        />
      );
    },
    ComponentPreview,
    ...components,
  };
}
