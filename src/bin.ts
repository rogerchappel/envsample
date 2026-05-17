#!/usr/bin/env node
import { runCli } from "./cli.js";

const result = await runCli();

if (result.stdout) {
  process.stdout.write(result.stdout);
}

if (result.stderr) {
  process.stderr.write(result.stderr);
}

process.exitCode = result.exitCode;
