// Prototype wiring shim — single source of truth for every cross-screen action
// in the FORGE app prototype. Each page just <script src="./_nav.js"></script>
// (or "../_nav.js" from the onboarding folder) and this attaches click handlers
// based on aria-label / role / data attributes. No per-page wiring.

(function () {
  "use strict";

  // Resolve a sibling page path so this script works from both /app/*.html
  // and /app/onboarding/*.html.
  function siblingHref(name) {
    var depth = location.pathname.includes("/onboarding/") ? "../" : "./";
    return depth + name;
  }

  // ---- Bottom nav ----
  // Markup convention: <nav class="k-nav"> with <button class="k-nav__btn"
  // aria-label="Home|Plan|Habits|Settings">. Some agents may have used <a>;
  // both work. We attach to the closest interactive element.
  var navMap = {
    home: "home.html",
    plan: "plan.html",
    habits: "habits.html",
    settings: "settings.html",
  };
  document.querySelectorAll(".k-nav .k-nav__btn, .k-nav a, .k-nav button").forEach(function (el) {
    var label = (el.getAttribute("aria-label") || el.textContent || "").trim().toLowerCase();
    var target = navMap[label];
    if (!target) return;
    el.addEventListener("click", function (e) {
      e.preventDefault();
      location.href = siblingHref(target);
    });
    if (el.tagName === "BUTTON") el.style.cursor = "pointer";
  });

  // ---- Account icon (top-right of any page) ----
  document.querySelectorAll('[aria-label="Account" i], [data-action="account"]').forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      location.href = siblingHref("account.html");
    });
  });

  // ---- Back / close (account, workout, onboarding) ----
  document.querySelectorAll('[aria-label="Back" i], [aria-label="Close" i], [data-action="back"]').forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      // Workout close → home; everything else → history back, falling through to home.
      if (location.pathname.endsWith("/workout.html")) {
        location.href = siblingHref("home.html");
      } else if (history.length > 1) {
        history.back();
      } else {
        location.href = siblingHref("home.html");
      }
    });
  });

  // ---- Start workout (any Start/Play CTA on Home or Plan) ----
  // Matches buttons whose text starts with "Start" or which have a play icon
  // and look like a primary CTA.
  document.querySelectorAll("a, button").forEach(function (el) {
    var t = (el.textContent || "").trim().toLowerCase();
    if (/^(▶\s*)?start( workout)?\b/.test(t) && !el.dataset.navWired) {
      el.dataset.navWired = "1";
      el.addEventListener("click", function (e) {
        e.preventDefault();
        location.href = siblingHref("workout.html");
      });
    }
  });

  // ---- Onboarding forward flow ----
  // The onboarding pages link forward via Continue/Get started pills. If the
  // page author already used <a href>, leave them be; otherwise wire by aria-label.
  var ONBOARDING = ["welcome.html", "signup.html", "connect.html", "habits.html", "plan.html", "first-sync.html"];
  if (location.pathname.includes("/onboarding/")) {
    var here = location.pathname.split("/").pop();
    var nextIdx = ONBOARDING.indexOf(here) + 1;
    if (nextIdx > 0 && nextIdx < ONBOARDING.length) {
      var nextHref = "./" + ONBOARDING[nextIdx];
      document.querySelectorAll("a, button").forEach(function (el) {
        if (el.dataset.navWired) return;
        var t = (el.textContent || "").trim().toLowerCase();
        if (/^(continue|next|get started|let'?s go|create account)\b/.test(t)) {
          el.dataset.navWired = "1";
          el.addEventListener("click", function (e) {
            e.preventDefault();
            location.href = nextHref;
          });
        }
      });
    }
    // Last step (first-sync) auto-redirects to home.html after its animation.
    if (here === "first-sync.html") {
      setTimeout(function () { location.href = "../home.html"; }, 6500);
    }
  }
})();
