'use client';

import React from 'react';
import { Icon } from '@unisane/ui/icon';
import { IconButton } from '@unisane/ui/icon-button';
import { Surface } from '@unisane/ui/surface';
import { cn } from '@unisane/ui/utils';

interface InstallCommandProps {
  className?: string;
  inverse?: boolean;
}

const INSTALL_COMMAND = 'pnpm dlx unisane-ui init';

export function InstallCommand({ className, inverse = false }: InstallCommandProps) {
  const [copied, setCopied] = React.useState(false);

  const copyCommand = async () => {
    await navigator.clipboard?.writeText(INSTALL_COMMAND);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Surface
      tone="surfaceContainerLowest"
      rounded="sm"
      className={cn(
        'border-control-outline flex min-h-12 min-w-0 items-center gap-2 border px-3',
        inverse && 'bg-on-surface text-surface border-on-surface',
        className,
      )}
    >
      <Icon symbol="terminal" className="shrink-0 text-inherit" />
      <code className="min-w-0 flex-1 truncate font-mono text-[0.78rem] tracking-[-0.01em] @sm:text-[0.84rem]">
        {INSTALL_COMMAND}
      </code>
      <IconButton
        variant="standard"
        aria-label={copied ? 'Install command copied' : 'Copy install command'}
        onClick={copyCommand}
        className={cn('shrink-0', inverse && 'text-surface')}
        icon={<Icon symbol={copied ? 'check' : 'content_copy'} />}
      />
      <span className="sr-only" aria-live="polite">
        {copied ? 'Install command copied' : ''}
      </span>
    </Surface>
  );
}
