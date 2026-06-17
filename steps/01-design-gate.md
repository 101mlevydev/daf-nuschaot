# Step 01 — Design gate (visual mockup) ⛔ APPROVAL

**Phase:** Gate · **Status:** todo · **Depends on:** none

## Goal
Produce an approvable visual of the app's look BEFORE writing any app source code. Owner signs off
on palette, type scale, spacing, the graph-paper canvas, the formula tile, and the export reveal.

## Do
- Create `design/mockup.html` — a single self-contained static page (no build, inline CSS) showing
  the key screens in the **locked style** (clean academic + subtle graph-paper canvas, calm palette,
  Hebrew RTL): **(a) the Workspace** — collapsible formula-library panel on the **RIGHT (RTL)** + an
  **A4 canvas** with a few placed formulas + a **top toolbar** (export / density / reset);
  **(b) a formula tile** — rendered-math look + Hebrew label + topic-color dot;
  **(c) the export preview / reveal moment** ("הנה הדף שלך").
- Fake the LaTeX look with styled text (fractions, superscripts, √, integrals); **math/code render
  LTR** inside the RTL layout.
- Include small **phone / iPad / laptop** framings so the owner sees the adaptive editor intent.
- Intentional palette, type scale, spacing, soft shadows — **not default-looking** (QUALITY-BAR §2).

## Files
- `design/mockup.html` (+ optional `design/palette.md` with hex tokens / type scale)

## Done-when
- [ ] Mockup opens in a browser, RTL, in one cohesive academic style; shows the Workspace, the
      formula tile, the export reveal, and the three device framings.
- [ ] **Owner has approved** the look (palette / type / spacing / canvas / tile / export).

## Verify
- Open `design/mockup.html` via browser MCP; screenshot phone + laptop widths; present to owner.

## ⛔ STOP — do not write any app source code (Step 02+) until the owner approves.
