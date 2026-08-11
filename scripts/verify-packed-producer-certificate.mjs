#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const dependencyFields = [
  'dependencies',
  'optionalDependencies',
  'peerDependencies',
  'devDependencies',
];
const runtimeDependencyFields = ['dependencies', 'optionalDependencies', 'peerDependencies'];
const localSpecifier = /^(?:workspace|file|link|portal):|^(?:\.{1,2}[\\/]|\/)/iu;
const forbiddenArchivePath =
  /(?:^|\/)(?:\.git|\.skopos|\.turbo|coverage|node_modules|src|test|tests|tmp)(?:\/|$)/iu;
const forbiddenEmittedReference =
  /["'](?:workspace|file|link|portal):|(?:^|["'(])(?:\.\.\/)+(?:unisane|unisane-(?:ops|pro|ui|site|platforms|infrastructure))(?:\/|["')])/mu;
const packageProfiles = Object.freeze([
  Object.freeze({
    name: '@unisane/tokens',
    directory: 'unisane-ui/packages/tokens',
    allowedRoots: Object.freeze(['dist', 'package.json', 'README.md', 'unisane.meta.json']),
  }),
  Object.freeze({
    name: '@unisane/ui',
    directory: 'unisane-ui/packages/ui',
    allowedRoots: Object.freeze([
      'dist',
      'registry',
      'package.json',
      'README.md',
      'unisane.meta.json',
    ]),
  }),
  Object.freeze({
    name: '@unisane/data-table',
    directory: 'unisane-ui/packages/data-table',
    allowedRoots: Object.freeze(['dist', 'package.json', 'README.md', 'unisane.meta.json']),
  }),
]);
const consumerRoots = Object.freeze(['unisane/starters/saaskit', 'unisane-ops/apps/console']);

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function sha256File(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex');
}

function integritySha512(filePath) {
  return `sha512-${createHash('sha512').update(readFileSync(filePath)).digest('base64')}`;
}

function archiveContentDigest(entries, extractedRoot) {
  return hashValue(
    entries.map((entry) => ({
      path: entry,
      sha256: sha256File(path.join(extractedRoot, entry)),
    })),
  );
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => [key, stableValue(entry)]),
  );
}

function hashValue(value) {
  return createHash('sha256')
    .update(JSON.stringify(stableValue(value)))
    .digest('hex');
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? repositoryRoot,
    encoding: 'utf8',
    env: { ...process.env, ...options.env },
    stdio: options.capture === false ? 'inherit' : 'pipe',
  });
  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(' ')} failed (${result.status ?? 'signal'}).\n${result.stderr || result.stdout || ''}`,
    );
  }
  return result.stdout ?? '';
}

function walkFiles(directory, results = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (['.git', '.next', '.turbo', 'dist', 'node_modules'].includes(entry.name)) continue;
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walkFiles(entryPath, results);
    else results.push(entryPath);
  }
  return results;
}

function collectExportTargets(value, targets = []) {
  if (typeof value === 'string') {
    targets.push(value.replace(/^\.\//u, ''));
  } else if (value && typeof value === 'object') {
    for (const child of Object.values(value)) collectExportTargets(child, targets);
  }
  return targets;
}

function wildcardMatches(pattern, candidate) {
  const expression = new RegExp(
    `^${pattern
      .split('*')
      .map((part) => part.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&'))
      .join('.+')}$`,
    'u',
  );
  return expression.test(candidate);
}

function dependencyEntries(manifest, fields = dependencyFields) {
  return fields.flatMap((field) =>
    Object.entries(manifest[field] ?? {}).map(([name, specifier]) => ({ field, name, specifier })),
  );
}

function barePackageName(specifier) {
  if (specifier.startsWith('@')) return specifier.split('/').slice(0, 2).join('/');
  return specifier.split('/')[0];
}

function collectEmittedSpecifiers(extractedRoot, entries) {
  const specifiers = new Set();
  const importExpression = /(?:from\s+|import\s*\(|import\s+|require\s*\()\s*["']([^"']+)["']/gu;
  for (const entry of entries) {
    if (!entry.startsWith('dist/') || !/\.(?:d\.ts|js)$/u.test(entry)) continue;
    const content = readFileSync(path.join(extractedRoot, entry), 'utf8');
    for (const match of content.matchAll(importExpression)) specifiers.add(match[1]);
  }
  return [...specifiers].sort();
}

export function assertPackedManifest(profile, manifest, entries, extractedRoot) {
  if (manifest.name !== profile.name || manifest.version !== '0.1.0') {
    throw new Error(`${profile.name} packed identity must remain exact 0.1.0.`);
  }
  if (manifest.private !== true || manifest.license !== 'UNLICENSED') {
    throw new Error(`${profile.name} must remain fail-closed for publication and legal approval.`);
  }
  const localDependencies = dependencyEntries(manifest).filter(({ specifier }) =>
    localSpecifier.test(specifier),
  );
  if (localDependencies.length > 0) {
    throw new Error(
      `${profile.name} packed manifest retains local dependency locators: ${localDependencies
        .map(({ field, name, specifier }) => `${field}.${name}=${specifier}`)
        .join(', ')}`,
    );
  }
  const unexpectedRoots = entries.filter(
    (entry) => !profile.allowedRoots.includes(entry.split('/')[0]),
  );
  const forbiddenEntries = entries.filter((entry) => forbiddenArchivePath.test(entry));
  if (unexpectedRoots.length > 0 || forbiddenEntries.length > 0) {
    throw new Error(
      `${profile.name} archive boundary failed: ${[...unexpectedRoots, ...forbiddenEntries].join(', ')}`,
    );
  }
  const targets = collectExportTargets(manifest.exports);
  for (const field of ['main', 'module', 'types']) {
    if (typeof manifest[field] === 'string') targets.push(manifest[field].replace(/^\.\//u, ''));
  }
  const missingTargets = [...new Set(targets)].filter((target) =>
    target.includes('*')
      ? !entries.some((entry) => wildcardMatches(target, entry))
      : !entries.includes(target),
  );
  if (missingTargets.length > 0) {
    throw new Error(
      `${profile.name} is missing packed export targets: ${missingTargets.join(', ')}`,
    );
  }
  const declaredRuntimePackages = new Set(
    dependencyEntries(manifest, runtimeDependencyFields).map(({ name }) => name),
  );
  const emittedSpecifiers = collectEmittedSpecifiers(extractedRoot, entries);
  const undeclared = emittedSpecifiers.filter((specifier) => {
    if (specifier.startsWith('.') || specifier.startsWith('node:')) return false;
    return !declaredRuntimePackages.has(barePackageName(specifier));
  });
  if (undeclared.length > 0) {
    throw new Error(
      `${profile.name} emits undeclared package references: ${undeclared.join(', ')}`,
    );
  }
  for (const entry of entries) {
    if (!entry.startsWith('dist/') || !/\.(?:css|d\.ts|js)$/u.test(entry)) continue;
    const content = readFileSync(path.join(extractedRoot, entry), 'utf8');
    if (forbiddenEmittedReference.test(content)) {
      throw new Error(`${profile.name} emitted sibling or local locator in ${entry}.`);
    }
  }
  return { emittedSpecifiers, exportTargetCount: new Set(targets).size };
}

function packageExportKey(specifier, packageName) {
  if (specifier === packageName) return '.';
  return `./${specifier.slice(packageName.length + 1)}`;
}

function sourceKind(filePath) {
  if (filePath.endsWith('.tsx')) return ts.ScriptKind.TSX;
  if (filePath.endsWith('.ts')) return ts.ScriptKind.TS;
  if (filePath.endsWith('.jsx')) return ts.ScriptKind.JSX;
  return ts.ScriptKind.JS;
}

export function collectConsumerImports(root = repositoryRoot) {
  const records = [];
  for (const relativeRoot of consumerRoots) {
    const absoluteRoot = path.join(root, relativeRoot);
    for (const filePath of walkFiles(absoluteRoot)) {
      if (!/\.[cm]?[jt]sx?$/u.test(filePath)) continue;
      const source = ts.createSourceFile(
        filePath,
        readFileSync(filePath, 'utf8'),
        ts.ScriptTarget.Latest,
        true,
        sourceKind(filePath),
      );
      for (const statement of source.statements) {
        if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) {
          continue;
        }
        const specifier = statement.moduleSpecifier.text;
        const packageName = packageProfiles.find(
          ({ name }) => specifier === name || specifier.startsWith(`${name}/`),
        )?.name;
        if (!packageName) continue;
        const values = [];
        const types = [];
        const clause = statement.importClause;
        if (clause?.name) (clause.isTypeOnly ? types : values).push('default');
        if (clause?.namedBindings && ts.isNamespaceImport(clause.namedBindings)) {
          (clause.isTypeOnly ? types : values).push('*');
        }
        if (clause?.namedBindings && ts.isNamedImports(clause.namedBindings)) {
          for (const element of clause.namedBindings.elements) {
            const name = element.propertyName?.text ?? element.name.text;
            (clause.isTypeOnly || element.isTypeOnly ? types : values).push(name);
          }
        }
        records.push({
          file: path.relative(root, filePath),
          packageName,
          specifier,
          types: [...new Set(types)].sort(),
          values: [...new Set(values)].sort(),
        });
      }
    }
  }
  return records.sort((left, right) =>
    `${left.file}:${left.specifier}`.localeCompare(`${right.file}:${right.specifier}`),
  );
}

export function assertConsumerCoverage(records, packedManifests) {
  if (records.length === 0) throw new Error('No UI consumer imports were discovered.');
  for (const record of records) {
    const manifest = packedManifests.get(record.packageName);
    const exportKey = packageExportKey(record.specifier, record.packageName);
    if (!manifest || !(exportKey in (manifest.exports ?? {}))) {
      throw new Error(`${record.specifier} is consumed but absent from the packed export map.`);
    }
  }
  return {
    importDeclarationCount: records.length,
    sourceFileCount: new Set(records.map(({ file }) => file)).size,
    specifiers: [...new Set(records.map(({ specifier }) => specifier))].sort(),
    values: [...new Set(records.flatMap(({ values }) => values))].sort(),
    types: [...new Set(records.flatMap(({ types }) => types))].sort(),
  };
}

function archiveEntries(tarballPath) {
  return run('tar', ['-tzf', tarballPath])
    .split('\n')
    .filter(Boolean)
    .map((entry) => entry.replace(/^package\//u, '').replace(/\/$/u, ''))
    .filter(Boolean)
    .sort();
}

function buildAndPackCandidates(workRoot) {
  const tarballRoot = path.join(workRoot, 'tarballs');
  const extractedRoot = path.join(workRoot, 'extracted');
  mkdirSync(tarballRoot, { recursive: true });
  mkdirSync(extractedRoot, { recursive: true });
  for (const profile of packageProfiles) {
    run('pnpm', ['--filter', profile.name, 'build']);
    run('pnpm', ['--filter', profile.name, 'pack', '--pack-destination', tarballRoot]);
  }
  const tarballs = readdirSync(tarballRoot).filter((entry) => entry.endsWith('.tgz'));
  return packageProfiles.map((profile) => {
    const expectedPrefix = profile.name.replace('@', '').replace('/', '-');
    const tarballName = tarballs.find((entry) => entry === `${expectedPrefix}-0.1.0.tgz`);
    if (!tarballName) throw new Error(`Missing packed artifact for ${profile.name}.`);
    const tarballPath = path.join(tarballRoot, tarballName);
    const packageRoot = path.join(extractedRoot, expectedPrefix);
    mkdirSync(packageRoot, { recursive: true });
    run('tar', ['-xzf', tarballPath, '-C', packageRoot, '--strip-components=1']);
    const entries = archiveEntries(tarballPath);
    const manifest = readJson(path.join(packageRoot, 'package.json'));
    const boundary = assertPackedManifest(profile, manifest, entries, packageRoot);
    return {
      ...profile,
      tarballPath,
      packageRoot,
      manifest,
      entries,
      boundary,
      bytes: statSync(tarballPath).size,
      contentDigest: archiveContentDigest(entries, packageRoot),
      runArtifactSha256: sha256File(tarballPath),
      runArtifactIntegrity: integritySha512(tarballPath),
    };
  });
}

function fixtureImports(records) {
  const bySpecifier = new Map();
  for (const record of records) {
    const current = bySpecifier.get(record.specifier) ?? { types: new Set(), values: new Set() };
    record.types.forEach((name) => current.types.add(name));
    record.values.forEach((name) => current.values.add(name));
    bySpecifier.set(record.specifier, current);
  }
  const typeLines = [];
  const valueLines = [];
  const runtimeChecks = [];
  let index = 0;
  for (const [specifier, imports] of [...bySpecifier].sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    if (specifier.endsWith('.css')) continue;
    const typeNames = [...imports.types].filter((name) => name !== '*' && name !== 'default');
    if (typeNames.length > 0) {
      typeLines.push(
        `import type { ${typeNames.map((name) => `${name} as T${index++}`).join(', ')} } from ${JSON.stringify(specifier)};`,
      );
    }
    const valueNames = [...imports.values].filter((name) => name !== '*' && name !== 'default');
    if (valueNames.length > 0) {
      const aliases = valueNames.map((name) => ({ alias: `V${index++}`, name }));
      valueLines.push(
        `import { ${aliases.map(({ alias, name }) => `${name} as ${alias}`).join(', ')} } from ${JSON.stringify(specifier)};`,
      );
      valueLines.push(`void [${aliases.map(({ alias }) => alias).join(', ')}];`);
      runtimeChecks.push({ specifier, values: valueNames });
    } else {
      runtimeChecks.push({ specifier, values: [] });
    }
  }
  return { runtimeChecks, source: `${typeLines.join('\n')}\n${valueLines.join('\n')}\n` };
}

function verifyExternalConsumer(workRoot, candidates, records) {
  const fixtureRoot = path.join(workRoot, 'consumer');
  mkdirSync(fixtureRoot, { recursive: true });
  const candidateByName = new Map(candidates.map((candidate) => [candidate.name, candidate]));
  const reactVersion = readJson(
    path.join(repositoryRoot, 'node_modules/react/package.json'),
  ).version;
  const reactDomVersion = readJson(
    path.join(repositoryRoot, 'node_modules/react-dom/package.json'),
  ).version;
  const reactTypesVersion = readJson(
    path.join(repositoryRoot, 'node_modules/@types/react/package.json'),
  ).version;
  const reactDomTypesVersion = readJson(
    path.join(repositoryRoot, 'node_modules/@types/react-dom/package.json'),
  ).version;
  const fileSpecifier = (name) => `file:${candidateByName.get(name).tarballPath}`;
  writeJson(path.join(fixtureRoot, 'package.json'), {
    name: 'unisane-ui-packed-certificate-consumer',
    version: '0.0.0',
    private: true,
    type: 'module',
    scripts: { check: 'tsc -p tsconfig.json && node runtime-check.mjs' },
    dependencies: {
      '@unisane/data-table': fileSpecifier('@unisane/data-table'),
      '@unisane/tokens': fileSpecifier('@unisane/tokens'),
      '@unisane/ui': fileSpecifier('@unisane/ui'),
      react: reactVersion,
      'react-dom': reactDomVersion,
    },
    devDependencies: {
      '@types/react': reactTypesVersion,
      '@types/react-dom': reactDomTypesVersion,
      typescript: '5.9.2',
    },
    pnpm: {
      overrides: {
        '@unisane/tokens@0.1.0': fileSpecifier('@unisane/tokens'),
        '@unisane/ui@0.1.0': fileSpecifier('@unisane/ui'),
      },
    },
    packageManager: 'pnpm@10.26.0',
  });
  writeJson(path.join(fixtureRoot, 'tsconfig.json'), {
    compilerOptions: {
      strict: true,
      target: 'ES2022',
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      jsx: 'react-jsx',
      skipLibCheck: false,
      noEmit: true,
    },
    include: ['consumer.tsx'],
  });
  const imports = fixtureImports(records);
  writeFileSync(
    path.join(fixtureRoot, 'consumer.tsx'),
    `${imports.source}\nimport type { Column, DataTableProps } from '@unisane/data-table';\ntype Row = { id: string; name: string };\nconst columns: Column<Row>[] = [{ key: 'name', header: 'Name' }];\nconst props: DataTableProps<Row> = { data: [{ id: '1', name: 'Ada' }], columns };\nvoid props;\n`,
  );
  writeFileSync(
    path.join(fixtureRoot, 'runtime-check.mjs'),
    `import { readFile } from 'node:fs/promises';\nimport { createElement } from 'react';\nimport { renderToStaticMarkup } from 'react-dom/server';\nimport { Button } from '@unisane/ui/button';\nimport { DataTable } from '@unisane/data-table';\nimport { preloadPDF, preloadXLSX } from '@unisane/data-table/export';\nconst checks = ${JSON.stringify(imports.runtimeChecks)};\nfor (const check of checks) {\n  const loaded = await import(check.specifier);\n  for (const name of check.values) {\n    if (!(name in loaded)) throw new Error(check.specifier + ' lacks runtime export ' + name);\n  }\n}\nconst stylesheets = ['@unisane/tokens/unisane.css', '@unisane/ui/styles.css', '@unisane/data-table/styles.css'];\nconst stylesheetBytes = {};\nfor (const stylesheet of stylesheets) {\n  const resolved = import.meta.resolve(stylesheet);\n  if (!resolved.startsWith('file:')) throw new Error('Stylesheet did not resolve: ' + stylesheet);\n  const content = await readFile(new URL(resolved), 'utf8');\n  if (content.length < 500) throw new Error('Stylesheet is unexpectedly empty: ' + stylesheet);\n  stylesheetBytes[stylesheet] = content.length;\n}\nfor (const stylesheet of stylesheets.slice(0, 2)) {\n  const content = await readFile(new URL(import.meta.resolve(stylesheet)), 'utf8');\n  if (!content.includes('--color-primary')) throw new Error('Token baseline is absent from ' + stylesheet);\n}\nconst buttonHtml = renderToStaticMarkup(createElement(Button, null, 'Packed UI'));\nif (!buttonHtml.includes('Packed UI')) throw new Error('Button SSR smoke failed.');\nconst tableHtml = renderToStaticMarkup(createElement(DataTable, { data: [{ id: '1', name: 'Ada' }], columns: [{ key: 'name', header: 'Name' }], preset: 'simple' }));\nif (!tableHtml.includes('Ada')) throw new Error('DataTable SSR smoke failed.');\nawait preloadXLSX();\nawait preloadPDF();\nconsole.log(JSON.stringify({ runtimeModules: checks.length, buttonSsr: true, dataTableSsr: true, dynamicExports: ['xlsx', 'jspdf', 'jspdf-autotable'], stylesheetBytes }));\n`,
  );
  const installArgs = ['install', '--ignore-workspace', '--config.shared-workspace-lockfile=false'];
  run('pnpm', installArgs, { cwd: fixtureRoot });
  const lock = readFileSync(path.join(fixtureRoot, 'pnpm-lock.yaml'), 'utf8');
  if (/workspace:|link:|(?:\.\.\/)+(?:Unisane|unisane-ui)/u.test(lock)) {
    throw new Error('External consumer lock retained a workspace, sibling, or source link.');
  }
  for (const profile of packageProfiles) {
    const installedRoot = realpathSync(
      path.join(fixtureRoot, 'node_modules', ...profile.name.split('/')),
    );
    if (!installedRoot.startsWith(realpathSync(fixtureRoot))) {
      throw new Error(`${profile.name} resolved outside the disposable consumer.`);
    }
  }
  run('pnpm', ['check'], { cwd: fixtureRoot, env: { NODE_ENV: 'production' } });
  return {
    lockSha256: sha256File(path.join(fixtureRoot, 'pnpm-lock.yaml')),
    runtimeModuleCount: imports.runtimeChecks.length,
    stylesheetCount: 3,
    dynamicDependencies: ['jspdf', 'jspdf-autotable', 'xlsx'],
  };
}

function assertExactInternalCoordinates(candidates) {
  const manifests = new Map(candidates.map((candidate) => [candidate.name, candidate.manifest]));
  if (manifests.get('@unisane/ui').dependencies?.['@unisane/tokens'] !== '0.1.0') {
    throw new Error('Packed UI must depend on exact @unisane/tokens 0.1.0.');
  }
  if (manifests.get('@unisane/data-table').peerDependencies?.['@unisane/ui'] !== '0.1.0') {
    throw new Error('Packed DataTable must peer on exact @unisane/ui 0.1.0.');
  }
  for (const dependency of ['xlsx', 'jspdf', 'jspdf-autotable']) {
    if (!(dependency in (manifests.get('@unisane/data-table').dependencies ?? {}))) {
      throw new Error(`Packed DataTable does not declare dynamic dependency ${dependency}.`);
    }
  }
  return manifests;
}

export function buildCertificateSummary(candidates, consumerImports, consumerProof) {
  return {
    schemaVersion: 1,
    sourceBaseline: '4f9d4a637ab271351a4c7b677b11792490b1c791',
    sourceInputDigest: hashValue({
      artifacts: candidates.map(({ contentDigest, manifest, name }) => ({
        contentDigest,
        manifest,
        name,
      })),
      consumerImports,
    }),
    artifacts: candidates.map(
      ({
        boundary,
        bytes,
        contentDigest,
        entries,
        manifest,
        name,
        runArtifactIntegrity,
        runArtifactSha256,
      }) => ({
        name,
        version: manifest.version,
        private: manifest.private,
        license: manifest.license,
        bytes,
        fileCount: entries.length,
        exportTargetCount: boundary.exportTargetCount,
        contentDigest,
        runArtifactSha256,
        runArtifactIntegrity,
      }),
    ),
    consumerImports,
    consumerProof,
    externalEffects: [],
    publicationAuthorized: false,
    consumerConversionAuthorized: false,
  };
}

export function main() {
  const workRoot = mkdtempSync(path.join(tmpdir(), 'unisane-ui-packed-certificate-'));
  try {
    const candidates = buildAndPackCandidates(workRoot);
    const packedManifests = assertExactInternalCoordinates(candidates);
    const records = collectConsumerImports();
    const consumerImports = assertConsumerCoverage(records, packedManifests);
    const consumerProof = verifyExternalConsumer(workRoot, candidates, records);
    const summary = buildCertificateSummary(candidates, consumerImports, consumerProof);
    console.log(JSON.stringify(summary, null, 2));
  } finally {
    if (existsSync(workRoot)) rmSync(workRoot, { recursive: true, force: true });
  }
}

if (path.resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) main();
