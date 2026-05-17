export type OutputFormat = "text" | "json";

export interface CliResult {
  exitCode: number;
  stdout?: string;
  stderr?: string;
}

export interface ScanOptions {
  cwd: string;
  includeFixtures?: boolean;
  ignorePatterns?: string[];
}

export interface EnvReference {
  name: string;
  file: string;
  line: number;
  syntax: string;
}

export interface Finding {
  code: string;
  severity: "info" | "warning" | "error";
  message: string;
  name?: string;
  file?: string;
  line?: number;
}

export interface ScanResult {
  root: string;
  references: EnvReference[];
  skippedFiles: string[];
  ignoredFiles: string[];
  findings: Finding[];
}

export interface ValidateResult {
  root: string;
  examplePath: string;
  missing: string[];
  stale: string[];
  suspicious: string[];
  findings: Finding[];
}
