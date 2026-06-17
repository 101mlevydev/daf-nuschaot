# Step 08 — Place / move / resize / snap + free nudge + overflow guide

**Phase:** Core (canvas) · **Status:** done · **Depends on:** 07

## Goal
The heart of the product: drag a formula onto the page and arrange it cleanly. (Feel-critical —
this must feel immediate.)

## Do
- `canvasStore` — `{ page, blocks:[{id,type,ref,latex,text,x,y,w,h,scale,z}] }`; actions
  `addBlock / moveBlock / resizeBlock / reorder / removeBlock / clearCanvas` (ARCHITECTURE §5).
  Blocks store a **denormalized `latex` copy** so library edits never break a placed block.
- Wire `FormulaTile` as a **drag source** → drop on `A4Canvas` → `addBlock` → **snap to grid**.
- `CanvasBlock` (formula variant) + `SelectionLayer`: select, move (snap), resize with min/max
  clamp, delete, z-order. **Free nudge:** hold a modifier to bypass snap for fine placement.
- `OverflowGuide` — fades/marks any block crossing the printable A4 bounds.
- `First-run ghost` — "גרור נוסחה לכאן" when the canvas is empty.

## Files
- `src/stores/canvasStore.js`, `src/components/CanvasBlock.jsx`, `SelectionLayer.jsx`,
  `OverflowGuide.jsx`

## Done-when
- [ ] Drag-place works; move/resize/delete/z-order work; blocks snap, and hold-to-nudge places
      freely; overflow content is clearly flagged.
- [ ] Empty canvas shows the ghost hint.

## Verify
- Browser MCP (mouse): place 3 formulas, rearrange, push one off-page (guide fires), delete one.
  Tune snap/drag feel. Commit `step 08: place/move/resize/snap`.
