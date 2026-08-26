'use client';

import { useState } from 'react';
import { cn } from '@unisane/ui/utils';
import { IconButton } from '@unisane/ui/icon-button';
import { Surface } from '@unisane/ui/surface';
import { Tabs, TabsList, TabsTrigger } from '@unisane/ui/tabs';

type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

interface CliCommandProps {
  /** The package and arguments without a package-manager runner. */
  command: string;
  className?: string;
}

const PACKAGE_MANAGERS: { id: PackageManager; label: string; runner: string }[] = [
  { id: 'npm', label: 'npm', runner: 'npx' },
  { id: 'pnpm', label: 'pnpm', runner: 'pnpm dlx' },
  { id: 'yarn', label: 'yarn', runner: 'yarn dlx' },
  { id: 'bun', label: 'bun', runner: 'bunx' },
];

const PACKAGE_MANAGER_RUNNER_PATTERN = /^(?:npx|pnpm dlx|yarn dlx|bunx)\s+/;

export function CliCommand({ command, className }: CliCommandProps) {
  const [activeManager, setActiveManager] = useState<PackageManager>('npm');
  const [copied, setCopied] = useState(false);

  const getFullCommand = (manager: PackageManager) => {
    const normalizedCommand = command.trim();
    if (!normalizedCommand || PACKAGE_MANAGER_RUNNER_PATTERN.test(normalizedCommand)) {
      throw new Error(
        'CliCommand expects a package and arguments without a package-manager runner.',
      );
    }

    const pm = PACKAGE_MANAGERS.find((p) => p.id === manager);
    return `${pm?.runner} ${normalizedCommand}`;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getFullCommand(activeManager));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Surface tone="surfaceContainerLow" rounded="sm" className={cn('overflow-hidden', className)}>
      {/* Package Manager Tabs */}
      <Tabs
        value={activeManager}
        onValueChange={(value) => setActiveManager(value as PackageManager)}
      >
        <TabsList className="bg-surface-container">
          {PACKAGE_MANAGERS.map((pm) => (
            <TabsTrigger key={pm.id} value={pm.id} className="text-label-medium">
              {pm.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Command Display */}
      <div className="bg-surface-container-low flex items-center justify-between gap-4 p-5 font-mono">
        <code className="text-body-medium text-on-surface overflow-x-auto">
          {getFullCommand(activeManager)}
        </code>
        <IconButton
          variant="standard"
          size="sm"
          aria-label={copied ? 'Copied!' : 'Copy command'}
          onClick={handleCopy}
          className="shrink-0"
          icon={
            <span className="material-symbols-outlined text-[20px]">
              {copied ? 'check' : 'content_copy'}
            </span>
          }
        />
      </div>
    </Surface>
  );
}
