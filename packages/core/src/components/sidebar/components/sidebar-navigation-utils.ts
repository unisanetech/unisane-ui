import type { NavigationItem } from '../../../types/navigation';

export function collectDescendantIds(items?: NavigationItem[]): string[] {
  if (!items || items.length === 0) return [];
  return items.flatMap((item) => {
    if (!item.items || item.items.length === 0) return [item.id];
    return collectDescendantIds(item.items);
  });
}
