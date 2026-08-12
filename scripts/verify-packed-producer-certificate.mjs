#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
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

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
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
const themeNames = Object.freeze([
  'black',
  'blue',
  'cyan',
  'green',
  'neutral',
  'orange',
  'pink',
  'purple',
  'red',
  'yellow',
]);
const packageProfiles = Object.freeze([
  Object.freeze({
    name: '@unisane/tokens',
    directory: 'packages/tokens',
    allowedRoots: Object.freeze(['dist', 'package.json', 'README.md', 'unisane.meta.json']),
  }),
  Object.freeze({
    name: '@unisane/ui',
    directory: 'packages/ui',
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
    directory: 'packages/data-table',
    allowedRoots: Object.freeze(['dist', 'package.json', 'README.md', 'unisane.meta.json']),
  }),
]);
const standaloneConsumerRecords = Object.freeze([
  Object.freeze({
    file: 'certificate/consumer.tsx',
    packageName: '@unisane/tokens',
    specifier: '@unisane/tokens/unisane.css',
    types: Object.freeze([]),
    values: Object.freeze([]),
  }),
  Object.freeze({
    file: 'certificate/consumer.tsx',
    packageName: '@unisane/ui',
    specifier: '@unisane/ui/styles.css',
    types: Object.freeze([]),
    values: Object.freeze([]),
  }),
  Object.freeze({
    file: 'certificate/consumer.tsx',
    packageName: '@unisane/ui',
    specifier: '@unisane/ui/button',
    types: Object.freeze([]),
    values: Object.freeze(['Button']),
  }),
  Object.freeze({
    file: 'certificate/consumer.tsx',
    packageName: '@unisane/data-table',
    specifier: '@unisane/data-table',
    types: Object.freeze(['Column', 'DataTableProps']),
    values: Object.freeze(['DataTable']),
  }),
  Object.freeze({
    file: 'certificate/consumer.tsx',
    packageName: '@unisane/data-table',
    specifier: '@unisane/data-table/export',
    types: Object.freeze([]),
    values: Object.freeze(['preloadPDF', 'preloadXLSX']),
  }),
  Object.freeze({
    file: 'certificate/consumer.tsx',
    packageName: '@unisane/data-table',
    specifier: '@unisane/data-table/styles.css',
    types: Object.freeze([]),
    values: Object.freeze([]),
  }),
]);
export const EXTERNAL_CONSUMER_INSTALL_ARGS = Object.freeze([
  'install',
  '--offline',
  '--ignore-workspace',
  '--config.shared-workspace-lockfile=false',
]);
const packedTarballLocator =
  /file:[^\s"',}\]]*\/tarballs\/unisane-(?:data-table|tokens|ui)-0\.1\.0\.tgz/gu;
const externalConsumerDependencyContracts = Object.freeze([
  Object.freeze({ field: 'peerDependencies', name: 'react' }),
  Object.freeze({ field: 'peerDependencies', name: 'react-dom' }),
  Object.freeze({ field: 'devDependencies', name: '@types/react' }),
  Object.freeze({ field: 'devDependencies', name: '@types/react-dom' }),
]);

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

function emittedSourceKind(entry) {
  if (entry.endsWith('.d.ts')) return ts.ScriptKind.TS;
  if (entry.endsWith('.mjs')) return ts.ScriptKind.JS;
  if (entry.endsWith('.cjs')) return ts.ScriptKind.JS;
  return ts.ScriptKind.JS;
}

function literalModuleSpecifier(node) {
  return ts.isStringLiteralLike(node) ? node.text : null;
}

function collectModuleSpecifiers(entry, content) {
  const specifiers = new Set();
  const source = ts.createSourceFile(
    entry,
    content,
    ts.ScriptTarget.Latest,
    true,
    emittedSourceKind(entry),
  );
  const visit = (node) => {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) {
      const specifier = literalModuleSpecifier(node.moduleSpecifier);
      if (specifier === null) throw new Error(`${entry} contains a nonliteral module declaration.`);
      specifiers.add(specifier);
    }
    if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference)) {
      const specifier = literalModuleSpecifier(node.moduleReference.expression);
      if (specifier === null) throw new Error(`${entry} contains a nonliteral import assignment.`);
      specifiers.add(specifier);
    }
    if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)) {
      const specifier = literalModuleSpecifier(node.argument.literal);
      if (specifier !== null) specifiers.add(specifier);
    }
    if (ts.isCallExpression(node)) {
      let loader = null;
      if (node.expression.kind === ts.SyntaxKind.ImportKeyword) loader = 'import()';
      if (ts.isIdentifier(node.expression) && node.expression.text === 'require') {
        loader = 'require()';
      }
      if (
        ts.isPropertyAccessExpression(node.expression) &&
        ts.isIdentifier(node.expression.expression) &&
        node.expression.expression.text === 'require' &&
        node.expression.name.text === 'resolve'
      ) {
        loader = 'require.resolve()';
      }
      if (loader) {
        if (node.arguments.length !== 1) {
          throw new Error(`${entry} contains ${loader} without one exact literal argument.`);
        }
        const specifier = literalModuleSpecifier(node.arguments[0]);
        if (specifier === null) {
          throw new Error(`${entry} contains nonliteral ${loader} and cannot be certified.`);
        }
        specifiers.add(specifier);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return [...specifiers].sort();
}

function collectEmittedSpecifiers(extractedRoot, entries) {
  const specifiers = new Set();
  for (const entry of entries) {
    if (!entry.startsWith('dist/') || !/\.(?:[cm]?js|d\.[cm]?ts)$/u.test(entry)) continue;
    const content = readFileSync(path.join(extractedRoot, entry), 'utf8');
    for (const specifier of collectModuleSpecifiers(entry, content)) specifiers.add(specifier);
  }
  return [...specifiers].sort();
}

function expandArchiveTarget(target, entries) {
  return target.includes('*')
    ? entries.filter((entry) => wildcardMatches(target, entry))
    : entries.includes(target)
      ? [target]
      : [];
}

function declarationTarget(relativeTarget) {
  if (relativeTarget.endsWith('.mjs')) return relativeTarget.replace(/\.mjs$/u, '.d.mts');
  if (relativeTarget.endsWith('.cjs')) return relativeTarget.replace(/\.cjs$/u, '.d.cts');
  if (relativeTarget.endsWith('.js')) return relativeTarget.replace(/\.js$/u, '.d.ts');
  return relativeTarget;
}

function resolveRelativeArchiveEntry(fromEntry, specifier, entries) {
  const entrySet = new Set(entries);
  const normalized = path.posix.normalize(
    path.posix.join(path.posix.dirname(fromEntry), specifier),
  );
  if (normalized.startsWith('../') || path.posix.isAbsolute(normalized)) {
    throw new Error(`${fromEntry} references a path outside the packed archive: ${specifier}`);
  }
  const declarationFirst = /\.d\.[cm]?ts$/u.test(fromEntry);
  const candidates = [
    ...(declarationFirst ? [declarationTarget(normalized)] : []),
    normalized,
    `${normalized}.js`,
    `${normalized}.d.ts`,
    `${normalized}/index.js`,
    `${normalized}/index.d.ts`,
  ];
  const match = candidates.find((candidate) => entrySet.has(candidate));
  if (!match) throw new Error(`${fromEntry} has an unresolved packed reference: ${specifier}`);
  return match;
}

function registryOwnedEntries(entries, extractedRoot) {
  if (!entries.includes('registry/registry.json')) return [];
  const registry = readJson(path.join(extractedRoot, 'registry/registry.json'));
  const declared = Object.values(registry.components ?? {}).flatMap(({ files = [] }) =>
    files.map((file) => `registry/${file}`),
  );
  return [
    ...declared,
    'registry/registry.json',
    'registry/registry-schema.json',
    'registry/tsconfig.json',
    'registry/styles/globals.css',
    ...themeNames.map((theme) => `registry/styles/themes/${theme}.css`),
  ];
}

function assertExactArchiveClosure(profile, manifest, targets, entries, extractedRoot) {
  const owned = new Set(
    ['package.json', 'README.md', 'unisane.meta.json'].filter((entry) => entries.includes(entry)),
  );
  const queue = [...new Set(targets.flatMap((target) => expandArchiveTarget(target, entries)))];
  if (profile.name === '@unisane/tokens') {
    queue.push(...themeNames.map((theme) => `dist/themes/${theme}.css`));
  }
  if (profile.name === '@unisane/ui') queue.push(...registryOwnedEntries(entries, extractedRoot));
  while (queue.length > 0) {
    const entry = queue.shift();
    if (owned.has(entry)) continue;
    if (!entries.includes(entry)) {
      throw new Error(`${profile.name} owns a missing packed archive entry: ${entry}`);
    }
    owned.add(entry);
    const sourceMap = `${entry}.map`;
    if (entries.includes(sourceMap)) owned.add(sourceMap);
    const pairedEntry = /\.d\.ts$/u.test(entry)
      ? entry.replace(/\.d\.ts$/u, '.js')
      : /\.js$/u.test(entry)
        ? entry.replace(/\.js$/u, '.d.ts')
        : null;
    if (pairedEntry && entries.includes(pairedEntry)) queue.push(pairedEntry);
    if (!/\.(?:[cm]?js|d\.[cm]?ts)$/u.test(entry)) continue;
    const content = readFileSync(path.join(extractedRoot, entry), 'utf8');
    for (const specifier of collectModuleSpecifiers(entry, content)) {
      if (specifier.startsWith('.')) {
        queue.push(resolveRelativeArchiveEntry(entry, specifier, entries));
      }
    }
  }
  const unexpected = entries.filter((entry) => !owned.has(entry));
  if (unexpected.length > 0) {
    throw new Error(`${profile.name} has unowned archive entries: ${unexpected.join(', ')}`);
  }
  return owned.size;
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
  const ownedArchiveEntryCount = assertExactArchiveClosure(
    profile,
    manifest,
    targets,
    entries,
    extractedRoot,
  );
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
  return { emittedSpecifiers, exportTargetCount: new Set(targets).size, ownedArchiveEntryCount };
}

function packageExportKey(specifier, packageName) {
  if (specifier === packageName) return '.';
  return `./${specifier.slice(packageName.length + 1)}`;
}

export function collectConsumerImports() {
  return standaloneConsumerRecords.map((record) => ({
    ...record,
    types: [...record.types],
    values: [...record.values],
  }));
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

export function assertExternalConsumerLock(lock) {
  const withoutPackedTarballs = lock.replace(packedTarballLocator, '');
  if (
    /(?:^|[\s'"])(?:workspace|file|link|portal):|(?:\.\.\/)+(?:Unisane|unisane-(?:ops|pro|ui|site|platforms|infrastructure))(?:\/|$)/mu.test(
      withoutPackedTarballs,
    )
  ) {
    throw new Error(
      'External consumer lock retained a workspace, file, link, portal, sibling, or source fallback.',
    );
  }
}

function isPathInside(root, candidate) {
  const relative = path.relative(root, candidate);
  return (
    relative === '' ||
    (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative))
  );
}

function compareVersions(left, right) {
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) return left[index] - right[index];
  }
  return 0;
}

function assertDeclaredVersion(dependencyName, declaredRange, installedVersion) {
  const versionMatch = /^(\d+)\.(\d+)\.(\d+)$/u.exec(installedVersion);
  if (!versionMatch) {
    throw new Error(
      `${dependencyName} resolved an unsupported installed version: ${installedVersion}`,
    );
  }
  const installed = versionMatch.slice(1).map(Number);
  const exactMatch = /^(\d+)\.(\d+)\.(\d+)$/u.exec(declaredRange);
  if (exactMatch) {
    if (compareVersions(installed, exactMatch.slice(1).map(Number)) !== 0) {
      throw new Error(
        `${dependencyName} installed version ${installedVersion} does not match ${declaredRange}.`,
      );
    }
    return;
  }
  const caretMatch = /^\^(\d+)(?:\.(\d+))?(?:\.(\d+))?$/u.exec(declaredRange);
  if (!caretMatch) {
    throw new Error(`${dependencyName} must use an exact or caret semver declaration.`);
  }
  const lower = caretMatch.slice(1).map((part) => Number(part ?? 0));
  const upper =
    lower[0] > 0
      ? [lower[0] + 1, 0, 0]
      : lower[1] > 0
        ? [0, lower[1] + 1, 0]
        : [0, 0, lower[2] + 1];
  if (compareVersions(installed, lower) < 0 || compareVersions(installed, upper) >= 0) {
    throw new Error(
      `${dependencyName} installed version ${installedVersion} does not satisfy ${declaredRange}.`,
    );
  }
}

export function resolveOwnedDependencyVersions({
  targetRoot = repositoryRoot,
  ownerDirectory = 'packages/ui',
  contracts = externalConsumerDependencyContracts,
} = {}) {
  const targetRealRoot = realpathSync(targetRoot);
  const ownerRoot = realpathSync(path.join(targetRealRoot, ownerDirectory));
  if (!isPathInside(targetRealRoot, ownerRoot)) {
    throw new Error(`Dependency owner escapes the standalone target: ${ownerDirectory}`);
  }
  const ownerManifestPath = path.join(ownerRoot, 'package.json');
  const ownerManifest = readJson(ownerManifestPath);
  const ownerRequire = createRequire(ownerManifestPath);
  return Object.fromEntries(
    contracts.map(({ field, name }) => {
      const declaredRange = ownerManifest[field]?.[name];
      if (typeof declaredRange !== 'string' || localSpecifier.test(declaredRange)) {
        throw new Error(
          `${ownerManifest.name}.${field}.${name} must declare an external version range.`,
        );
      }
      const ownerInstalledManifest = path.join(
        ownerRoot,
        'node_modules',
        ...name.split('/'),
        'package.json',
      );
      if (!existsSync(ownerInstalledManifest)) {
        throw new Error(`${name} is not installed in ${ownerManifest.name}'s dependency graph.`);
      }
      const ownerInstalledRealPath = realpathSync(ownerInstalledManifest);
      const resolvedRealPath = realpathSync(ownerRequire.resolve(`${name}/package.json`));
      if (resolvedRealPath !== ownerInstalledRealPath) {
        throw new Error(
          `${name} did not resolve through ${ownerManifest.name}'s installed dependency graph.`,
        );
      }
      if (!isPathInside(targetRealRoot, resolvedRealPath)) {
        throw new Error(`${name} resolved outside the standalone target.`);
      }
      const installedManifest = readJson(resolvedRealPath);
      if (installedManifest.name !== name || typeof installedManifest.version !== 'string') {
        throw new Error(`${name} resolved an invalid installed package manifest.`);
      }
      assertDeclaredVersion(name, declaredRange, installedManifest.version);
      return [name, installedManifest.version];
    }),
  );
}

function verifyExternalConsumer(workRoot, candidates, records) {
  const fixtureRoot = path.join(workRoot, 'consumer');
  mkdirSync(fixtureRoot, { recursive: true });
  const candidateByName = new Map(candidates.map((candidate) => [candidate.name, candidate]));
  const dependencyVersions = resolveOwnedDependencyVersions();
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
      react: dependencyVersions.react,
      'react-dom': dependencyVersions['react-dom'],
    },
    devDependencies: {
      '@types/react': dependencyVersions['@types/react'],
      '@types/react-dom': dependencyVersions['@types/react-dom'],
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
  run('pnpm', EXTERNAL_CONSUMER_INSTALL_ARGS, { cwd: fixtureRoot });
  const lock = readFileSync(path.join(fixtureRoot, 'pnpm-lock.yaml'), 'utf8');
  assertExternalConsumerLock(lock);
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

function assertPathsMatchRevision(revision, paths, label) {
  const result = spawnSync('git', ['diff', '--quiet', revision, '--', ...paths], {
    cwd: repositoryRoot,
    encoding: 'utf8',
    stdio: 'pipe',
  });
  if (result.status !== 0) {
    throw new Error(`${label} do not match immutable revision ${revision}.`);
  }
}

function collectSourceIdentity(records) {
  const producerPaths = packageProfiles.map(({ directory }) => directory);
  const producerRevision = run('git', ['rev-parse', 'HEAD']).trim();
  assertPathsMatchRevision(producerRevision, producerPaths, 'Producer package paths');
  return {
    consumerContract: {
      authority: 'standalone-target-owned',
      digest: hashValue(records),
      source: 'scripts/verify-packed-producer-certificate.mjs',
    },
    producerGit: {
      revision: producerRevision,
      tree: run('git', ['rev-parse', `${producerRevision}^{tree}`]).trim(),
      paths: producerPaths,
    },
  };
}

export function buildCertificateSummary(
  candidates,
  consumerImports,
  consumerProof,
  sourceIdentity,
) {
  const producerContentDigest = hashValue(
    candidates.map(({ contentDigest, manifest, name }) => ({ contentDigest, manifest, name })),
  );
  const consumerImportDigest = hashValue(consumerImports);
  return {
    schemaVersion: 1,
    sourceIdentity: {
      ...sourceIdentity,
      producerContentDigest,
      consumerImportDigest,
      certificateInputDigest: hashValue({ producerContentDigest, consumerImportDigest }),
    },
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
        ownedArchiveEntryCount: boundary.ownedArchiveEntryCount,
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

export function writeCertificateArtifact(summary, artifactRoot = process.env.SKOPOS_ARTIFACT_ROOT) {
  if (!artifactRoot) return null;
  const artifactPath = path.join(artifactRoot, 'unisane-ui', 'packed-producer-certificate.json');
  mkdirSync(path.dirname(artifactPath), { recursive: true });
  writeJson(artifactPath, summary);
  return artifactPath;
}

export function main() {
  const workRoot = mkdtempSync(path.join(tmpdir(), 'unisane-ui-packed-certificate-'));
  try {
    const candidates = buildAndPackCandidates(workRoot);
    const packedManifests = assertExactInternalCoordinates(candidates);
    const records = collectConsumerImports();
    const consumerImports = assertConsumerCoverage(records, packedManifests);
    const consumerProof = verifyExternalConsumer(workRoot, candidates, records);
    const sourceIdentity = collectSourceIdentity(records);
    const summary = buildCertificateSummary(
      candidates,
      consumerImports,
      consumerProof,
      sourceIdentity,
    );
    writeCertificateArtifact(summary);
    console.log(JSON.stringify(summary, null, 2));
  } finally {
    if (existsSync(workRoot)) rmSync(workRoot, { recursive: true, force: true });
  }
}

if (path.resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) main();
