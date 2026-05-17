import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { renderEnvExample } from "./env-example.js";
import { renderGenerateText, renderScanText, renderValidateText } from "./report.js";
import { scanProject } from "./scanner.js";
import { validateEnvExample } from "./validator.js";
import type { CliResult, OutputFormat } from "./types.js";

export async function runCli(argv: string[] = process.argv.slice(2)): Promise<CliResult> {
  const command = argv[0] ?? "help";

  if (command === "help" || command === "--help" || command === "-h") {
    return { exitCode: 0, stdout: usage() };
  }

  try {
    if (command === "scan") {
      return await scanCommand(argv.slice(1));
    }

    if (command === "generate") {
      return await generateCommand(argv.slice(1));
    }

    if (command === "validate") {
      return await validateCommand(argv.slice(1));
    }

    return {
      exitCode: 1,
      stderr: "Unknown command: " + command + "\n\n" + usage()
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { exitCode: 1, stderr: "envsample: " + message + "\n" };
  }
}

async function scanCommand(args: string[]): Promise<CliResult> {
  const options = parseArgs(args);
  const result = await scanProject({
    cwd: options.cwd,
    includeFixtures: options.includeFixtures
  });

  return {
    exitCode: 0,
    stdout: options.format === "json" ? JSON.stringify(result, null, 2) + "\n" : renderScanText(result)
  };
}

async function generateCommand(args: string[]): Promise<CliResult> {
  const options = parseArgs(args);
  const result = await scanProject({
    cwd: options.cwd,
    includeFixtures: options.includeFixtures
  });
  const content = renderEnvExample(result.references);

  if (options.write) {
    const outputPath = path.resolve(options.cwd, options.output ?? ".env.example");
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, content, { flag: options.force ? "w" : "wx" });
    return { exitCode: 0, stdout: "wrote " + outputPath + "\n" };
  }

  if (options.format === "json") {
    return {
      exitCode: 0,
      stdout: JSON.stringify({ ...result, example: content }, null, 2) + "\n"
    };
  }

  return { exitCode: 0, stdout: renderGenerateText(result) };
}

async function validateCommand(args: string[]): Promise<CliResult> {
  const options = parseArgs(args);
  const result = await validateEnvExample({
    cwd: options.cwd,
    examplePath: options.example,
    includeFixtures: options.includeFixtures
  });
  const hasErrors = result.missing.length > 0 || result.suspicious.length > 0;

  return {
    exitCode: hasErrors ? 1 : 0,
    stdout: options.format === "json" ? JSON.stringify(result, null, 2) + "\n" : renderValidateText(result)
  };
}

interface ParsedArgs {
  cwd: string;
  example?: string;
  output?: string;
  format: OutputFormat;
  write: boolean;
  force: boolean;
  includeFixtures: boolean;
}

function parseArgs(args: string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    cwd: process.cwd(),
    format: "text",
    write: false,
    force: false,
    includeFixtures: false
  };

  const positionals: string[] = [];

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];

    if (arg === "--format") {
      parsed.format = parseFormat(requireValue(arg, next));
      index += 1;
    } else if (arg === "--example") {
      parsed.example = requireValue(arg, next);
      index += 1;
    } else if (arg === "--output" || arg === "-o") {
      parsed.output = requireValue(arg, next);
      index += 1;
    } else if (arg === "--write") {
      parsed.write = true;
    } else if (arg === "--force") {
      parsed.force = true;
    } else if (arg === "--include-fixtures") {
      parsed.includeFixtures = true;
    } else if (arg === "--help" || arg === "-h") {
      throw new Error("\n" + usage());
    } else if (arg.startsWith("-")) {
      throw new Error("Unknown option: " + arg);
    } else {
      positionals.push(arg);
    }
  }

  if (positionals[0]) {
    parsed.cwd = path.resolve(positionals[0]);
  }

  return parsed;
}

function requireValue(flag: string, value: string | undefined): string {
  if (!value || value.startsWith("-")) {
    throw new Error(flag + " requires a value");
  }
  return value;
}

function parseFormat(value: string): OutputFormat {
  if (value === "text" || value === "json") {
    return value;
  }
  throw new Error("--format must be text or json");
}

function usage(): string {
  return [
    "envsample",
    "",
    "Generate and validate .env.example files without reading real .env secrets.",
    "",
    "Usage:",
    "  envsample scan [path] [--format text|json]",
    "  envsample generate [path] [--write] [--output .env.example] [--force]",
    "  envsample validate [path] [--example .env.example] [--format text|json]",
    "",
    "Safety:",
    "  Files named .env, .env.local, secrets, credentials, or private keys are skipped.",
    ""
  ].join("\n");
}
