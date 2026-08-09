import { rmSync } from 'node:fs';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packagesRoot = resolve(repositoryRoot, 'packages');
const packageRoot = resolve(process.cwd());
const packagePath = relative(packagesRoot, packageRoot);

if (
  packagePath.length === 0 ||
  packagePath.startsWith(`..${sep}`) ||
  packagePath === '..' ||
  packagePath.includes(sep)
) {
  throw new Error(`Refusing to clean output outside a direct package directory: ${packageRoot}`);
}

rmSync(resolve(packageRoot, 'dist'), { recursive: true, force: true });
