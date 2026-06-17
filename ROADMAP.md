# ROADMAP — דף נוסחאות (Daf Nuschaot Builder)

**Status:** Draft for review
**Assumption:** small team, time-compressed hackathon. Times are relative effort blocks, not
wall-clock guarantees. Adjust to your actual schedule.

---

## 0. Pre-flight (before the clock)
- [ ] Confirm seed course list (אלגברה לינארית · פיזיקה · אינפי 1 · אינפי 2).
- [ ] Confirm KaTeX vs MathJax (default: KaTeX) and bundle fonts locally.
- [ ] Confirm canvas approach go/no-go: **Konva + HTML overlay** (primary) vs **pure DOM canvas**
      (fallback). Decide at the end of Block 2 based on overlay-sync friction.
- [ ] Scaffold: `npm create vite@latest daf-nuschaot -- --template react`; add `katex`,
      `konva`, `react-konva`, `html2canvas`, `jspdf`.

---

## 1. Build order (dependency-first)

The export and the canvas are the demo. Everything serves the 90-second "build a sheet → print"
flow. Build the spine first, polish later.

### Block 1 — Skeleton & RTL shell
- [ ] Vite + React app boots; `<html dir="rtl" lang="he">`; base RTL CSS.
- [ ] App layout: library sidebar + A4 canvas region + toolbar (static).
- [ ] Load `public/formulas.json`; populate library store.
- **Exit check:** courses/topics/formulas list renders in Hebrew.

### Block 2 — Math rendering + library
- [ ] KaTeX render helper; FormulaTile renders `latex` (LTR island) with Hebrew label.
- [ ] Course filter + topic grouping + search box.
- **Exit check:** browse and search a real seed library; formulas render crisply.

### Block 3 — A4 canvas + drag-to-place (CORE)
- [ ] A4 page at fixed px size with visible boundary + snap grid.
- [ ] Drag a tile → create a CanvasBlock at drop position, snapped to grid.
- [ ] Move / resize (Transformer or handles) / select / delete / z-order.
- [ ] **Go/no-go:** if Konva+overlay sync is painful, switch to pure DOM canvas now.
- **Exit check:** place ~8 formulas, rearrange them, delete one — feels smooth.

### Block 4 — Persistence
- [ ] Debounced autosave to localStorage; restore on load; reset-with-confirm.
- **Exit check:** refresh mid-build → layout returns intact.

### Block 5 — PDF export (THE CLIMAX)
- [ ] PrintView: print-only A4 render, blocks at exact positions, UI hidden via `@media print`.
- [ ] `@page A4`, `break-inside: avoid`, locked px↔mm scale.
- [ ] "ייצוא ל-PDF" → `window.print()`.
- [ ] Fallback "הורד PDF" via html2canvas+jsPDF (note raster quality).
- **Exit check:** exported PDF is crisp, A4, math selectable (print path).

### Block 6 — Polish & content
- [ ] Text/header blocks; page-fullness indicator.
- [ ] Expand `formulas.json` with a believable per-course set (enough for a real demo sheet).
- [ ] Visual polish: tile hover, drop affordance, empty-state, micro-animations.
- [ ] (Stretch) undo/redo; two-sided sheet; LaTeX custom-input.

---

## 2. Component reuse / shared-with-suite notes
- This repo is **standalone** (no shared package). Two utilities are worth copying *into* the
  other repos rather than linking: the **RTL shell/CSS** and the **localStorage persistence
  helper**. Keep them small and dependency-free so copy-paste is clean.
- KaTeX usage here is unique to this app (Gold Miner and Hub don't render math).

---

## 3. Testing strategy (sandbox-aware)
- **Local CSP rehearsal:** serve the `vite build` output behind a strict CSP header
  (`default-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'`) and confirm KaTeX
  fonts load and print works. This simulates the BGU sandbox early.
- **Offline test:** load once, kill network, confirm full functionality (build + export).
- **Print fidelity:** export to PDF in Chrome and Firefox; verify A4 size, vector math, grayscale
  legibility; verify on-screen layout == printed layout (scale lock).
- **Persistence:** refresh, reopen tab, clear-and-confirm reset.
- **RTL/LTR:** confirm math/code never reorder inside RTL pages; Hebrew labels read correctly.
- **iframe embedding:** if the hub embeds via sandboxed iframe, test `window.print()` there;
  if blocked, default the UI to the download fallback.

---

## 4. Demo script (target: < 90s, judge can do it unassisted)
1. Open app → blank A4 already visible. (no setup friction)
2. Pick "אלגברה לינארית" → library fills with real formulas.
3. Drag 5–6 formulas onto the page; nudge two to align (snap is visible/satisfying).
4. Add one header block "אלגברה לינארית — מבחן סופי".
5. Click **ייצוא ל-PDF** → "Save as PDF" → open the crisp result. **Mic drop.**
6. One-liner: "All client-side. Nothing leaves the browser. Print it and walk into the exam."

---

## 5. Risk register
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Konva+HTML overlay sync eats time | Med | High | Go/no-go in Block 3 → fall back to pure DOM canvas. |
| Print output ≠ on-screen layout | Med | High | Lock px↔mm scale constant in one place; test early in Block 5. |
| KaTeX fonts blocked by CSP | Low | High | Bundle fonts locally; rehearse under strict CSP. |
| iframe blocks `window.print()` | Low | Med | html2canvas+jsPDF download fallback ready. |
| Thin/incorrect formula content | Med | Med | Seed believable set; keep LaTeX editable; mark community-expandable. |
| Scope creep (undo, 2-sided, custom LaTeX) | Med | Med | All are stretch; protect Blocks 1–5. |

---

## 6. Definition of done (hackathon)
- A judge builds a believable Linear Algebra sheet and exports a crisp A4 PDF in < 90s.
- Works offline, survives refresh, runs under a strict CSP, fully RTL.
- Zero backend, zero network calls post-load, zero paywall code.
