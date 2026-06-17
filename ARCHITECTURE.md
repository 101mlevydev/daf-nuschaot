# ARCHITECTURE — דף נוסחאות (Daf Nuschaot Builder)

**Status:** Draft for review
**Constraint envelope:** zero backend · no DB · no third-party API · static hosting in the BGU
sandbox · Hebrew RTL.

---

## 1. System overview

A single-page static web app. Everything runs in the browser; the only "I/O" is reading a
bundled static JSON file and reading/writing `localStorage`.

```
┌─────────────────────────────────────────────────────────────┐
│ Browser (only runtime)                                        │
│                                                               │
│  formulas.json ──fetch──▶ Library Store ──▶ Library Sidebar   │
│   (static, in /public)                          │ drag        │
│                                                  ▼             │
│                                    Canvas Store ◀─┐            │
│                                    (blocks[])     │ autosave   │
│                                        │          ▼            │
│                                        │     localStorage      │
│                                        ▼                       │
│                                  A4 Canvas (Konva)             │
│                                        │                       │
│                                        ▼                       │
│                                  Export → window.print() → PDF │
└─────────────────────────────────────────────────────────────┘
```

No server, no network calls after the initial static asset load. Works fully offline once
loaded.

---

## 2. Tech stack & rationale

| Concern | Choice | Why |
|---|---|---|
| Build / dev | **Vite** | Instant HMR, static output, CSP-friendly (no runtime eval). |
| UI | **React 18** | Declarative state for library + canvas; clean component reuse. |
| Math rendering | **KaTeX** | Vector output, synchronous, fast on many formulas, ~30KB; broad enough LaTeX coverage for undergrad engineering. Fonts **bundled locally** (no CDN) to survive strict CSP. |
| Canvas | **Konva + react-konva** | Built-in drag, resize (Transformer), z-order layers, snap-to-grid, and high-DPI export. |
| PDF export | **Browser print stylesheet → "Save as PDF"** (primary); **html2canvas + jsPDF** (fallback button) | Print path is vector + selectable text = crisp A4. Fallback is one-click but rasterizes math (documented quality loss). |
| State | React state + light store (Context/Zustand) | Two stores: library (read-only) and canvas (mutable). |
| Persistence | **localStorage** | Autosave canvas layout; no DB needed. |
| Compression | none needed | Layout JSON is tiny. |

> **KaTeX vs MathJax:** KaTeX chosen for speed/size and crisp vector output. If a specific
> formula needs LaTeX KaTeX can't render, we either rewrite it in supported syntax or (last
> resort) ship that one as an SVG asset. Circuit diagrams / figures, if added, are SVG/PNG assets
> — not LaTeX.

---

## 3. Rendering the math (the crisp-text question)

Two viable ways to put KaTeX output on the page; we deliberately **keep math as DOM/HTML, not
baked into the Konva canvas bitmap**, so the print path stays vector:

- **Library tiles:** plain DOM, `katex.renderToString(latex)` into a styled tile.
- **Canvas blocks:** each placed formula is a positioned **HTML overlay** (absolutely positioned
  `div`s in a layer above/below a Konva interaction layer), OR a Konva node whose drag/resize
  transforms are mirrored onto the HTML overlay. We render *interaction* (drag handles, selection,
  snapping) with Konva, but the **visible math is HTML/KaTeX** so the browser can print it as
  vector.

> **Decision:** Use Konva for the *interaction/transform model* and an HTML/KaTeX overlay for the
> *visible content*. This is the key trick that makes a Konva-based editor still export crisp,
> selectable, vector math via the print pipeline. (A pure Konva-bitmap canvas would force a
> raster export and lose crispness — avoided.)
>
> If overlay-sync proves fiddly under hackathon time, the fallback is a **pure DOM canvas**
> (absolutely-positioned blocks + pointer-event drag/resize, snap via `Math.round(x/grid)*grid`)
> and skip Konva entirely. ROADMAP flags this as a go/no-go checkpoint.
>
> **RESOLVED (Step 07):** went with the **pure-DOM canvas** — Konva dropped. The editor is a fixed
> 794×1123px page (`src/lib/grid.js`) fit to the viewport via CSS `transform: scale()`; blocks are
> absolutely-positioned DOM nodes dragged with Pointer Events (deltas ÷ scale), snapped with
> `Math.round(x/grid)*grid`. Math stays HTML/KaTeX so the print path is vector and selectable.

---

## 4. Data model

### 4.1 Static formula library — `public/formulas.json`

```jsonc
{
  "version": "1.0",
  "courses": [
    {
      "id": "linear-algebra",
      "name": "אלגברה לינארית",          // Hebrew display name
      "nameLatin": "Linear Algebra",
      "topics": [
        {
          "id": "eigen",
          "name": "ערכים ווקטורים עצמיים",
          "formulas": [
            {
              "id": "eigen-char-poly",
              "label": "פולינום אופייני",
              "latex": "\\det(A - \\lambda I) = 0",
              "category": "equation",        // definition | theorem | equation
              "tags": ["eigenvalue", "determinant"],
              "difficulty": 2                  // 1..3, drives "essentials first" sorting
            }
          ]
        }
      ]
    }
  ]
}
```

**Design notes**
- Two-level nesting (`courses → topics → formulas`) maps to how students think.
- `latex` is the single source of truth; the UI renders it on demand — no pre-rendered images to
  maintain.
- Library is **append-only friendly**: anyone can add a course/topic/formula by editing JSON; no
  code change. This is how content scales post-hackathon.
- Loaded once via `fetch('/formulas.json')` at app init (same-origin, no CORS, no CSP issue).

### 4.2 Canvas state (in memory + persisted)

```jsonc
{
  "version": 1,
  "page": { "size": "A4", "sides": 1, "grid": 8 },
  "blocks": [
    {
      "id": "blk_01",                 // unique instance id
      "type": "formula",             // formula | text | header
      "ref": "eigen-char-poly",      // formula id (for type=formula)
      "latex": "\\det(A-\\lambda I)=0", // denormalized copy so deleting from library is safe
      "text": null,                   // for type=text/header
      "x": 24, "y": 40,               // mm or px (see units note)
      "w": 60, "h": 18,
      "scale": 1.0,
      "z": 3
    }
  ]
}
```

**Notes**
- Blocks store a **denormalized `latex` copy** so a placed block never breaks if the library
  changes.
- One layout object per page-set; `sides: 2` adds a second page array (stretch).
- **Units:** internal coordinates in CSS px at a fixed A4 pixel size (e.g., 794×1123 px @ 96dpi);
  the print stylesheet maps that 1:1 to a 210×297mm `@page`. Document the chosen DPI constant in
  one place.

---

## 5. State management

Two stores, intentionally separate:

- **Library store** — read-only; loaded from `formulas.json`; provides filtered/searched views.
- **Canvas store** — mutable list of blocks; all editor actions (add/move/resize/delete/reorder)
  mutate here; subscribes an autosave effect.

```
addBlock(formula)        → push block, snap to grid
moveBlock(id, x, y)      → update + snap
resizeBlock(id, w, h)    → update (min/max clamps)
reorder(id, dir)         → adjust z
removeBlock(id)          → drop
clearCanvas()            → reset (with confirm)
```

Undo/redo (stretch) = a bounded history stack of canvas-store snapshots.

---

## 6. Persistence

- **Autosave:** debounce (~300ms) canvas-store changes → `localStorage["daf:layout:v1"] =
  JSON.stringify(state)`.
- **Restore:** on load, hydrate from that key if present and `version` matches; else start blank.
- **Reset:** "התחל מחדש" clears the key after a confirm dialog.
- **Migration:** bump `version` and write a tiny migrator if the schema changes.
- IndexedDB is unnecessary (payload is small); localStorage is simpler and universally allowed.

---

## 7. PDF export pipeline (the deliverable)

### Primary — print-to-PDF (vector, crisp, selectable)
1. Render a **print-only view**: the A4 page with all blocks at exact positions, math as
   KaTeX/HTML, everything else (sidebar, handles, grid) hidden via `@media print`.
2. `@page { size: A4; margin: 0; }` and `.block { break-inside: avoid; }`.
3. Call `window.print()`. The user picks "Save as PDF". Output is vector, text-selectable, true
   A4.

```css
@media print {
  body > :not(.print-page) { display: none !important; }
  @page { size: A4; margin: 0; }
  .print-page { width: 210mm; height: 297mm; }
  .block { break-inside: avoid; }
}
```

### Fallback — one-click download (raster)
- A "הורד PDF" button using **html2canvas (scale: 2–3) + jsPDF** to produce an A4 PDF without the
  print dialog. **Known cost:** KaTeX becomes a rasterized image — slightly soft, not selectable.
  Use only if the print dialog is undesirable. Surfaced as secondary, with the print path primary.

**Gotchas captured:**
- Don't bake math into a Konva bitmap before export (kills vector quality) — export from the HTML
  overlay (see §3).
- Pin the px↔mm scale so on-screen layout == printed layout.
- Bundle KaTeX fonts locally; if fonts load from CDN they may be blocked or print as fallback
  glyphs.

---

## 8. Zero-backend / "no paywall code" statement

- **No server, no DB, no API, no auth.** The only fetch is the same-origin static
  `formulas.json`. After load the app is fully offline-capable.
- **No payment or entitlement logic.** We assume access implies payment (the hub gates entry).
  There is no paywall hook, no "is paid" flag, no locked features. Every feature, including
  export, is always available in our code.

---

## 9. Sandbox / CSP considerations

- Vite build = static HTML/CSS/JS, **no runtime `eval`**, friendly to a strict `script-src
  'self'`.
- **Bundle all assets locally** (KaTeX CSS+fonts, any icons) — no CDN — to survive `style-src` /
  `font-src` restrictions. KaTeX needs `style-src 'unsafe-inline'` OR its stylesheet served as a
  file; prefer the file + a small allowance if needed.
- No WebSocket, no outbound network → nothing for `connect-src` to block.
- `localStorage` and `window.print()` are standard and allowed in sandboxed iframes that permit
  scripts.
- **Open question for the hub:** if the app is embedded in a sandboxed `<iframe>`, confirm
  `allow-modals` / printing is permitted; otherwise fall back to the html2canvas download path.

---

## 10. Proposed project structure

```
daf-nuschaot/
  public/
    formulas.json
    katex/                 # locally bundled KaTeX fonts/css
  src/
    main.jsx
    App.jsx
    stores/
      libraryStore.js
      canvasStore.js
    components/
      LibrarySidebar.jsx
      FormulaTile.jsx       # KaTeX render + drag source
      A4Canvas.jsx          # Konva stage + HTML overlay sync
      CanvasBlock.jsx
      Toolbar.jsx           # export, reset, sides toggle
      PrintView.jsx         # print-only A4 render
    lib/
      katex.js              # render helpers
      pdf.js                # print + html2canvas/jsPDF fallback
      persistence.js        # localStorage autosave/restore
      grid.js               # snap math
    styles/
      app.css               # RTL + print stylesheet
  index.html                # <html dir="rtl" lang="he">
```

---

## 11. Accessibility & RTL specifics
- `<html dir="rtl" lang="he">`; layout via logical CSS properties (`margin-inline`, `inset-*`).
- Math and code are **LTR islands**: wrap KaTeX output in `dir="ltr"` containers so RTL context
  doesn't reorder symbols.
- Keyboard: delete-selected, arrow-nudge a selected block (stretch).
- Sufficient contrast; the printed sheet must be legible in grayscale (many students print B/W).
