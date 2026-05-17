# envsample

Generate and validate .env.example files from source references without reading real secrets.

envsample is a local-first CLI for the boring but important contract every repo needs: which environment variables exist, where they are referenced, and whether the checked-in example file is still honest.

## Install

```sh
npm install --save-dev envsample
```

From this repo:

```sh
pnpm install
pnpm run build
node dist/bin.js scan fixtures/basic
```

## Use

Scan a project:

```sh
envsample scan . --format text
```

Generate an example to stdout:

```sh
envsample generate .
```

Write a new .env.example:

```sh
envsample generate . --write
```

Validate the checked-in example:

```sh
envsample validate . --example .env.example
```

Make stale keys fail CI too:

```sh
envsample validate . --fail-on-stale
```

## What It Finds

- JavaScript and TypeScript: process.env.NAME, process.env["NAME"], import.meta.env.NAME, Deno.env.get("NAME")
- Python: os.getenv("NAME"), os.environ["NAME"]
- Shell and Compose-style references: $NAME, ${NAME}, ${NAME:-fallback}
- Common source and config files including JS, TS, Python, shell, YAML, JSON, TOML, Docker Compose, Dockerfile, and Makefile

## Safety Model

By default, envsample skips files that look secret-bearing:

- .env
- .env.local
- files or paths containing secret
- files or paths containing credential
- files or paths containing private-key

It records skipped paths in reports, but it does not print their values. Fixture tests can opt in with --include-fixtures.

Use .envsampleignore for generated files or noisy directories:

```gitignore
generated/**
tmp/
```

If a non-source key in .env.example is intentional, document it:

```dotenv
# envsample: allow LEGACY_SHARED_KEY
LEGACY_SHARED_KEY=example-static-fixture
```

## Output

Text output is meant for humans. JSON output is meant for CI and agents:

```sh
envsample scan . --format json
envsample validate . --format json
```

Validation exits non-zero when required keys are missing or example values look secret-like. With --fail-on-stale, unused example keys also fail.

## Verify

```sh
pnpm test
pnpm run check
pnpm run build
pnpm run smoke
bash scripts/validate.sh
```

## Status

MVP. It is intentionally conservative: static pattern scanning, blank generated values, and no schema inference. Sharp enough to catch drift; small enough to trust.

## License

MIT
