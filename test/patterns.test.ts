import assert from "node:assert/strict";
import test from "node:test";
import { extractEnvReferences } from "../src/patterns.js";

test("extracts common env syntaxes", () => {
  const refs = extractEnvReferences(
    [
      "process.env.DATABASE_URL",
      "process.env['PUBLIC_API_BASE']",
      "import.meta.env.VITE_FEATURE_FLAG",
      "Deno.env.get(\"DENO_TOKEN\")",
      "os.getenv('QUEUE_URL')",
      "os.environ[\"WORKER_TOKEN\"]",
      "curl $PUBLIC_API_BASE/\${WORKER_TOKEN}"
    ].join("\n"),
    "src/example.ts"
  );

  assert.deepEqual(
    [...new Set(refs.map((ref) => ref.name))].sort(),
    [
      "DATABASE_URL",
      "DENO_TOKEN",
      "PUBLIC_API_BASE",
      "QUEUE_URL",
      "VITE_FEATURE_FLAG",
      "WORKER_TOKEN"
    ]
  );
});

test("ignores common shell variables", () => {
  const refs = extractEnvReferences("echo $PATH $HOME $PWD $CUSTOM_SETTING", "script.sh");
  assert.deepEqual(refs.map((ref) => ref.name), ["CUSTOM_SETTING"]);
});
