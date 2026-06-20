#!/usr/bin/env node
// FORGE mock-check: opens HTML mocks in headless Chromium across three iPhone
// viewports, finds horizontal overflow, right-edge text clipping, and lints raw
// hex / px values outside the kit/. Writes screenshots + a markdown report.
//
// Usage: node tooling/mock-check.mjs <file-or-glob> [<file-or-glob> ...]

import { chromium, devices } from 'playwright';
import { glob } from 'glob';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(__dirname, '.mock-check-out');

const C = { red: s => `\x1b[31m${s}\x1b[0m`, green: s => `\x1b[32m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`, dim: s => `\x1b[2m${s}\x1b[0m`,
  bold: s => `\x1b[1m${s}\x1b[0m` };

// Playwright device descriptors — verified viewport widths: SE 375, 13 390, 14PM 430.
const VIEWPORTS = [
  // Use modern device descriptors as a base, but force the viewport width to the
  // actual screen width we want to test. (Playwright's bundled `iPhone SE` is
  // the 1st-gen 320px device — long extinct. We target 375 / 390 / 430.)
  { name: 'iPhone 13 mini · 375', key: 'iPhone 13', vw: 375, vh: 812 },
  { name: 'iPhone 13 · 390', key: 'iPhone 13', vw: 390, vh: 844 },
  { name: 'iPhone 14 Pro Max · 430', key: 'iPhone 14 Pro Max', vw: 430, vh: 932 },
];

async function expandInputs(args) {
  const out = new Set();
  for (const a of args) {
    const matches = await glob(a, { cwd: REPO_ROOT, absolute: true, nodir: true });
    if (matches.length) matches.forEach(m => out.add(m));
    else out.add(path.resolve(process.cwd(), a));
  }
  return [...out];
}

async function lintSource(file) {
  const src = await fs.readFile(file, 'utf8');
  const rel = path.relative(REPO_ROOT, file);
  const inKit = rel.startsWith('kit' + path.sep) || rel === 'kit';
  if (inKit) return { exempt: true, hexCount: 0, pxCount: 0, hexExamples: [], pxExamples: [] };
  const hexMatches = [...src.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map(m => m[0]);
  const pxMatches = [...src.matchAll(/\b\d+px\b/g)].map(m => m[0]);
  return {
    exempt: false,
    hexCount: hexMatches.length, pxCount: pxMatches.length,
    hexExamples: [...new Set(hexMatches)].slice(0, 5),
    pxExamples: [...new Set(pxMatches)].slice(0, 5),
  };
}

async function runChecksOnPage(page) {
  return page.evaluate(() => {
    const overflows = [];
    document.querySelectorAll('*').forEach(el => {
      if (el.scrollWidth > el.clientWidth + 1) {
        overflows.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className && el.className.toString) ? el.className.toString().slice(0, 80) : '',
          overflow: el.scrollWidth - el.clientWidth,
          clientWidth: el.clientWidth,
        });
      }
    });
    const clipped = [];
    const W = window.innerWidth;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      const txt = n.nodeValue && n.nodeValue.trim();
      if (!txt) continue;
      const r = document.createRange(); r.selectNodeContents(n);
      const rect = r.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      if (rect.top > window.innerHeight || rect.bottom < 0) continue;
      if (rect.right > W - 4) {
        const parent = n.parentElement;
        clipped.push({
          tag: parent ? parent.tagName.toLowerCase() : '?',
          text: txt.slice(0, 60),
          right: Math.round(rect.right),
          innerWidth: W,
        });
      }
    }
    return { overflows: overflows.slice(0, 25), clipped: clipped.slice(0, 25),
             docScrollWidth: document.documentElement.scrollWidth };
  });
}

async function checkFile(browser, file) {
  const base = path.basename(file, path.extname(file));
  const url = pathToFileURL(file).href;
  const lint = await lintSource(file);
  const perViewport = [];

  for (const vp of VIEWPORTS) {
    const device = devices[vp.key];
    if (!device) throw new Error(`Unknown Playwright device: ${vp.key}`);
    // Override the viewport so we always test the width WE want, regardless of
    // what the device descriptor's default is.
    const ctx = await browser.newContext({
      ...device,
      viewport: { width: vp.vw, height: vp.vh ?? 844 },
    });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle' }).catch(() => page.goto(url, { waitUntil: 'load' }));
    await page.waitForTimeout(250); // let webfonts/icons settle
    const results = await runChecksOnPage(page);
    const shotPath = path.join(OUT_DIR, `${base}--${vp.vw}x.png`);
    await page.screenshot({ path: shotPath, fullPage: true });
    perViewport.push({ vp, results, shot: shotPath });
    await ctx.close();
  }

  const pass = perViewport.every(v => v.results.overflows.length === 0 && v.results.clipped.length === 0)
    && (lint.exempt || (lint.hexCount === 0 && lint.pxCount === 0));

  return { file, base, lint, perViewport, pass };
}

function renderMarkdown(report) {
  const rel = path.relative(REPO_ROOT, report.file);
  const lines = [`# mock-check report: \`${rel}\``, '',
    `Status: ${report.pass ? 'PASS' : 'FAIL'}`, ''];
  lines.push('## Lint (raw hex / raw px)');
  if (report.lint.exempt) lines.push('- exempt (file is under `kit/`)');
  else {
    lines.push(`- raw hex colors: **${report.lint.hexCount}** ${report.lint.hexExamples.length ? `(e.g. ${report.lint.hexExamples.join(', ')})` : ''}`);
    lines.push(`- raw px values: **${report.lint.pxCount}** ${report.lint.pxExamples.length ? `(e.g. ${report.lint.pxExamples.join(', ')})` : ''}`);
  }
  lines.push('');
  for (const v of report.perViewport) {
    lines.push(`## ${v.vp.name} (${v.vp.vw}px)`);
    lines.push(`- doc scrollWidth: ${v.results.docScrollWidth}`);
    lines.push(`- horizontal overflows: **${v.results.overflows.length}**`);
    for (const o of v.results.overflows.slice(0, 8))
      lines.push(`  - \`<${o.tag}>\` cls="${o.cls}" overflow=+${o.overflow}px (clientWidth=${o.clientWidth})`);
    lines.push(`- right-edge clipped text: **${v.results.clipped.length}**`);
    for (const c of v.results.clipped.slice(0, 8))
      lines.push(`  - \`<${c.tag}>\` right=${c.right}/${c.innerWidth} text="${c.text.replace(/"/g, '\\"')}"`);
    lines.push(`- screenshot: \`${path.relative(REPO_ROOT, v.shot)}\``);
    lines.push('');
  }
  return lines.join('\n');
}

function printSummary(report) {
  const rel = path.relative(REPO_ROOT, report.file);
  const tag = report.pass ? C.green('PASS') : C.red('FAIL');
  console.log(`\n${C.bold(rel)}  ${tag}`);
  if (!report.lint.exempt && (report.lint.hexCount || report.lint.pxCount))
    console.log(`  ${C.yellow('lint')}  hex=${report.lint.hexCount} px=${report.lint.pxCount}`);
  for (const v of report.perViewport) {
    const ov = v.results.overflows.length, cl = v.results.clipped.length;
    const status = (ov || cl) ? C.red('x') : C.green('ok');
    console.log(`  ${status}  ${v.vp.vw}x  overflow=${ov} clipped=${cl}  ${C.dim(path.relative(REPO_ROOT, v.shot))}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (!args.length) { console.error('Usage: mock-check.mjs <file-or-glob> ...'); process.exit(2); }
  await fs.mkdir(OUT_DIR, { recursive: true });
  const files = await expandInputs(args);
  if (!files.length) { console.error('No files matched.'); process.exit(2); }

  const browser = await chromium.launch();
  const reports = [];
  try {
    for (const f of files) {
      const r = await checkFile(browser, f);
      reports.push(r);
      printSummary(r);
      const md = renderMarkdown(r);
      const mdPath = path.join(OUT_DIR, `${r.base}--REPORT.md`);
      await fs.writeFile(mdPath, md, 'utf8');
    }
  } finally { await browser.close(); }

  // JSON to stdout (after pretty summary, separated)
  console.log('\n' + JSON.stringify(reports.map(r => ({
    file: path.relative(REPO_ROOT, r.file), pass: r.pass, lint: r.lint,
    viewports: r.perViewport.map(v => ({ vw: v.vp.vw, name: v.vp.name,
      overflows: v.results.overflows, clipped: v.results.clipped,
      shot: path.relative(REPO_ROOT, v.shot) })),
  })), null, 2));

  process.exit(reports.every(r => r.pass) ? 0 : 1);
}

main().catch(e => { console.error(e); process.exit(2); });
