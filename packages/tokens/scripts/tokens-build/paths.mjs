import { mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const rootDir = join(__dirname, "..", "..");
export const srcDir = join(rootDir, "src");
export const distDir = join(rootDir, "dist");

export function ensureBuildDirs() {
  mkdirSync(distDir, { recursive: true });
}
