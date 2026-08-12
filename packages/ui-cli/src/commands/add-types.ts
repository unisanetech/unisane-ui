export interface ComponentMeta {
  name: string;
  type: string;
  description: string;
  files: string[];
  dependencies: string[];
  registryDependencies: string[];
  devDependencies?: string[];
}

export interface Registry {
  version: string;
  components: Record<string, ComponentMeta>;
}

export interface UnisaneConfig {
  aliases?: {
    components?: string;
    lib?: string;
    hooks?: string;
    types?: string;
  };
  srcDir?: string;
}

export interface UiAddOptions {
  cwd?: string;
  components?: string[];
  all?: boolean;
  overwrite?: boolean;
  yes?: boolean;
  dryRun?: boolean;
}
