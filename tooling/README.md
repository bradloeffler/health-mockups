# FORGE tooling

Two small Node CLIs that keep mockups honest:

- `mock-check.mjs` — runs an HTML mock through headless Chromium at three iPhone viewports and reports overflow, clipped text, raw-hex/px lint, and a screenshot per viewport.
- `gen-gallery.mjs` — checks N candidate mocks and writes a `gallery.html` containing only the passing ones, side-by-side.

## Install

From the repo root:

```sh
cd tooling
npm install
# postinstall runs: npx playwright install chromium
```

## mock-check

```sh
node tooling/mock-check.mjs home/explore/j-merged.html
node tooling/mock-check.mjs "home/explore/*.html"
```

### Checks (per viewport)

| # | Name | What it does |
|---|------|--------------|
| A | overflow | walks every DOM element, flags any where `scrollWidth > clientWidth + 1` |
| B | right-edge text clipping | iterates visible text nodes, flags any whose bounding rect right edge exceeds `innerWidth - 4` |
| C | raw-hex / raw-px lint (static) | greps the source for `#[0-9a-fA-F]{3,8}` and bare `Npx`. Files under `kit/` are exempt (they DEFINE tokens). |
| D | screenshot | full-page PNG to `tooling/.mock-check-out/<base>--<vw>x.png` |

Viewports: iPhone SE (375x667), iPhone 13 (390x844), iPhone 14 Pro Max (430x932), all using Playwright's `devices[...]` descriptors so DPR + UA emulate correctly.

### Output

- Pretty colored summary to stdout.
- A deterministic JSON blob to stdout (after the summary) for programmatic consumers.
- A Markdown report at `tooling/.mock-check-out/<base>--REPORT.md` per file.
- Three screenshots per file at `tooling/.mock-check-out/<base>--{375,390,430}x.png`.

### Exit codes

- `0` — every viewport passed (no overflow, no clipping, no raw hex/px outside `kit/`).
- `1` — at least one file failed a check.
- `2` — bad CLI args, no files matched, or harness error.

## gen-gallery

```sh
node tooling/gen-gallery.mjs \
  --candidates "home/explore/{j,k,h}-*.html" \
  --out home/explore/gallery.html \
  --brief home/explore/BRIEF.md
```

For v1 the subagent-spawn step is stubbed (`// TODO: spawn subagent here`). You pass already-authored candidates and the tool:

1. Prints a plan for spawning N subagents.
2. Runs `mock-check.mjs` on each candidate as a child process.
3. Writes `gallery.html` with `<iframe>` previews + iPhone-13 thumbnail + PASS/FAIL badge for the passing candidates.

## Adding new lint rules

Open `mock-check.mjs` and find `lintSource()`. Each rule is a regex over the source string; add a new entry, surface its count in `renderMarkdown()` and `printSummary()`, and include it in the `pass` boolean at the end of `checkFile()`.

To add a new in-page check (runs inside Playwright's `page.evaluate`), extend `runChecksOnPage()` — it has full DOM access at the active viewport.
