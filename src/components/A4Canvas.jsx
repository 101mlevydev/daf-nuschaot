import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import CanvasBlock from './CanvasBlock.jsx'
import canvasStore from '../stores/canvasStore.js'
import { PAGE_W, PAGE_H, GRID, MAJOR, MARGIN } from '../lib/grid.js'
import copy from '../lib/copy.js'

export default function A4Canvas({ blocks, selectedId, density, pageRef, scaleRef, dropActive }) {
  const stageRef = useRef(null)
  const [scale, setScale] = useState(0.5)

  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const fit = () => {
      const pad = 52
      const availW = stage.clientWidth - pad
      const availH = stage.clientHeight - pad
      const s = Math.max(0.18, Math.min(availW / PAGE_W, availH / PAGE_H, 1.2))
      setScale(s)
      if (scaleRef) scaleRef.current = s
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(stage)
    return () => ro.disconnect()
  }, [scaleRef])

  useEffect(() => {
    if (scaleRef) scaleRef.current = scale
  }, [scale, scaleRef])

  const empty = blocks.length === 0

  return (
    <div
      className="stage"
      ref={stageRef}
      onPointerDown={(e) => {
        // background click deselects
        if (e.target === e.currentTarget || e.target.classList.contains('page-scaler'))
          canvasStore.select(null)
      }}
    >
      <div
        className="page-scaler"
        style={{ width: PAGE_W * scale, height: PAGE_H * scale }}
        onPointerDown={(e) => {
          if (e.target.classList.contains('page') || e.target.classList.contains('page-scaler'))
            canvasStore.select(null)
        }}
      >
        <div
          ref={pageRef}
          className={`page${dropActive ? ' drop-active' : ''}`}
          style={{
            width: PAGE_W,
            height: PAGE_H,
            transform: `scale(${scale})`,
            backgroundSize: `${GRID}px ${GRID}px, ${GRID}px ${GRID}px, ${MAJOR}px ${MAJOR}px, ${MAJOR}px ${MAJOR}px`,
          }}
        >
          <span className="page-tag">{copy.canvas.pageTag}</span>
          <div className="margin-guide" style={{ inset: MARGIN }} />

          {empty && (
            <div className="ghost-hint">
              <div>
                <div className="gh-icon" aria-hidden>＋</div>
                <div className="gh-title">{copy.canvas.ghost}</div>
                <div className="gh-sub">{copy.canvas.ghostHint}</div>
              </div>
            </div>
          )}

          {blocks.map((b) => (
            <CanvasBlock
              key={b.id}
              block={b}
              scale={scale}
              scaleRef={scaleRef}
              density={density}
              selected={selectedId === b.id}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
