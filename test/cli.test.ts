import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

test("CLI smoke scans fixtures as JSON", () => {
  const result = spawnSync(process.execPath, ["--import", "tsx", "src/bin.ts", "scan", "fixtures/basic", "--format", "json"], {
    encoding: "utf8"
  });

  assert.equal(result.status, 0);
  const payload = JSON.parse(result.stdout);
  assert.ok(payload.references.some((reference: { name: string }) => reference.name === "DATABASE_URL"));
  assert.ok(!result.stdout.includes("real-password"));
});
