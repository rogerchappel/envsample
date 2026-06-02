# Validate an env contract before CI deploys

This recipe uses the checked-in `fixtures/basic` app to show envsample's main
workflow: discover env references, generate an example contract, and validate
the checked-in `.env.example` without reading real secret values.

## Run the demo

```sh
bash examples/demo-env-contract.sh
```

Expected summary:

```text
envsample demo: discovered variables
- DATABASE_URL
- PUBLIC_API_BASE
- QUEUE_URL
- VITE_FEATURE_FLAG
- WORKER_TOKEN

secret-like files skipped:
- .env
- .env.example

validation: 0 missing, 0 stale, 0 suspicious
```

The demo builds the local CLI, scans `fixtures/basic`, prints the unique
variable names from JSON output, and validates the fixture's `.env.example`.

## Copy the CI shape

For a real project, keep the validation command small and fail when stale keys
should block a deploy:

```sh
envsample validate . --example .env.example --fail-on-stale --format json
```

Use `envsample generate .` during review to inspect the contract that the source
tree implies. Add `--write --force` only when you intentionally want to replace
the checked-in example file.

## Boundaries

envsample is a static scanner. It recognizes common JavaScript, TypeScript,
Python, shell, Compose, YAML, JSON, TOML, Dockerfile, and Makefile patterns, but
it does not execute code or infer values. Secret-like files such as `.env` are
reported as skipped so reviewers can see why values were not read.
