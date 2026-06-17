# MASTER-PLAN — דף נוסחאות (Daf Nuschaot)

> The orchestrator. Build this app from empty repo → finished product by executing the step files
> in `./steps/` **in order, one at a time**. Each step file is a small, self-contained task with
> its own done-when + verify. This plan is the index + the rules; the steps are the work.

**Source of truth for detail:** `DESIGN-SPEC.md` · `PRD.md` · `ARCHITECTURE.md` · `DISCOVERY.md`.

---

## Locked context (decided with the owner)
- **`daf-nuschaot` is the hero app** of the suite — it gets the **deepest polish**. The signature
  moment is **drag → arrange → one click → a genuinely crisp, print-ready A4 PDF**. Protect it.
- **Full execution** (scaffold, run builds, browser-verify, git branch per app). **Proceed on
  assumptions**; owner reviews at the two **gates** below.
- Assumptions until told otherwise: BGU hub serves static files in a **sandboxed iframe** under a
  **strict CSP**; **"in app = paid"** (no paywall code). No backend, no DB, no third-party API.
- Stack: **Vite + React 18 + KaTeX** (fonts bundled locally), **Konva** for the editor (with a
  **pure-DOM fallback** go/no-go — see Step 07), localStorage persistence, all assets local.

### The locked product shape
- **One workspace**: collapsible formula **library panel on the RIGHT (RTL)** + an **A4 canvas** +
  a **top toolbar**. Course is a filter, not a screen.
- **Adaptive editor**, one document model, three input experiences: **laptop** (full drag) ·
  **iPad** (touch-tuned full editor, the *ideal* device) · **phone** (streamlined **tap-build**:
  tap a formula → next free slot → mini-toolbar). The **printed A4 PDF is identical** on all three.
- **Snap-to-grid + free nudge** (hold to place freely); per-block resize **+ a global density
  slider** to cram more onto one page; an **overflow guide** for anything past the printable area.
- **Autosave + silent restore** (localStorage), with a small reset.
- **Export is the climax**: a short preview-reveal ("הנה הדף שלך") → browser print (vector A4) with
  an html2canvas/jsPDF fallback download.
- **Voice: warm but efficient**, calm — emotional target = **relief**. Never reads as AI.
- **Look: clean academic + a subtle graph-paper canvas**, calm palette; formula tiles = rendered
  math + Hebrew label + topic-color dot; printed sheet = pure formulas (labels optional).

## Approval gates (these pause the run)
- **Step 01 — DESIGN GATE** ⛔ produce the visual mockup → owner approves the look BEFORE any
  UI/code. **No app source code is written until this is approved.**
- **Step 13 — CONTENT & COPY GATE** ⛔ the real formula library (LaTeX correctness) + per-course
  starter sheets + every Hebrew UI string drafted → owner/native speaker approves (formulas must be
  trustworthy; copy must not read as AI).
Everything else runs autonomously between/after the gates.

## How to execute (rules)
1. Do steps **in numeric order**. Open the step file, do it, run its **Verify**, tick its
   **Done-when**, mark its `Status: done`, then move on.
2. At a **GATE**, produce the artifact and **STOP for owner approval**; resume only when approved.
3. After each step: `git add -A && git commit` on the app branch with `step NN: <title>`.
4. Self-verify with the **`run`/`verify`** skills + browser MCP (Playwright/Chrome) at **three
   viewports** (phone · iPad · laptop). Simulate the sandbox with a **strict-CSP local serve**.
5. **Protect the critical path:** Step 07–08 (canvas) → Step 10 (export) *are* the product. If time
   is tight, **cut scope, never craft** — fewer formulas, but a flawless drag→export.
6. If a Verify fails → fix → re-verify before advancing. If blocked → stop and report.
7. Finish when the **Definition of Done** is fully green.

## Definition of Done
> **Inherits [QUALITY-BAR.md](../QUALITY-BAR.md).** "Builds and runs" is the floor. Visual craft,
> motion/feel, native-Hebrew copy, and a flawless rehearsed demo are **gates**, not extras. As the
> **hero app**, the export reveal must feel like magic and carry the deepest polish in the suite.
- [ ] Meets the QUALITY-BAR standard (cohesive design system · motion/feel · no console errors ·
      offline + strict CSP · flawless RTL with math/code as LTR islands).
- [ ] `npm run build` → static output; loads with no console errors; runs offline & under strict
      CSP; **KaTeX fonts bundled locally** (no CDN, no fallback glyphs in print).
- [ ] Course-filtered library loads from `public/formulas.json`; browse by course→topic + search;
      tiles render crisp KaTeX + Hebrew label + topic dot.
- [ ] Drag (laptop/iPad) **and** tap-build (phone) place a formula; move / resize / delete / z-order
      / **snap-to-grid + free nudge**; **overflow guide** flags off-page content.
- [ ] **Density slider** scales the whole sheet; **text + header** blocks work.
- [ ] **Autosave + silent restore** across reload; reset clears with a confirm.
- [ ] **Export (climax):** preview-reveal → `window.print()` vector A4 (selectable text) **+**
      html2canvas/jsPDF fallback download; on-screen layout == printed layout.
- [ ] **Responsive** & flawless on phone, iPad/tablet, laptop; the **A4 layout JSON & PDF are
      identical** regardless of the device it was built on; ≥44px touch targets.
- [ ] Seed `formulas.json` covers the five courses with **verified** LaTeX + a per-course
      **starter sheet**; native-reviewed Hebrew copy; **no paywall code**.
- [ ] A judge builds a believable Linear Algebra sheet and exports a clean PDF in **< 90s**,
      unaided (DESIGN-SPEC / PRD §5).

## Step index
| # | Step | Phase | Gate |
|---|---|---|---|
| 01 | Design gate — visual mockup | Gate | ⛔ approve |
| 02 | Scaffold (Vite + React) + git + env check | Setup | |
| 03 | Design tokens + RTL base + graph-paper canvas | Setup | |
| 04 | KaTeX integration — locally-bundled fonts | Core (math) | |
| 05 | `formulas.json` schema + library store | Content/data | |
| 06 | Library panel — course/topic browse + search | Core (browse) | |
| 07 | A4 canvas + Konva-vs-pure-DOM go/no-go | **Core (canvas)** | |
| 08 | Place / move / resize / snap + free nudge + overflow guide | **Core (canvas)** | |
| 09 | Persistence — localStorage autosave/restore + restore banner | Core | |
| 10 | **PDF export** — print primary + html2canvas/jsPDF fallback (the climax) | **Core (export)** | |
| 11 | Responsive adaptive editor (phone tap-build / iPad / laptop) | Polish | |
| 12 | Text + header blocks + density slider | Polish | |
| 13 | Content & copy gate — seed formulas + starter sheets + Hebrew copy | Content | ⛔ approve |
| 14 | Final — CSP/offline acceptance + demo | Acceptance | |

## What the owner must do
- **Approve Step 01 mockup** (the look) and **Step 13 content & copy** (formula correctness + the
  Hebrew). Everything else is autonomous.
- Optional later: provide the BGU hub's real CSP/iframe facts (esp. whether `window.print()` /
  `allow-modals` is permitted — if not, the fallback download path becomes primary); contribute
  more course/topic formulas (the library is append-only JSON, no code change).
