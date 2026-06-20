// FORGE icon registry — typed, semantic. Authors NEVER hand-pick Phosphor names; they go through `icons.<domain>`.
// Every value is a Phosphor class string. Use as: `<i class="ph ${icons.fuel}"></i>`.
// To add an icon, add it here first. To pick a different glyph, change it here once.

export const icons = Object.freeze({
  // --- biometrics ---
  recovery:    'ph-heartbeat',
  strain:      'ph-pulse',
  sleep:       'ph-moon',
  hrv:         'ph-wave-sine',
  rhr:         'ph-heartbeat',

  // --- daily ---
  steps:       'ph-footprints',
  water:       'ph-drop',
  weight:      'ph-scales',

  // --- fuel / macros ---
  // fuel = calories (energy in/out). Fire reads as "burn/energy", drop would mean liquid — wrong domain.
  fuel:        'ph-fire',
  calories:    'ph-fire',
  // protein → egg reads more universally as "food protein" than fish.
  protein:     'ph-egg',
  carbs:       'ph-bowl-food',
  fat:         'ph-drop-half',

  // --- training ---
  workout:     'ph-barbell',
  run:         'ph-person-simple-run',
  mobility:    'ph-person-simple-walk',
  stretch:     'ph-person-simple-tai-chi',

  // --- supplements ---
  vitaminsAM:  'ph-sun',
  vitaminsPM:  'ph-moon-stars',

  // --- nav / chrome ---
  home:        'ph-house',
  plan:        'ph-calendar-blank',
  habits:      'ph-check-square',
  settings:    'ph-gear-six',
  account:     'ph-user-circle',

  // --- actions ---
  refresh:     'ph-arrow-clockwise',
  edit:        'ph-pencil-simple',
  plus:        'ph-plus',
  minus:       'ph-minus',
  check:       'ph-check',
  caretLeft:   'ph-caret-left',
  caretRight:  'ph-caret-right',
  x:           'ph-x',
  play:        'ph-play',
  pause:       'ph-pause',
  record:      'ph-record-fill',
});

/**
 * getIcon(name) — typed accessor. Throws in dev so a typo can't ship as a missing glyph.
 * Pass `{ fallback: true }` to receive 'ph-question' instead of throwing (useful in templates).
 */
export function getIcon(name, opts = {}) {
  if (Object.prototype.hasOwnProperty.call(icons, name)) return icons[name];
  if (opts.fallback) return 'ph-question';
  throw new Error(`[forge/icons] Unknown icon "${name}". Add it to kit/icons.js or call getIcon(name, { fallback: true }).`);
}

// CommonJS / browser globals fallback so example HTML can use it without a bundler.
if (typeof window !== 'undefined') {
  window.ForgeIcons = { icons, getIcon };
}
