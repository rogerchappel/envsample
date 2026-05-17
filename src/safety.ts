import path from "node:path";

const SECRET_FILE_PATTERNS = [
  /^\.env(?:\..*)?$/i,
  /secret/i,
  /credential/i,
  /private[-_.]?key/i
];

const DEFAULT_IGNORED_DIRS = new Set([
  ".git",
  ".hg",
  ".svn",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".next",
  ".nuxt",
  ".turbo",
  ".cache",
  "vendor"
]);

export function isIgnoredDirectory(name: string): boolean {
  return DEFAULT_IGNORED_DIRS.has(name);
}

export function isSecretLikePath(filePath: string, includeFixtures = false): boolean {
  const normalized = filePath.split(path.sep).join("/");

  if (includeFixtures && normalized.includes("/fixtures/")) {
    return false;
  }

  return normalized
    .split("/")
    .some((part) => SECRET_FILE_PATTERNS.some((pattern) => pattern.test(part)));
}

export function toPosixRelative(root: string, filePath: string): string {
  return path.relative(root, filePath).split(path.sep).join("/");
}
