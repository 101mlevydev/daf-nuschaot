# Step 10 — PDF export — print primary + html2canvas/jsPDF fallback (the climax)

**Phase:** Core (export) · **Status:** done · **Depends on:** 09

## Goal
**The signature moment of the hero app.** Drag → arrange → one click → a genuinely crisp,
print-ready A4 PDF. The reveal should feel like magic — deepest polish in the suite.

## Do
- `PrintView` — a print-only DOM A4: blocks at exact positions, **math as KaTeX/HTML** (vector,
  selectable), UI hidden via `@media print`; `@page { size:A4; margin:0 }`,
  `.block { break-inside:avoid }`. On-screen px↔mm must map **1:1** to the printed page.
- `ExportPreview` — the **preview-reveal**: a short, satisfying animation surfacing the finished A4
  ("הנה הדף שלך 💪") before the print/download — warm, calm, not gimmicky; respects
  `prefers-reduced-motion`.
- **Primary path:** `window.print()` → user picks "Save as PDF" → vector A4.
- **Fallback path:** `src/lib/pdf.js` html2canvas (scale 2–3) + jsPDF one-click **"הורד PDF"**
  download — offered quietly as a backup (rasterized math; no scary warning). Used when the sandbox
  iframe blocks the print dialog.
- Optional "show labels" toggle on the printed sheet (default: pure formulas).

## Files
- `src/components/ExportPreview.jsx`, `PrintView.jsx`, `src/lib/pdf.js`, print styles in `app.css`

## Done-when
- [ ] Preview-reveal plays, then print produces a **vector, selectable, true-A4** PDF; printed
      layout == on-screen layout; KaTeX prints crisp (local fonts, not fallback glyphs).
- [ ] Fallback download produces a valid A4 PDF when print is unavailable.

## Verify
- Browser MCP: export → inspect print preview (selectable text, A4, no UI chrome); trigger the
  fallback and confirm a downloaded A4 PDF. **This beat is rehearsed for the demo.** Commit
  `step 10: pdf export (climax)`.
