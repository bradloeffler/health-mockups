/* FORGE catalog — shared interaction layer (polish v3).
   Loaded by every catalog page. Token-only, no raw values authored here.
   Responsibilities:
     - masthead shrink on scroll
     - top scroll-progress bar
     - next / prev dock injection
     - about-block live counts (index only)
     - swatch click-to-copy with three-way picker (foundations only)
     - cmd-K command palette (all pages)
     - changelog modal (triggered by .cat-news)
     - theme toggle (Dark / Night)
     - page entrance stagger (tiles, sections, ex blocks)
     - bare/standalone view via ?bare=1
*/
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var qs = function (s, r) { return (r || document).querySelector(s); };
  var qsa = function (s, r) { return Array.from((r || document).querySelectorAll(s)); };

  // ----- bare / standalone view --------------------------------------------
  try {
    var params = new URLSearchParams(window.location.search);
    if (params.get('bare') === '1') {
      document.documentElement.classList.add('is-bare');
    }
  } catch (e) {}

  // ----- masthead shrink ----------------------------------------------------
  var mast = qs('.cat-masthead');
  var bar = null;
  if (mast) {
    var shrunk = false;
    var onScrollMast = function () {
      var y = window.scrollY || window.pageYOffset || 0;
      var want = y > 80;
      if (want !== shrunk) {
        shrunk = want;
        mast.classList.toggle('is-shrunk', shrunk);
      }
    };
    onScrollMast();
    window.addEventListener('scroll', onScrollMast, { passive: true });
  }

  // ----- scroll progress bar ------------------------------------------------
  (function () {
    var prog = document.createElement('div');
    prog.className = 'cat-progress';
    var b = document.createElement('div');
    b.className = 'cat-progress__bar';
    prog.appendChild(b);
    document.body.appendChild(prog);
    var update = function () {
      var doc = document.documentElement;
      var max = (doc.scrollHeight - doc.clientHeight) || 1;
      var y = window.scrollY || window.pageYOffset || 0;
      var pct = Math.max(0, Math.min(100, (y / max) * 100));
      b.style.width = pct + '%';
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  })();

  // ----- toast helper --------------------------------------------------------
  var toastEl = null;
  var toastTimer = null;
  function toast(html) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'cat-toast';
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = html;
    void toastEl.offsetWidth;
    toastEl.classList.add('is-visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 1400);
  }
  window.__catToast = toast;

  // ----- catalog page order (used for prev / next + palette) ---------------
  var ORDER = [
    { href: 'foundations.html',                title: 'Foundations',         section: 'Foundations', kind: 'root',      icon: 'ph-stack' },
    { href: 'icons.html',                      title: 'Icons',               section: 'Foundations', kind: 'root',      icon: 'ph-sparkle' },
    { href: 'components/card.html',            title: 'k-card',              section: 'Components',  kind: 'component', icon: 'ph-square' },
    { href: 'components/eyebrow.html',         title: 'k-eyebrow',           section: 'Components',  kind: 'component', icon: 'ph-text-aa' },
    { href: 'components/metric.html',          title: 'k-metric',            section: 'Components',  kind: 'component', icon: 'ph-chart-bar' },
    { href: 'components/numeric.html',         title: 'k-numeric',           section: 'Components',  kind: 'component', icon: 'ph-number-square-one' },
    { href: 'components/ring.html',            title: 'k-ring',              section: 'Components',  kind: 'component', icon: 'ph-circle-half' },
    { href: 'components/icon-tile.html',       title: 'k-icon-tile',         section: 'Components',  kind: 'component', icon: 'ph-squares-four' },
    { href: 'components/pill.html',            title: 'k-pill',              section: 'Components',  kind: 'component', icon: 'ph-pill' },
    { href: 'components/progress.html',        title: 'k-progress',          section: 'Components',  kind: 'component', icon: 'ph-rows' },
    { href: 'components/step-btn.html',        title: 'k-step-btn',          section: 'Components',  kind: 'component', icon: 'ph-plus-circle' },
    { href: 'components/checkbox.html',        title: 'k-checkbox',          section: 'Components',  kind: 'component', icon: 'ph-check-square' },
    { href: 'components/habit-row.html',       title: 'k-habit-row',         section: 'Components',  kind: 'component', icon: 'ph-list-checks' },
    { href: 'components/nav.html',             title: 'k-nav',               section: 'Components',  kind: 'component', icon: 'ph-house' },
    { href: 'components/screen.html',          title: 'k-screen',            section: 'Components',  kind: 'component', icon: 'ph-device-mobile' },
    { href: 'patterns/metric-card.html',       title: 'Metric card',         section: 'Patterns',    kind: 'pattern',   icon: 'ph-cards' },
    { href: 'patterns/ring-pair.html',         title: 'Ring pair',           section: 'Patterns',    kind: 'pattern',   icon: 'ph-circles-three' },
    { href: 'patterns/progress-stat.html',     title: 'Progress stat',       section: 'Patterns',    kind: 'pattern',   icon: 'ph-chart-line' },
    { href: 'patterns/stepper-control.html',   title: 'Stepper control',     section: 'Patterns',    kind: 'pattern',   icon: 'ph-plus-minus' },
    { href: 'patterns/habit-checklist.html',   title: 'Habit checklist',     section: 'Patterns',    kind: 'pattern',   icon: 'ph-check-square' },
    { href: 'patterns/bottom-nav-shell.html',  title: 'Bottom nav shell',    section: 'Patterns',    kind: 'pattern',   icon: 'ph-rectangle' },
    { href: 'patterns/card-grid.html',         title: 'Card grid',           section: 'Patterns',    kind: 'pattern',   icon: 'ph-grid-four' },
    { href: 'patterns/eyebrow-pill-row.html',  title: 'Eyebrow + pill row',  section: 'Patterns',    kind: 'pattern',   icon: 'ph-text-columns' }
  ];

  function currentRel() {
    var path = window.location.pathname || '';
    var i = path.lastIndexOf('/catalog/');
    if (i < 0) return '';
    return path.slice(i + '/catalog/'.length);
  }

  function resolveHref(targetHref, currentRelPath) {
    var depth = (currentRelPath.match(/\//g) || []).length;
    var prefix = depth > 0 ? '../'.repeat(depth) : './';
    return prefix + targetHref;
  }

  // ----- next / prev dock ---------------------------------------------------
  function buildDock() {
    var rel = currentRel();
    if (rel === '' || rel === 'index.html') return;

    var idx = -1;
    for (var k = 0; k < ORDER.length; k++) {
      if (ORDER[k].href === rel) { idx = k; break; }
    }
    if (idx < 0) return;

    var host = qs('main.cat')
            || qs('main.doc')
            || qs('main.cat-page')
            || qs('main')
            || document.body;
    if (!host) return;

    var prev = idx > 0 ? ORDER[idx - 1] : null;
    var next = idx < ORDER.length - 1 ? ORDER[idx + 1] : null;

    var dock = document.createElement('nav');
    dock.className = 'cat-dock cat-fade';
    dock.style.setProperty('--i', '8');
    dock.setAttribute('aria-label', 'Catalog navigation');

    function entry(item, dir) {
      if (!item) {
        var empty = document.createElement('span');
        empty.className = 'cat-dock__link cat-dock__link--empty cat-dock__link--' + dir;
        return empty;
      }
      var a = document.createElement('a');
      a.className = 'cat-dock__link cat-dock__link--' + dir;
      a.href = resolveHref(item.href, rel);
      var arrow = dir === 'prev'
        ? '<i class="ph ph-caret-left"></i> Previous'
        : 'Next <i class="ph ph-caret-right"></i>';
      a.innerHTML =
        '<span class="cat-dock__lbl">' + arrow + ' &middot; ' + item.section + '</span>' +
        '<span class="cat-dock__name">' + item.title + '</span>';
      return a;
    }

    dock.appendChild(entry(prev, 'prev'));
    dock.appendChild(entry(next, 'next'));

    var footer = host.querySelector('.cat-footer, .doc-footer');
    if (footer && footer.parentElement === host) {
      host.insertBefore(dock, footer);
    } else {
      host.appendChild(dock);
    }
  }

  // ----- about-block live counts -------------------------------------------
  function fillAboutCounts() {
    var about = qs('.cat-about');
    if (!about) return;
    var slots = qsa('[data-count]', about);
    slots.forEach(function (slot) {
      var key = slot.getAttribute('data-count');
      if (key === 'components') slot.textContent = '13';
      else if (key === 'patterns') slot.textContent = '8';
      else if (key === 'viewports') slot.textContent = '3';
      else if (key === 'tokens') slot.textContent = '55';
      else if (key === 'icons') {
        slot.textContent = '40';
        fetch('../icons.js').then(function (r) { return r.text(); }).then(function (txt) {
          var matches = txt.match(/^\s*[a-zA-Z][a-zA-Z0-9]*:\s*'ph-/gm);
          if (matches) slot.textContent = String(matches.length);
        }).catch(function () {});
      }
    });
  }

  // ----- foundations: swatch click → picker --------------------------------
  function bindSwatches() {
    var swatches = qsa('.cat-swatch');
    if (!swatches.length) return;

    function getName(sw) {
      var nameEl = qs('.cat-swatch__name', sw);
      return nameEl ? nameEl.textContent.trim() : '';
    }
    function getVal(sw) {
      var valEl = qs('.cat-swatch__val', sw);
      return valEl ? valEl.textContent.trim() : '';
    }
    function closeAll() { swatches.forEach(function (s) { s.classList.remove('is-active'); }); }

    swatches.forEach(function (sw) {
      // Inject picker UI once
      if (!qs('.cat-swatch__picker', sw)) {
        var name = getName(sw);
        var val = getVal(sw);
        var picker = document.createElement('div');
        picker.className = 'cat-swatch__picker';
        picker.setAttribute('role', 'menu');
        picker.innerHTML =
          '<button type="button" data-fmt="css">CSS <span class="kind">var(' + name + ')</span></button>' +
          '<button type="button" data-fmt="sass">SASS <span class="kind">$' + name.replace(/^--/, '') + '</span></button>' +
          '<button type="button" data-fmt="ts">TS <span class="kind">tokens.' + name.replace(/^--/, '').replace(/-/g, '_') + '</span></button>' +
          '<button type="button" data-fmt="raw">RAW <span class="kind">' + val + '</span></button>';
        sw.appendChild(picker);

        qsa('button', picker).forEach(function (btn) {
          btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var fmt = btn.getAttribute('data-fmt');
            var out = '';
            switch (fmt) {
              case 'css':  out = 'var(' + name + ')'; break;
              case 'sass': out = '$' + name.replace(/^--/, ''); break;
              case 'ts':   out = 'tokens.' + name.replace(/^--/, '').replace(/-/g, '_'); break;
              case 'raw':  out = val; break;
            }
            if (navigator.clipboard) {
              navigator.clipboard.writeText(out).then(function () {
                toast('<span class="ok">&check;</span> Copied <b>' + out + '</b>');
              }).catch(function () {});
            }
            closeAll();
          });
        });
      }

      sw.addEventListener('click', function (e) {
        if (e.target.closest('.cat-swatch__picker')) return;
        var wasActive = sw.classList.contains('is-active');
        closeAll();
        if (!wasActive) sw.classList.add('is-active');
      });
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.cat-swatch')) closeAll();
    });
  }

  // ----- page entrance stagger ---------------------------------------------
  function applyEntrance() {
    if (reduced) return;
    // tiles (index)
    qsa('.tile').forEach(function (el, i) {
      el.classList.add('cat-fade');
      el.style.setProperty('--i', String(i));
    });
    // sections on every page
    qsa('.doc-section, .cat-section').forEach(function (el, i) {
      el.classList.add('cat-fade');
      el.style.setProperty('--i', String(i));
    });
    // example blocks on component / pattern pages
    qsa('.ex, .cat-demo').forEach(function (el, i) {
      el.classList.add('cat-fade');
      el.style.setProperty('--i', String(i + 1));
    });
  }

  // ----- Cmd+K command palette ---------------------------------------------
  function buildPalette() {
    var rel = currentRel();
    var pal = document.createElement('div');
    pal.className = 'cat-palette';
    pal.setAttribute('aria-hidden', 'true');
    pal.innerHTML =
      '<div class="cat-palette__panel" role="dialog" aria-label="Search the catalog">' +
        '<div class="cat-palette__top">' +
          '<i class="ph ph-magnifying-glass"></i>' +
          '<input class="cat-palette__input" type="text" placeholder="Search pages…" autocomplete="off" spellcheck="false" />' +
          '<span class="cat-palette__hint">esc</span>' +
        '</div>' +
        '<div class="cat-palette__list" role="listbox"></div>' +
        '<div class="cat-palette__foot">' +
          '<span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>' +
          '<span><kbd>↵</kbd> Open</span>' +
          '<span style="margin-left:auto"><kbd>⌘K</kbd> Toggle</span>' +
        '</div>' +
      '</div>';
    document.body.appendChild(pal);

    var input = qs('.cat-palette__input', pal);
    var list = qs('.cat-palette__list', pal);
    var cur = 0;
    var filtered = ORDER.slice();

    // Include current page in entries with marker
    var entries = [
      { href: rel.indexOf('/') >= 0 ? '../index.html' : 'index.html', title: 'Home · Catalog', section: 'Index', icon: 'ph-house-line' }
    ].concat(ORDER);

    function render() {
      var q = (input.value || '').toLowerCase().trim();
      filtered = entries.filter(function (it) {
        if (!q) return true;
        return (it.title + ' ' + it.section).toLowerCase().indexOf(q) >= 0;
      });
      if (cur >= filtered.length) cur = Math.max(0, filtered.length - 1);
      list.innerHTML = '';
      if (!filtered.length) {
        var em = document.createElement('div');
        em.className = 'cat-palette__empty';
        em.textContent = 'No matches';
        list.appendChild(em);
        return;
      }
      filtered.forEach(function (it, i) {
        var a = document.createElement('a');
        a.className = 'cat-palette__item' + (i === cur ? ' is-cur' : '');
        a.href = it.href === 'index.html' || it.href === '../index.html'
          ? it.href
          : resolveHref(it.href, rel);
        a.innerHTML =
          '<i class="ph ' + (it.icon || 'ph-arrow-up-right') + '"></i>' +
          '<span class="name">' + it.title + '</span>' +
          '<span class="sect">' + it.section + '</span>';
        a.addEventListener('mouseenter', function () {
          cur = i;
          qsa('.cat-palette__item', list).forEach(function (el, j) {
            el.classList.toggle('is-cur', j === cur);
          });
        });
        list.appendChild(a);
      });
    }

    function open() {
      pal.classList.add('is-open');
      pal.setAttribute('aria-hidden', 'false');
      cur = 0;
      input.value = '';
      render();
      setTimeout(function () { input.focus(); }, 30);
    }
    function close() {
      pal.classList.remove('is-open');
      pal.setAttribute('aria-hidden', 'true');
    }
    function navigate(target) {
      if (target) window.location.href = target.href || resolveHref(target.href, rel);
    }

    input.addEventListener('input', render);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        cur = Math.min(filtered.length - 1, cur + 1);
        render();
        var node = list.children[cur]; if (node && node.scrollIntoView) node.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        cur = Math.max(0, cur - 1);
        render();
        var n = list.children[cur]; if (n && n.scrollIntoView) n.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        var pick = filtered[cur];
        if (pick) {
          var href = (pick.href === 'index.html' || pick.href === '../index.html')
            ? pick.href : resolveHref(pick.href, rel);
          window.location.href = href;
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    });
    pal.addEventListener('click', function (e) {
      if (e.target === pal) close();
    });

    document.addEventListener('keydown', function (e) {
      var isToggle = (e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey);
      if (isToggle) {
        e.preventDefault();
        if (pal.classList.contains('is-open')) close(); else open();
      } else if (e.key === '/' && document.activeElement === document.body) {
        e.preventDefault();
        open();
      }
    });

    // Wire trigger pill in masthead
    var trigger = qs('.cat-kbd');
    if (trigger) trigger.addEventListener('click', open);
  }

  // ----- changelog modal ---------------------------------------------------
  function buildChangelog() {
    var modal = document.createElement('div');
    modal.className = 'cat-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML =
      '<div class="cat-modal__panel" role="dialog" aria-label="What\'s new">' +
        '<div class="cat-modal__head">' +
          '<span class="cat-modal__title">What\'s new · v0.1</span>' +
          '<button class="cat-modal__close" aria-label="Close"><i class="ph ph-x"></i></button>' +
        '</div>' +
        '<div class="cat-modal__body">' +
          '<div class="cat-change">' +
            '<span class="cat-change__ver">v0.1.3</span>' +
            '<span class="cat-change__txt">Cmd+K command palette across all 24 pages.' +
              '<em>Type to filter, ↑↓ to move, ↵ to open. Also bound to /.</em></span>' +
          '</div>' +
          '<div class="cat-change">' +
            '<span class="cat-change__ver">v0.1.2</span>' +
            '<span class="cat-change__txt">Vitrine stages, page-entrance stagger, scroll progress.' +
              '<em>Every example gets a hairline weave and an amber underglow.</em></span>' +
          '</div>' +
          '<div class="cat-change">' +
            '<span class="cat-change__ver">v0.1.1</span>' +
            '<span class="cat-change__txt">Swatch copy picker (CSS, SASS, TS, raw).' +
              '<em>Click any color on Foundations and choose your dialect.</em></span>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);

    function open() {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
    }
    function close() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    }
    qs('.cat-modal__close', modal).addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });
    var trigger = qs('.cat-news');
    if (trigger) trigger.addEventListener('click', open);
  }

  // ----- theme toggle (Dark / Night) ---------------------------------------
  function bindTheme() {
    var toggle = qs('.cat-theme');
    if (!toggle) return;
    try {
      var saved = localStorage.getItem('forge-theme');
      if (saved === 'night') document.documentElement.setAttribute('data-theme', 'night');
    } catch (e) {}
    var update = function () {
      var cur = document.documentElement.getAttribute('data-theme') === 'night' ? 'night' : 'dark';
      qsa('button', toggle).forEach(function (b) {
        b.classList.toggle('is-on', b.getAttribute('data-theme') === cur);
      });
    };
    qsa('button', toggle).forEach(function (b) {
      b.addEventListener('click', function () {
        var t = b.getAttribute('data-theme');
        if (t === 'night') document.documentElement.setAttribute('data-theme', 'night');
        else document.documentElement.removeAttribute('data-theme');
        try { localStorage.setItem('forge-theme', t); } catch (e) {}
        update();
      });
    });
    update();
  }

  // ----- code language tag inference ---------------------------------------
  function tagCode() {
    qsa('.code, .cat-code').forEach(function (el) {
      if (el.hasAttribute('data-lang')) return;
      var txt = el.textContent || '';
      var lang = 'HTML';
      if (/^\s*(import|const|function|let|var|window\.)/.test(txt)) lang = 'JS';
      else if (/--[a-z]/.test(txt) && !/<[a-z]/i.test(txt)) lang = 'CSS';
      else if (/<[a-z]/i.test(txt)) lang = 'HTML';
      el.setAttribute('data-lang', lang);
    });
  }

  // ----- init ---------------------------------------------------------------
  function init() {
    try { buildDock(); } catch (e) {}
    try { fillAboutCounts(); } catch (e) {}
    try { bindSwatches(); } catch (e) {}
    try { applyEntrance(); } catch (e) {}
    try { tagCode(); } catch (e) {}
    try { buildPalette(); } catch (e) {}
    try { buildChangelog(); } catch (e) {}
    try { bindTheme(); } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
