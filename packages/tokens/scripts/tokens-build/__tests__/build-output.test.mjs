import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { generateBuildArtifacts } from "../build-pipeline.mjs";
import { validateThemeConfig, validateThemeOverride } from "../theme-validation.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const snapshotsDir = join(__dirname, "..", "__snapshots__");
const blueSnapshotPath = join(snapshotsDir, "blue.unisane.css");

function syncSnapshot(filePath, content) {
  if (process.env.UPDATE_SNAPSHOTS === "1") {
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, content);
  }
}

test("blue theme CSS matches snapshot", () => {
  const { mergedCss } = generateBuildArtifacts("blue");
  syncSnapshot(blueSnapshotPath, mergedCss);

  const expected = readFileSync(blueSnapshotPath, "utf-8");
  assert.equal(mergedCss, expected);
});

test("cyan theme build output differs from blue and uses hue 195", () => {
  const { mergedCss: blueCss } = generateBuildArtifacts("blue");
  const { mergedCss: cyanCss } = generateBuildArtifacts("cyan");

  assert.notEqual(cyanCss, blueCss);
  assert.match(cyanCss, /:root\[data-color-theme="cyan"\]\s*\{[\s\S]*?--hue:\s*195;/);
});

test("merged CSS includes all required sections", () => {
  const { mergedCss } = generateBuildArtifacts("blue");

  assert.match(mergedCss, /@layer unisane-defaults/);
  assert.match(mergedCss, /@theme\s*\{/);
  assert.match(mergedCss, /SHARED RUNTIME UTILITIES/);
  assert.match(mergedCss, /\.duration-short\s*\{/);
});

test("theme config validation rejects unknown keys", () => {
  assert.throws(
    () =>
      validateThemeConfig(
        {
          name: "Invalid",
          primary: { hue: 230, chroma: 0.15 },
          secondary: { strategy: "analogous", hueShift: 0, chromaScale: 0.7 },
          tertiary: { strategy: "complementary", hueShift: 60, chromaScale: 0.7 },
          neutral: { tintFromPrimary: 0.012 },
          error: { hue: 25, chroma: 0.18 },
          unknown: true,
        },
        "inline-config.json",
      ),
    /\$\.unknown is not allowed/,
  );
});

test("theme override validation enforces schema reference when provided", () => {
  assert.throws(
    () =>
      validateThemeOverride(
        {
          $schema: "./wrong.schema.json",
          name: "Bad Override",
          primary: { hue: 195 },
        },
        "inline-override.json",
      ),
    /\$schema must equal "\.\/theme-override\.schema\.json"/,
  );
});
