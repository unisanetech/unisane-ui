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
const consumerImportBaseline = '4f9d4a637ab271351a4c7b677b11792490b1c791';
const approvedPrereleaseVersion = '0.1.0-next.b67ebfd0';
const approvedConsumerImport = Object.freeze({
  file: 'unisane-ops/apps/console/src/browser/main.tsx',
  packageName: '@unisane/data-table',
  specifier: '@unisane/data-table/styles.css',
  types: Object.freeze([]),
  values: Object.freeze([]),
  order: 1,
});
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
    directory: 'unisane-ui/packages/tokens',
    allowedRoots: Object.freeze([
      'dist',
      'LICENSE',
      'package.json',
      'README.md',
      'unisane.meta.json',
    ]),
  }),
  Object.freeze({
    name: '@unisane/ui',
    directory: 'unisane-ui/packages/ui',
    allowedRoots: Object.freeze([
      'dist',
      'LICENSE',
      'registry',
      'package.json',
      'README.md',
      'unisane.meta.json',
    ]),
  }),
  Object.freeze({
    name: '@unisane/data-table',
    directory: 'unisane-ui/packages/data-table',
    allowedRoots: Object.freeze([
      'dist',
      'LICENSE',
      'package.json',
      'README.md',
      'unisane.meta.json',
    ]),
  }),
]);
const consumerRoots = Object.freeze(['unisane/starters/saaskit', 'unisane-ops/apps/console']);
export const EXTERNAL_CONSUMER_INSTALL_ARGS = Object.freeze([
  'install',
  '--offline',
  '--ignore-workspace',
  '--config.shared-workspace-lockfile=false',
  `--store-dir=${path.join(repositoryRoot, '.pnpm-store')}`,
]);
const packedTarballLocator =
  /file:[^\s"',}\]]*\/tarballs\/unisane-(?:data-table|tokens|ui)-0\.1\.0-next\.b67ebfd0\.tgz/gu;

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
    ['LICENSE', 'package.json', 'README.md', 'unisane.meta.json'].filter((entry) =>
      entries.includes(entry),
    ),
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
  if (manifest.name !== profile.name || manifest.version !== approvedPrereleaseVersion) {
    throw new Error(
      `${profile.name} packed identity must remain exact ${approvedPrereleaseVersion}.`,
    );
  }
  if (
    manifest.private !== false ||
    manifest.license !== 'MIT' ||
    manifest.publishConfig?.access !== 'public' ||
    manifest.publishConfig?.provenance !== true ||
    manifest.publishConfig?.tag !== 'next'
  ) {
    throw new Error(`${profile.name} approved public prerelease metadata drifted.`);
  }
  if (!entries.includes('LICENSE')) {
    throw new Error(`${profile.name} packed archive must include its MIT LICENSE.`);
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

function sourceKind(filePath) {
  if (filePath.endsWith('.tsx')) return ts.ScriptKind.TSX;
  if (filePath.endsWith('.ts')) return ts.ScriptKind.TS;
  if (filePath.endsWith('.jsx')) return ts.ScriptKind.JSX;
  return ts.ScriptKind.JS;
}

function parseConsumerImports(files) {
  const records = [];
  for (const { content, file } of files) {
    const source = ts.createSourceFile(
      file,
      content,
      ts.ScriptTarget.Latest,
      true,
      sourceKind(file),
    );
    let order = 0;
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
        file,
        packageName,
        specifier,
        types: [...new Set(types)].sort(),
        values: [...new Set(values)].sort(),
        order,
      });
      order += 1;
    }
  }
  return records.sort((left, right) =>
    `${left.file}:${String(left.order).padStart(6, '0')}:${left.specifier}`.localeCompare(
      `${right.file}:${String(right.order).padStart(6, '0')}:${right.specifier}`,
    ),
  );
}

export function collectConsumerImports(root = repositoryRoot) {
  return parseConsumerImports(
    consumerRoots.flatMap((relativeRoot) =>
      walkFiles(path.join(root, relativeRoot))
        .filter((filePath) => /\.[cm]?[jt]sx?$/u.test(filePath))
        .map((filePath) => ({
          content: readFileSync(filePath, 'utf8'),
          file: path.relative(root, filePath),
        })),
    ),
  );
}

function collectConsumerImportsFromRevision(revision) {
  const paths = run('git', ['ls-tree', '-r', '--name-only', revision, '--', ...consumerRoots])
    .split('\n')
    .filter((file) => /\.[cm]?[jt]sx?$/u.test(file));
  return parseConsumerImports(
    paths.map((file) => ({ content: run('git', ['show', `${revision}:${file}`]), file })),
  );
}

function consumerManifestsFromRoot(root = repositoryRoot) {
  return new Map(
    consumerRoots.map((consumerRoot) => [
      consumerRoot,
      readJson(path.join(root, consumerRoot, 'package.json')),
    ]),
  );
}

function consumerManifestsFromRevision(revision) {
  return new Map(
    consumerRoots.map((consumerRoot) => [
      consumerRoot,
      JSON.parse(run('git', ['show', `${revision}:${consumerRoot}/package.json`])),
    ]),
  );
}

export function buildConsumerSemanticInventory(records, manifests) {
  const imports = [...records].sort((left, right) =>
    `${left.file}:${String(left.order).padStart(6, '0')}:${left.specifier}`.localeCompare(
      `${right.file}:${String(right.order).padStart(6, '0')}:${right.specifier}`,
    ),
  );
  const coordinates = [];
  for (const consumerRoot of consumerRoots) {
    const manifest = manifests.get(consumerRoot);
    const importedPackages = [
      ...new Set(
        imports
          .filter(({ file }) => file.startsWith(`${consumerRoot}/`))
          .map(({ packageName }) => packageName),
      ),
    ].sort();
    for (const packageName of importedPackages) {
      const declarations = runtimeDependencyFields
        .filter((field) => packageName in (manifest?.[field] ?? {}))
        .map((field) => ({ coordinate: manifest[field][packageName], field }));
      if (declarations.length !== 1) {
        throw new Error(
          `${consumerRoot} must declare imported ${packageName} in exactly one runtime dependency field.`,
        );
      }
      coordinates.push({
        consumerRoot,
        consumerName: manifest.name,
        consumerPrivate: manifest.private === true,
        packageName,
        ...declarations[0],
      });
    }
  }
  return {
    imports,
    sourceFiles: [...new Set(imports.map(({ file }) => file))].sort(),
    coordinates,
  };
}

export function assertConsumerSemanticContract(current, expected) {
  if (JSON.stringify(stableValue(current)) !== JSON.stringify(stableValue(expected))) {
    throw new Error(
      'UI consumer semantic inventory drifted from the immutable approved import and dependency contract.',
    );
  }
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
    const tarballName = tarballs.find(
      (entry) => entry === `${expectedPrefix}-${approvedPrereleaseVersion}.tgz`,
    );
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
        [`@unisane/tokens@${approvedPrereleaseVersion}`]: fileSpecifier('@unisane/tokens'),
        [`@unisane/ui@${approvedPrereleaseVersion}`]: fileSpecifier('@unisane/ui'),
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
  if (
    manifests.get('@unisane/ui').dependencies?.['@unisane/tokens'] !== approvedPrereleaseVersion
  ) {
    throw new Error(`Packed UI must depend on exact @unisane/tokens ${approvedPrereleaseVersion}.`);
  }
  if (
    manifests.get('@unisane/data-table').peerDependencies?.['@unisane/ui'] !==
    approvedPrereleaseVersion
  ) {
    throw new Error(
      `Packed DataTable must peer on exact @unisane/ui ${approvedPrereleaseVersion}.`,
    );
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

function collectSourceIdentity(consumerSemanticInventory) {
  const producerPaths = packageProfiles.map(({ directory }) => directory);
  const producerRevision = run('git', ['rev-parse', 'HEAD']).trim();
  assertPathsMatchRevision(producerRevision, producerPaths, 'Producer package paths');
  return {
    consumerImportBaseline: {
      revision: consumerImportBaseline,
      tree: run('git', ['rev-parse', `${consumerImportBaseline}^{tree}`]).trim(),
      paths: consumerRoots,
      approvedImport: approvedConsumerImport,
      semanticInventoryDigest: hashValue(consumerSemanticInventory),
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
    legalApproved: true,
    licenseApproved: true,
    publicationAuthorized: true,
    registryApproved: true,
    releaseAuthorized: true,
    consumerConversionAuthorized: true,
    remoteAuthorized: false,
    authorityCutoverAuthorized: false,
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
    const semanticInventory = buildConsumerSemanticInventory(records, consumerManifestsFromRoot());
    const baselineRecords = collectConsumerImportsFromRevision(consumerImportBaseline);
    const expectedSemanticInventory = buildConsumerSemanticInventory(
      [...baselineRecords, approvedConsumerImport],
      consumerManifestsFromRevision(consumerImportBaseline),
    );
    assertConsumerSemanticContract(semanticInventory, expectedSemanticInventory);
    const consumerImports = {
      ...assertConsumerCoverage(records, packedManifests),
      semanticInventory,
    };
    const consumerProof = verifyExternalConsumer(workRoot, candidates, records);
    const sourceIdentity = collectSourceIdentity(semanticInventory);
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
