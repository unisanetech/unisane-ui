export type RegistryItemType = 'registry:ui' | 'registry:lib' | 'registry:hook' | 'registry:file';

export interface RegistryFile {
  path: string;
  type: RegistryItemType;
  target: string;
}

export interface RegistryItem {
  name: string;
  type: RegistryItemType;
  title: string;
  description: string;
  files: RegistryFile[];
  dependencies: string[];
  registryDependencies: string[];
  devDependencies?: string[];
}

export interface Registry {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
}

export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

export type PackageInstallRunner = (
  command: string,
  args: string[],
  cwd: string,
) => number | Promise<number>;

export interface UiAddOptions {
  cwd?: string;
  components?: string[];
  all?: boolean;
  overwrite?: boolean;
  yes?: boolean;
  dryRun?: boolean;
  install?: boolean;
  packageManager?: PackageManager;
  installRunner?: PackageInstallRunner;
}
