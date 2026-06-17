// ============================================================
// The single source of truth for the px <-> mm mapping.
// A4 at 96dpi: 210mm = 793.7px, 297mm = 1122.5px.
// We work entirely in this 794 x 1123 px coordinate space; the
// print page declares width:210mm/height:297mm and CSS maps px
// 1:1 to mm (CSS px is fixed at 96dpi), so on-screen == printed.
// ============================================================
export const PAGE_W = 794;   // px  (~210mm)
export const PAGE_H = 1123;  // px  (~297mm)
export const GRID = 19;      // px  snap grid (also the graph-paper minor line)
export const MAJOR = GRID * 5;
export const MARGIN = 38;    // px  printable-area inset (~10mm)

// snap a single coordinate to the grid
export const snap = (v) => Math.round(v / GRID) * GRID;

// clamp a value into [min,max]
export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

// clamp a block fully inside the page (allow a little overhang for overflow UX)
export function clampToPage(x, y, w, h) {
  return {
    x: clamp(x, -w + GRID, PAGE_W - GRID),
    y: clamp(y, -h + GRID, PAGE_H + GRID),
  };
}

// does the block cross the printable bounds?
export function isOverflowing(b) {
  return (
    b.x < 0 ||
    b.y < 0 ||
    b.x + b.w > PAGE_W ||
    b.y + b.h > PAGE_H
  );
}

// find the next free-ish grid slot for tap-to-add (phone) / quick add.
// Walks down the page in grid rows from the top margin, avoiding overlaps.
export function nextFreeSlot(blocks, w = 180, h = 44) {
  const startX = MARGIN;
  for (let y = MARGIN; y < PAGE_H - MARGIN - h; y += GRID * 2) {
    const collides = blocks.some(
      (b) =>
        !(startX + w <= b.x || startX >= b.x + b.w || y + h <= b.y || y >= b.y + b.h)
    );
    if (!collides) return { x: snap(startX), y: snap(y) };
  }
  // fallback: stack near top with a small cascade
  const n = blocks.length;
  return { x: snap(MARGIN + (n % 4) * GRID), y: snap(MARGIN + n * GRID) };
}
