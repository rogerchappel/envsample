# Roadmap

This roadmap describes intended direction, not a binding delivery promise.
Review it regularly and update it as the project learns from users,
contributors, and implementation constraints.

## Now

- Harden parser coverage against real-world repositories.
- Keep safety docs and fixtures aligned with new scanner behavior.
- Prepare the first public npm release.

## Next

- Add framework-specific examples for Next.js, Vite, Django, and FastAPI.
- Add config-file defaults for teams that want strict stale-key enforcement.
- Add SARIF or GitHub annotation output if CI users need inline findings.

## Later

- Explore editor integrations after CLI usage settles.
- Consider schema-validator interop without taking over runtime validation.

## Not Planned

- Unrelated platform rewrites without a clear migration path.
- Mandatory dependencies on a single ecosystem unless the project requires it.
- Public release dates before maintainers are ready to commit to them.

## Roadmap Review

Before each major or meaningful minor release:

- Move completed user-visible work into `CHANGELOG.md`.
- Remove stale commitments.
- Promote only the next reviewable set of work into `Now`.
