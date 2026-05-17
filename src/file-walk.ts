import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { isIgnoredDirectory, isSecretLikePath, toPosixRelative } from "./safety.js";

const SUPPORTED_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".mjs",
  ".cjs",
  ".py",
  ".sh",
  ".bash",
  ".zsh",
  ".fish",
  ".yml",
  ".yaml",
  ".json",
  ".toml",
  ".ini",
  ".conf",
  ".config",
  ".env.example"
]);

const SUPPORTED_FILENAMES = new Set([
  "Dockerfile",
  "docker-compose.yml",
  "docker-compose.yaml",
  "compose.yml",
  "compose.yaml",
  "Makefile"
]);

export interface WalkResult {
  files: string[];
  skippedFiles: string[];
  ignoredFiles: string[];
}

export async function collectSourceFiles(
  root: string,
  includeFixtures = false,
  ignorePatterns: string[] = []
): Promise<WalkResult> {
  const files: string[] = [];
  const skippedFiles: string[] = [];
  const ignoredFiles: string[] = [];

  async function visit(current: string): Promise<void> {
    const entries = await readdir(current, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      const relative = toPosixRelative(root, fullPath);

      if (entry.isDirectory()) {
        if (isIgnoredDirectory(entry.name)) {
          continue;
        }
        await visit(fullPath);
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      if (matchesIgnorePattern(relative, ignorePatterns)) {
        ignoredFiles.push(relative);
        continue;
      }

      if (isSecretLikePath(fullPath, includeFixtures)) {
        skippedFiles.push(relative);
        continue;
      }

      const fileStat = await stat(fullPath);
      if (fileStat.size > 512_000) {
        skippedFiles.push(relative);
        continue;
      }

      if (SUPPORTED_FILENAMES.has(entry.name) || SUPPORTED_EXTENSIONS.has(path.extname(entry.name))) {
        files.push(fullPath);
      }
    }
  }

  await visit(root);

  return {
    files: files.sort(),
    skippedFiles: skippedFiles.sort(),
    ignoredFiles: ignoredFiles.sort()
  };
}

function matchesIgnorePattern(relative: string, patterns: string[]): boolean {
  return patterns.some((pattern) => {
    if (pattern.endsWith("/")) {
      return relative.startsWith(pattern);
    }

    if (pattern.includes("*")) {
      const escaped = pattern
        .split("*")
        .map((part) => part.replace(/[|\\{}()[\]^$+?.]/g, "\\$&"))
        .join(".*");
      return new RegExp("^" + escaped + "$").test(relative);
    }

    return relative === pattern || relative.startsWith(pattern + "/");
  });
}
