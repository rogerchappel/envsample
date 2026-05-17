import assert from "node:assert/strict";
import test from "node:test";
import { renderEnvExample } from "../src/env-example.js";

test("renders grouped blank env example entries", () => {
  const output = renderEnvExample([
    { name: "DATABASE_URL", file: "src/app.ts", line: 1, syntax: "process.env.NAME" },
    { name: "QUEUE_URL", file: "src/app.ts", line: 2, syntax: "process.env.NAME" },
    { name: "WORKER_TOKEN", file: "worker.py", line: 4, syntax: "os.getenv('NAME')" }
  ]);

  assert.match(output, /# src\/app\.ts\nDATABASE_URL=\nQUEUE_URL=/);
  assert.match(output, /# worker\.py\nWORKER_TOKEN=/);
  assert.doesNotMatch(output, /undefined|null/);
});
