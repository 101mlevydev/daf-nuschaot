import canvasStore from '../stores/canvasStore.js'
import copy from '../lib/copy.js'

const D_MIN = 0.6
const D_MAX = 1.4

export default function Toolbar({ density, onExport, onReset, hasBlocks }) {
  const fill = ((density - D_MIN) / (D_MAX - D_MIN)) * 100
  return (
    <div className="toolbar">
      <div className="brand"><span className="dot" /><span>{copy.appName}</span></div>
      <div className="tb-spacer" />

      <div className="tb-group tb-add">
        <button className="btn ghost" onClick={() => canvasStore.addBlock('header')}>
          <span className="ic">𝐇</span> {copy.toolbar.addHeader}
        </button>
        <button className="btn ghost" onClick={() => canvasStore.addBlock('text')}>
          <span className="ic">✎</span> {copy.toolbar.addText}
        </button>
      </div>

      <div className="density">
        <label htmlFor="density">{copy.toolbar.density}</label>
        <input
          id="density"
          type="range"
          min={D_MIN}
          max={D_MAX}
          step="0.05"
          value={density}
          style={{ '--fill': `${fill}%` }}
          onChange={(e) => canvasStore.setDensity(parseFloat(e.target.value))}
          aria-label={copy.toolbar.density}
        />
      </div>

      <button className="btn ghost" onClick={onReset}>
        <span className="ic">↺</span> {copy.toolbar.reset}
      </button>
      <button className="btn primary" onClick={onExport} disabled={!hasBlocks}>
        <span className="ic">⭳</span> {copy.toolbar.export}
      </button>
    </div>
  )
}
