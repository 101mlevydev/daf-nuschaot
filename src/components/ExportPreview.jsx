import { useRef, useState } from 'react'
import SheetRender from './SheetRender.jsx'
import { PAGE_W, PAGE_H } from '../lib/grid.js'
import { printSheet, downloadPdf } from '../lib/pdf.js'
import copy from '../lib/copy.js'

const CONFETTI = [
  { c: 'var(--relief)', top: 22, side: { insetInlineStart: '16%' }, rot: 18, d: 0 },
  { c: 'var(--accent)', top: 38, side: { insetInlineEnd: '22%' }, rot: -22, d: 0.05 },
  { c: 'var(--t-infi2)', top: 16, side: { insetInlineEnd: '40%' }, rot: 40, d: 0.1 },
  { c: '#fff', top: 56, side: { insetInlineStart: '32%' }, rot: -10, d: 0.15 },
  { c: 'var(--t-mech)', top: 28, side: { insetInlineStart: '46%' }, rot: 28, d: 0.08 },
  { c: 'var(--t-em)', top: 48, side: { insetInlineEnd: '12%' }, rot: -32, d: 0.12 },
]

export default function ExportPreview({ blocks, density, onClose }) {
  const [showLabels, setShowLabels] = useState(false)
  const [busy, setBusy] = useState(false)
  const captureRef = useRef(null)

  const previewW = Math.min(300, window.innerWidth * 0.66)
  const ps = previewW / PAGE_W

  async function onDownload() {
    setBusy(true)
    try {
      await downloadPdf(captureRef.current)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="reveal-overlay" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="reveal-stage" role="dialog" aria-modal="true" aria-label={copy.export.title}>
        <button className="reveal-close" onClick={onClose} aria-label={copy.export.back}>✕</button>
        {CONFETTI.map((p, i) => (
          <span key={i} className="confetti"
            style={{ background: p.c, top: p.top, ...p.side, transform: `rotate(${p.rot}deg)`, animationDelay: `${p.d}s` }} />
        ))}

        <div className="reveal-card">
          <p className="ttl">{copy.export.title}</p>
          <p className="sub">{copy.export.subtitle}</p>

          <div
            className="preview-frame"
            style={{
              width: previewW,
              height: PAGE_H * ps,
              backgroundImage:
                'linear-gradient(rgba(72,116,140,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(72,116,140,.08) 1px,transparent 1px)',
              backgroundSize: '11px 11px,11px 11px',
            }}
          >
            <span className="shimmer" />
            <div style={{ width: PAGE_W, height: PAGE_H, transform: `scale(${ps})`, transformOrigin: 'top left' }}>
              <SheetRender blocks={blocks} density={density} showLabels={showLabels} style={{ background: 'transparent' }} />
            </div>
          </div>

          <label className="reveal-toggle">
            <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} />
            {copy.export.showLabels}
          </label>

          <div className="reveal-actions">
            <button className="btn relief" onClick={printSheet}>
              <span className="ic">⭳</span> {copy.export.print}
            </button>
            <button className="btn onsurface" onClick={onDownload} disabled={busy}>
              {busy ? '…' : copy.export.download}
            </button>
          </div>
        </div>
      </div>

      {/* offscreen full-resolution sheet for the raster fallback */}
      <div style={{ position: 'fixed', left: -100000, top: 0, pointerEvents: 'none' }} aria-hidden>
        <SheetRender ref={captureRef} blocks={blocks} density={density} showLabels={showLabels} />
      </div>
    </div>
  )
}
