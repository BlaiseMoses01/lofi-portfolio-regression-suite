<!-- playgentic:start -->

## Test suite (playgentic)

Before writing or reviewing tests, read the suite wiki in `.playgentic/wiki/`:

- `CONVENTIONS.md`: how this suite is written and what good tests look like here. It takes precedence over your defaults.
- `index.md`: the generated index of every step and page object. Reuse them before writing new ones, and run `npm run wiki` after changing them.
- `extensions/<agent>.md`: extra rules for each playgentic agent (author-tests, explorer, builder, auditor). They override that agent's built-in instructions.

<!-- playgentic:end -->
