---
name: feature-discovery
description: Discover an application's user-facing features by reading its source code, then scaffold BDD feature files (Gherkin only, no step logic) plus harness guidance in a playwright-bdd test repo. Use when asked to plan test coverage, find what needs testing, scaffold features or acceptance criteria for an app, or prepare features for /playgentic:author-tests to implement.
argument-hint: "<path to app source> [path to test repo, default: cwd]"
---

# feature-discovery

You read an application's source and turn what it actually does into declarative Gherkin features
that a test harness (e.g. playgentic `author-tests`) can implement later. **You write behaviour, not
test logic.** No step definitions, page objects, or config changes.

The output is:

1. `.feature` files, one per area of the app, with concrete oracles.
2. App-specific guidance for the harness (conventions, explorer and builder notes).
3. A testability report: what the app needs (ARIA, test ids) before steps can be written cleanly.

## Step 1: Learn the test repo first

Read these before the app, because they decide how you write the features:

- `CLAUDE.md` / `AGENTS.md`, `README.md`, `package.json`, the Playwright config.
- `.playgentic/wiki/CONVENTIONS.md`, `extensions/*.md` and `index.md` if they exist. Existing steps are vocabulary you must reuse.
- Existing features and steps.

Record these:

- **Device projects and tag routing.** In playgentic, a scenario runs only in the projects whose tags it carries (`@desktop`, `@mobile`). A scenario with no device tag never runs.
- **`missingSteps` behaviour.** `fail-on-gen` means unimplemented features break `bddgen`, `npm test` and CI. That's a staging decision for the user (Step 5).
- **The run and compile commands** (`npx bddgen`, `runCommand`).
- **How `TARGET_URL` is set**, and therefore which build of the app the tests will hit.

## Step 2: Map the application

Read the entry point and work outward. Read the main components in full; the behaviour is in the
event handlers and conditionals, and skimming misses it. Check every one of these:

| Look for                                                                   | Why it matters                                                           |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Routes, hash handling, deep links                                          | Entry points and fast test setup                                         |
| Content/config files (JSON, CMS, i18n)                                     | The exact strings oracles quote, and the data for Scenario Outlines      |
| Event listeners (click, key, pointer, hashchange, resize)                  | Every user action, including global ones like Esc                        |
| Gates and first-interaction logic                                          | "The first click only wakes it" bugs, and setup cost                     |
| Browser storage keys (local vs session)                                    | Persistence scenarios, and seeding state in Givens                       |
| Time-dependent logic (`new Date`, `getHours`)                              | Needs a controlled clock and boundary-value outlines                     |
| Media queries in JS (`prefers-reduced-motion`, `hover: none`, orientation) | Behaviour that differs per device project, plus hidden side effects      |
| Env-gated / dev-only code (`import.meta.env`, debug panels)                | It must never appear in production. Stale storage must not reactivate it |
| Lazy loading (images, audio, chunks)                                       | Network-request oracles ("X is only fetched when needed")                |
| External links (`href`, `target`, `rel`)                                   | Link oracles                                                             |
| Imperative/test APIs on `window`                                           | Fallback oracles for state with no visible signal                        |
| ARIA roles, labels, `data-testid`, `title`                                 | Testability (Step 4)                                                     |
| `<head>` metadata                                                          | Cheap smoke scenarios                                                    |

Rules:

- **Trust code over docs.** README and NOTES are leads, not facts. Check every claim against the
  code. Docs drift, e.g. a README listing two "low" points where the code's predicate selects four.
- **Derive, don't guess.** If behaviour comes from a formula (a threshold, a slug function, a
  template like `~/{group}/{point}`), compute the expected value for each example row from the code.
- **Check the app repo's git status.** Uncommitted or undeployed content won't exist at
  `TARGET_URL`. Isolate it (Step 6) instead of letting it fail confusingly.
- **Note device-specific geometry.** On portrait mobile, things that are on screen on desktop may be
  cropped or need scrolling or panning. Steps must cope, so write it down for the builder.
- **Note side effects of setup shortcuts.** A shortcut such as reduced motion may also change other
  defaults (sound, animation, the intro), which matters for whichever scenarios use it.

## Step 3: Inventory behaviours by surface

Group the behaviours by user-facing surface: entry/gate, navigation, content panels, lists, links,
deep links, settings (theme, sound), layout per device, and metadata. Each surface becomes one
feature file and one step `@domain`.

For each behaviour, write down:

- **What the user does and sees**, in their words.
- **The oracle**: specific text, ARIA state (`aria-expanded`, `aria-pressed`, `aria-checked`,
  `aria-current`), href, URL, or network request. "It works" is not an oracle.
- **Which device projects** it applies to.

Cover the happy path, negative cases ("there's no VISIT link on unlinked points", "unknown hash is
ignored"), boundaries (07:00 vs 06:59), persistence (reload vs new session), and regressions the
code comments warn about (the comments explaining _why_ something is done are the best source of
regression scenarios).

## Step 4: Testability audit

List the elements the steps will need to locate, and check what hooks each one exposes. Interactive
`div`s with no role, no `tabIndex` and no label are both an accessibility bug and a locator problem.

Recommend, in this order:

1. **ARIA first:** roles, accessible names and keyboard activation on interactive elements. This fixes real
   a11y gaps and gives `getByRole` locators at no extra cost.
2. **`data-testid` only where nothing is semantic** (decorative containers, hints, footers).
3. Watch for `aria-hidden` / `visibility:hidden` tricks that hide the _full_ text from assistive tech.

The refactor belongs in the app repo, on its own branch, with no visual change. Propose it; don't do
it unless the user approves. Tag scenarios that depend on it (e.g. `@needs-a11y-hooks`).

## Step 5: Ask the user (one round, only real decisions)

Use AskUserQuestion with a recommended option first. Typical decisions:

- **Staging.** If `missingSteps: fail-on-gen` is set: put features directly in `tests/features/` (CI goes red
  until the steps exist), in a backlog directory outside the glob, or tag them `@wip` without device tags.
- **Oracle policy.** Strictly DOM, DOM first with the app's `window` API as a fallback, or the API freely.
- **Source refactor.** Include the Step 4 refactor in scope, or list it as a follow-up.
- **Extras.** Fill in `CONVENTIONS.md`, write extension notes, or produce feature files only.

If the app repo has uncommitted changes and the refactor is in scope, ask the user to commit or
stash them. Never stash on their behalf.

## Step 6: Write the features

- **Declarative, in user language.** Name things by what the user sees (the panel title, the menu label),
  not by internal keys. The steps translate.
- **One shared step vocabulary.** Before writing, draft the phrases (`I am in the room`, `I open the
"<title>" point`, `the reading panel shows the title "<title>"`) and reuse them exactly across files.
  Reuse existing repo steps verbatim. Fewer unique phrases means less harness work.
- **Scenario Outlines carry content.** Use one row per item, quoting the app's content files. For long bodies,
  assert a distinctive excerpt (the closing sentence proves the full text rendered).
- **Every scenario gets** device tag(s), the feature's area tag, and `@smoke` on the core path
  (about one scenario per surface).
- **Isolate the unknown.** Put undeployed content in a separate tagged `Examples:` block (`@pending-deploy`),
  and tag scenarios that depend on the refactor.
- **Use a Background** for shared setup (clock, entering the app). Give each Given exactly one meaning, and
  document it in the conventions.
- Delete the scaffold's example feature if the user agrees; keep its steps if they're reusable.

## Step 7: Write the harness guidance (if approved)

Never overwrite user-owned content. Only fill placeholder or comment sections.

- **`CONVENTIONS.md`:** feature-to-domain mapping, step wording, what each shared Given means, page
  objects by surface, locator order and accessible names, storage keys and how to seed them, clock
  control, the oracle policy, the "no `waitForTimeout`, no pixel assertions" rule, and the tag scheme.
- **`extensions/explorer.md`:** app quirks an explorer would trip on (gates, timing, clock, device
  layouts, things that must never appear in production).
- **`extensions/builder.md`:** page object layout, where setup goes (Givens vs fixtures), how to make
  network oracles (record from before the first navigation), and "report a mismatched oracle, don't edit
  it to pass".

## Step 8: Verify and hand off

- Run `npx bddgen`. It should fail **only** on missing steps (no parse errors). Report the
  unique missing-step count; that's the harness's workload.
- Run prettier on any markdown you edited.
- Don't commit unless asked.
- Report:
  - a table of feature file → what it covers
  - tags the user must know about (`@pending-deploy`, `@needs-a11y-hooks`)
  - discrepancies found between the docs and the code
  - the refactor status
  - a suggested implementation order: features with the fewest new steps first (metadata, deep links)
