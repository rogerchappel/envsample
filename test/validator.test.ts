import assert from "node:assert/strict";
import test from "node:test";
import { validateEnvExample } from "../src/validator.js";

test("passes a complete blank fixture example", async () => {
  const result = await validateEnvExample({
    cwd: "fixtures/basic",
    examplePath: ".env.example",
    includeFixtures: true
  });

  assert.deepEqual(result.missing, []);
  assert.deepEqual(result.suspicious, []);
});

test("reports suspicious values and stale keys", async () => {
  const result = await validateEnvExample({
    cwd: "fixtures/unsafe",
    examplePath: ".env.example",
    includeFixtures: true
  });

  assert.deepEqual(result.missing, []);
  assert.deepEqual(result.stale, ["OLD_UNUSED"]);
  assert.deepEqual(result.suspicious, ["STRIPE_SECRET_KEY"]);
});
