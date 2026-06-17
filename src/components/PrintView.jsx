import { forwardRef } from 'react'
import SheetRender from './SheetRender.jsx'

// Print-only DOM. Hidden on screen; revealed by @media print
// (app.css). The page declares 210x297mm and blocks use the same
// px coords as the editor (px maps 1:1 to mm at 96dpi).
const PrintView = forwardRef(function PrintView({ blocks, density, showLabels }, ref) {
  return (
    <div className="print-root" aria-hidden>
      <SheetRender
        ref={ref}
        blocks={blocks}
        density={density}
        showLabels={showLabels}
        style={{ width: '210mm', height: '297mm' }}
      />
    </div>
  )
})

export default PrintView
