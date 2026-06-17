# Step 14 — Final — CSP/offline acceptance + demo

**Phase:** Acceptance · **Status:** todo · **Depends on:** all

## Goal
Prove the finished hero app against the Definition of Done — and rehearse the climax.

## Do
- Build (`npm run build`); serve `dist/` behind a **strict CSP** (`script-src 'self'`); confirm
  KaTeX + bundled fonts load with **no CDN** and **no console errors**.
- **Offline test:** load once, kill network, build a sheet and export end-to-end.
- **iframe/print check:** confirm `window.print()` works in a sandboxed iframe; if blocked, the
  html2canvas/jsPDF fallback download becomes the demo path (and note it for the hub).
- Polish pass: motion/feel on drag, snap, density, and the **export reveal**; flawless RTL with
  math as LTR islands; grayscale-legible printed sheet.
- Rehearse the **demo script** (PRD §K): pick אלגברה לינארית → drag/tap a few formulas → density to
  fit → **export → crisp A4 PDF** — in **< 90s**, unaided.

## Files
- (config) CSP serve script; final tuning in `public/formulas.json` / starter sheets

## Done-when
- [ ] Every **MASTER-PLAN Definition of Done** box is checked.
- [ ] Demo runs in < 90s, no fumbles, zero console errors, the reveal lands.

## Verify
- Browser MCP under strict CSP + offline at 3 viewports; run the full demo to a real PDF. Final
  commit `step 14: acceptance`.
