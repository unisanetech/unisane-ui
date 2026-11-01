import { describe, expect, it } from 'vitest';
import { read, utils } from 'xlsx';
import { toExcelBlob } from '../../../src/utils/export/excel';
import { toPDFBlob } from '../../../src/utils/export/pdf';
import type { Column } from '../../../src/types';

const data = [
  { id: 'one', name: 'Included item', code: '00123' },
  { id: 'two', name: 'Excluded item', code: '00456' },
];
const columns: Column<(typeof data)[number]>[] = [
  { key: 'name', header: 'Item' },
  { key: 'code', header: 'Code' },
];
const options = { data, columns, selectedOnly: true, selectedIds: new Set(['one']) };

describe('supported binary export formats with patched dependencies', () => {
  it('writes an actual workbook preserving selected rows, headers and numeric-looking text', async () => {
    const blob = await toExcelBlob({ ...options, sheetName: 'Items' });
    const workbook = read(await blob.arrayBuffer(), { type: 'array' });
    expect(workbook.SheetNames).toEqual(['Items']);
    expect(utils.sheet_to_json(workbook.Sheets.Items!, { header: 1 })).toEqual([
      ['Item', 'Code'],
      ['Included item', '00123'],
    ]);
    expect(workbook.Sheets.Items!.B2).toMatchObject({ t: 's', v: '00123' });
  });

  it('writes an actual PDF containing the selected data rather than downloading or reading local files', async () => {
    const blob = await toPDFBlob({ ...options, title: 'Synthetic items' });
    const text = Buffer.from(await blob.arrayBuffer()).toString('latin1');
    expect(text.startsWith('%PDF-')).toBe(true);
    expect(text).toContain('Included item');
    expect(text).toContain('00123');
    expect(text).not.toContain('Excluded item');
  });
});
