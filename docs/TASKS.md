# EnvSample Tasks

## Done in MVP

- TypeScript CLI package with npm binary metadata.
- Source scanner for JavaScript, TypeScript, Python, shell, Docker Compose, and common config files.
- Secret-like file denylist for .env, local env files, credentials, secrets, and private keys.
- .env.example generation with blank values grouped by source file.
- .env.example validation for missing keys, stale keys, and suspicious secret-looking values.
- Text and JSON reports for scan and validate commands.
- .envsampleignore support for generated or noisy paths.
- Allow comments for intentional non-source example entries.
- Fixtures and focused tests, including real CLI smoke coverage.

## Next

- Add richer parser coverage for framework-specific env accessors.
- Support config-file-driven project defaults.
- Publish package after the first tagged release check.
- Add examples for GitHub Actions and pre-commit hooks.

## Deliberately Not Doing

- Reading real .env values by default.
- Inferring cloud provider secrets.
- Replacing runtime schema validators.
