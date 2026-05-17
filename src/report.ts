import { renderEnvExample, uniqueEnvNames } from "./env-example.js";
import type { ScanResult, ValidateResult } from "./types.js";

export function renderScanText(result: ScanResult): string {
  const names = uniqueEnvNames(result.references);
  const lines = [
    "envsample scan",
    "root: " + result.root,
    "variables: " + String(names.length),
    ""
  ];

  for (const name of names) {
    const locations = result.references
      .filter((reference) => reference.name === name)
      .map((reference) => reference.file + ":" + reference.line)
      .join(", ");
    lines.push("- " + name + " (" + locations + ")");
  }

  if (result.skippedFiles.length > 0) {
    lines.push("", "skipped secret-like files:");
    for (const file of result.skippedFiles) {
      lines.push("- " + file);
    }
  }

  return lines.join("\n") + "\n";
}

export function renderGenerateText(result: ScanResult): string {
  return renderEnvExample(result.references);
}

export function renderValidateText(result: ValidateResult): string {
  const lines = [
    "envsample validate",
    "example: " + result.examplePath,
    "missing: " + String(result.missing.length),
    "stale: " + String(result.stale.length),
    "suspicious: " + String(result.suspicious.length)
  ];

  for (const finding of result.findings) {
    const target = finding.name ? " " + finding.name : finding.file ? " " + finding.file : "";
    lines.push("- " + finding.severity + " " + finding.code + target + ": " + finding.message);
  }

  return lines.join("\n") + "\n";
}
