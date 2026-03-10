import { BLOCK_META } from './block-meta';
import type { DocsBlockCategory, DocsBlockMeta } from './types';

export { BLOCK_META } from './block-meta';
export type { DocsBlock, DocsBlockCategory, DocsBlockListItem, DocsBlockMeta } from './types';

export function getAllBlocks(): DocsBlockMeta[] {
  return BLOCK_META;
}

export function getBlockMetaBySlug(slug: string): DocsBlockMeta | undefined {
  return BLOCK_META.find((block) => block.slug === slug);
}

export function getBlockMetaByCategory(): Record<DocsBlockCategory, DocsBlockMeta[]> {
  return {
    layout: getAllBlocks().filter((block) => block.category === 'layout'),
    auth: getAllBlocks().filter((block) => block.category === 'auth'),
    workflow: getAllBlocks().filter((block) => block.category === 'workflow'),
  };
}
