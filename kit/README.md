# FORGE Kit

The opinionated substrate every FORGE mock is authored against. Warm-charcoal dark, amber accents, mono numerals, hairlines over heavy borders.

## Files

| File | Role |
| --- | --- |
| `tokens.json` | W3C-DTCG source of truth (color, space, type, radius, shadow, motion). |
| `tokens.css`  | The same tokens projected as CSS custom properties — the only color/size values mocks may consume. |
| `kit.css`     | Primitive component classes (`.k-screen`, `.k-card`, `.k-ring`, etc.). Imports `tokens.css`. |
| `icons.js`    | Frozen `icons` registry — DOMAIN nouns -> Phosphor class strings. Authors pick by meaning, not glyph. |
| `example-home.html` | A complete FORGE Home screen authored only with these primitives. |

## Authoring rules (non-negotiable)

1. **No raw hex** in mock CSS or `style=""`. Use `var(--c-*)`.
2. **No raw px** for spacing/radius/font-size. Use `var(--s-*)`, `var(--r-*)`, `var(--t-*)`.
3. **No hand-picked Phosphor names.** Import from `kit/icons.js` and reference by domain noun (`icons.fuel`, not `ph-fire`).
4. **One ring = one number = one label.** The `.k-ring` primitive owns all three so duplicates cannot happen.
5. **Numbers are mono and column-aligned.** Use `.k-metric-list` for stacks; the 3-col grid forces digits into their own cell.
6. **Phone shell is `.k-screen`** (max-width 430px, safe-area padded). Never set widths above it.
7. No em dashes, no editorial copy.

## Primitives reference

### `.k-screen` — phone shell

```html
<main class="k-screen">
  <div class="k-screen__scroll">
    <!-- cards, sections -->
  </div>
  <nav class="k-nav">...</nav>
</main>
```

Sets `max-width: 430px`, dark warm gradient, safe-area padding. Bottom inner padding leaves room for the floating nav.

### `.k-card`

```html
<section class="k-card">...</section>
<section class="k-card k-card--quiet">...</section>   <!-- no shadow, transparent -->
<section class="k-card k-card--accent">...</section>  <!-- amber heat-glow -->
```

### `.k-row` / `.k-stack` / `.k-grid-2`

```html
<div class="k-row k-row--between">...</div>
<div class="k-stack" style="--gap: var(--s-3);">...</div>
<div class="k-grid-2">...</div>
```

### `.k-eyebrow`

```html
<span class="k-eyebrow">WHOOP</span>
```

### `.k-metric-list` / `.k-metric` — column-aligned numerics

```html
<div class="k-metric-list">
  <div class="k-metric">
    <span class="k-metric__lbl">HRV</span>
    <span class="k-metric__val">62</span>
    <span class="k-metric__unit">ms</span>
  </div>
  <div class="k-metric">
    <span class="k-metric__lbl">RHR</span>
    <span class="k-metric__val">54</span>
    <span class="k-metric__unit">bpm</span>
  </div>
</div>
```

The parent is a 3-col grid (`auto 1fr auto`); each child `.k-metric` uses `display: contents` so all rows share the same column edges.

### `.k-numeric`

```html
<span class="k-numeric k-numeric--xl">
  <span class="k-numeric__val">7,420</span>
  <span class="k-numeric__unit">steps</span>
</span>
```

Sizes: `--sm` (14), `--md` (18), `--lg` (22), `--xl` (28). Mono with tabular numerals by default.

### `.k-ring`

```html
<div class="k-ring" style="--ring-color: var(--c-green); --ring-pct: 71;">
  <svg class="k-ring__svg" viewBox="0 0 100 100" aria-hidden="true">
    <circle class="k-ring__track"/>
    <circle class="k-ring__bar"/>
  </svg>
  <div class="k-ring__num">71</div>
  <div class="k-ring__label">Recovery</div>
</div>
```

Props: `--ring-size` (default 96px), `--ring-stroke` (default 6px), `--ring-color`, `--ring-pct` (0-100). The stroke math is in CSS, authors never compute dashoffset.

### `.k-icon-tile`

```html
<span class="k-icon-tile k-icon-tile--amber"><i class="ph ph-sun"></i></span>
```

Variants: `--amber`, `--green`, `--blue`. Sizes: `--sm` (28), default (36), `--lg` (44).

### `.k-pill`

```html
<span class="k-pill k-pill--amber"><i class="ph ph-play"></i> Start</span>
<span class="k-pill k-pill--green">Live</span>
<span class="k-pill k-pill--ghost">+ Log</span>
```

### `.k-progress`

```html
<div class="k-progress" style="--p-pct: 64; --p-color: var(--c-amber);"></div>
```

### `.k-nav` — floating frosted bottom-nav

```html
<nav class="k-nav" aria-label="Primary">
  <button class="k-nav__btn" aria-current="page"><i class="ph ph-house"></i></button>
  <button class="k-nav__btn"><i class="ph ph-calendar-blank"></i></button>
  <button class="k-nav__btn"><i class="ph ph-squares-four"></i></button>
  <button class="k-nav__btn"><i class="ph ph-gear-six"></i></button>
</nav>
```

### `.k-step-btn`

```html
<button class="k-step-btn"><i class="ph ph-plus"></i></button>
```

### `.k-checkbox`

```html
<span class="k-checkbox is-checked"><i class="ph ph-check"></i></span>
<span class="k-checkbox"></span>
```

### `.k-habit-row`

```html
<div class="k-habit-row">
  <span class="k-icon-tile k-icon-tile--amber"><i class="ph ph-sun"></i></span>
  <span class="k-habit-row__name">Vitamins AM</span>
  <span class="k-checkbox is-checked"><i class="ph ph-check"></i></span>
</div>
<div class="k-habit-row k-habit-row--done">...</div>
```

## Icons

```js
import { icons, getIcon } from './icons.js';

// Domain noun, not glyph name
const el = `<i class="ph ${icons.fuel}"></i>`;
```

Or, in a plain HTML file with the script imported, `window.ForgeIcons.icons` is available globally.
