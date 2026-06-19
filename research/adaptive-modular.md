# FORGE Home Screen — Direction C: Adaptive Modular System

**Designer:** Senior Product Designer, FORGE
**Date:** 2026-06-19
**Theme:** Warm charcoal surface, amber accent, premium dark.

---

## 0. Research grounding (what I drew from)

| App | What I took | What I rejected |
|---|---|---|
| **WHOOP** (2025 redesign) | Three top dials (Sleep / Recovery / Strain) as the fixed, glanceable "header of truth." Each dial taps into a deep-dive page. | Three co-equal dials — for FORGE recovery is the protagonist, not a peer. |
| **Bevel** | Three circular dials (strain/recovery/sleep) + a coaching panel directly beneath. Card/corner complications adapt to what's connected (nutrition/macros/calories). | Coaching panel as a permanent block — too chatty for a training app. |
| **Apple Health** (Summary) | "Pinned" favorites that the user edits and drag-reorders, sitting above an auto-generated feed. The *pinned* region is curated; the rest is system-ordered. | Fully free-form pinning of everything — leads to incoherent screens. |
| **Fitbit Today** | Editable, drag-to-reorder tiles; you remove what's irrelevant. Glanceable stat tiles (steps, sleep score, zone minutes). | Tiles-only grid — loses the "one clear next action." |
| **Samsung Health** | A **locked anchor tile at the top that can be reordered but not removed** (steps), above a reorderable tracker list. | "Interests"/content feed clutter — universally hated in their forums. |
| **Garmin Connect** ("My Day") | **Intent presets** ("Be healthy / Stay active / Track my training") that pick a sensible default layout; plus per-widget reorder. | Forced redesign + buried "Edit My Day" → forum revolt. Lesson: **strong defaults, discoverable editing, never reshuffle a user's order on you.** |
| **Gentler Streak** | A single dominant "readiness" visual (Activity Path) as the emotional anchor; everything else supports it. | — |

**The two patterns that win and that I'm fusing:**
1. **Locked anchor + reorderable body** (Samsung/Apple): the most important module is pinned at top and identical for everyone; below it the user has bounded control.
2. **Intent-derived defaults** (Garmin): the default order/visibility is computed from what the user connected and tracks — so an empty account and a maxed-out account are the *same screen, gracefully collapsed*.

---

## 1. Naming, header & date navigation

**Verdict: "Home" is right.** Rename Today → **Home**. Rationale: the screen is becoming more than a daily log (workout launcher, habits, future macros) — "Today" undersells it and boxes it into a date. "Home" signals "your base camp," which fits the modular-dashboard model. The day-by-day behavior is retained *inside* Home, not in the name.

**Header treatment (fixed, ~56pt tall, charcoal, hairline divider on scroll):**

```
┌──────────────────────────────────────────────┐
│  ‹     Today · Wed Jun 19          ⚙︎  │   ← amber chevrons, centered date
│        ●  ●  ●  ○  ○  ○  ○            │   ← 7-dot week strip (optional)
└──────────────────────────────────────────────┘
```

- **Center = contextual date label**, not "Home." On today it reads **"Today"** (so the user always knows the default state); on any other day it reads the weekday + date (e.g. "Mon · Jun 17"). The tab bar already says "Home" — repeating it in the header wastes the most valuable pixels.
- **Left/right chevrons** (amber) step one day. **Horizontal swipe** on the whole canvas is the primary gesture (matches WHOOP/Oura day paging); chevrons are the discoverable affordance.
- **Hard stop at today** — you cannot navigate into the future. Right chevron disables (dims) on today. A **"Today" pill** appears top-right whenever you're on a past day; tap to snap back (cheap escape hatch, like a "scroll to top").
- **Gear (⚙︎)** top-right = edit/customize layout (the only place reordering lives — see §2).
- Optional **7-dot week strip** under the date for users who want spatial orientation; ships off by default to keep the header calm, toggle in settings.
- **Past days are read-mostly:** biometrics/workout history show as logged; habits remain editable for back-fill (people log water/habits late). A subtle "Viewing Jun 17" tint on the header background reinforces you've left today.

---

## 2. The Module System (the core deliverable)

### 2.1 Module catalog, default order, sizes, visibility rules

Order is **fixed by default** and computed from connections + tracked data. Every module has a **visibility rule** so the same ordered list collapses cleanly. Sizes: **Hero** (full-width tall), **Standard** (full-width medium), **Tile** (half-width, in a grid), **Strip** (full-width short).

| # | Module | Size | Default visibility rule | Empty/fallback behavior |
|---|---|---|---|---|
| 1 | **Biometric / Readiness** | Hero | Always present (locked anchor) | If no recovery source → "Daily Status" fallback (§3) |
| 2 | **Workout** | Standard | Always present | Rest day / no-plan states (§4) |
| 3 | **Hero Habits** | Tile grid | Present if ≥1 hero habit enabled (Steps & Water default-on) | Hidden only if user disables all hero habits |
| 4 | **Macros / Nutrition** | Standard | Present only if nutrition logging enabled (future) | Hidden entirely when off — no placeholder |
| 5 | **Habits** | Standard (list) | Present if ≥1 regular habit exists | Hidden if zero; "Add a habit" entry lives in the section header when present |
| 6 | **Insights / Coaching** | Strip | Present if a source can produce an insight (recovery trend, streak milestone) | Silently absent when nothing to say (no empty card) |

> **Locked vs. movable.** Module **#1 (Biometric) is locked to the top** for everyone (Samsung's anchor-tile principle, Apple's pinned-region principle). Modules **#2–#6 are reorderable within the body**, but #1 never moves. This guarantees that account-A and account-B always open to the same "hero of truth," which is the whole point of Direction C: *consistency across wildly different setups.*

### 2.2 Should users reorder? — **Yes, but bounded.**

**Recommendation: allow reordering of body modules (#2–#6), allow show/hide of optional modules, but lock #1 and never reorder *on behalf of* the user after first setup.**

Reasoning, grounded in research:
- **Pro (Fitbit, Apple, Samsung, Garmin all ship it):** users have genuinely different priorities — Brad wants Workout high; a habit-streak user wants Habits high. Forbidding it makes the app feel rigid against direct competitors.
- **Risk (Garmin forums):** the failure mode isn't *offering* reorder — it's (a) burying the editor and (b) the app silently reshuffling order after updates/resets. So:
  - The editor is one tap from the **⚙︎** in the header (discoverable), and a long-press on any module enters edit mode in place (Samsung/Fitbit pattern).
  - **Order is sticky and versioned.** We compute a default order *once*, at onboarding, from the user's setup. After that, **we never reorder a user's screen automatically.** When a *new* module becomes eligible (e.g., they connect WHOOP, or enable macros), it's **inserted at its catalog-default position and gently highlighted ("New on your Home") for one session** rather than silently appearing — solving Garmin's "where did this come from / why did it move" complaint.
  - **Bounded, not free-form** (the Apple lesson): users reorder/hide from a fixed catalog; they can't create arbitrary card types or move #1. This is what keeps two accounts feeling like the same product.

### 2.3 The coherence rules (the system's spine)

1. **One anchor.** #1 is always top, always present, always the same shape. The product has a single emotional thesis statement.
2. **Fixed catalog, computed defaults.** Modules come from a closed list with a canonical order. A new account and a power account render the *same ordered list*, just with more rows collapsed out.
3. **Absent, not empty.** A module with no data **hides** rather than showing a hollow placeholder (Samsung's mistake was the opposite — permanent clutter). The two exceptions that *do* show a populated empty-state are Workout (always actionable) and the locked Biometric anchor (always shows *something*, see §3).
4. **Vertical rhythm is uniform.** Every module: 20pt outer margin, 16pt inter-module gap, 16pt internal padding, 16pt corner radius, charcoal `#1A1714` card on `#0E0C0A` canvas, 1px `rgba(255,255,255,0.06)` hairline. Amber `#E8A23D` is reserved for the single primary action and live/active states only — never decorative. This shared chrome is what makes a recovery card and a habits list read as siblings.
5. **Reorder is bounded and sticky** (§2.2).
6. **Section headers are consistent:** 13pt uppercase tracked label, left; optional action (e.g. "Edit", "+") right. Same for every module so the eye learns the grammar.

---

## 3. Module #1 — Biometric / Readiness (locked anchor)

**With a recovery source (WHOOP/Oura/Garmin):** a **Hero** card. One dominant **Recovery ring** (large, left or center), amber-to-charcoal arc, big % numeral — this is FORGE's protagonist (Gentler Streak's "single readiness anchor" lesson; not WHOOP's three co-equal dials, because recovery is the headline). Three supporting metrics in a row beneath the ring as small stat cells:

```
┌──────────────────────────────────────────────┐
│   READINESS                                    │
│        ╭─────╮                                 │
│        │ 72% │   Recovered. Good day to push.  │
│        ╰─────╯                                 │
│   ── Sleep ──   ── Resting HR ──  ── Strain ──│
│      7h 42m         54 bpm          11.3 ●live │
└──────────────────────────────────────────────┘
```

- **Sleep, Resting HR, and live Day-Strain** are the three supporting cells. Strain shows a small amber pulse + "live" when it's accumulating in real time (your current live day-strain feature).
- One-line plain-language verdict next to the ring ("Recovered. Good day to push." / "Run down — keep it easy.") — Bevel's coaching-inline idea, but a single sentence, not a panel.
- Tapping the card → recovery deep-dive. Tapping a cell → that metric's history.

**No-recovery-source fallback ("Daily Status"):** The anchor never disappears — but it changes identity rather than showing a broken ring. With only Apple Health / phone data, render a **Hero "Daily Status"** built from what *is* available:

- Promote **live Day-Strain / active energy** to the hero numeral (computed from Apple Health workouts + steps), since that's the strongest signal we have without a recovery wearable.
- Supporting cells become **Steps**, **Resting HR (if Apple Health has it)**, and **Sleep (if any source)**; any cell with no data is dropped, and the row re-centers (2 cells or even 1, never empty slots).
- A subtle, **non-nagging** "Connect a recovery device for a readiness score →" link at the card's bottom edge (dismissible, returns as a single settings row after dismiss). This is an upsell to richer data, not a blocker.
- If literally nothing is connected (fresh install): the hero shows **Steps + a "Connect your health data" CTA** so the screen is never blank.

> Net effect: every account, from "nothing connected" to "WHOOP + Oura," opens to a single full-width hero in the same position and shape. That's the consistency promise.

---

## 4. Module #2 — Workout

**Standard** card, second position. The **Start CTA is the most prominent interactive element on the screen** (the one amber-filled button), because launching a session is the highest-intent action in a training app.

**State A — Planned workout today (Brad's Atomic Athlete case):**
```
┌──────────────────────────────────────────────┐
│  TODAY'S TRAINING            Atomic Athlete    │
│  Lower Body Strength + 5K Z2 run               │
│  ~65 min · 6 exercises                         │
│  ┌──────────────────────────────────────────┐ │
│  │            ▶  Start Workout              │ │ ← amber fill, full-width
│  └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```
- Plan name as a small tag (top-right), session title as the headline, duration/volume as metadata, then the full-width amber **Start Workout** button. Secondary "Preview" is a text link, not a competing button.

**State B — Rest day (plan prescribes rest):** keep the card, swap the CTA. Headline "Rest Day," supportive copy tied to recovery ("Recovery is the work. Active recovery suggested."). Primary action softens to an **outlined** "Log activity" (so it stops competing with nothing). If recovery is low, the verdict echoes it. *We keep the module present so the screen rhythm is identical day-to-day.*

**State C — No plan (free user / between programs):** headline "No session planned." Primary amber button becomes **"Start a workout"** (freestyle/quick-start), secondary text link "Browse plans." This is the graceful-degradation case: the module's *shape and position never change*, only its contents — so a planned user and an unplanned user have the same screen skeleton.

---

## 5. Module #3 — Hero Habits (the adaptive-layout centerpiece)

**Concept:** "Hero habits" are user-promoted habits that earn a **larger Tile** with a richer visual (ring/progress + big numeral), vs. regular habits which are compact list rows. **Steps and Water are hero habits by default.** A user can promote any counter/binary habit to hero (capped — see below) or demote a default one.

**Which qualify:** any habit the user flags as hero, **max 6**. Counter habits (steps, water, protein, sets) shine here because they have a number + goal to render; binary habits *can* be hero but render as a big check-state tile. Default heroes: Steps, Water.

**Card treatment (each hero tile):** charcoal tile, 16pt radius, a **progress ring or bar in amber**, the current value as a large numeral, goal as small subtext, an icon, and a one-tap increment affordance on counters (tap = +1 unit / +250ml; long-press = custom). Tapping the tile opens detail. Active/over-goal state fills the ring amber and adds a subtle check.

### 5.1 EXACT adaptive layout rules (grid breakpoints)

Grid is a **2-column** system on a standard iPhone (≈16pt gutters, tiles ~½ width). Rules by count *N*:

| N (hero habits) | Layout | Tile size | Rationale |
|---|---|---|---|
| **0** | Module hidden entirely | — | No empty placeholder (coherence rule #3). |
| **1** | **1 full-width Hero tile** | full width, tall (≈ 96pt) | A lone half-tile looks broken; promote it to full width with a horizontal layout (ring left, label+value right). |
| **2** | **1 row × 2 tiles** | half width each | Clean pair, balanced. |
| **3** | **Row of 2 + 1 full-width** below | top two half; third full-width | Avoids an orphaned half-tile with dead space beside it. |
| **4** | **2 rows × 2 tiles** | half width each | Perfect grid. |
| **5** | **2×2 grid + 1 full-width** at bottom | four half + one full | Keeps the grid square, gives the 5th a deliberate full-width slot rather than a lonely half. |
| **6** | **3 rows × 2 tiles** | half width each | Cap. Perfect grid; beyond this density hurts glanceability. |

**Breakpoint logic in one sentence:** *fill complete rows of two; if there's a single leftover, render it full-width rather than as an orphaned half-tile.* This single rule (no naked half-tiles) is what keeps every count from 1–6 looking intentional. (Odd counts get a full-width "cap" tile; even counts are pure grids.)

- **Ordering within the module:** default heroes (Steps, Water) first, then user order; reorderable via the same edit mode. On **larger devices (Pro Max / iPad)** the grid can go 3-up — same "no orphan" rule, just fill rows of three.
- **Past days:** hero tiles show that day's logged value, increment disabled (read-only) except habit back-fill if you allow it.

---

## 6. Module #5 — Regular Habits

**Standard** card, a **compact checklist** (Fitbit/Things-style rows), present only if ≥1 non-hero habit exists.

- Section header "HABITS" + a right-aligned **"+"** to add and **"Edit"** in the gear flow.
- Each row: leading icon, habit name, and a trailing control:
  - **Binary** → a circular check (tap to complete; fills amber + check, strikes/dims the label).
  - **Counter** → a compact stepper "3 / 5" with −/+ , or a tap-to-increment chip.
- **Progress affordance at the header:** "4 of 7 done" + a thin amber track, so the module is glanceable without reading every row.
- **Density:** rows are 44pt min tap targets; the list scrolls inside the page (no inner scroll view — it just extends the page). With many habits (10+), we keep the list flat but show a "Show all (12)" collapse after the first 6 to protect the screens below it — promoting frequently-missed ones to the top is a v2 nicety.
- **Promote to hero** lives in each habit's detail/edit (respecting the max-6 cap), tying the two modules together.

---

## 7. Module #4 — Macros / Nutrition (future)

**Placement: directly beneath Workout (#4 slot), above Hero Habits**, *only when nutrition logging is enabled.* Reasoning: macros are a high-frequency, multiple-times-per-day logging surface (like Bevel surfacing nutrition/net-energy complications); they belong high, but **below** training because FORGE's identity is training-first and the workout is the day's keystone action. When present it pushes hero habits/habits down — acceptable because a nutrition user has *opted into* that priority.

**Page WITHOUT macros (default today):** module simply **absent** (coherence rule #3) — no "Add nutrition" placeholder cluttering the screen. Discovery happens in onboarding/settings, not as a permanent empty card.

**Page WITH macros enabled:**
```
┌──────────────────────────────────────────────┐
│  NUTRITION                         1,840 / 2,300 kcal │
│  ███████████░░░░  Calories                     │
│  Protein 132/180   Carbs 190/230   Fat 58/70   │
│  ┌─────────────┐  ┌─────────────┐              │
│  │  + Log food │  │  Quick add  │              │  ← + Log food = amber-outlined
│  └─────────────┘  └─────────────┘              │
└──────────────────────────────────────────────┘
```
- Headline = calories progress bar (most-glanced number), then three macro mini-bars (Protein/Carbs/Fat), then a **"+ Log food"** action. Note: this action is **amber-outlined, not filled** — the filled amber button is reserved for Workout's Start so the screen has exactly one primary CTA. The protein bar can tint amber when it's the user's emphasized macro (common for a strength crowd).
- Macros adopts the same chrome as every other module, so adding nutrition never feels like a bolt-on.

---

## 8. Above-the-fold priority & full section order

**Above-the-fold (first viewport), in priority order:**
1. **Header** (date nav) — orientation.
2. **Biometric/Readiness hero** — "how is my body today" answers first; it's the reason a training-obsessed user opens the app at 6am.
3. **Workout card with the Start CTA** — the day's keystone action must be reachable without scrolling. The amber Start button should sit at or just above the fold.

Everything below is a scroll. This mirrors WHOOP/Bevel (recovery/readiness at the very top) and respects that **answer-state-then-take-action** is the home screen's job.

**Full default section order (top → bottom):**
```
[Header: ‹ Today · Wed Jun 19 ⚙︎ ]      ← fixed
1. Biometric / Readiness  (Hero, LOCKED top)
2. Workout                (Standard)
3. Macros / Nutrition     (Standard — only if enabled)
4. Hero Habits            (Tile grid — only if ≥1)
5. Habits                 (Standard list — only if ≥1)
6. Insights / Coaching    (Strip — only if there's something to say)
```

**Three representative accounts, same skeleton:**
- **Brad (WHOOP + Atomic Athlete + Strava + habits):** Readiness hero → Today's Training (Start) → Hero Habits (Steps, Water + maybe Protein) → Habits checklist → Insight strip.
- **Running-plan user, no wearable:** Daily Status hero (live strain + steps) → Today's Run (Start) → Hero Habits (Steps, Water) → (no habits → module absent) → Insight maybe absent. *Same shape, fewer rows.*
- **Habit-only user, no plan, no wearable:** Daily Status hero (steps) → "Start a workout" card → Hero Habits → long Habits checklist. *Same shape, weighted differently.*

This is the thesis made concrete: **identical anchor, identical grammar, contents collapse gracefully.**

---

## 9. Rationale + the 2–3 biggest tradeoffs/risks

**Why this design (grounded):**
- **Locked anchor + reorderable body** fuses Samsung Health's un-removable top tile and Apple Health's "curated pins above a system feed." It's the only way to let two very different accounts feel like one product *while* honoring different priorities.
- **Computed-from-setup defaults** is Garmin's intent-preset idea generalized: instead of asking users to pick "Be healthy / Stay active," we *infer* the default order/visibility from what they connected and track — zero setup friction, coherent result.
- **Absent-not-empty + uniform chrome** is what makes the modularity invisible; the screen never looks half-built and never looks like a different app account-to-account.
- **One primary CTA (Workout Start, amber-filled)** keeps a training-first hierarchy even as nutrition/habits compete for attention; every other action is outlined/secondary.

**Tradeoffs & risks:**
1. **Reorder vs. coherence tension (the central risk).** Every gram of customization we grant erodes the "same product everywhere" guarantee and adds support surface (Garmin's forums are full of "where did my widget go"). *Mitigation:* lock #1, bound the catalog, never auto-reshuffle, and surface newly-eligible modules with a one-session "New on your Home" highlight at their canonical position rather than silently. If we had to cut scope, **cut reorder first and ship fixed defaults** — the system still works; it just trusts our ordering.
2. **The fallback-anchor could feel like a downgrade / nag.** Users without a recovery wearable see a "lesser" hero and an upsell. Done wrong this reads as a paywall guilt-trip. *Mitigation:* the fallback must be a *genuinely useful* Daily Status (real live-strain + steps numbers), the connect-prompt is dismissible and demoted to a settings row after one dismiss, and we never gray-out or fake a recovery ring.
3. **Vertical sprawl for power users.** A maxed account (readiness + workout + macros + 6 hero habits + 12 habits + insights) is a long scroll, and the most-used habit can fall below the fold. *Mitigation:* the "no orphan tile" grid keeps hero habits dense; the regular-habits list collapses after 6 with "Show all"; and because order is user-controllable, power users can pull their priority module up. Watch this in usage data — if scroll depth to habits is high, consider a collapse-by-default for completed modules.

**One thing I'd validate first:** whether recovery-as-sole-hero (vs. WHOOP's three co-equal dials) tests well for users who care more about strain/sleep — if so, the hero's *primary* numeral becomes a user choice while the card shape stays locked, preserving coherence.
