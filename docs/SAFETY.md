# Safety Guide

EnvSample should help publish environment contracts, not environment values.

## Defaults

- Real .env files are skipped.
- Secret-looking paths are skipped.
- Generated examples contain blank values.
- Validation reports key names, not runtime values.

## Safe Example

    DATABASE_URL=
    PUBLIC_API_BASE=
    WORKER_TOKEN=

## Unsafe Example

    DATABASE_URL=postgres://user:password@example.invalid/app
    WORKER_TOKEN=ghp_real_token_value

If a value is required for documentation, prefer a harmless placeholder:

    PUBLIC_API_BASE=https://api.example.com

## Agent Guidance

Agents should run scan or validate commands from the repo root and summarize names only. Do not inspect or quote local .env contents while fixing validation failures.
