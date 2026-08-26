import fse from 'fs-extra';

const { existsSync, readFileSync, removeSync, writeFileSync } = fse;

interface FileSnapshot {
  path: string;
  content: Buffer | null;
}

export class FileTransaction {
  readonly #snapshots: FileSnapshot[];

  constructor(paths: Iterable<string>) {
    this.#snapshots = Array.from(new Set(paths), (filePath) => ({
      path: filePath,
      content: existsSync(filePath) ? readFileSync(filePath) : null,
    }));
  }

  rollback(): void {
    for (const snapshot of this.#snapshots) {
      if (snapshot.content === null) {
        removeSync(snapshot.path);
      } else {
        writeFileSync(snapshot.path, snapshot.content);
      }
    }
  }
}
