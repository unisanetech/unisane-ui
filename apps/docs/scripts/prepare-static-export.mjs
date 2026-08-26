import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const applicationRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = path.join(applicationRoot, 'out');
const testRoutesOutput = path.join(outputRoot, 'test-fixtures');

await fs.rm(testRoutesOutput, { recursive: true, force: true });

console.log(`Public UI website prepared at ${outputRoot}`);
