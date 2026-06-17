# Step 04 — KaTeX integration — locally-bundled fonts

**Phase:** Core (math) · **Status:** done · **Depends on:** 03

## Goal
Crisp, vector math rendering that survives a strict CSP and prints true-vector — **no CDN**.

## Do
- Add `katex`; **bundle KaTeX CSS + fonts locally** (copy into `public/katex/` or import so Vite
  fingerprints them) — never load fonts from a CDN (they'd be CSP-blocked or print as fallback
  glyphs; see ARCHITECTURE §7/§9).
- `src/lib/katex.js` — `renderToString(latex, { throwOnError:false })` helper; one place that wraps
  output in a `dir="ltr"` container so RTL context never reorders symbols.
- Smoke-render a few formulas (fraction, superscript, √, integral, matrix) into a throwaway view.

## Files
- `src/lib/katex.js`, `public/katex/` (or bundled import), font wiring

## Done-when
- [ ] Sample formulas render crisp and correctly LTR inside the RTL page.
- [ ] **Network tab shows zero external font/CSS requests**; fonts resolve from local assets.

## Verify
- Browser MCP: render samples, screenshot, inspect Network for CDN calls (must be none). Commit
  `step 04: katex local fonts`.
