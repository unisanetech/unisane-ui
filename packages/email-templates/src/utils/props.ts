export function readText(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

export function readUserName(value: unknown): string | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  return readText((value as { name?: unknown }).name);
}

export function readStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const text = readText(item);
    return text ? [text] : [];
  });
}

export function isMarketingCategory(category?: string): boolean {
  return category === 'marketing' || category === 'product_updates' || category === 'digest';
}

export function ttlSentence(value: unknown, fallback: string): string {
  const duration = formatDuration(value);
  if (!duration) return fallback;
  return `This expires in ${duration}.`;
}

export function formatDuration(value: unknown): string | null {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return null;
  if (value >= 3600) {
    const hours = Math.round(value / 3600);
    return `${hours} hour${hours === 1 ? '' : 's'}`;
  }
  if (value >= 60) {
    const minutes = Math.round(value / 60);
    return `${minutes} minute${minutes === 1 ? '' : 's'}`;
  }
  const seconds = Math.max(1, Math.round(value));
  return `${seconds} second${seconds === 1 ? '' : 's'}`;
}

export function formatDateTime(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return `${new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(parsed)} UTC`;
}

export function formatAmount(amount: unknown, currency: unknown): string | null {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) return null;
  const normalizedCurrency = typeof currency === 'string' ? currency.trim().toUpperCase() : '';
  return normalizedCurrency ? `${amount} ${normalizedCurrency}` : String(amount);
}

export function joinText(...parts: Array<string | undefined | null | false>): string {
  return parts.filter((part): part is string => Boolean(part && part.trim())).join('\n\n');
}
