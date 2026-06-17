# Step 12 — Text + header blocks + density slider

**Phase:** Polish · **Status:** partial (text/header + density done; undo/redo & page-sides pending) · **Depends on:** 11

## Goal
Let students annotate and **cram more onto one A4** — the real job-to-be-done.

## Do
- `CanvasBlock` variants `text` and `header` — add a free-text note / section header block;
  inline-edit; same move/resize/snap/z-order as formula blocks.
- `DensitySlider` (in `Toolbar`) — a **global font-scale** that proportionally shrinks/grows every
  block so more fits on the page; persists with the layout; re-checks overflow on change.
- `Toolbar` final assembly: export · density · reset · (stretch) page-sides toggle · undo/redo.

## Files
- extend `src/components/CanvasBlock.jsx`, `src/components/Toolbar.jsx`,
  `src/components/DensitySlider.jsx`

## Done-when
- [ ] Text & header blocks add/edit/move/resize; density slider scales the whole sheet and persists;
      overflow guide updates live as density changes.

## Verify
- Browser MCP: add a header + a note, drag density down to fit more, confirm overflow re-evaluates,
  reload (density restored). Commit `step 12: text/header + density`.
