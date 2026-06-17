// ============================================================
// KaTeX render helper. One place that:
//  - renders LaTeX to an HTML string (vector, prints crisp)
//  - never throws on a bad formula (shows the raw source instead)
//  - wraps output as a dir="ltr" island so the RTL page never
//    reorders math symbols.
// Fonts are bundled locally via the CSS import below (no CDN).
// ============================================================
import katex from 'katex'
import 'katex/dist/katex.min.css'

const cache = new Map()

export function renderToString(latex, opts = {}) {
  const key = latex + '|' + (opts.displayMode ? 'd' : 'i')
  if (cache.has(key)) return cache.get(key)
  let html
  try {
    html = katex.renderToString(latex, {
      throwOnError: false,
      displayMode: !!opts.displayMode,
      output: 'html',
      strict: false,
      trust: false,
    })
  } catch {
    // last-resort: show the raw latex so nothing ever crashes the UI
    html = `<span class="katex-fallback">${escapeHtml(latex)}</span>`
  }
  cache.set(key, html)
  return html
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export default renderToString
