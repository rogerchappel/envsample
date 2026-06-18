# CI Env Contract Demo Transcript

This transcript is a maintainer-friendly companion to
`examples/demo-env-contract.sh`. It shows what the fixture-backed demo is meant
to prove without exposing any real `.env` values.

## Setup

```bash
npm run build
bash examples/demo-env-contract.sh
```

## Expected Story

The script scans `fixtures/basic` and reports the variable names referenced by
the sample app, worker, compose file, and shell script:

- `DATABASE_URL`
- `PUBLIC_API_BASE`
- `QUEUE_URL`
- `VITE_FEATURE_FLAG`
- `WORKER_TOKEN`

It also reports skipped secret-like files, including `.env` and `.env.example`
in the fixture scan. That is the point of the demo: envsample can describe the
env contract from source references without reading real values.

The validation step checks `fixtures/basic/.env.example` and prints a summary of
missing, stale, and suspicious keys. In the committed fixture, the example file
contains the expected blank keys grouped by source file.

## Reviewer Use

Use this transcript in a pull request when you want to show:

- which env variables are required by code and config;
- that secret-bearing files were skipped;
- whether the checked-in `.env.example` still matches the source references.
