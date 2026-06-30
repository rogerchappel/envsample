# Social Hooks

## Hook 1

Your `.env.example` is a contract. envsample checks it from source references
without reading real secrets.

Demo angle: run `bash examples/demo-env-contract.sh` and show the skipped
`fixtures/basic/.env` file beside the discovered variable list.

## Hook 2

Most env drift is boring until deploy time. This tiny CLI makes the boring part
visible in CI.

Demo angle: scan `fixtures/basic`, then validate `.env.example` with blank
values for `DATABASE_URL`, `QUEUE_URL`, `PUBLIC_API_BASE`, `WORKER_TOKEN`, and
`VITE_FEATURE_FLAG`.

## Hook 3

Generate the example, keep secrets out, fail when required keys go missing.

Demo angle: show `envsample generate .` for the stdout flow, then use
`envsample validate . --fail-on-stale` as the stricter CI gate.

## Guardrails

- Do not claim envsample infers schemas or validates provider credentials.
- Do not show real `.env` values.
- Keep claims local-first: static pattern scanning, blank generated values, and
  explicit skip rules for secret-like files.

## Longer launch thread

Use [launch-thread-env-contract.md](launch-thread-env-contract.md) when a post
needs a step-by-step narrative around the fixture demo and CI command.
