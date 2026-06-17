# Step 03 — Design tokens + RTL base + graph-paper canvas

**Phase:** Setup · **Status:** done · **Depends on:** 02

## Goal
Encode the approved mockup into reusable tokens; lay the RTL foundation and the graph-paper surface.

## Do
- `src/styles/tokens.css` — palette, type scale, spacing, radii, soft-shadow tokens **lifted from
  the approved `design/mockup.html`** (no improvising new values).
- `src/styles/app.css` — RTL base via logical properties (`margin-inline`, `inset-*`); `<html
  dir="rtl">`; **math/code wrapped as `dir="ltr"` islands**.
- The **graph-paper canvas** background (faint grid via CSS gradients) + the A4 page boundary, as a
  reusable surface.
- Topic-color token set (one calm hue per course) used by the tiles' dots.
- A tiny `src/lib/copy.js` stub — central Hebrew strings (filled & approved at Step 13).

## Files
- `src/styles/tokens.css`, `src/styles/app.css`, `src/lib/copy.js`

## Done-when
- [ ] A sample screen renders in the approved palette/type, RTL, with the graph-paper A4 surface and
      a soft page shadow matching the mockup.

## Verify
- Browser MCP screenshot vs `design/mockup.html`; colors/type/spacing match. Commit
  `step 03: design tokens`.
