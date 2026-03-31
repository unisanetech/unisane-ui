import path from 'path';

const SOURCE_ROOTS = new Set(['components', 'primitives', 'layout', 'hooks', 'lib', 'types']);

const MODULE_SPECIFIER_REGEX = /(\bfrom\s+|\bimport\s+)(["'])([^"']+)\2/g;

function isRelativeSpecifier(specifier) {
  return specifier.startsWith('./') || specifier.startsWith('../');
}

export function rewriteModuleSpecifiers(content, replacer) {
  return content.replace(
    MODULE_SPECIFIER_REGEX,
    (match, prefix, quote, specifier) => {
      const nextSpecifier = replacer(specifier);
      if (!nextSpecifier || nextSpecifier === specifier) {
        return match;
      }

      return `${prefix}${quote}${nextSpecifier}${quote}`;
    },
  );
}

export function resolveInternalSourcePath(specifier, importerRelativePath) {
  if (specifier.startsWith('@ui/')) {
    return specifier.slice('@ui/'.length);
  }

  if (!isRelativeSpecifier(specifier)) {
    return null;
  }

  const importerDir = path.posix.dirname(importerRelativePath);
  const resolvedPath = path.posix.normalize(path.posix.join(importerDir, specifier));

  if (resolvedPath.startsWith('../')) {
    return null;
  }

  const [root] = resolvedPath.split('/');
  if (!SOURCE_ROOTS.has(root)) {
    return null;
  }

  return resolvedPath;
}

export function toRelativeSourceSpecifier(importerRelativePath, targetRelativePath) {
  const importerDir = path.posix.dirname(importerRelativePath);
  let relativePath = path.posix.relative(importerDir, targetRelativePath);

  if (!relativePath.startsWith('.')) {
    relativePath = `./${relativePath}`;
  }

  return relativePath;
}

export function rewriteUiAliasImportsToRelative(content, importerRelativePath) {
  return rewriteModuleSpecifiers(content, (specifier) => {
    if (!specifier.startsWith('@ui/')) {
      return specifier;
    }

    return toRelativeSourceSpecifier(importerRelativePath, specifier.slice('@ui/'.length));
  });
}

export function toRegistryImportSpecifier(sourceRelativePath) {
  const segments = sourceRelativePath.split('/');
  const [root, ...rest] = segments;
  const remainder = rest.join('/');

  switch (root) {
    case 'components':
      return `@/components/ui/${remainder}`;
    case 'primitives':
      return `@/primitives/${remainder}`;
    case 'layout':
      return `@/layout/${remainder}`;
    case 'hooks':
      return `@/hooks/${remainder}`;
    case 'lib':
      return `@/lib/${remainder}`;
    case 'types':
      return `@/types/${remainder}`;
    default:
      return `@/${sourceRelativePath}`;
  }
}

export function rewriteSourceImportsToRegistry(content, importerRelativePath) {
  return rewriteModuleSpecifiers(content, (specifier) => {
    const resolvedSourcePath = resolveInternalSourcePath(specifier, importerRelativePath);
    if (!resolvedSourcePath) {
      return specifier;
    }

    return toRegistryImportSpecifier(resolvedSourcePath);
  });
}
