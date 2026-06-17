import { useMemo, useState } from 'react'
import FormulaTile from './FormulaTile.jsx'
import { courseView } from '../stores/libraryStore.js'
import copy from '../lib/copy.js'

export default function LibraryPanel({
  data,
  courseId,
  setCourseId,
  query,
  setQuery,
  onTilePointerDown,
  draggingId,
  collapsed,
  onToggleCollapse,
}) {
  const [closedTopics, setClosedTopics] = useState({})

  const course = useMemo(
    () => data?.courses.find((c) => c.id === courseId) || data?.courses[0],
    [data, courseId]
  )
  const topics = useMemo(() => (course ? courseView(course, query) : []), [course, query])

  if (collapsed) {
    return (
      <button className="collapse" style={{ alignSelf: 'start', margin: 10 }}
        onClick={onToggleCollapse} title={copy.library.expand} aria-label={copy.library.expand}>
        ⟨
      </button>
    )
  }

  const toggleTopic = (id) => setClosedTopics((s) => ({ ...s, [id]: !s[id] }))

  return (
    <aside className="lib" aria-label={copy.library.title}>
      <div className="lib-head">
        <div className="row">
          <h3>{copy.library.title}</h3>
          <button className="collapse" onClick={onToggleCollapse}
            title={copy.library.collapse} aria-label={copy.library.collapse}>⟩</button>
        </div>
        <div className="search">
          <span className="ic" aria-hidden>⌕</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={copy.library.searchPlaceholder}
            aria-label={copy.library.searchPlaceholder}
          />
        </div>
      </div>

      <div className="courses" role="tablist" aria-label="קורסים">
        {data?.courses.map((c) => {
          const on = c.id === (course?.id)
          return (
            <button
              key={c.id}
              role="tab"
              aria-selected={on}
              className={`chip${on ? ' on' : ''}`}
              onClick={() => setCourseId(c.id)}
            >
              <span className="cd" style={{ background: `var(${c.color})` }} />
              {c.name}
            </button>
          )
        })}
      </div>

      <div className="lib-scroll">
        {topics.length === 0 && <div className="lib-empty">{copy.library.empty}</div>}
        {topics.map((t) => {
          const closed = !!closedTopics[t.id]
          return (
            <div key={t.id}>
              <div className={`topic${closed ? ' closed' : ''}`} onClick={() => toggleTopic(t.id)}>
                <span className="caret" aria-hidden>▾</span>
                {t.name}
              </div>
              {!closed &&
                t.formulas.map((f) => (
                  <FormulaTile
                    key={f.id}
                    formula={f}
                    dragging={draggingId === f.id}
                    onPointerDown={onTilePointerDown}
                  />
                ))}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
