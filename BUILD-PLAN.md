# BUILD-PLAN — דף נוסחאות (Daf Nuschaot)

> **What this is.** A single, executable runbook to take this app from empty repo to finished
> product. Hand it to an autonomous coding agent ("execute BUILD-PLAN.md to completion") or follow
> it by hand. It references `DESIGN-SPEC.md`, `PRD.md`, and `ARCHITECTURE.md` for detail.
>
> **The rule that protects your time:** everything needing human approval is in **Gate 0** at the
> top. The executor produces those artifacts first, **stops for sign-off**, then runs the rest
> unattended.

---

## How to use this plan (executor operating rules)

1. Work **top to bottom**. Do not start Phase 1 until **Gate 0 is approved by the human**.
2. After **every step**, run its **Verify**. If it fails, fix and re-verify before advancing.
3. **Commit** at the end of each phase (branch per app; never commit to a shared main without ask).
4. Use the **`run`** and **`verify`** skills + the browser MCP (Playwright/Chrome DevTools) for UI
   checks; use a **strict-CSP local serve** to simulate the BGU sandbox.
5. **Stop and report** only when (a) Gate 0 needs approval, (b) an unresolved blocker appears, or
   (c) the **Definition of Done** is fully met.
6. Keep scope to this plan; defer "could-have" items if time is short (they're marked).

---

## Definition of Done (the run ends when all are true)
- [ ] `npm run build` produces static output; app loads with no console errors.
- [ ] Runs under a **strict CSP** locally (KaTeX fonts load from bundle, not CDN).
- [ ] User can: pick a course → browse/search formulas → drag/tap them onto an A4 page →
      move/resize/delete/snap → and **export a crisp A4 PDF**.
- [ ] **Adaptive editor** works on **phone, iPad/tablet, and laptop** (per DESIGN-SPEC §3); the
      exported PDF is identical regardless of device.
- [ ] Layout **autosaves** and **restores** on reload.
- [ ] Hebrew **RTL** throughout; math/code render LTR within RTL.
- [ ] Seed `formulas.json` covers the 5 courses with believable content; each has a starter sheet.
- [ ] No backend, no network calls post-load, **no paywall/entitlement code**.
- [ ] Demo script (DESIGN-SPEC §… / below) runs start-to-finish in < 90s.

---

## GATE 0 — Approvals & inputs (FRONT-LOADED — executor does these first, then STOPS)

> Produce the artifacts below, then **pause for human approval**. Phases 1+ may not begin until
> each gate is ✅.

### G0.1 — Design direction & mockups ⛔ blocks all UI work
- **Executor produces:** a small **clickable/visual mockup** (static HTML or a Figma-style frame
  set, or a styled Storybook) of the 3 key views — **Workspace** (library + A4 canvas + toolbar),
  a **formula tile**, and the **export preview** — in the locked visual language (clean academic +
  subtle graph-paper, calm palette, RTL). Include phone, iPad, and laptop framings.
- **Human approves:** the look, palette, type, density, and the RTL layout. → then ✅.
- **Why first:** every component inherits this; redoing visuals after build is expensive.

### G0.2 — Formula content ⛔ blocks the library/demo credibility
- **Human provides OR approves:** the real LaTeX content per course/topic (PRD §7 lists the
  topics). If not provided, executor **drafts a believable seed set** (standard formulas) for
  approval — but a real/verified set is strongly preferred for a study tool.
- **Output:** `public/formulas.json` populated; one **starter sheet** layout per course.

### G0.3 — Deployment & sandbox facts ⛔ de-risks the final integration
- **Human provides** (or we proceed on documented assumptions): the BGU hub's hosting model
  (how it clones/serves), the **CSP** it enforces, whether the app runs in a **sandboxed iframe**,
  and the **paywall hook** contract (we *ignore* it, but confirm "in app = paid"). 
- **Why:** the only things that can break a zero-backend static app are CSP/iframe rules.

**↳ Once G0.1–G0.3 are ✅, proceed autonomously through Phases 1–7.**

---

## Phase 1 — Scaffold & RTL shell
- **Do:** `npm create vite@latest` (React); add `katex`, `konva`, `react-konva`, `html2canvas`,
  `jspdf`; bundle KaTeX fonts locally; `<html dir="rtl" lang="he">`; base RTL CSS + the approved
  design tokens; AppShell with toolbar + (empty) library + (empty) canvas regions.
- **Done-when:** app boots; RTL layout matches the approved mockup shell.
- **Verify:** `run` the dev server; screenshot on laptop+phone widths; no console errors.

## Phase 2 — Library (browse/search)
- **Do:** load `public/formulas.json` → `libraryStore`; `CourseFilter` accordions; `TopicGroup`;
  `FormulaTile` (KaTeX render + Hebrew label + topic dot); `SearchBar` filter.
- **Done-when:** all courses/topics render; search filters live; formulas render crisply.
- **Verify:** browser MCP — pick a course, search a term, confirm results + KaTeX output.

## Phase 3 — Canvas core (place / move / resize / snap)  ⭐ critical path
- **Do:** `A4Canvas` (fixed px A4, graph-paper bg, snap grid, overflow guide); drag a tile →
  `addBlock` (denormalized LaTeX) → snap; `CanvasBlock` (formula/text/header); `SelectionLayer`
  (move/resize/z-order/delete). **Go/no-go checkpoint:** if Konva+HTML-overlay sync is costly,
  switch to the pure-DOM canvas fallback (ARCHITECTURE §3).
- **Done-when:** place ~8 formulas, rearrange, delete — smooth; snapping visible.
- **Verify:** browser MCP drag/drop interactions on laptop; tap interactions on emulated phone.

## Phase 4 — Persistence
- **Do:** debounced autosave to `localStorage`; hydrate on load; `RestoreBanner`; reset-with-confirm.
- **Done-when:** refresh mid-build restores the exact layout.
- **Verify:** build a layout → reload → identical; reset clears it.

## Phase 5 — Export (the deliverable)  ⭐ critical path
- **Do:** `PrintView` (print-only A4, blocks at exact positions, UI hidden via `@media print`,
  `@page A4`); `ExportPreview` reveal; primary `window.print()`; fallback `html2canvas+jsPDF`
  download.
- **Done-when:** exported PDF is crisp, A4, vector math (print path); on-screen == printed layout.
- **Verify:** export in Chrome + Firefox; inspect PDF (size, selectable math, grayscale legible).

## Phase 6 — Responsive / adaptive editor
- **Do:** breakpoints (phone/tablet/laptop); iPad touch tuning (bigger handles, drawer library);
  **phone tap-build** (tap-to-add into grid slot + contextual mini-toolbar + pinch-zoom/pan);
  bottom-sheet library on phone.
- **Done-when:** full edit on laptop+iPad; streamlined build + full export on phone; PDF identical.
- **Verify:** browser MCP emulating phone, tablet, and desktop viewports; export from each.

## Phase 7 — Polish, content & starter sheets
- **Do:** `DensitySlider`, `OverflowGuide`, text/header blocks; finalize `formulas.json` + starter
  sheets; empty-state ghost + inline hints; micro-animations. *(Could-have, cut first if needed:
  undo/redo, two-sided sheet, custom-LaTeX input.)*
- **Done-when:** the demo script runs in < 90s end-to-end; content is believable.
- **Verify:** full demo dry-run on phone + laptop; CSP rehearsal serve.

---

## Final acceptance & demo
Run the **Definition of Done** checklist. Then the demo: blank A4 visible → pick "אלגברה לינארית"
→ drag 5–6 formulas + a header → **ייצוא ל-PDF** → open crisp PDF. Confirm offline + strict-CSP.

## Risks / rollback
- **Canvas sync risk** → Phase 3 go/no-go to pure-DOM canvas.
- **Print blocked in iframe** → html2canvas+jsPDF fallback (already built).
- **Thin content** → seed set + visible/editable LaTeX; mark community-expandable.
- Each phase commits separately, so any phase can be reverted without losing earlier work.
