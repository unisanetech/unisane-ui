import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { uiList, uiSearch, uiView } from '../src/commands/catalog.js';

const registryDirectory = path.resolve(import.meta.dirname, '../../ui/registry');
process.env.UNISANE_UI_REGISTRY_DIR = registryDirectory;

afterEach(() => {
  process.env.UNISANE_UI_REGISTRY_DIR = registryDirectory;
  vi.restoreAllMocks();
});

describe('UI registry catalog commands', () => {
  it('lists, searches, and views the same generated catalog', async () => {
    const output: string[] = [];
    vi.spyOn(console, 'log').mockImplementation((message?: unknown) => {
      output.push(String(message ?? ''));
    });

    await expect(uiList({ json: true })).resolves.toBe(0);
    const listed = JSON.parse(output.pop() ?? '[]') as Array<{ name: string }>;
    expect(listed.some((item) => item.name === 'button')).toBe(true);

    await expect(uiSearch('date picker', { json: true })).resolves.toBe(0);
    const searched = JSON.parse(output.pop() ?? '[]') as Array<{ name: string }>;
    expect(searched.some((item) => item.name === 'date-picker')).toBe(true);

    await expect(uiView('button', { json: true })).resolves.toBe(0);
    expect(JSON.parse(output.pop() ?? '{}')).toMatchObject({
      name: 'button',
      type: 'registry:ui',
    });
    await expect(uiView('missing', { json: true })).resolves.toBe(1);
  });
});
