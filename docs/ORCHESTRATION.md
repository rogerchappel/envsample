# EnvSample Orchestration

EnvSample is designed for local agent workflows where safety matters more than clever inference.

## Worker Contract

- Scan only local source and config files.
- Treat real env and secret-like files as denylisted inputs.
- Generate blank example values only.
- Validate examples without printing private values.
- Return machine-readable JSON when another tool or agent is making decisions.

## Recommended Flow

- Run envsample scan . --format json to discover referenced names.
- Run envsample generate . and inspect the blank contract.
- Run envsample validate . --example .env.example --format json in CI.
- Add --fail-on-stale when stale example keys should block merges.

## Safety Notes

- Do not pass real .env files as source inputs.
- Use .envsampleignore for generated clients, bundled output, and vendored code.
- Use allow comments sparingly and only with placeholder-safe values.
- If validation reports a suspicious value, remove the value from .env.example before sharing logs.

## Handoff Shape

Agents should report:

- command run
- exit code
- missing keys
- stale keys
- suspicious keys
- skipped secret-like files

Do not include local environment values in summaries.
