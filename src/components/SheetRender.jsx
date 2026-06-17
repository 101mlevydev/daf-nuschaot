import { forwardRef } from 'react'
import { renderToString } from '../lib/katex.js'
import { PAGE_W, PAGE_H } from '../lib/grid.js'

const BASE_FS = { formula: 16, header: 14, text: 14 }

// Static, non-interactive render of the sheet's blocks into a
// PAGE_W x PAGE_H box. Used by the export preview (scaled down)
// and the print view (sized to 210x297mm by its wrapper).
const SheetRender = forwardRef(function SheetRender(
  { blocks, density = 1, showLabels = false, style },
  ref
) {
  return (
    <div ref={ref} className="print-page" style={{ width: PAGE_W, height: PAGE_H, ...style }}>
      {blocks
        .slice()
        .sort((a, b) => (a.z || 0) - (b.z || 0))
        .map((b) => {
          const fontSize = BASE_FS[b.type] * (b.scale || 1) * density
          return (
            <div key={b.id} className="p-blk" style={{ left: b.x, top: b.y }}>
              {b.type === 'formula' && (
                <>
                  <span
                    className="math"
                    dir="ltr"
                    style={{ fontSize }}
                    dangerouslySetInnerHTML={{ __html: renderToString(b.latex) }}
                  />
                  {showLabels && b.label && (
                    <div style={{ fontSize: 9 * (b.scale || 1) * density, color: '#5A6573', marginTop: 2 }}>
                      {b.label}
                    </div>
                  )}
                </>
              )}
              {b.type === 'header' && (
                <div className="sheet-h" style={{ fontSize }}>{b.text}</div>
              )}
              {b.type === 'text' && (
                <div className="free-text" style={{ fontSize }}>{b.text}</div>
              )}
            </div>
          )
        })}
    </div>
  )
})

export default SheetRender
export { PAGE_W, PAGE_H }
