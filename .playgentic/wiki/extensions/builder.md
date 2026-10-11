# builder extensions

This file is yours, and plugin updates never overwrite it. The playgentic agents pass these rules to the **builder** agent on every run.

They're added to its built-in instructions, and **they override those instructions where the two conflict, including the guardrails.** Keep the rules short and concrete. Delete the examples you don't want.

## Rules

- Page objects go in `tests/pages/`: `BootScreen`, `RoomPage`, `Hud`, `ReadingPanel`, each extending `BasePage`. Reuse them across features rather than adding per-feature objects.
- Clock, reduced-motion and storage setup go in Givens (or a `baseTest.ts` fixture if three or more features need it). Use `page.clock`, `page.emulateMedia({ reducedMotion: 'reduce' })` and `addInitScript` for storage. All of it happens before the first `goto`.
- Network oracles (artwork plates, `hmm.mp3`): record requests from before the first navigation, using `page.on('request')` stored on `world`. Don't use `waitForRequest` for a negative check.
- `window.LofiScene` reads: only where CONVENTIONS allows them, wrapped in one helper on the page object, with a comment in the step.
- If an oracle in a feature file disagrees with the live site, report it. Don't edit the expected text to match. The copy is quoted from the site repo's `src/content/*.json`.
