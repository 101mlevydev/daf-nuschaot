# Step 02 — Scaffold (Vite + React) + git + env check

**Phase:** Setup · **Status:** done · **Depends on:** 01 approved

## Goal
A running Vite + React skeleton on a git branch.

## Do
- Verify toolchain: `node -v`, `npm -v`, `git --version`.
- `git init` (if needed); create branch `build/daf-nuschaot`.
- `npm create vite@latest .` (**react** template, JS) in `daf-nuschaot/`.
- `index.html` → `<html dir="rtl" lang="he">`; set title "דף נוסחאות".
- Strip the Vite demo content; render an empty `<AppShell>` placeholder.
- `.gitignore` for `node_modules`, `dist`.

## Files
- `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `.gitignore`

## Done-when
- [ ] `npm run dev` serves a blank RTL shell with no console errors.
- [ ] `npm run build` produces `dist/` static output.

## Verify
- `run` dev server; browser MCP loads the page; console clean; `dir="rtl"` confirmed. Commit
  `step 02: scaffold`.
