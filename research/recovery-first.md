# FORGE Home Screen — Direction A: Recovery-First / Biometric-Led

**Designer's stance:** The body's physiological state is the lede. Before FORGE asks you to train, log, or check off a habit, it tells you what kind of day your body is having — and everything below reorganizes around that verdict. This is the WHOOP/Oura thesis, adapted for an app that also owns your workout, your habits, and (soon) your macros.

---

## Research grounding (what real apps actually do)

**WHOOP (2025 redesign):** The Home screen opens with **three dials — Sleep, Recovery, Strain** — each a deep-dive entry point. Recovery is the emotional center (the famous red/yellow/green %). Everything else (Weekly Plans, coaching) sits *below* the dials. Takeaway: a tight cluster of 2–3 physiological scores as the hero, color-coded, tappable. ([WHOOP Home](https://www.whoop.com/us/en/thelocker/the-all-new-whoop-home-screen/))

**Oura (Today tab):** A **Score Shortcuts row** across the very top (Readiness, Sleep, Activity, Stress, etc.) — a horizontally scannable strip — then a dynamic **"One Big Thing" daily highlight** that changes by time of day (Sleep Score in the morning, activity/stress later), then a **Timeline**. Takeaway: a compact score strip + one prioritized narrative card beats a wall of equal-weight metrics. ([Oura redesign](https://ouraring.com/blog/new-oura-app-experience/), [liveworksleep](https://liveworksleep.com/oura-app-features/))

**Bevel (closest analog to FORGE):** All-in-one — **Recovery (HRV, RHR, recovery score), Sleep, Strain, macro/nutrition logging, and a strength-training builder** all in one app. Recovery is framed as "your daily readiness, simplified." Proves the exact combination FORGE wants (biometrics + workouts + macros) can coexist, with Recovery as the organizing score. ([Bevel](https://www.bevel.health/), [review](https://www.autonomous.ai/ourblog/bevel-app-review))

**Gentler Streak:** A single **Activity Path / Daily Readiness** visual is the hero — "ready for a challenge, needs rest, or balanced" — and it explicitly drives a **workout suggestion** ("Go Zone" / rest). Takeaway: readiness should *recommend an action*, not just report a number. ([Gentler Streak](https://gentler.app/), [Activity Path docs](https://docs.gentler.app/understanding-your-activity-path/interpret-the-activity-path))

**Apple Health (Summary):** **Pinned** (user-chosen favorites) over **Highlights** (auto-surfaced trends). Dynamic but user-controllable order. Takeaway: let power users pin; default sensibly for everyone else. ([Apple Support](https://support.apple.com/en-us/104997))

**Synthesis → FORGE rule:** Hero = a small recovery-led cluster (WHOOP dials) + one prioritized verdict line (Oura's One Big Thing) that *recommends today's training* (Gentler Streak). Below it, an action stack (workout → hero habits → habits → macros), gracefully degrading like Apple Health when sources are missing.

---

## 1. Naming, header & date navigation

**"Home" is correct.** Rename Today → **Home**. It defaults to today, is day-by-day, and swipes back to prior days. Rationale: this screen is no longer only "today's to-dos" — it's the daily command center (biometrics + plan + habits + macros). "Home" signals "this is where you live," matching WHOOP ("Home"), while still defaulting to today like Oura's "Today."

**Header treatment (sticky, compact):**
```
┌──────────────────────────────────────────────┐
│  ‹      Tuesday, Jun 17        ›      ◔ 73%   │   ← amber "today" pill when on today
│         Today · Day 14                        │   ← subtitle: relative label + plan day
└──────────────────────────────────────────────┘
```
- **Left/right chevrons** + horizontal swipe move day-by-day. Right chevron is **disabled/absent on today** (can't go to the future).
- **Center = date.** Tapping it opens a small calendar/week-strip popover for jumping.
- When viewing a past day, show a **"Today" jump button** (amber) where the recovery mini-readout sits, so one tap returns home.
- **Recovery mini-readout** (small ring + %) in the top-right of the header **only when scrolled past the hero** — persistent ambient recovery, WHOOP-style.
- Past days render **read-only** (dimmed CTAs, "Start workout" becomes "View workout"); biometrics and habit completion history stay visible.

---

## 2. Top biometric block (THE HERO)

This is the franchise. Arrangement, top to bottom:

**(a) Two primary rings — Recovery + Day Strain — side by side.**
```
┌──────────────────────────────────────────────┐
│     ╭─────╮              ╭─────╮              │
│     │ 73% │  RECOVERY    │ 8.4 │  STRAIN     │
│     ╰─────╯  recovered   ╰─────╯  building    │
│   HRV 62   RHR 48      SLEEP 7h12  REST 91%   │   ← 4 secondary metrics under rings
└──────────────────────────────────────────────┘
```
- **Recovery is the hero of the hero** — largest, left, color-coded green/yellow/red (WHOOP's most-recognized signal). Strain sits right as its live counterweight (fills through the day).
- **Four secondary metrics** in a single row beneath: **HRV, RHR, Sleep duration, Sleep performance (REST%)**. These are *readouts, not rings* — keeps the cluster tight (WHOOP/Oura both resist over-ringing).
- Tapping a ring → deep-dive; tapping a metric → its trend.

**(b) The verdict line — FORGE's "One Big Thing."** Directly under the rings, one sentence that *interprets* the state and *frames the day*:
> **"Well recovered. Green light for today's strength + intervals."**
> or **"Recovery's low (red). Consider swapping to Zone 2 or a rest day."**

This is the Oura "One Big Thing" + Gentler Streak "readiness recommends action" move. It is the bridge from biometrics → the workout CTA below, and it's what makes this layout *recovery-first* rather than just *recovery-on-top*.

**If the user has NO recovery source connected** (no WHOOP/Oura/Garmin):
- **Do not show empty rings.** Degrade to an **Apple-Health-backed cluster**: a single **Sleep ring** (from Apple Health, almost always present) + **Steps-so-far** as the second ring, with **RHR** if available.
- Verdict line becomes neutral/action-oriented: **"No recovery source connected. Based on sleep (7h2m), you look rested."** with a subtle **"Connect WHOOP / Oura / Garmin →"** affordance (dismissible, never nags daily).
- If literally nothing is connected: the hero collapses to a slim **date + a single "Connect a device to unlock recovery" card**, and the workout CTA (§3) is promoted up to become the visual hero instead. The page never shows a broken/empty ring.

**Layout invariant:** the hero is always the same *height* and *shape* regardless of source, so the page feels identical across accounts. We swap *contents*, not the *frame* (the Apple Health "consistent shell, variable data" lesson).

---

## 3. Workout CTA

**Placement:** Immediately below the hero verdict line — it's the #1 action and the verdict explicitly hands off to it ("Green light for today's strength + intervals" → the card for that workout sits right there). This is the single most important above-the-fold action.

**Treatment — a full-width "primary action" card**, amber-accented:
```
┌──────────────────────────────────────────────┐
│  TODAY · ATOMIC ATHLETE — WEEK 3 DAY 2        │
│  Strength: Squat 5×5 · Run: 4×800m            │
│  ~62 min                          [ Start ▸ ] │   ← amber filled button
└──────────────────────────────────────────────┘
```
- Recovery-aware: when recovery is red, the card surfaces a soft banner — *"Low recovery — consider the lighter variant"* — but never blocks. (Gentler Streak's "suggest, don't dictate.")
- **Multiple sources:** if the user has both an Atomic-Athlete-style plan and a Strava/running plan, show the plan's prescribed session as primary; a secondary "+ Add a workout" stays as a quiet text button.

**No plan that day:**
- **Rest day (planned):** card becomes a calm, non-amber **"Rest day"** state — "Recovery day. Your next session is tomorrow: Upper strength." Keeps continuity, removes pressure.
- **No plan at all (user has no program):** card becomes **"Start a workout"** — a neutral CTA opening quick-start (Run / Strength / Custom). For users who never use plans, this is a stable, useful default, not an empty slot.
- **Off-plan but wants to move:** "+ Log a workout" always available.

**Above-the-fold guarantee:** hero + verdict + workout CTA all fit on first screen (iPhone 14/15/16). That's the recovery-first promise: *state → recommendation → the one action that follows from it*, with zero scrolling.

---

## 4. Hero habits

**Which qualify:** **Steps** and **Water** are the default hero habits (the two Brad already treats as big cards). The "hero" tier = **ambient, all-day, quantitative habits that benefit from a live progress read** — exactly steps and water. We allow the user to **promote up to a max of 4** habits to hero status (e.g. Protein-grams once macros ship, or a daily Zone-2 minutes goal). Beyond 4, they live in the regular list. Cap protects the layout.

**Card treatment:** a hero habit card is a **compact progress tile** — big number + unit, a thin radial or linear progress arc, goal, and a one-tap increment (for counters) or check (for binary). Larger type and a progress arc are what separate it from a regular row.

**EXACT adaptive layout rules** (single source of truth — the layout engine keys off the count `N` of hero habits):

| N (hero habits) | Layout |
|---|---|
| **0** | Section omitted entirely. No empty header, no placeholder. Page flows hero → workout → regular habits. |
| **1** | **One full-width tile** (taller, ~96pt). Number is oversized; arc is a horizontal bar. Feels intentional, not lonely. |
| **2** | **2-column grid, one row** (Steps left, Water right). The canonical Brad layout. Square-ish tiles (~1:1). |
| **3** | **2-column grid; tile #3 spans full width on row 2** (2 + 1). Avoids a ragged single orphan in a 2-col grid. |
| **4** | **2×2 grid.** Clean, balanced. |
| **5+** | **Hard cap at 4 in the grid.** The grid stays 2×2; any further promoted habits fall back to the regular list (and we surface a one-time hint: "You can feature up to 4 habits here"). |

**Breakpoint logic:** the grid is fixed at **2 columns** on iPhone (never 3 — tiles need the touch target and the number needs to breathe). Tile aspect ratio shifts by N: full-width bars at N=1 and for the spanning tile at N=3; square at N=2 and N=4. This makes 0→4 feel designed at every count, which is the explicit requirement.

**Placement:** directly below the workout CTA. Rationale: steps/water are *physiological + all-day*, so they belong near the biometric story, above the more granular binary-habit checklist. They're also the most-glanced, most-incremented items — high on the page earns its keep.

---

## 5. Regular habits section

**Placement:** below hero habits. Header: **"Habits · 3 of 7 done"** with a thin completion bar (gives a sense of progress without a heavy ring).

**Treatment:** a **single-column list of compact rows**, each: icon · name · (for counters) `2/3` stepper or (binary) a tap-to-check circle that fills amber on completion. Completed items **sink to the bottom and dim** (Things-style satisfaction; reduces visual noise as the day progresses).

**Graceful degradation:**
- **Many habits (10+):** show first ~6, then a **"Show all (N)"** expander so the section never dominates the scroll.
- **Few/zero habits:** if 0, section collapses to a single quiet **"+ Add a habit"** row — never a big empty state. If 1–2, just render them; no minimum.
- Past days: rows are read-only history (checked state preserved, steppers disabled).

---

## 6. Macro / nutrition logging (future)

**When present:** a **"Fuel" card** placed **below regular habits, above the footer** — it's a logging surface, not a biometric, so it sits in the "input/tracking" lower band, not the recovery hero. (Bevel proves macros + recovery coexist; it keeps nutrition as its own logging surface rather than mixing it into readiness.)

**Card design:**
```
┌──────────────────────────────────────────────┐
│  FUEL                              1,840 / 2,300 │
│  ▇▇▇▇▇▇▇░░  Protein 142/180g                  │
│  Carbs 190g · Fat 61g            [ + Log food ]│
└──────────────────────────────────────────────┘
```
- **Calories** as the headline ring/bar + **Protein** as the emphasized secondary (most training-relevant macro), with Carbs/Fat as readouts. One-tap **"+ Log food."**
- Optionally **promotable to a hero habit** (Protein-grams) for users who care most about that — reusing the §4 hero mechanic instead of inventing a new surface.

**With vs without macros:**
- **Without (today):** the Fuel card simply doesn't render; nothing else moves. The page ends at regular habits. No gap, no placeholder.
- **With:** Fuel slots in as the last content card. Because it's last, adding it later doesn't disturb the recovery-first hierarchy or push the workout CTA off the first screen — a key reason it goes at the bottom, not the top.

---

## 7. Top-to-bottom section order & above-the-fold

```
═══════════ STICKY HEADER ═══════════
‹ Date ›  + Day N  + (ambient recovery on scroll)

────────── ABOVE THE FOLD ──────────
1. BIOMETRIC HERO     Recovery ring + Strain ring + 4 metrics
2. VERDICT LINE       "Well recovered. Green light for…"
3. WORKOUT CTA        Today's session · [Start]

────────── BELOW THE FOLD ──────────
4. HERO HABITS        Steps / Water (+up to 4) — adaptive grid
5. REGULAR HABITS     "Habits · 3 of 7" checklist, completed sink
6. FUEL (when present) Calories + Protein logging card
────────────────────────────────────
```

**Above-the-fold = state, recommendation, action** (hero + verdict + workout). That triad is the entire thesis: you open FORGE, you learn how your body is, you're told what to do, and the button to do it is right there — before any habit checklist competes for attention.

---

## 8. Rationale + biggest tradeoffs/risks

**Why this wins:**
- **Recovery as the frame, not a stat** (WHOOP/Oura/Gentler Streak all do this) gives FORGE a point of view: it's a *coach*, not a tracker. The verdict line — recovery literally recommending the day's training — is the differentiator and the connective tissue between the biometric block and the workout you already start from this screen.
- **One consistent shell, variable contents** (Apple Health lesson) solves the cross-account consistency requirement: same hero frame whether you're on WHOOP, Oura, Garmin, Apple-Health-only, or nothing.
- **Hero-habit grid with explicit 0→4 rules** means the page looks intentional at every user's habit count — the most common way these screens break.

**Tradeoffs / risks (the honest 3):**
1. **Recovery-first punishes the source-less user.** Our whole hero leans on a recovery score most casual users won't have. Mitigation: the Apple-Health Sleep+Steps fallback and the "promote workout to hero when nothing's connected" rule — but there's residual risk the top of the app feels emptier for the very users we most want to convert. Worth A/B testing the no-source hero.
2. **The verdict line is a trust liability.** Telling someone "green light, train hard" when their data is noisy (one bad HRV night, a sick day) can be wrong in a way a bare number isn't. It must be hedged ("consider"), never blocking, and ideally tunable — or it erodes confidence in the whole app.
3. **Workout above habits is a bet on the training-led user (Brad).** A habit-streak-driven user might want their checklist higher. We're explicitly prioritizing the Atomic-Athlete/hybrid-athlete persona. If retention data shows habit-completion drives DAUs more than workouts, the order (4 and 3) may need to flip — the architecture supports it, but it's a real directional bet, not a neutral choice.
