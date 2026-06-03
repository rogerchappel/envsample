# Demo Brief: Keep .env.example Honest

## Audience

Maintainers who want their checked-in `.env.example` file to match real source references without exposing local secrets.

## Core claim

envsample scans source and config files for environment variable references, skips secret-like files by default, and can generate or validate a blank `.env.example`.

## 60-second video flow

1. Open `fixtures/basic/src/app.ts`, `fixtures/basic/src/worker.py`, and `fixtures/basic/compose.yaml`.
2. Run `pnpm run build`.
3. Run `node dist/bin.js scan fixtures/basic --format text`.
4. Point out the five discovered keys and the skipped `.env` files.
5. Run `node dist/bin.js generate fixtures/basic`.
6. Show the blank generated values and the warning not to paste secrets.
7. Open `examples/github-actions.yml` to show how validation fits into CI.

## Social hooks

- "Your `.env.example` should be a contract, not a stale guess."
- "envsample scans code for env vars, skips secret-like files, and generates blank examples."
- "A local-first CLI demo for catching missing and stale environment variable examples before CI surprises you."

## Boundaries

- Do not claim envsample reads or validates real secret values.
- Do not claim schema inference; the README states the MVP uses conservative static scanning.
- Keep demo output tied to `fixtures/basic` unless adding a new fixture.
