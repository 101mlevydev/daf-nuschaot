# Step 11 — Responsive adaptive editor (phone tap-build / iPad / laptop)

**Phase:** Polish · **Status:** partial (breakpoints + phone tap-build + pointer touch-drag done; iPad slide-over drawer & pinch-zoom pending) · **Depends on:** 10

## Goal
One A4 document model, three input experiences — flawless on phone, iPad/tablet, and laptop. The
**layout JSON & printed PDF are identical** regardless of the device it was built on.

## Do
- `AppShell` breakpoint context (phone <640 · tablet 640–1024 · laptop >1024); mount panels per
  device class.
- **Laptop (>1024):** library docked right + canvas + top toolbar; mouse drag-and-drop + Transformer
  resize.
- **iPad (640–1024), the *ideal* device:** same full editor, touch-tuned — larger hit targets &
  handles, library as a **slide-over drawer**, long-press to drag, two-finger pan / pinch-zoom.
- **Phone (<640):** vertical **tap-build** — A4 fit-to-width on top, library as a **bottom sheet**;
  **tap a formula → drops into the next free grid slot**; tap a block → **contextual mini-toolbar**
  (drag move, ± resize, delete, bring-to-front); pinch/pan + "fit page". Full preview + export.
- Unify mouse/touch/pen via Pointer Events; respect safe-area insets; **≥44px** touch targets.

## Files
- `src/components/AppShell.jsx`, breakpoint behaviors across `LibraryPanel` / `A4Canvas` /
  `SelectionLayer`, `src/lib/breakpoints.js`

## Done-when
- [ ] Laptop drag, iPad touch-drag, and phone tap-build all place & arrange formulas; export works
      on all three; a sheet built on one device opens identically on another.

## Verify
- Browser MCP at **3 viewports** + emulated touch: build & export on each. Confirm identical layout
  JSON. Commit `step 11: responsive`.
