import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { runCli } from "../src/cli.js";

test("generate --write creates a blank example without source secrets", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "envsample-"));
  try {
    await writeFile(path.join(root, "app.js"), "console.log(process.env.APP_SECRET)\n");
    await writeFile(path.join(root, ".env"), "APP_SECRET=real-secret\n");

    const result = await runCli(["generate", root, "--write"]);
    const output = await readFile(path.join(root, ".env.example"), "utf8");

    assert.equal(result.exitCode, 0);
    assert.match(output, /APP_SECRET=/);
    assert.doesNotMatch(output, /real-secret/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
