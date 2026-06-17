# Step 06 — Library panel — course/topic browse + search

**Phase:** Core (browse) · **Status:** done · **Depends on:** 05

## Goal
The hook: browse a curated, course-specific library fast and find any formula in seconds.

## Do
- `LibraryPanel` — collapsible container, docked on the **right (RTL)** on laptop.
- `CourseFilter` — course accordions (אלגברה לינארית · אינפי 1 · אינפי 2 · מכניקה · חשמל ומגנטיות);
  `TopicGroup` — collapsible topic sections.
- `SearchBar` — filters by label/tag across courses (live).
- `FormulaTile` — KaTeX-rendered math (`dir="ltr"`) + short **Hebrew label** + a subtle
  **topic-color dot**; sorted essentials-first by `difficulty`. (Drag source / tap-to-add wired in
  Steps 08 & 11.)

## Files
- `src/components/LibraryPanel.jsx`, `CourseFilter.jsx`, `TopicGroup.jsx`, `SearchBar.jsx`,
  `FormulaTile.jsx`

## Done-when
- [ ] Picking a course filters the library; topics expand/collapse; search narrows results live.
- [ ] Tiles render crisp math + label + topic dot, scannable, matching the mockup.

## Verify
- Browser MCP: filter a course, search a term, screenshot vs mockup. Commit `step 06: library browse`.
