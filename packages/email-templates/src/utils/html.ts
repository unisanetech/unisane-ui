export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function escapeAttr(input: string): string {
  return escapeHtml(input);
}

export function cssFontFamily(input: string): string {
  return `'${input.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

export function escapeCssUrl(input: string): string {
  return input.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}
