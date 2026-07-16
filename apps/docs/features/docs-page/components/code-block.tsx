'use client';

import { useState } from 'react';
import { cn } from '@unisane/ui/lib/utils';
import { IconButton, Surface } from '@unisane/ui';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Surface
      tone="surfaceContainerLow"
      rounded="sm"
      className={cn('group relative overflow-x-auto p-5', className)}
    >
      {/* Copy Button */}
      <div className="duration-short absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
        <IconButton
          variant="standard"
          size="sm"
          aria-label={copied ? 'Copied!' : 'Copy code'}
          onClick={handleCopy}
          icon={
            <span className="material-symbols-outlined text-[20px]">
              {copied ? 'check' : 'content_copy'}
            </span>
          }
        />
      </div>

      {/* Language Badge */}
      {language && (
        <span className="text-label-small text-on-surface-variant absolute top-3 right-12 font-mono">
          {language}
        </span>
      )}

      <pre className="text-body-small font-mono leading-relaxed">
        <code className="text-on-surface">{code}</code>
      </pre>
    </Surface>
  );
}
