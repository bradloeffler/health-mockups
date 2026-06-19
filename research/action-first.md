# FORGE Home Screen — Direction B: Action / Coaching-First

**Design philosophy:** The home screen leads with what you should *do* today — start your workout, close your habit rings, hit your macros. Biometrics are supporting *context* that calibrates the plan, not the hero. The screen should read as a coach's daily brief, not a dashboard of dials.

---

## Research basis (what the best apps actually do)

- **Apple Fitness (Summary tab):** Activity rings sit *right at the top* as the day's headline goal, immediately followed by the **Sessions/workout area** and a customizable stack you can add/move/remove. The rings ARE the "to-do" — close them — and workouts are a first-class section, not buried. This is the cleanest precedent for "progress summary up top, action below." [[Apple]](https://support.apple.com/guide/iphone/see-your-activity-summary-iph4c34a8a95/ios)
- **Fitbit Today tab:** Three-tab app (**Today / Coach / You**) — separating glanceable daily stats from the coaching surface. Today is oversized, glanceable tiles you can drag-rearrange. The cautionary tale: 2025–26 redesign drew a *revolt* — oversized tiles created "awkward empty space," and Google had to ship a follow-up reducing spacing. **Lesson: big cards must earn their size or they feel empty and patronizing.** [[TechCrunch]](https://techcrunch.com/2023/08/01/fitbit-is-revamping-its-app-with-a-three-tab-layout/) [[PiunikaWeb]](https://piunikaweb.com/2026/05/25/google-health-app-fitbit-backlash-missing-features-ui-changes/)
- **MacroFactor dashboard:** Top widget is **Nutrition & Targets** — macro/calorie progress as **stacked bars** with a highlighted box around today; bar turns solid black/white when you hit target. Toggle consumed vs. remaining. Logging is a dedicated **Food Log Focus** widget + a persistent **Shortcuts Toolbar** for one-tap logging from anywhere. Dashboard is fully customizable into 4 sections. **Lesson: macros are a compact progress widget + an always-available log entry point, not a full screen.** [[MacroFactor]](https://macrofactor.com/dashboard-revamp/) [[help]](https://help.macrofactorapp.com/en/articles/22-get-to-know-your-dashboard)
- **WHOOP (2025 all-new Home):** Three dials at top (Sleep, Recovery, Strain), then **key insights** and **intuitive shortcuts** for fast actions (fill Journal, start an activity), with **Daily Outlook** coaching giving proactive, biometric-driven guidance and *dynamic targets*. Crucially WHOOP moved coaching/recommendations adjacent to the metrics — the number means nothing without the "so what." **Lesson: biometrics should resolve into one coaching line + dynamic targets.** [[WHOOP]](https://www.whoop.com/us/en/thelocker/the-all-new-whoop-home-screen/)
- **Future:** Clearly labeled **Workout of the Day** as the centerpiece, coach check-ins, push reminders, swipe gestures, no clutter. The workout is unambiguously the hero action. [[Athletic Insight]](https://www.athleticinsight.com/exercise/future-fitness-app-review)
- **Streaks:** Circular grid, each habit its own colored **ring that fills on completion**, haptics, capped at ~24 — satisfying in a way a checklist never is. **Lesson: habits should be tactile rings/progress, not a to-do list of checkboxes.** [[Streaks]](https://apps.apple.com/us/app/streaks-2026-habit-tracker/id6740426283)
- **Strava:** Feed-first, but the **"You" / training** surfaces lead with the next planned activity and weekly progress toward goals — action and progress over raw numbers.

The throughline: **rings/progress as the day's headline → the workout as hero action → habits as tactile completion → biometrics compressed into coaching → nutrition as a compact widget + omnipresent log button.**

---

## 1. Naming & header / date navigation

**Keep "Home."** It's the right call. "Today" is accurate but a tab named "Today" implies it *only* shows today — which fights the day-by-day back-navigation Brad wants. "Home" lets the screen *default to today* while permitting history without a naming contradiction (this is exactly Fitbit's "Today" trap — it reads as locked to now).

**Header treatment (sticky, compact, ~56pt):**
- **Left:** "Home" is NOT shown as a giant title (that wastes the most valuable real estate — the Fitbit empty-space mistake). Instead the header shows the **date as the title**: large "Today" word when on today, or "Wed, Jun 17" when scrolled back. Tapping it opens a date picker.
- **Center/inline:** a thin **day strip** is optional; the primary nav is **horizontal swipe** to go back a day (forward disabled past today, or shows a subtle "—" state).
- **Chevron affordance:** a left "‹" appears once you're on a past day, plus a **"Today" pill** to jump back to the present in one tap (Apple Calendar pattern). Past days render read-only-ish (you can't start a workout in the past, but habit/macro history shows as completed state).
- **Right:** a single avatar/profile glyph → settings & source connections.

Greeting line ("Morning, Brad") is optional and time-aware but kept to **one small line** under the header, paired with the coaching sentence (see §2) so it earns its space.

---

## 2. The day's action framing (without feeling like a chore list)

This is the heart of Direction B. Three devices keep it "coach" not "chore":

**(a) A single "Daily Brief" coaching line up top** (borrowed from WHOOP Daily Outlook + Future check-ins). One sentence, biometric-aware, that *frames the day*:
> "Recovery's at 71% — green light. Today's the hard Atomic session; fuel up to 190g protein."
> or on a low day: "Recovery 38%. Take the run easy or swap to mobility — I've adjusted today's targets down."

This single line does the emotional work so the cards below can be neutral and scannable. It's the difference between a coach and a checklist.

**(b) A "Day Ring" progress summary — the headline, Apple-style.** Above the fold sits **one consolidated progress element** so the user sees "how done is my day" at a glance. Rather than Apple's 3 fixed rings, FORGE uses a **single segmented "Day Ring"** (or a slim segmented progress bar) composed of the day's *committed* actions:
- Workout (done / not)
- Hero habits (steps, water)
- Regular habits (% complete)
- Macros (if enabled: % to protein/calorie target)

Each segment is weighted and fills as you complete things. Tapping the ring scrolls to the relevant section. This gives the dopamine of "closing the ring" (Apple/Streaks) **without** turning the page into a literal checklist — the checklist *is* the ring.

**(c) Tactile completion everywhere.** Habits fill (Streaks rings), the workout card flips to a "Done ✓ — nice work" state, macros bar goes solid on target (MacroFactor). Completion is celebrated inline, so the screen feels like it's *responding to you*, not assigning homework.

**Net:** top-of-fold = Daily Brief line + Day Ring. That's the summary. Everything below is the *expanded* version of those segments, in priority order.

---

## 3. Workout — the hero action

**The workout is the single most prominent card on the screen**, directly under the Day Ring (Future's WOTD model). Full-width, tall (~120–140pt), amber-accented CTA.

**States:**
- **Has plan, scheduled today (Brad's Atomic Athlete):** Card shows session name ("Atomic Athlete — Lower Strength + 5k"), est. duration, a 1-line preview (top exercises or "Squat 5×5 · Run 5k @ Z2"), and a **large amber "Start" button**. This is the screen's primary action — biggest tap target, only amber-filled button above the fold.
- **Has plan, but recovery is low:** Brief line + card reflect the *adjusted* recommendation ("Coach swapped to mobility — recovery's low"). The dynamic-target idea from WHOOP. Start button still present but reframed.
- **Rest day (planned):** Card becomes a calmer **"Rest Day"** state — no amber CTA, instead a muted card: "Rest day. Optional: 20-min walk or mobility." Offers a secondary "Log something else" link. It does NOT disappear — absence would read as a bug; a deliberate rest state reinforces the plan.
- **No plan at all (new user / habits-only user):** Card becomes a **"Start a workout"** launcher — quick-start tiles (Run, Lift, Custom) + a "Browse plans / connect Strava" prompt. Still hero-sized so the screen's structure is identical across users (consistency requirement). Degrades gracefully: a habits-only user still has a clear hero, just a generic one.
- **Running-plan user:** Same slot, shows today's run ("Easy 6mi @ Z2") with Start.

This single hero slot is the anchor that makes every account feel like the same app.

---

## 4. Biometrics — supporting context, not hero

Biometrics live in **one compact horizontal "Readiness" strip** placed **below the Daily Brief / Day Ring but it can sit ABOVE or just under the workout** — recommendation: **directly under the workout card**, because in Direction B the biometrics *justify* the workout recommendation, so reading workout-then-why flows naturally. (Alternatively tuck the strip right beneath the Brief line since the Brief already summarizes it — A/B candidate.)

**Treatment:** a single-row, 4-up **compact metric strip** (not big dials — that's the WHOOP hero treatment we're explicitly avoiding):
- **Recovery 71%** (color dot: green/yellow/red)
- **Sleep 7h12m** (or sleep score)
- **RHR 52**
- **Strain 8.4** (live, updates through the day)

Each is a small stat (number + label + tiny sparkline or color), ~80pt tall total, horizontally scrollable if a source adds more. Tapping any opens the full biometric detail/history.

**Graceful degradation by source:**
- **WHOOP user:** all four populate (recovery, sleep, RHR, day strain).
- **Oura user:** Readiness/Sleep/RHR populate; "Strain" slot swaps to Oura's activity/cardio-load equivalent or hides.
- **Garmin:** Body Battery / Sleep / RHR / Intensity.
- **Apple-Health-only:** Sleep + RHR + Move; no recovery → strip shows 2–3 stats centered, never empty placeholders.
- **No wearable:** the entire strip **collapses gracefully** — either hidden, or a single slim "Connect a recovery source" prompt that's dismissible. The Daily Brief then drops the recovery clause and leads with the plan. The screen must never show empty/zeroed biometric cards (the Fitbit empty-space failure).

Rule: **the strip auto-sizes to whatever the source provides and centers; it never reserves empty slots.**

---

## 5. Hero habits — adaptive rules

**Which qualify as hero habits:** habits with a *continuous numeric goal that benefits from a big progress visual and live data feeds*. Concretely:
- **Steps** (auto from HealthKit/wearable — live count, big progress)
- **Water** (frequent tap-to-add through the day)
- **Future candidates:** Active calories / Move, Sleep-hours-as-goal, Mindfulness minutes — but **cap the hero set at a curated, user-toggled list.** Default heroes = **Steps + Water.** Brad's "hero habits" concept = these slightly-bigger, data-rich cards.

**Card treatment:** each hero card shows a **ring or radial fill** (Streaks-style satisfaction) + the live value + goal ("7,420 / 10,000") + a **+ quick-add** (water) or auto-fill (steps). Amber fill on the ring as it completes; solid/celebratory state at goal. Distinctly larger and richer than regular habit chips.

**EXACT adaptive layout rules (by hero count):**

| Hero count | Layout |
|---|---|
| **0** | Hero section omitted entirely. (User turned both off.) Regular habits move up. |
| **1** | **Full-width** single hero card (tall, ~110pt) with prominent ring + large value. Don't leave a half-empty row. |
| **2** | **2-up grid** (side-by-side, square-ish ~1:1, ~160pt). This is the **default** (Steps + Water). |
| **3** | **2-up grid + 1 full-width** below (3rd spans full width), OR a 3-up compact row if cards stay ≥100pt wide. Rule: prefer 2+1 so no card gets cramped on narrow devices. |
| **4** | **2×2 grid** (square cards). Clean, balanced. |
| **5** | **2×2 grid + 1 full-width** (the 5th spans). |
| **6+** | **2×2 grid for first 4, remaining in a horizontally-scrolling compact row**, OR demote: prompt user that >4 heroes dilutes the concept and suggest moving extras to regular habits. Hard guidance: **soft-cap heroes at 4–5**; beyond that the "hero" distinction loses meaning. |

**Breakpoint rule of thumb:** full-width when count is odd *and* would otherwise orphan a card (1, 3→the +1, 5→the +1). Grid (2-up) is the base unit. Never render a single card at half-width with empty space beside it — that's the exact Fitbit mistake.

---

## 6. Regular habits section

**Placement:** below hero habits (or below biometrics if heroes are off). Header "Habits" with a small "3 of 6 done" counter and a tap-to-expand.

**Treatment:** **compact rows or a chip grid**, NOT big cards (reserve size for heroes). Each habit = icon + name + a **tap-to-complete control on the right**:
- **Binary habits:** a circular checkbox that fills with amber + haptic on tap (Streaks feel, compact form).
- **Counter habits:** a "2/3" stepper with +/–, the ring around the count filling as it climbs.

Completed habits get a struck/dimmed + ✓ state and optionally **sink to the bottom** of the list so the *remaining* actions stay top — reinforcing "what's left to do" without nagging. Many habits → the section scrolls internally or shows "+ N more"; few habits → it's just a short tidy list. The section **hides entirely if the user tracks zero habits.**

On **past days**, habits render as their historical completion state (read-only).

---

## 7. Macro / nutrition logging

**When present:** a **single compact "Nutrition" card** modeled on MacroFactor's Nutrition & Targets widget — **stacked horizontal bars** for Calories / Protein / Carbs / Fat showing consumed vs. target, the bar going **solid amber when a target is hit**, with **remaining** values. Placement: **after habits** in the scroll (it's important but secondary to workout+habits in a *training*-first app), but it ALSO contributes a segment to the top Day Ring so it's represented above the fold.

**Logging entry point:** two-tier, per MacroFactor's pattern —
1. A **"+ Log food" button on the Nutrition card** itself.
2. A persistent **quick-add affordance** — recommend folding food-logging into a global **+ FAB / quick-action** (the same one that can quick-start a workout or add water), so logging is one tap from anywhere, not gated behind scrolling to the card.

**When NOT present (most users today, feature not shipped or user opted out):** the card and the macro Day-Ring segment **simply don't render.** The Day Ring re-weights across the remaining segments (workout + habits). No placeholder, no "coming soon" clutter. This is the graceful-degradation rule applied — the layout is *additive*: nutrition slots in cleanly when enabled and vanishes when not, without leaving a hole.

---

## 8. Top-to-bottom section order (and above-the-fold)

```
┌─ Header (sticky): [Date / "Today"] ……………………… [Today pill] [avatar]
│
│  ── ABOVE THE FOLD ──────────────────────────────
│  Daily Brief         one coaching sentence (biometric-aware)
│  Day Ring            segmented progress: workout · habits · macros
│
│  WORKOUT (HERO)      full-width amber "Start today's workout"
│                      (or Rest Day / Start-a-workout state)
│  ── (fold ~here on iPhone) ──────────────────────
│
│  Readiness strip     compact 4-up: Recovery · Sleep · RHR · Strain
│
│  Hero Habits         Steps + Water (adaptive grid, §5)
│
│  Habits              compact completion rows (binary + counter)
│
│  Nutrition           macro bars + Log food   (only if enabled)
│
│  (footer: subtle "synced via WHOOP · 6:42am" + day nav hint)
└─
```

**Above-the-fold guarantee:** the user always sees, without scrolling — **(1) the coaching line, (2) the Day Ring progress, (3) the hero Workout CTA.** That is the entire thesis of Direction B in one viewport: *here's how you're doing, here's the why, here's the main thing to do.* Everything below is supporting detail and lighter-weight actions.

**Ordering rationale:** workout above biometrics (inverting WHOOP) because Direction B treats the *action* as the hero and biometrics as the *justification* you glance at second. Hero habits above regular habits (size = importance). Nutrition last because in a strength+running app it's the newest/most-optional surface — but it still earns an above-the-fold token via the Day Ring.

---

## 9. Rationale + biggest tradeoffs/risks

**Why this layout (grounded):**
- **Workout-as-hero** is Future's WOTD and Apple's Sessions-prominence, adapted so it's the single amber CTA — unmistakable primary action.
- **Day Ring + Daily Brief** fuses Apple's close-your-rings dopamine with WHOOP's Daily Outlook coaching, so the screen *coaches* rather than *lists*. This is what differentiates Direction B from a generic dashboard.
- **Compact biometric strip** deliberately rejects WHOOP's big-dials-on-top — in our philosophy the numbers are context, so they get a glanceable strip and tap-through, not the marquee.
- **Streaks-style tactile habits + hero/regular split** matches Brad's mental model and the proven satisfaction of fill-on-complete.
- **MacroFactor's compact macro widget + global log button** lets nutrition slot in additively without ever owning the screen.
- **Additive/degrading layout** (sources, habits, macros all auto-size or vanish) directly answers the cross-account-consistency requirement and avoids Fitbit's empty-card revolt.

**The 3 biggest tradeoffs / risks:**

1. **The Day Ring's weighting is hard to get right.** If macros count as much as a 90-minute workout, completing the "easy" segments (drink water) can show a misleadingly "done" day, or conversely the ring feels unbeatable on rest days. *Mitigation:* weight segments by effort/importance, special-case rest days (ring target shrinks), and make the ring informative-not-judgmental. This is the single most likely thing to feel wrong in v1 — prototype the math early.

2. **Coaching line quality is make-or-break and fragile across sources.** A great Daily Brief sells the whole "coach" feeling; a generic or wrong one ("Recovery 71%" when the user has no recovery source) instantly breaks trust. *Mitigation:* template the Brief by available data tier (full-wearable / partial / no-wearable / no-plan), and never reference a metric the user doesn't have. Degrade to plan-only language gracefully.

3. **Action-first can feel naggy / guilt-inducing** — the flip side of "here's what to do today" is "here's everything you haven't done." Fitbit's redesign backlash shows users punish screens that feel like they're judging them. *Mitigation:* completed items celebrate and recede (sink/dim), the Brief is encouraging not scolding, rest days are first-class, and nothing shows angry-red for incompletion. The tone must be coach, not drill sergeant — especially on low-recovery days where pushing would be wrong.

**Secondary risk — discoverability of day-by-day history:** leading with "Home" + swipe-back is clean but less discoverable than a visible date strip. *Mitigation:* the date-as-title + "Today" pill + a subtle swipe hint on first run.
