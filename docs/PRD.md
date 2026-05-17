# EnvSample PRD

Status: in-progress

## Summary

EnvSample creates and validates .env.example files from local source usage without copying secrets. It gives developers and agents a clean contract for required environment variables while keeping private values out of the repo.

## Problem

Repos often reference process.env keys, shell variables, or config placeholders without a matching sample file. New contributors discover missing variables only after commands fail, while agent workflows risk leaking real .env content when trying to help.

## Users

- OSS maintainers who want safer onboarding.
- Agents preparing local-first projects for publication.
- Developers auditing whether a sample environment file is complete.

## V1

- Scan JavaScript, TypeScript, Python, shell, Docker Compose, and common config files for env var references.
- Generate .env.example with empty values and comments grouped by source file.
- Validate existing .env.example for missing, stale, or suspicious secret-looking values.
- Output text and JSON reports.
- Include ignore patterns, allowlist comments, fixtures, tests, and CLI smoke.

## Non-goals

- Reading private .env values by default.
- Inferring cloud provider credentials.
- Replacing schema validators like zod or envsafe.

## Safety

Never print real environment values. Treat files named .env, .env.local, and secrets files as denylisted unless an explicit fixture flag is used in tests.

## Attribution

Inspired by common env example drift in OSS repos and agent-generated projects, reframed as a privacy-first local scanner.
