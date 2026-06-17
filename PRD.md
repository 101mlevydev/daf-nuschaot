# PRD — דף נוסחאות (Daf Nuschaot Builder)

**Document owner:** Product
**Status:** Draft for review
**Phase:** Pre-build (planning)

---

## 1. Problem & opportunity

At BGU, most engineering and CS finals permit a single hand-prepared **דף נוסחאות** (formula
sheet) — usually one A4 page, sometimes two-sided. Preparing it is a high-anxiety ritual:

- Students hunt for formulas across lecture slides, the course *סיכום*, WhatsApp groups, and old
  exams.
- They hand-copy or paste into Word, fight with equation editors and RTL/LTR chaos, and waste
  hours on **layout** instead of **studying**.
- The sheet is done at the last minute, looks messy, and they're never sure they captured the
  right formulas.

**Opportunity:** collapse "find + lay out + print" into a five-minute, drag-and-drop flow with a
curated, course-specific formula library and a clean A4 export. The payoff is concrete and
demo-friendly: a **print-ready PDF** in hand.

### Why this wins the hackathon
- **Authentic pain.** University judges have lived this. No explanation needed.
- **Tangible climax.** The demo ends with a real PDF — a deliverable, not a toy.
- **Real engineering, scoped.** In-browser LaTeX rendering + a snapping A4 canvas + vector PDF
  export is substantive but shippable in a hackathon.
- **Lowest demo risk** of the suite: single device, no network, no multiplayer.

---

## 2. Ideal Customer Profile (ICP)

**Primary:** BGU undergraduate in a quantitative degree (EE, ME, CS, BME, ChemE, Industrial
Eng., Math/Physics) during an exam period (*תקופת מבחנים*), 19–25, phone-and-laptop native,
Hebrew-first, time-pressured, grade-anxious.

**Jobs to be done**
- "Help me assemble a *complete* formula sheet for **this** course fast."
- "Make it fit cleanly on one A4 page so it's allowed and readable."
- "Give me something I can print right now."

**Secondary:** course TAs / *מתרגלים* who could curate an "official" recommended sheet; students
in other quantitative faculties.

**Anti-persona:** humanities students with no formula-based exams; anyone wanting collaborative
real-time editing (explicitly out of scope — this is a focused single-user tool).

---

## 3. User journey (happy path)

1. **Land.** Hebrew RTL home screen. One clear primary action: "בנה דף נוסחאות" (Build a formula
   sheet). A blank A4 page is visible immediately — no signup, no setup.
2. **Pick a course.** Sidebar lists seed courses (אלגברה לינארית, פיזיקה, אינפי 1, אינפי 2).
   Selecting one filters the formula library to that course's topics.
3. **Browse & search.** Formulas are grouped by topic, each rendered live via KaTeX with a short
   Hebrew label. A search box filters by label/tag.
4. **Drag onto the page.** Drag a formula tile onto the A4 canvas. It drops as a movable,
   resizable block that **snaps to a grid**. Add as many as fit.
5. **Arrange.** Move, resize, reorder (z-index), and delete blocks. Optional: free-text note
   blocks and section headers. A live "page fullness" indicator hints when you're overflowing A4.
6. **Autosave.** Every change persists to `localStorage` — refresh-safe.
7. **Export (the climax).** Click "ייצוא ל-PDF". The page renders to a crisp, A4, print-ready
   PDF via the browser's print pipeline (vector, selectable text). Student prints it.

**Recovery paths:** reload restores the last layout; "התחל מחדש" clears the canvas (with confirm);
undo/redo for accidental moves/deletes (stretch).

---

## 4. Feature set

### Must-have (MVP — demo-critical)
- A4 canvas (210×297mm) with visible page boundary and a snap grid.
- Course-filtered formula library, KaTeX-rendered tiles, grouped by topic, with search.
- Drag-to-place; move / resize / delete / z-order on the canvas.
- **PDF export** that looks crisp on A4 (the deliverable).
- localStorage autosave + restore.
- Hebrew RTL UI throughout.

### Should-have
- Free-text note blocks and section header blocks (student's own annotations).
- Two-sided sheet (page 1 / page 2 toggle).
- "Page fullness" / overflow indicator.
- Undo / redo.

### Could-have (stretch / post-hackathon)
- Per-formula color/highlight, font-size presets.
- Import a custom formula via LaTeX input.
- Templates ("recommended starter sheet" per course).
- Multi-format export (PNG image).

### Won't-have (explicitly out of scope)
- Accounts, cloud sync, real-time collaboration.
- Any server, database, or third-party API.
- Payment / paywall logic (see §6).

---

## 5. Success & judging criteria

| Judging dimension | How this app scores |
|---|---|
| **Real-world value** | Solves a universal, recurring BGU pain — high. |
| **Polish / UX** | Clean RTL UI, smooth drag/snap, beautiful rendered math. |
| **Technical depth** | In-browser LaTeX + canvas + vector PDF, all client-side. |
| **Demo wow** | The "click → print-ready PDF" moment. |
| **Feasibility** | No network/multiplayer → near-zero live-demo risk. |

**Internal success metric for the demo:** a judge can build a believable Linear Algebra sheet
and export a clean PDF in **under 90 seconds**, unassisted.

---

## 6. Paywall placement (informational — not our code)

The BGU hub is the payment gateway and wraps our app. In the original "freemium trap" framing,
the natural gate for this product is **the export** (curation is free; the sunk-cost makes the
final PDF the conversion moment).

**Our build does not implement any of this.** We assume **"in the app = already paid"** and the
export simply works. No gating, no entitlement state, no paywall hook. This keeps our code
honest and simple; the hub owns monetization. This section exists only so reviewers understand
*where* the gate would sit conceptually.

---

## 7. Content plan

Seed `formulas.json` ships with a starter set across four core courses:
**אלגברה לינארית · פיזיקה (מכניקה + חשמל ומגנטיות) · אינפי 1 · אינפי 2**.

Each formula: a stable `id`, a Hebrew/short `label`, a `latex` string (source of truth), a
`category` (definition/theorem/equation), `tags`, and a `difficulty`. The library is designed to
be **expanded by anyone** editing a static JSON file — no code change required. Full content
authoring is an open TODO (see ARCHITECTURE.md §schema and ROADMAP.md).

### Supported topics (seed library)

The data model is `course → topic → formula`, so courses and topics are pure data — this list is
the starter coverage, not a hard limit.

| Course | Topics covered |
|---|---|
| **אלגברה לינארית** (Linear Algebra) | matrices & operations · determinants · systems of linear equations / Gaussian elimination · vector spaces & subspaces · linear independence, basis & dimension · linear transformations · eigenvalues & eigenvectors · diagonalization · inner-product spaces & orthogonality |
| **אינפי 1** (Calculus 1) | limits & continuity · sequences · derivatives & differentiation rules · extrema & monotonicity · L'Hôpital · Taylor / Maclaurin series · indefinite integrals · definite integrals & the FTC · integration techniques |
| **אינפי 2** (Calculus 2) | series & convergence tests · power series · multivariable functions · partial derivatives · gradient & directional derivatives · double & triple integrals · line & surface integrals · Green / Stokes / Gauss theorems · polar / cylindrical / spherical coordinates |
| **פיזיקה — מכניקה** (Mechanics) | kinematics · Newton's laws · work & energy · momentum & collisions · circular motion · rotational dynamics & torque · simple harmonic motion · gravitation |
| **פיזיקה — חשמל ומגנטיות** (E&M) | Coulomb's law & electric field · Gauss's law · electric potential · capacitance · current, resistance & Ohm's law · Kirchhoff circuits · magnetic force (Lorentz) · Ampère's law · Faraday's law & induction |

**Post-hackathon expansion candidates:** משוואות דיפרנציאליות (ODEs), הסתברות (Probability),
מבוא להנדסת חשמל / מערכות ספרתיות — each is just another `course` entry in `formulas.json`.

---

## 8. Risks (product)

- **Content credibility.** Wrong/incomplete formulas hurt trust. *Mitigation:* seed from
  standard course material; mark library as community-expandable; keep LaTeX visible/editable.
- **RTL + LTR math layout bugs.** *Mitigation:* treat math/code as LTR islands inside RTL pages
  from day one (see ARCHITECTURE.md).
- **"Looks like a Word doc."** Differentiation is speed + curated library + clean export.
  *Mitigation:* invest in the drag/snap feel and the export quality — that's the wow.
