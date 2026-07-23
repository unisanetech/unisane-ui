import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageJson = JSON.parse(await readFile(path.join(packageDir, 'package.json'), 'utf8'));
const runtimeSubpaths = Object.entries(packageJson.exports)
  .filter(([, target]) => typeof target === 'object' && typeof target.import === 'string')
  .map(([subpath]) => subpath.slice(2))
  .sort();

for (const subpath of runtimeSubpaths) {
  const module = await import(`@unisane/ui/${subpath}`);
  if (subpath !== 'navigation' && Object.keys(module).length === 0) {
    throw new Error(`@unisane/ui/${subpath} has no runtime exports`);
  }
}

if (packageJson.exports['.']) {
  throw new Error('The retired @unisane/ui root runtime export is still public.');
}
if (Object.keys(packageJson.exports).some((subpath) => subpath.includes('*'))) {
  throw new Error('Wildcard UI runtime exports are not allowed.');
}

console.log(
  `Runtime export check passed for all ${runtimeSubpaths.length} explicit flat subpaths.`,
);
