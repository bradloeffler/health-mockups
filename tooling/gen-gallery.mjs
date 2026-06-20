#!/usr/bin/env node
// FORGE gen-gallery: orchestrate N candidate mocks, run mock-check on each,
// and emit a gallery.html that side-by-sides only the passing candidates.
//
// v1 does NOT call the Claude API — pass --candidates with already-authored
// HTML files. The subagent-spawn step is stubbed with a TODO for v2.
//
// Usage:
//   node tooling/gen-gallery.mjs \
//     --candidates "home/explore/{j,k,h}-*.html" \
//     --out home/explore/gallery.html \
//     --brief home/explore/BRIEF.md

import { glob } from 'glob';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(__dirname, '.mock-check-out');

function parseArgs(argv) {
  const out = { candidates: [], out: null, brief: null, n: 0 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--candidates') out.candidates.push(argv[++i]);
    else if (a === '--out') out.out = argv[++i];
    else if (a === '--brief') out.brief = argv[++i];
    else if (a === '--n') out.n = +argv[++i];
  }
  return out;
}

function printPlan(n, brief) {
  console.log(`\n=== gen-gallery plan ===`);
  console.log(`brief: ${brief || '(none)'}`);
  console.log(`target candidates: ${n}`);
  for (let i = 1; i <= n; i++) {
    console.log(`  step ${i}. spawn subagent #${i} with brief + FORGE kit primitives`);
    console.log(`           -> produce home/explore/candidate-${i}.html`);
  }
  console.log(`  step ${n + 1}. run mock-check.mjs on each candidate`);
  console.log(`  step ${n + 2}. write gallery.html with PASSING candidates only`);
  console.log(`========================\n`);
}

async function runCheck(file) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath,
      [path.join(__dirname, 'mock-check.mjs'), file],
      { cwd: REPO_ROOT });
    let stdout = '', stderr = '';
    child.stdout.on('data', d => stdout += d);
    child.stderr.on('data', d => stderr += d);
    child.on('close', code => {
      // mock-check writes a JSON blob at the tail after a blank line.
      let report = null;
      const idx = stdout.lastIndexOf('\n[');
      if (idx >= 0) { try { report = JSON.parse(stdout.slice(idx + 1))[0]; } catch {} }
      resolve({ code, report, stderr });
    });
  });
}

function badge(pass) {
  const color = pass ? '#10b981' : '#ef4444';
  const label = pass ? 'PASS' : 'FAIL';
  return `<span style="background:${color};color:#fff;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.04em;">${label}</span>`;
}

function renderGallery({ brief, results, outPath }) {
  const outDir = path.dirname(path.resolve(REPO_ROOT, outPath));
  const tiles = results.map(({ file, report }) => {
    const pass = !!(report && report.pass);
    const rel = path.relative(outDir, path.resolve(REPO_ROOT, file));
    const shot = report?.viewports?.find(v => v.vw === 390)?.shot;
    const shotRel = shot ? path.relative(outDir, path.resolve(REPO_ROOT, shot)) : null;
    const ov = report?.viewports?.reduce((s, v) => s + v.overflows.length, 0) ?? '?';
    const cl = report?.viewports?.reduce((s, v) => s + v.clipped.length, 0) ?? '?';
    return `
    <article class="tile">
      <header><a href="${rel}" target="_blank">${path.basename(file)}</a> ${badge(pass)}</header>
      <div class="meta">overflow=${ov} clipped=${cl} hex=${report?.lint?.hexCount ?? '?'} px=${report?.lint?.pxCount ?? '?'}</div>
      ${shotRel ? `<a href="${rel}" target="_blank"><img class="thumb" src="${shotRel}" alt="iPhone 13 screenshot"></a>` : ''}
      <iframe src="${rel}" width="390" height="700" loading="lazy"></iframe>
    </article>`;
  }).join('\n');

  return `<!doctype html><html><head><meta charset="utf-8"><title>FORGE gallery</title>
<style>
  body{font:14px/1.4 -apple-system,system-ui,sans-serif;background:#0b0b0c;color:#e7e7ea;margin:0;padding:24px}
  h1{font-size:18px;margin:0 0 4px}
  .brief{color:#9aa;margin:0 0 24px;font-size:13px}
  .grid{display:flex;flex-wrap:wrap;gap:24px}
  .tile{background:#161618;border:1px solid #26262a;border-radius:14px;padding:14px;width:420px}
  .tile header{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;font-weight:600}
  .tile a{color:#9cf;text-decoration:none}
  .meta{color:#9aa;font-size:12px;margin-bottom:10px;font-family:ui-monospace,monospace}
  .thumb{width:180px;border-radius:8px;border:1px solid #26262a;display:block;margin-bottom:10px}
  iframe{border:1px solid #26262a;border-radius:10px;background:#fff}
</style></head><body>
<h1>FORGE gallery — passing candidates</h1>
<p class="brief">${brief ? `brief: ${path.relative(outDir, path.resolve(REPO_ROOT, brief))}` : ''}</p>
<div class="grid">${tiles}</div>
</body></html>`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const files = [];
  for (const pat of args.candidates) {
    const m = await glob(pat, { cwd: REPO_ROOT, absolute: true, nodir: true });
    files.push(...m);
  }
  const unique = [...new Set(files)];
  printPlan(args.n || unique.length, args.brief);

  // TODO: spawn subagent here — for v1 we consume pre-authored candidates.
  if (!unique.length) { console.error('No candidate files matched.'); process.exit(2); }
  if (!args.out) { console.error('--out is required'); process.exit(2); }

  console.log(`running mock-check on ${unique.length} candidate(s)...`);
  const results = [];
  for (const f of unique) {
    const r = await runCheck(f);
    results.push({ file: path.relative(REPO_ROOT, f), report: r.report });
    console.log(`  ${r.report?.pass ? 'PASS' : 'FAIL'}  ${path.relative(REPO_ROOT, f)}`);
  }

  const passing = results.filter(r => r.report?.pass);
  const html = renderGallery({ brief: args.brief, results: passing, outPath: args.out });
  const outAbs = path.resolve(REPO_ROOT, args.out);
  await fs.mkdir(path.dirname(outAbs), { recursive: true });
  await fs.writeFile(outAbs, html, 'utf8');
  console.log(`\nwrote ${args.out}  (${passing.length}/${results.length} passing)`);
}

main().catch(e => { console.error(e); process.exit(2); });
