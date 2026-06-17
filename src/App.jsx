import { useEffect, useRef, useState } from 'react'
import Toolbar from './components/Toolbar.jsx'
import RestoreBanner from './components/RestoreBanner.jsx'
import LibraryPanel from './components/LibraryPanel.jsx'
import A4Canvas from './components/A4Canvas.jsx'
import ExportPreview from './components/ExportPreview.jsx'
import PrintView from './components/PrintView.jsx'
import SuiteFooter from './components/SuiteFooter.jsx'
import { useLibrary } from './stores/libraryStore.js'
import { useCanvas } from './hooks/useCanvas.js'
import { useViewport } from './hooks/useViewport.js'
import canvasStore from './stores/canvasStore.js'
import { clearSaved } from './lib/persistence.js'
import { renderToString } from './lib/katex.js'
import copy from './lib/copy.js'

const MOVE_THRESHOLD = 5

function DragGhost({ formula }) {
  const ref = useRef(null)
  useEffect(() => {
    const move = (e) => {
      if (ref.current) {
        ref.current.style.left = `${e.clientX}px`
        ref.current.style.top = `${e.clientY}px`
      }
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])
  const dot = formula.color ? `var(${formula.color})` : 'var(--muted)'
  return (
    <div className="drag-ghost" ref={ref}>
      <span className="cdot" style={{ background: dot }} />
      <span className="math" dir="ltr" dangerouslySetInnerHTML={{ __html: renderToString(formula.latex) }} />
    </div>
  )
}

export default function App({ initiallyRestored = false }) {
  const { data, error } = useLibrary()
  const state = useCanvas()
  const { device } = useViewport()

  const [courseId, setCourseId] = useState(null)
  const [query, setQuery] = useState('')
  const [libCollapsed, setLibCollapsed] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [showRestore, setShowRestore] = useState(initiallyRestored)
  const [dragFormula, setDragFormula] = useState(null)
  const [dropActive, setDropActive] = useState(false)

  const pageRef = useRef(null)
  const scaleRef = useRef(0.5)
  const dragInfo = useRef(null)

  useEffect(() => {
    if (data && !courseId) setCourseId(data.courses[0]?.id)
  }, [data, courseId])

  // ---- drag a tile onto the page (mouse + touch unified via pointer) ----
  function onTilePointerDown(formula, e) {
    e.preventDefault()
    const startX = e.clientX
    const startY = e.clientY
    dragInfo.current = { formula, startX, startY, moved: false }

    const overPage = (cx, cy) => {
      const el = pageRef.current
      if (!el) return null
      const r = el.getBoundingClientRect()
      if (cx < r.left || cx > r.right || cy < r.top || cy > r.bottom) return null
      const s = scaleRef.current || 0.5
      return { x: (cx - r.left) / s - 90, y: (cy - r.top) / s - 22 }
    }

    const onMove = (ev) => {
      const info = dragInfo.current
      if (!info) return
      if (!info.moved) {
        if (Math.hypot(ev.clientX - startX, ev.clientY - startY) < MOVE_THRESHOLD) return
        info.moved = true
        setDragFormula(formula)
      }
      setDropActive(!!overPage(ev.clientX, ev.clientY))
    }
    const onUp = (ev) => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      const info = dragInfo.current
      dragInfo.current = null
      setDragFormula(null)
      setDropActive(false)
      if (!info) return
      if (info.moved) {
        const pos = overPage(ev.clientX, ev.clientY)
        if (pos) canvasStore.addFormula(formula, pos)
      } else {
        // tap-to-add → next free slot
        canvasStore.addFormula(formula)
      }
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  function handleReset() {
    if (state.blocks.length === 0 || window.confirm(copy.resetConfirm)) {
      canvasStore.clearCanvas()
      clearSaved()
      setShowRestore(false)
    }
  }

  if (error) {
    return (
      <div className="app-root">
        <div className="app" style={{ display: 'grid', placeItems: 'center', padding: 40 }}>
          טעינת ספריית הנוסחאות נכשלה. רעננו את העמוד.
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="app-root">
        <div className="app">
          <Toolbar
            density={state.page.density}
            hasBlocks={state.blocks.length > 0}
            onExport={() => setExportOpen(true)}
            onReset={handleReset}
          />

          {showRestore && (
            <RestoreBanner onReset={handleReset} onDismiss={() => setShowRestore(false)} />
          )}

          <div className="app-body">
            <A4Canvas
              blocks={state.blocks}
              selectedId={state.selectedId}
              density={state.page.density}
              pageRef={pageRef}
              scaleRef={scaleRef}
              dropActive={dropActive}
            />

            <LibraryPanel
              data={data}
              courseId={courseId}
              setCourseId={setCourseId}
              query={query}
              setQuery={setQuery}
              onTilePointerDown={onTilePointerDown}
              draggingId={dragFormula?.id}
              collapsed={libCollapsed && device === 'laptop'}
              onToggleCollapse={() => setLibCollapsed((v) => !v)}
            />
          </div>

          <SuiteFooter />
        </div>
      </div>

      {dragFormula && <DragGhost formula={dragFormula} />}

      {exportOpen && (
        <ExportPreview
          blocks={state.blocks}
          density={state.page.density}
          onClose={() => setExportOpen(false)}
        />
      )}

      <PrintView blocks={state.blocks} density={state.page.density} showLabels={false} />
    </>
  )
}
