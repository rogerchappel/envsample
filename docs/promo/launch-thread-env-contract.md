# Launch Thread: Env Contract Checks

## Thread

1. `.env.example` should be a contract, not a stale suggestion. `envsample`
   scans local source references and checks whether the checked-in example is
   still honest.
2. The fixture demo finds `DATABASE_URL`, `QUEUE_URL`, `PUBLIC_API_BASE`,
   `WORKER_TOKEN`, and `VITE_FEATURE_FLAG` across TypeScript, Python, shell,
   and Compose files.
3. The demo keeps values blank in `.env.example` and skips secret-like files,
   including the fixture `.env`.
4. Run the local walkthrough with:

```sh
bash examples/demo-env-contract.sh
```

5. For CI, use:

```sh
npx envsample validate . --example .env.example --fail-on-stale
```

6. The point is not secret management. It is making env drift visible before a
   deploy or handoff.

## Screenshot prompts

- `fixtures/basic/src/app.ts` beside `fixtures/basic/.env.example`.
- Terminal output from `bash examples/demo-env-contract.sh`.
- The stricter GitHub Actions line in `examples/github-actions.yml`.

## Guardrails

- Do not claim schema inference.
- Do not claim full secret scanning.
- Do not show real `.env` values.
- Keep the wording grounded in static scanning, blank generated values, and
  explicit validation.
