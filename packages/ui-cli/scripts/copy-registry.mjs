import { cp, mkdir, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDirectory = path.resolve(packageDirectory, '..', 'ui', 'registry');
const targetDirectory = path.resolve(packageDirectory, 'dist', 'ui-registry');

const registry = JSON.parse(await readFile(path.join(sourceDirectory, 'registry.json'), 'utf8'));
if (registry === null || typeof registry !== 'object' || Array.isArray(registry)) {
  throw new Error('[UI_CLI_REGISTRY_INVALID] UI registry root must be an object.');
}

await rm(targetDirectory, { recursive: true, force: true });
await mkdir(path.dirname(targetDirectory), { recursive: true });
await cp(sourceDirectory, targetDirectory, { recursive: true });
