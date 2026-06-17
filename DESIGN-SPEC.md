# DESIGN-SPEC — דף נוסחאות (Daf Nuschaot)

> The deep build spec: **what it takes, the components, how it works, how it's designed, and the
> finalized stack.** Builds on PRD.md / ARCHITECTURE.md and folds in the DISCOVERY answers.
> This is the document to hand a developer.

---

## 0. Locked decisions (from discovery)

All discovery answers = **as recommended**, plus the suite-wide mandate:

- **Responsive across phone · tablet/iPad · laptop** — see §3. The canvas uses an **adaptive
  editor** (full drag on laptop/iPad; streamlined tap-build on phone). Export is identical A4
  everywhere.
- Single workspace (library + canvas + toolbar), snap-to-grid with free nudge, global density
  slider, overflow guide, export = the climax with a short preview-reveal, autosave + silent
  restore, learn-by-doing with inline hints + a per-course starter sheet.
- Voice: **warm but efficient**, calm; emotional target = **relief**.
- Visual: clean academic with a subtle graph-paper canvas; formula tiles = rendered math + Hebrew
  label + topic-color dot; printed sheet = pure formulas (labels optional).

---

## 1. The finalized stack

| Layer | Choice | Role |
|---|---|---|
| Build/dev | **Vite** | static output, HMR, CSP-safe (no eval) |
| UI | **React 18** | component model, declarative canvas + library state |
| Math | **KaTeX** (fonts bundled locally) | vector, fast, crisp in print/PDF |
| Canvas (laptop/iPad) | **Konva + react-konva** | drag, Transformer resize, snap, z-order, layers |
| Canvas content layer | **HTML/KaTeX overlay** synced to Konva transforms | keeps math vector for print (see ARCHITECTURE §3) |
| Export — primary | **browser print → "Save as PDF"** via a print stylesheet | vector, selectable, true A4 |
| Export — fallback | **html2canvas + jsPDF** | one-click download; raster (documented quality loss) |
| State | React + light store (Context or Zustand) | `libraryStore` (read-only) + `canvasStore` (mutable) |
| Persistence | **localStorage** | autosave/restore canvas layout |
| Gestures (touch) | Pointer Events (+ optional `@use-gesture`) | unify mouse/touch/pen; pinch-zoom/pan on canvas |

> **Go/no-go retained:** if the Konva+overlay sync proves costly under time pressure, fall back to
> a **pure DOM canvas** (absolutely-positioned blocks, Pointer-Events drag, `Math.round(x/grid)`
> snap). Decision point is in ROADMAP Block 3.

---

## 2. Information architecture (screens / views)

It's a **single-page workspace** with modal/overlay surfaces, not a multi-screen flow.

| View | Job | Notes |
|---|---|---|
| **Workspace** | the whole app: library + A4 canvas + toolbar | default and only "page" |
| **Library panel** | browse/search/filter formulas, drag onto canvas | collapsible; RTL = right side |
| **Canvas** | the A4 page being built | snap grid, overflow guide, selection |
| **Export preview** | the "here's your sheet" reveal → print/download | the climax moment |
| **Restore banner** | "המשכנו מאיפה שהפסקת" + reset | appears on load if a saved layout exists |
| **First-run ghost** | empty-state hint ("גרור נוסחה לכאן") | shown only when canvas empty |

No login, no accounts, no separate course screen (course is a filter inside the library panel).

---

## 3. Responsive / adaptive design (the new mandate)

One A4 document model; three input experiences. Breakpoints (approx): **phone < 640px ·
tablet 640–1024 · laptop/desktop > 1024**.

### Laptop / desktop (> 1024) — full editor
- Library panel docked (right, RTL) + canvas centered + toolbar on top.
- Mouse drag-and-drop from library to canvas; Konva Transformer for resize; hover affordances.

### Tablet / iPad (640–1024) — full editor, touch-tuned *(ideal device)*
- Same canvas, but: larger hit targets & resize handles, library becomes a **slide-over drawer**
  to free canvas space, long-press to drag, two-finger pan / pinch-zoom the A4.
- This is the **best** Daf experience: big touch surface + precise placement.

### Phone (< 640) — streamlined "tap-build" editor
- Vertical layout: A4 preview fit-to-width on top, library as a **bottom sheet**.
- **Primary add = tap a formula → it drops into the next free grid slot** (no precise drag
  needed); then tap a block to **select → contextual mini-toolbar** (move by drag, resize via
  ± buttons, delete, bring-to-front).
- Pinch-zoom/pan to inspect; a "fit page" button.
- Full **preview + export** available (the deliverable is the point even on phone).

**Invariant:** the underlying layout JSON and the **printed A4 PDF are identical** regardless of
the device it was built on. A sheet started on iPad opens the same on a laptop.

---

## 4. Component inventory

Grouped by area. (Responsibilities, not code.)

**Shell & chrome**
- `AppShell` — RTL layout, breakpoint context, mounts panels by device class.
- `Toolbar` — export, density slider, page-sides toggle, reset, (stretch) undo/redo.
- `RestoreBanner` — detects saved layout, offers continue/reset.

**Library**
- `LibraryPanel` — container; docked / drawer / bottom-sheet per breakpoint.
- `CourseFilter` — course accordions (אלגברה לינארית · אינפי 1 · אינפי 2 · מכניקה · חשמל ומגנטיות).
- `SearchBar` — filters by label/tag across courses.
- `TopicGroup` — collapsible topic section.
- `FormulaTile` — KaTeX-rendered math + Hebrew label + topic-color dot; **drag source**
  (desktop/tablet) and **tap-to-add** (phone).

**Canvas**
- `A4Canvas` — the page surface (graph-paper bg, page boundary, snap grid, overflow guide); on
  laptop/iPad wraps the Konva stage + HTML/KaTeX overlay; on phone wraps the tap-build surface.
- `CanvasBlock` — a placed item; variants: `formula` (KaTeX), `text`, `header`.
- `SelectionLayer` — selection outline + transform handles (desktop/iPad) / mini-toolbar (phone).
- `OverflowGuide` — fades/marks anything past the printable A4 area.
- `DensitySlider` — global font-scale for the whole sheet (cram more on one page).

**Export**
- `ExportPreview` — renders the final A4 (`PrintView`) with a short reveal animation.
- `PrintView` — print-only DOM: blocks at exact positions, math as KaTeX, UI hidden via
  `@media print`; `@page { size:A4 }`.
- `pdfFallback` — html2canvas + jsPDF download path.

**Lib / non-UI**
- `libraryStore`, `canvasStore`, `persistence` (debounced localStorage), `katex` (render
  helpers), `grid` (snap math), `pdf` (print + fallback).

---

## 5. How it works — key flows

**Place a formula (laptop/iPad):** drag `FormulaTile` → drop on `A4Canvas` → `canvasStore.addBlock`
(denormalized LaTeX copy) → snap to grid → render KaTeX overlay → autosave.

**Place a formula (phone):** tap `FormulaTile` → `addBlock` into next free slot → tap block to
select → mini-toolbar to nudge/resize/delete.

**Arrange:** drag (snap) / Transformer resize (min-max clamp) / z-order / delete. `DensitySlider`
scales all blocks' font size proportionally.

**Overflow:** any block crossing the printable bounds triggers `OverflowGuide` highlight.

**Autosave & restore:** every change → debounced (~300ms) write to `localStorage["daf:layout:v1"]`.
On load, hydrate if version matches → `RestoreBanner`.

**Export (climax):** Toolbar → `ExportPreview` reveal ("הנה הדף שלך 💪") → primary `window.print()`
(vector A4) or fallback download. UI hidden in print via `@media print`.

---

## 6. State model (shapes referenced from ARCHITECTURE §4)

- `libraryStore`: loaded once from `public/formulas.json` (`courses → topics → formulas`);
  read-only; exposes filtered/searched views.
- `canvasStore`: `{ page:{size,sides,grid}, blocks:[{id,type,ref,latex,text,x,y,w,h,scale,z}] }`;
  all editor mutations here; subscribes autosave.
- Coordinates in CSS px at a fixed A4 size (e.g., 794×1123 @96dpi); print stylesheet maps 1:1 to
  210×297mm. The px↔mm constant lives in one place.

---

## 7. Content plan (topics)

Seed `formulas.json` covers the five courses and their topics (full list in PRD §7):
Linear Algebra, Infi 1, Infi 2, Mechanics, E&M — ~9 topics each, ~15–25 formulas per course. Each
course also ships a **starter sheet** (a pre-arranged layout the user prunes). Library is
append-only via JSON; content authoring is the main open TODO.

---

## 8. What it will take (build breakdown)

Effort blocks (relative), mapped to ROADMAP:

| # | Block | Components touched | Risk |
|---|---|---|---|
| 1 | RTL shell + load library | AppShell, LibraryPanel, CourseFilter, libraryStore | low |
| 2 | Math render + browse/search | FormulaTile, SearchBar, TopicGroup, katex | low |
| 3 | **Canvas + place/move/resize** | A4Canvas, CanvasBlock, SelectionLayer, grid | **high** (core) |
| 4 | Persistence | persistence, RestoreBanner | low |
| 5 | **Export** | ExportPreview, PrintView, pdfFallback | **high** (the deliverable) |
| 6 | Responsive adaptation | breakpoint behaviors, phone tap-build, bottom-sheet | med |
| 7 | Polish + content | DensitySlider, OverflowGuide, text/header blocks, starter sheets | med |

**Critical path:** Block 3 (canvas) → Block 5 (export). These two *are* the product; protect
them. Responsive phone mode (Block 6) is additive and can ship after the laptop/iPad path works.

---

## 9. Open items
- Author the real formula content (LaTeX) per course/topic.
- Confirm the px↔mm A4 constant and default grid size.
- Decide Konva-overlay vs pure-DOM canvas at the Block 3 checkpoint.
