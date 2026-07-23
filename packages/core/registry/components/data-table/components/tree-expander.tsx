'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { useI18n } from '@/components/ui/data-table/i18n';

// ─── TYPES ───────────────────────────────────────────────────────────────────

export interface TreeExpanderProps {
  /** Whether the node is expanded */
  isExpanded: boolean;
  /** Whether the node has children (can be expanded) */
  hasChildren: boolean;
  /** Whether children are currently loading */
  isLoading?: boolean;
  /** Depth level (0 = root) */
  level: number;
  /** Indent size per level in pixels */
  indentSize?: number;
  /** Toggle expand/collapse */
  onToggle: () => void;
  /** Whether to show indicator for leaf nodes */
  showLeafIndicator?: boolean;
  /** Custom class name */
  className?: string;
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

/**
 * Tree expander button component for hierarchical row expansion.
 *
 * Features:
 * - Shows expand/collapse chevron for nodes with children
 * - Shows loading spinner during lazy load
 * - Applies indentation based on tree level
 * - Optional leaf node indicator
 *
 * @example
 * ```tsx
 * <TreeExpander
 *   isExpanded={node.isExpanded}
 *   hasChildren={node.hasChildren}
 *   isLoading={node.isLoading}
 *   level={node.level}
 *   onToggle={() => toggleNode(node.id)}
 * />
 * ```
 */
export function TreeExpander({
  isExpanded,
  hasChildren,
  isLoading = false,
  level,
  indentSize = 24,
  onToggle,
  showLeafIndicator = false,
  className,
}: TreeExpanderProps) {
  const { t } = useI18n();

  // Calculate indentation
  const indent = level * indentSize;

  // Don't render anything for leaf nodes without indicator
  if (!hasChildren && !showLeafIndicator) {
    return <span style={{ width: indent + 24, display: 'inline-block' }} />;
  }

  return (
    <span className={cn('inline-flex items-center', className)} style={{ paddingLeft: indent }}>
      {hasChildren ? (
        <IconButton
          variant="standard"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          disabled={isLoading}
          className={cn(isLoading && 'cursor-wait opacity-50')}
          selected={isExpanded}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? t('collapseRow') : t('expandRow')}
          icon={
            isLoading ? (
              <Icon symbol="progress_activity" className="text-on-surface-variant animate-spin" />
            ) : (
              <Icon
                symbol={isExpanded ? 'expand_more' : 'chevron_right'}
                className="transition-transform duration-150"
              />
            )
          }
        />
      ) : showLeafIndicator ? (
        // Leaf indicator (dot or dash)
        <span className="inline-flex h-6 w-6 items-center justify-center">
          <span className="bg-outline-variant h-1.5 w-1.5 rounded-full" />
        </span>
      ) : null}
    </span>
  );
}

export default TreeExpander;
