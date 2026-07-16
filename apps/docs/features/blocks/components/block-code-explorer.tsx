'use client';

import { useEffect, useMemo, useState } from 'react';
import { IconButton, Surface, Typography } from '@unisane/ui';
import { cn } from '@unisane/ui/lib/utils';
import type { DocsBlockCodeExample, DocsBlockCodeFile } from '@/lib/docs/blocks/types';

interface BlockCodeExplorerProps {
  codeExample: DocsBlockCodeExample;
  className?: string;
}

interface BlockCodeTreeNode {
  key: string;
  name: string;
  path: string;
  isFolder: boolean;
  children: BlockCodeTreeNode[];
  file?: DocsBlockCodeFile;
}

function buildCodeTree(files: DocsBlockCodeFile[]): BlockCodeTreeNode {
  const root: BlockCodeTreeNode = {
    key: '__root__',
    name: '',
    path: '',
    isFolder: true,
    children: [],
  };

  const sortedFiles = [...files].sort((left, right) => left.path.localeCompare(right.path));

  for (const file of sortedFiles) {
    const segments = file.path.split('/').filter(Boolean);
    let current = root;

    segments.forEach((segment, index) => {
      const nextPath = current.path ? `${current.path}/${segment}` : segment;
      const isLeaf = index === segments.length - 1;
      let child = current.children.find((node) => node.name === segment);

      if (!child) {
        child = {
          key: nextPath,
          name: segment,
          path: nextPath,
          isFolder: !isLeaf,
          children: [],
        };
        current.children.push(child);
      }

      if (isLeaf) {
        child.isFolder = false;
        child.file = file;
      }

      current = child;
    });
  }

  const sortNodes = (node: BlockCodeTreeNode) => {
    node.children.sort((left, right) => {
      if (left.isFolder !== right.isFolder) {
        return left.isFolder ? -1 : 1;
      }
      return left.name.localeCompare(right.name);
    });

    node.children.forEach(sortNodes);
  };

  sortNodes(root);
  return root;
}

function collectExpandedFolders(node: BlockCodeTreeNode): Record<string, boolean> {
  const expanded: Record<string, boolean> = {};

  const visit = (current: BlockCodeTreeNode) => {
    if (current.isFolder && current.path) {
      expanded[current.path] = true;
    }
    current.children.forEach(visit);
  };

  visit(node);
  return expanded;
}

export function BlockCodeExplorer({ codeExample, className }: BlockCodeExplorerProps) {
  const files = codeExample.files;
  const tree = useMemo(() => buildCodeTree(files), [files]);
  const defaultFilePath = codeExample.entryFile ?? files[0]?.path ?? '';
  const [selectedFilePath, setSelectedFilePath] = useState(defaultFilePath);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>(() =>
    collectExpandedFolders(tree),
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSelectedFilePath(defaultFilePath);
    setExpandedFolders(collectExpandedFolders(tree));
  }, [defaultFilePath, tree]);

  const selectedFile = files.find((file) => file.path === selectedFilePath) ?? files[0] ?? null;

  const toggleFolder = (path: string) => {
    setExpandedFolders((previous) => ({
      ...previous,
      [path]: !previous[path],
    }));
  };

  const handleCopy = async () => {
    if (!selectedFile) return;
    await navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Surface
      tone="surfaceContainerLow"
      rounded="sm"
      className={cn(
        'border-outline-variant grid min-h-0 overflow-hidden border @4xl:grid-cols-[260px_minmax(0,1fr)]',
        className,
      )}
    >
      <div className="border-outline-variant bg-surface min-h-0 border-b @4xl:border-r @4xl:border-b-0">
        <div className="border-outline-variant flex h-14 items-center border-b px-4">
          <Typography variant="labelLarge" className="text-on-surface-variant">
            Files
          </Typography>
        </div>
        <div className="max-h-64 overflow-auto p-2 @4xl:h-full @4xl:max-h-none">
          <BlockCodeTree
            node={tree}
            expandedFolders={expandedFolders}
            selectedFilePath={selectedFile?.path ?? ''}
            onSelectFile={setSelectedFilePath}
            onToggleFolder={toggleFolder}
          />
        </div>
      </div>

      <div className="bg-surface flex min-h-0 flex-col">
        <div className="border-outline-variant flex h-14 items-center justify-between gap-3 border-b px-4">
          <div className="min-w-0">
            <Typography
              variant="labelMedium"
              className="text-on-surface-variant truncate font-mono"
            >
              {selectedFile?.path ?? 'No file selected'}
            </Typography>
          </div>
          <div className="flex items-center gap-2">
            {selectedFile?.language ? (
              <Typography variant="labelSmall" className="text-on-surface-variant font-mono">
                {selectedFile.language}
              </Typography>
            ) : null}
            <IconButton
              variant="standard"
              size="sm"
              aria-label={copied ? 'Copied!' : 'Copy code'}
              onClick={handleCopy}
              disabled={!selectedFile}
              icon={
                <span className="material-symbols-outlined text-[20px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
              }
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-5">
          {selectedFile ? (
            <pre className="text-body-small text-on-surface overflow-auto font-mono leading-relaxed">
              <code>{selectedFile.code}</code>
            </pre>
          ) : (
            <div className="flex h-full items-center justify-center">
              <Typography variant="bodyMedium" className="text-on-surface-variant">
                No code available for this block yet.
              </Typography>
            </div>
          )}
        </div>
      </div>
    </Surface>
  );
}

interface BlockCodeTreeProps {
  node: BlockCodeTreeNode;
  expandedFolders: Record<string, boolean>;
  selectedFilePath: string;
  onSelectFile: (path: string) => void;
  onToggleFolder: (path: string) => void;
  depth?: number;
}

function BlockCodeTree({
  node,
  expandedFolders,
  selectedFilePath,
  onSelectFile,
  onToggleFolder,
  depth = 0,
}: BlockCodeTreeProps) {
  if (!node.path) {
    return (
      <div className="space-y-1">
        {node.children.map((child) => (
          <BlockCodeTree
            key={child.key}
            node={child}
            expandedFolders={expandedFolders}
            selectedFilePath={selectedFilePath}
            onSelectFile={onSelectFile}
            onToggleFolder={onToggleFolder}
            depth={depth}
          />
        ))}
      </div>
    );
  }

  if (node.isFolder) {
    const expanded = expandedFolders[node.path] ?? true;

    return (
      <div className="space-y-1">
        <button
          type="button"
          onClick={() => onToggleFolder(node.path)}
          className="text-body-small text-on-surface hover:bg-surface-container flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
            {expanded ? 'expand_more' : 'chevron_right'}
          </span>
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
            folder
          </span>
          <span className="truncate">{node.name}</span>
        </button>

        {expanded ? (
          <div className="space-y-1">
            {node.children.map((child) => (
              <BlockCodeTree
                key={child.key}
                node={child}
                expandedFolders={expandedFolders}
                selectedFilePath={selectedFilePath}
                onSelectFile={onSelectFile}
                onToggleFolder={onToggleFolder}
                depth={depth + 1}
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  const selected = selectedFilePath === node.path;

  return (
    <button
      type="button"
      onClick={() => onSelectFile(node.path)}
      className={cn(
        'text-body-small text-on-surface hover:bg-surface-container flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left',
        selected &&
          'bg-secondary-container text-on-secondary-container hover:bg-secondary-container',
      )}
      style={{ paddingLeft: `${depth * 12 + 8}px` }}
    >
      <span
        className={cn(
          'material-symbols-outlined text-[18px]',
          selected ? 'text-on-secondary-container' : 'text-on-surface-variant',
        )}
      >
        description
      </span>
      <span className="truncate">{node.name}</span>
    </button>
  );
}
