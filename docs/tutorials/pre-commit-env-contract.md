# Check an Env Contract Before Commit

Use this recipe when a repo already has an `.env.example` and you want a fast
local check before pushing a docs or config change.

```sh
bash examples/pre-commit.sh fixtures/basic .env.example
```

The example hook accepts an optional target directory and example-file path. If
no arguments are provided, it defaults to the current directory and
`.env.example`:

```sh
bash examples/pre-commit.sh
```

For CI, use the stricter stale-key gate from `examples/github-actions.yml`:

```sh
npx envsample validate . --example .env.example --fail-on-stale
```

## Demo fixture

The fixture at `fixtures/basic` includes env references across:

- `src/app.ts`: `DATABASE_URL`, `PUBLIC_API_BASE`, and `VITE_FEATURE_FLAG`.
- `src/worker.py`: `QUEUE_URL` and `WORKER_TOKEN`.
- `compose.yaml`: `DATABASE_URL` and `QUEUE_URL`.
- `scripts/start.sh`: `PUBLIC_API_BASE` and `WORKER_TOKEN`.

Its `.env.example` keeps values blank, while the real `.env` fixture is treated
as secret-like input and skipped by the scanner.

## When to use each command

- `envsample scan . --format text`: inspect references during local review.
- `envsample generate .`: preview a blank example file.
- `envsample validate . --example .env.example`: fail when required keys are
  missing or suspicious.
- `envsample validate . --example .env.example --fail-on-stale`: also fail
  when `.env.example` contains unused keys.
