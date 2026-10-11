# Conventions

This file is yours. Record how this suite is written and what good tests look like here. `npm run wiki` never touches it. The playgentic agents read it before writing or reviewing anything, and it takes precedence over their built-in defaults.

It starts with the scaffold's defaults. Edit, delete or extend freely.

## Project layout

- Features: `tests/features/**/*.feature`
- Step definitions: `tests/steps/**/*.steps.ts`. Import `Given/When/Then/expect` from `tests/baseTest.ts`.
- Page objects: `tests/pages/**/*.ts`. Extend `BasePage`.
- The generated index of steps and page objects is `.playgentic/wiki/index.md`. Regenerate it with `npm run wiki` after adding or changing steps or page objects.

## Code style

- TypeScript, formatted by prettier and linted by eslint. Pre-commit runs both, plus `lint:steps` and `tsc`.
- One feature file per area of the site (`boot-gate`, `navigation`, `points-of-interest`, `poi-lists`, `outbound-links`, `deep-links`, `theme`, `sound`, `mobile-layout`, `page-metadata`). Step files mirror them: `tests/steps/<area>.steps.ts`, and the step `@domain` matches the area.

## Steps

- Every step definition has a JSDoc block with all four tags. `npm run lint:steps` enforces it:
  - `@domain`: the grouping, which becomes a wiki page
  - `@description`: what the step does
  - `@prereq`: the state it expects, or `none`
  - `@uses`: the fixtures it uses, or `none`
- Reuse existing steps (see `.playgentic/wiki/steps/`) before writing new ones. Never add near-duplicates.
- Keep steps thin: interactions belong in page objects, assertions belong in `Then` steps.
- Steps speak the visitor's language. Points are named by their **title** as shown in the panel (`"Guitar"`, `"Retro Hardware & Video Games"`), groups by their **menu label** (`"PROJECTS"`). Only steps translate titles to POI keys.
- `Given I am in the room` means: open `/`, wake the boot gate, and wait until the opening shot has handed over to the room. It must **not** use reduced motion, because reduced motion also changes the sound default. Fast-forwarding the intro with `page.clock` is fine.
- `Given I open the portfolio with reduced motion` is the cheap way into the room when sound and the intro are not under test.
- `When I open the "<title>" point` must work on both projects. In portrait, many points are cropped off-screen, so bring the point into view (drag, or pick its group first) before tapping it. Never deep-link inside that step; deep links have their own feature.

## Page objects

- One class per screen or component, extending `BasePage`.
- Expose locators as `readonly` properties and user actions as methods. Give each a one-line JSDoc so it shows up in the wiki.
- Page objects by surface: `BootScreen` (the CRT gate), `RoomPage` (the artwork, hotspots, wall light switch), `Hud` (menu, sound, lights, footer, drag hint), `ReadingPanel` (group panel and point panel, listing, VISIT link).
- Page objects never assert; they return locators or values for `Then` steps.

## Locators

- Prefer `getByRole`, `getByLabel` and `getByTestId` over CSS. Never use XPath.
- Locator order for this site: `getByRole` (accessible names below) → `getByTestId` (`data-testid`) → `[data-focus="<key>"]` as a last resort. Never click by coordinates on the artwork; target the hotspot element.
- Accessible names: hotspots are buttons named by the point title; the menu button is "Menu"; the sound button is "Sound on"/"Sound off" (`aria-pressed`); the lights button is a `switch` named "Lights on"/"Lights off" (`aria-checked` = day); menu entries are `menuitem`s; back links (`◂ ROOM`, `◂ <GROUP>`, `◂ cd ..`) and listing rows are buttons; the reading panel is a dialog/region named by its title.
- Test ids, where nothing is semantic: `crt-screen`, `group-panel`, `poi-panel`, `poi-path`, `poi-prompt`, `site-footer`, `drag-hint`, `light-switch`.
- The roles and test ids above come from the `chore/a11y-test-hooks` change in the site repo. Until it ships, fall back to `[data-focus]`, `title` attributes and visible text, and leave the `@needs-a11y-hooks` scenarios for later.

## Test data and auth

- Scenario-scoped state goes on the `world` fixture.
- Credentials come from env (`STANDARD_USER`, `STANDARD_PASS`), never from feature files.
- There is no backend and no auth. Test data is the site's own copy (`src/content/*.json` in the site repo); feature files quote it directly.
- State lives in the browser: `sessionStorage['lofi.theme']` (the theme for this tab), `localStorage['lofi.mute']` (sound), `localStorage['lofi.debug']` (dev-only, must be ignored in production). Seed it with `addInitScript` in Givens, never by clicking through.
- Time: any scenario where the theme matters sets the clock with `page.clock` (`Given the visitor's local time is "HH:MM"`). `page.clock` also drives `performance.now`/rAF, which the scene's single animation clock runs on.

## UI testing expectations

- Oracles are DOM first: visible text, ARIA state (`aria-expanded`, `aria-pressed`, `aria-checked`, `aria-current`), hrefs, and network requests (artwork plates, `hmm.mp3`).
- `window.LofiScene` (`.group`, `.current`, `.theme`, `.sound`) is allowed **only** when no user-visible signal exists (e.g. which group's points are lit). Put a one-line comment in the step saying why.
- Typed text: skip the typing (click the panel body) or use reduced motion before asserting a full body. Never `waitForTimeout`; wait on the text itself.
- No screenshot or pixel assertions. Camera motion and animation are checked through the panel and state they lead to, not through what the frame looks like.

## API testing expectations

- None. The site is a static build with no API.

## Tagging and running

- Device projects are `desktop` and `mobile`, and each one only runs scenarios tagged with its name. Every scenario needs `@desktop`, `@mobile`, or both; a scenario with neither never runs.
- Run everything with `npm test`. Run one scenario with `npx bddgen && npx playwright test --grep "<tag or title>"`, adding `--project desktop` for a quicker loop.
- `TARGET_URL` comes from `.env`.
- Area tags on every feature: `@boot @nav @poi @lists @links @deeplink @theme @sound @layout @meta`. `@smoke` marks the core path (gate boot, menu → group, open a point, open a list entry, theme toggle, metadata).
- `@pending-deploy`: rows covering site content that is not deployed to `TARGET_URL` yet. Exclude them with `--grep-invert @pending-deploy` until it ships, then drop the tag.
- `@needs-a11y-hooks`: needs the site's ARIA/test-id change. Drop the tag once it is live.
