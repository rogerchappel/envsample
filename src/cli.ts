import type { CliResult } from "./types.js";

export async function runCli(argv: string[] = process.argv.slice(2)): Promise<CliResult> {
  const command = argv[0] ?? "help";

  if (command === "help" || command === "--help" || command === "-h") {
    return { exitCode: 0, stdout: "envsample help\n" };
  }

  return {
    exitCode: 1,
    stderr: `Unknown command: ${command}\n`
  };
}
