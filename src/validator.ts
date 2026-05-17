import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseEnvExample } from "./example-parser.js";
import { uniqueEnvNames } from "./env-example.js";
import { scanProject } from "./scanner.js";
import type { Finding, ValidateResult } from "./types.js";

const SECRET_VALUE_PATTERNS = [
  /sk_live_[A-Za-z0-9]+/,
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /^[A-Za-z0-9_\-]{32,}$/,
  /^gh[pousr]_[A-Za-z0-9_]{20,}$/
];

export interface ValidateOptions {
  cwd: string;
  examplePath?: string;
  includeFixtures?: boolean;
}

export async function validateEnvExample(options: ValidateOptions): Promise<ValidateResult> {
  const root = path.resolve(options.cwd);
  const examplePath = path.resolve(root, options.examplePath ?? ".env.example");
  const scan = await scanProject({ cwd: root, includeFixtures: options.includeFixtures });
  const expected = uniqueEnvNames(scan.references);
  const parsed = parseEnvExample(await readFile(examplePath, "utf8"));
  const actual = [...parsed.values.keys()].sort();
  const missing = expected.filter((name) => !parsed.values.has(name));
  const stale = actual.filter((name) => !expected.includes(name) && !parsed.allowed.has(name));
  const suspicious = actual.filter((name) => !parsed.allowed.has(name) && isSuspicious(parsed.values.get(name) ?? ""));
  const findings: Finding[] = [
    ...scan.findings,
    ...missing.map((name) => ({
      code: "missing",
      severity: "error" as const,
      message: "Missing from example: " + name,
      name
    })),
    ...stale.map((name) => ({
      code: "stale",
      severity: "warning" as const,
      message: "Present in example but not found in source: " + name,
      name
    })),
    ...suspicious.map((name) => ({
      code: "suspicious-value",
      severity: "error" as const,
      message: "Example value looks secret-like: " + name,
      name
    })),
    ...parsed.malformedLines.map((line) => ({
      code: "malformed-line",
      severity: "warning" as const,
      message: "Line is not a KEY=value entry",
      line
    }))
  ];

  return {
    root,
    examplePath,
    missing,
    stale,
    suspicious,
    findings
  };
}

function isSuspicious(value: string): boolean {
  if (!value || value === "\"\"" || value === "''") {
    return false;
  }

  const placeholderWords = ["changeme", "example", "todo", "placeholder", "localhost"];
  if (placeholderWords.some((word) => value.toLowerCase().includes(word))) {
    return false;
  }

  return SECRET_VALUE_PATTERNS.some((pattern) => pattern.test(value));
}
