# Step 13 — Content & copy gate — seed formulas + starter sheets + Hebrew copy ⛔ APPROVAL

**Phase:** Content · **Status:** todo · **Depends on:** 12

## Goal
Trustworthy formula content + a per-course head-start + every Hebrew string in an authentic, warm
but efficient voice — **formulas must be correct; copy must not read as AI.**

## Do
- Author the **full, verified** `public/formulas.json` across the five courses & their topics
  (PRD §7): **אלגברה לינארית · אינפי 1 · אינפי 2 · מכניקה · חשמל ומגנטיות** — ~9 topics each,
  ~15–25 formulas per course. LaTeX is the source of truth; use standard, recognizable formulas;
  keep LaTeX visible/editable; **do not claim "official BGU."**
- Add a **per-course starter sheet** — a pre-arranged layout the student prunes (reduces
  blank-canvas paralysis; faster "wow"). Store as a starter-layout file the app can load.
- Fill `src/lib/copy.js` with **every** Hebrew string: toolbar/labels, restore banner, ghost hint
  ("גרור נוסחה לכאן"), inline learn-by-doing hints, export reveal ("הנה הדף שלך" / "בהצלחה במבחן 💪"),
  reset confirm. Warm but efficient, calm — emotional target = **relief**.
- Produce `design/content-review.md` (formula list per course) + `design/copy-review.md` (all
  strings) for the owner / a native speaker to verify and edit.

## Files
- `public/formulas.json`, starter-sheet layouts, `src/lib/copy.js`, `design/content-review.md`,
  `design/copy-review.md`

## Done-when
- [ ] Five courses populated; each has a starter sheet; all strings centralized.
- [ ] **Owner / native speaker approved** formula correctness AND the Hebrew copy (natural, not AI).

## Verify
- Validate JSON; load each course + its starter sheet; present the two review docs; apply edits.
  ⛔ STOP for approval before final acceptance. Commit `step 13: content + copy`.
