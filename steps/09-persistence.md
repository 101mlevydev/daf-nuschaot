# Step 09 — Persistence — localStorage autosave/restore + restore banner

**Phase:** Core · **Status:** done · **Depends on:** 08

## Goal
Refresh-safe work: the sheet is never lost, and it just reappears.

## Do
- `src/lib/persistence.js` — **debounced (~300ms)** write of `canvasStore` →
  `localStorage["daf:layout:v1"]`; on load, hydrate if present and `version` matches, else blank.
- `RestoreBanner` — on load with a saved layout, **silently restore** + show a calm
  "המשכנו מאיפה שהפסקת" note with a reset.
- Reset = "התחל מחדש" clears the key after a **confirm**. Add a tiny version migrator hook for
  future schema bumps.

## Files
- `src/lib/persistence.js`, `src/components/RestoreBanner.jsx`

## Done-when
- [ ] Edits persist; reload restores the exact layout silently; reset clears with a confirm.
- [ ] Bad/old/corrupt stored data fails gracefully to a blank canvas (no crash).

## Verify
- Browser MCP: place blocks → reload (restored) → reset (cleared) → corrupt the key → reload
  (graceful blank). Commit `step 09: autosave/restore`.
