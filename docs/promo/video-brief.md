# Video brief: catch `.env.example` drift without reading secrets

## Angle

Show envsample as a local-first contract check for teams that keep discovering
missing env vars during deploys.

## Demo beats

1. Open `fixtures/basic/src/app.ts`, `fixtures/basic/src/worker.py`, and
   `fixtures/basic/compose.yaml` to show env vars referenced across languages
   and config files.
2. Run `bash examples/demo-env-contract.sh`.
3. Point out the five discovered variables and the two skipped secret-like
   files, `.env` and `.env.example`.
4. Run `node dist/bin.js generate fixtures/basic` to show the generated
   `.env.example` shape.
5. Close with the CI command:

```sh
envsample validate . --example .env.example --fail-on-stale --format json
```

## Claims to avoid

- Do not claim full secret scanning.
- Do not claim schema inference.
- Do not claim every env access pattern is supported.

## Grounded positioning

envsample is useful when the promotion story is "make the env contract visible
and reviewable" rather than "manage secrets." It scans local files, skips
secret-like paths, and emits JSON that CI or agents can consume.
