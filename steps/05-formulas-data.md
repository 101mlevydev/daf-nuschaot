# Step 05 — `formulas.json` schema + library store

**Phase:** Content/data · **Status:** done (seed; full content+native review pending Step 13) · **Depends on:** 04

## Goal
The data backbone: a static, append-only formula library loaded once into a read-only store.

## Do
- `public/formulas.json` — the `courses → topics → formulas` schema from ARCHITECTURE §4.1. Each
  formula: `id`, `label` (Hebrew), `latex` (source of truth), `category`
  (definition|theorem|equation), `tags`, `difficulty` (1–3).
- Seed a **small but real** placeholder set (a few topics across 2 courses) just to build against —
  the **full, verified** five-course content + starter sheets land at Step 13 (the content gate).
- `src/stores/libraryStore.js` — load via `fetch('/formulas.json')` once at init; read-only; expose
  `courses`, plus `filterByCourse` / `search(query)` selector views.

## Files
- `public/formulas.json`, `src/stores/libraryStore.js`

## Done-when
- [ ] `formulas.json` parses; store loads it once and exposes courses/topics/formulas.
- [ ] Selectors return correct filtered/searched subsets.

## Verify
- Browser MCP: log store contents; confirm shape + counts; one fetch, same-origin. Commit
  `step 05: formula library store`.
