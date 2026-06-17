# Step 07 — A4 canvas + Konva-vs-pure-DOM go/no-go

**Phase:** Core (canvas) · **Status:** done (decision: PURE-DOM canvas — see note) · **Depends on:** 06

## Goal
The page surface + the **architecture decision** that everything downstream depends on. (Critical
path starts here — protect it.)

## Do
- `A4Canvas` — the A4 page surface at a fixed pixel size (e.g. **794×1123 px @96dpi**), graph-paper
  bg, page boundary, snap grid. **Pin the px↔mm constant in one place** (`src/lib/grid.js`) so
  on-screen == printed.
- Stand up the **Konva + react-konva** interaction stage with an **HTML/KaTeX overlay** synced to
  Konva transforms (math stays vector for print — ARCHITECTURE §3).
- **GO/NO-GO checkpoint:** timebox the overlay-sync spike. If it proves fiddly/janky under time
  pressure, **fall back to a pure-DOM canvas** (absolutely-positioned blocks + Pointer-Events drag,
  `Math.round(x/grid)*grid` snap) and drop Konva. **Record the decision** in `ARCHITECTURE.md §3 /
  DESIGN-SPEC §1**.

## Files
- `src/components/A4Canvas.jsx`, `src/lib/grid.js` (snap math + px↔mm constant)

## Done-when
- [ ] A4 page renders at the pinned size with graph-paper + boundary + grid.
- [ ] Konva-vs-pure-DOM decision is **made and written down**; chosen path renders a placeholder
      block at a snapped position.

## Verify
- Browser MCP: render canvas, confirm A4 proportions + grid; smoke-test the chosen interaction
  model. Commit `step 07: a4 canvas + canvas decision`.

## DECISION (recorded)
**Chose PURE-DOM canvas, dropped Konva.** Blocks are absolutely-positioned DOM nodes inside a
fixed 794×1123px page (`src/lib/grid.js` pins px↔mm: 794px ≈ 210mm @96dpi). Pointer-Events drag
with `Math.round(x/grid)*grid` snap; the page is fit-to-viewport via a CSS `transform: scale()` and
pointer deltas are divided by that scale. Math stays HTML/KaTeX, so the print path is vector. Lower
risk than Konva-overlay sync; verified working (drag/snap/resize/select/overflow).
