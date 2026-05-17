import assert from "node:assert/strict";
import test from "node:test";
import { scanProject } from "../src/scanner.js";

test("scans fixture sources without reading real env files", async () => {
  const result = await scanProject({ cwd: "fixtures/basic" });
  const names = [...new Set(result.references.map((reference) => reference.name))].sort();

  assert.deepEqual(names, [
    "DATABASE_URL",
    "PUBLIC_API_BASE",
    "QUEUE_URL",
    "VITE_FEATURE_FLAG",
    "WORKER_TOKEN"
  ]);
  assert.deepEqual(result.skippedFiles, [".env", ".env.example"]);
});
