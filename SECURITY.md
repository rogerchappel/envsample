# Security Policy

EnvSample is a local CLI that scans source references to environment variable names. Its central security promise is narrow: do not read or print real secret values by default.

## Supported Versions

The project is pre-1.0. Security fixes target the latest release and the main branch until versioned support is defined.

## Reporting a Vulnerability

Please do not include secrets, tokens, private repository contents, or exploit details in public issues.

Open a public issue asking for a private reporting path, or use GitHub private vulnerability reporting if it is enabled for the repository.

## In Scope

- Cases where EnvSample reads denylisted .env or secret-like files unexpectedly.
- Cases where generated output includes secret values.
- CLI behavior that encourages unsafe sharing of local environment data.
- Dependency, packaging, or CI issues maintained in this repository.

## Out of Scope

- Secrets already committed by downstream projects.
- Runtime validation bugs in applications using generated examples.
- Requests for guaranteed response times.

## Maintainer Guidance

When triaging reports, avoid asking reporters to paste real .env files. Ask for minimized fixtures with fake values instead.
