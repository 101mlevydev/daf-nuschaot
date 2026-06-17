import { useMemo } from 'react'
import { renderToString } from '../lib/katex.js'

export default function FormulaTile({ formula, onPointerDown, dragging }) {
  const html = useMemo(() => renderToString(formula.latex), [formula.latex])
  const dotColor = formula.color ? `var(${formula.color})` : 'var(--muted)'
  return (
    <div
      className={`tile${dragging ? ' dragging' : ''}`}
      onPointerDown={(e) => onPointerDown?.(formula, e)}
      role="button"
      tabIndex={0}
      title={formula.label}
      aria-label={`${formula.label} — הוסף לדף`}
    >
      <span className="cdot" style={{ background: dotColor }} />
      <div className="body">
        <span className="math" dir="ltr" dangerouslySetInnerHTML={{ __html: html }} />
        <div className="lbl">{formula.label}</div>
      </div>
      <span className="grip" aria-hidden>⋮⋮</span>
    </div>
  )
}
