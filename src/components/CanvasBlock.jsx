import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { renderToString } from '../lib/katex.js'
import { isOverflowing } from '../lib/grid.js'
import canvasStore from '../stores/canvasStore.js'
import copy from '../lib/copy.js'

const BASE_FS = { formula: 16, header: 14, text: 14 }
const MOVE_THRESHOLD = 3

export default function CanvasBlock({ block, scale, density, selected, scaleRef }) {
  const elRef = useRef(null)
  const [drag, setDrag] = useState(null) // {dx,dy} transient page-space offset
  const [rScale, setRScale] = useState(null) // transient scale during resize
  const [editing, setEditing] = useState(false)
  const dragInfo = useRef(null)

  const isText = block.type === 'text' || block.type === 'header'
  const effScale = (rScale ?? block.scale) * density
  const fontSize = BASE_FS[block.type] * effScale

  const x = block.x + (drag?.dx || 0)
  const y = block.y + (drag?.dy || 0)
  const overflow = isOverflowing({ ...block, x, y })

  // measure real size → feed store estimates (for overflow/clamp/slots).
  useLayoutEffect(() => {
    const el = elRef.current
    if (!el) return
    const w = el.offsetWidth
    const h = el.offsetHeight
    if (Math.abs(w - block.w) > 1 || Math.abs(h - block.h) > 1) {
      canvasStore.resizeBlock(block.id, w, h)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block.scale, rScale, block.text, density, block.latex])

  // ---- move (pointer) ----
  function onPointerDown(e) {
    if (editing) return
    if (e.target.closest('.hdl') || e.target.closest('.blk-tools') || e.target.closest('.blk-edit'))
      return
    e.stopPropagation()
    canvasStore.select(block.id)
    const startX = e.clientX
    const startY = e.clientY
    dragInfo.current = { startX, startY, moved: false, free: e.altKey || e.shiftKey }
    e.currentTarget.setPointerCapture?.(e.pointerId)

    const onMove = (ev) => {
      const s = scaleRef.current || scale || 1
      const dx = (ev.clientX - startX) / s
      const dy = (ev.clientY - startY) / s
      if (!dragInfo.current.moved && Math.hypot(ev.clientX - startX, ev.clientY - startY) < MOVE_THRESHOLD)
        return
      dragInfo.current.moved = true
      dragInfo.current.free = ev.altKey || ev.shiftKey
      setDrag({ dx, dy })
    }
    const onUp = (ev) => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      const info = dragInfo.current
      if (info?.moved) {
        const s = scaleRef.current || scale || 1
        const dx = (ev.clientX - startX) / s
        const dy = (ev.clientY - startY) / s
        canvasStore.moveBlock(block.id, block.x + dx, block.y + dy, !info.free)
      }
      setDrag(null)
      dragInfo.current = null
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  // ---- resize (scale) ----
  function onResizeDown(e) {
    e.stopPropagation()
    e.preventDefault()
    canvasStore.select(block.id)
    const rect = elRef.current.getBoundingClientRect()
    const ox = rect.left
    const oy = rect.top
    const startDist = Math.max(12, Math.hypot(e.clientX - ox, e.clientY - oy))
    const startScale = block.scale
    const onMove = (ev) => {
      const curDist = Math.max(8, Math.hypot(ev.clientX - ox, ev.clientY - oy))
      const ns = Math.min(2.4, Math.max(0.55, +(startScale * (curDist / startDist)).toFixed(2)))
      setRScale(ns)
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      setRScale((cur) => {
        if (cur != null) canvasStore.setScaleAbsolute(block.id, cur)
        return null
      })
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  // keyboard: delete / nudge when selected
  useEffect(() => {
    if (!selected || editing) return
    const onKey = (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (!isText) { e.preventDefault(); canvasStore.removeBlock(block.id) }
      } else if (e.key.startsWith('Arrow')) {
        e.preventDefault()
        const step = e.shiftKey ? 1 : 19
        const d = { ArrowUp: [0, -step], ArrowDown: [0, step], ArrowLeft: [-step, 0], ArrowRight: [step, 0] }[e.key]
        if (d) canvasStore.moveBlock(block.id, block.x + d[0], block.y + d[1], false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, editing, isText, block.id, block.x, block.y])

  const html = block.type === 'formula' ? renderToString(block.latex) : null

  return (
    <div
      ref={elRef}
      className={`blk${selected ? ' sel' : ''}${drag ? ' dragging' : ''}${overflow ? ' overflow' : ''}`}
      style={{ left: x, top: y, zIndex: block.z }}
      onPointerDown={onPointerDown}
      onDoubleClick={() => isText && setEditing(true)}
    >
      {block.type === 'formula' && (
        <span className="math" dir="ltr" style={{ fontSize }} dangerouslySetInnerHTML={{ __html: html }} />
      )}

      {block.type === 'header' &&
        (editing ? (
          <textarea
            className="blk-edit" autoFocus rows={1} style={{ fontSize }}
            value={block.text}
            placeholder={copy.block.headerPlaceholder}
            onChange={(e) => canvasStore.setText(block.id, e.target.value)}
            onBlur={() => setEditing(false)}
          />
        ) : (
          <div className="sheet-h" style={{ fontSize }}>{block.text || copy.block.headerPlaceholder}</div>
        ))}

      {block.type === 'text' &&
        (editing ? (
          <textarea
            className="blk-edit" autoFocus rows={2} style={{ fontSize }}
            value={block.text}
            placeholder={copy.block.textPlaceholder}
            onChange={(e) => canvasStore.setText(block.id, e.target.value)}
            onBlur={() => setEditing(false)}
          />
        ) : (
          <div className="free-text" style={{ fontSize }}>{block.text || copy.block.textPlaceholder}</div>
        ))}

      {selected && !editing && (
        <>
          <div className="blk-tools" onPointerDown={(e) => e.stopPropagation()}>
            {isText && <button title="ערוך" onClick={() => setEditing(true)}>✎</button>}
            <button title={copy.block.smaller} onClick={() => canvasStore.bumpScale(block.id, -0.1)}>−</button>
            <button title={copy.block.bigger} onClick={() => canvasStore.bumpScale(block.id, 0.1)}>＋</button>
            <button title={copy.block.front} onClick={() => canvasStore.bringToFront(block.id)}>⬆</button>
            <button className="danger" title={copy.block.delete} onClick={() => canvasStore.removeBlock(block.id)}>🗑</button>
          </div>
          <span className="hdl br" onPointerDown={onResizeDown} title="שנה גודל" />
        </>
      )}

      {overflow && <span className="overflow-pill" style={{ bottom: -26 }}>{copy.overflow}</span>}
    </div>
  )
}
