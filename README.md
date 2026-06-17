# דף נוסחאות — Daf Nuschaot Builder

> A 100% client-side, drag-and-drop **A4 formula-sheet builder** for BGU engineering students.
> Pick formulas from a curated library → arrange them on a digital A4 page → export a crisp,
> print-ready PDF for your exam *daf nuschaot*.

**This is the hackathon hero app.** It solves a real, sharp pain (assembling an allowed
cheat-sheet under deadline pressure) and ends on a satisfying, tangible deliverable: a printed
PDF.

---

## At a glance

| | |
|---|---|
| **Audience** | BGU engineering & CS students (exam prep) |
| **Language / direction** | Hebrew, **RTL**. Math & code render LTR within RTL pages. |
| **Backend** | **None.** Static site, all logic in-browser. |
| **Persistence** | `localStorage` (canvas autosave) |
| **Content** | Static `formulas.json`, bundled in the repo |
| **Core stack** | Vite + React · KaTeX (math) · Konva/react-konva (canvas) · browser print → PDF |
| **Deploy** | `vite build` → static files, cloned & hosted by the BGU hub sandbox |
| **Paywall** | Out of our scope — the hub gates payment; we assume "in the app = paid" |

---

> 🏆 **Built to win.** Held to the suite-wide **[QUALITY-BAR.md](../QUALITY-BAR.md)** —
> top-quality, demo-flawless, zero rough edges. This is the **hero app**: deepest polish in the
> suite.

## Documents

Read in this order:

1. **[PRD.md](./PRD.md)** — what we're building and for whom: concept, ICP, user journey,
   feature set, judging criteria, paywall placement.
2. **[ARCHITECTURE.md](./ARCHITECTURE.md)** — how it works with zero backend: rendering stack,
   state model, the `formulas.json` schema, the PDF-export pipeline, sandbox/CSP constraints.
3. **[ROADMAP.md](./ROADMAP.md)** — hackathon execution: hour-by-hour build order, component
   breakdown, testing strategy, demo script, risk register.

---

## The one-sentence pitch

> "Every BGU engineer has rebuilt their formula sheet at 3 AM the night before a final. We turn
> that panic into a five-minute drag-and-drop, and hand you a print-ready PDF."

---

## Status

📄 **Design phase.** This repo currently contains design documents only — no code yet. Build
begins after doc review and approval (see ROADMAP.md).

## Open content TODOs (tracked, non-blocking)
- Expand `formulas.json` with the full per-course formula set (docs ship a seed set + schema).
- Confirm the seed course list: Linear Algebra · Physics (Mechanics/E&M) · Infi 1 · Infi 2.
