import { readFile } from "node:fs/promises";
import path from "node:path";
import { collectSourceFiles } from "./file-walk.js";
import { readIgnoreFile } from "./ignore-file.js";
import { extractEnvReferences } from "./patterns.js";
import { toPosixRelative } from "./safety.js";
import type { EnvReference, ScanOptions, ScanResult } from "./types.js";

export async function scanProject(options: ScanOptions): Promise<ScanResult> {
  const root = path.resolve(options.cwd);
  const ignorePatterns = [...(await readIgnoreFile(root)), ...(options.ignorePatterns ?? [])];
  const walked = await collectSourceFiles(root, options.includeFixtures, ignorePatterns);
  const references: EnvReference[] = [];

  for (const filePath of walked.files) {
    const relative = toPosixRelative(root, filePath);
    const content = await readFile(filePath, "utf8");
    references.push(...extractEnvReferences(content, relative));
  }

  return {
    root,
    references: dedupeReferences(references),
    skippedFiles: walked.skippedFiles,
    ignoredFiles: walked.ignoredFiles,
    findings: walked.skippedFiles.map((file) => ({
      code: "secret-file-skipped",
      severity: "info",
      message: "Skipped secret-like file: " + file,
      file
    }))
  };
}

function dedupeReferences(references: EnvReference[]): EnvReference[] {
  const seen = new Set<string>();
  const result: EnvReference[] = [];

  for (const reference of references.sort(compareReferences)) {
    const key = [reference.name, reference.file, String(reference.line), reference.syntax].join("\0");
    if (!seen.has(key)) {
      seen.add(key);
      result.push(reference);
    }
  }

  return result;
}

function compareReferences(a: EnvReference, b: EnvReference): number {
  return a.name.localeCompare(b.name) || a.file.localeCompare(b.file) || a.line - b.line;
}
