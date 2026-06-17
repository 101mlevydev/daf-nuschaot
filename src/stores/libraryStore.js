// ============================================================
// Library store — read-only formula library.
// Loaded once from the same-origin static public/formulas.json.
// Exposes the raw courses + filter/search selectors.
// ============================================================
import { useEffect, useState } from 'react'

let _data = null
let _promise = null

export function loadLibrary() {
  if (_data) return Promise.resolve(_data)
  if (_promise) return _promise
  // base-relative so it resolves inside the sandbox iframe mount path
  const url = `${import.meta.env.BASE_URL}formulas.json`
  _promise = fetch(url)
    .then((r) => {
      if (!r.ok) throw new Error(`formulas.json ${r.status}`)
      return r.json()
    })
    .then((json) => {
      // attach each formula's course color + id for tiles/blocks
      for (const c of json.courses || []) {
        for (const t of c.topics || []) {
          for (const f of t.formulas || []) {
            f.color = c.color
            f.courseId = c.id
            f.topicId = t.id
          }
        }
      }
      _data = json
      return json
    })
  return _promise
}

export function useLibrary() {
  const [data, setData] = useState(_data)
  const [error, setError] = useState(null)
  useEffect(() => {
    let alive = true
    loadLibrary()
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e))
    return () => {
      alive = false
    }
  }, [])
  return { data, error }
}

// flat list of all formulas (for global search)
export function allFormulas(data) {
  const out = []
  for (const c of data?.courses || []) {
    for (const t of c.topics || []) {
      for (const f of t.formulas || []) out.push({ ...f, courseName: c.name, topicName: t.name })
    }
  }
  return out
}

// filtered view: a course's topics, each with difficulty-sorted formulas,
// narrowed by a live search query (matches label / tags / latex).
export function courseView(course, query) {
  const q = (query || '').trim().toLowerCase()
  const match = (f) =>
    !q ||
    f.label.toLowerCase().includes(q) ||
    (f.tags || []).some((t) => t.toLowerCase().includes(q)) ||
    f.latex.toLowerCase().includes(q)

  return (course.topics || [])
    .map((t) => ({
      ...t,
      formulas: [...t.formulas]
        .filter(match)
        .sort((a, b) => (a.difficulty || 2) - (b.difficulty || 2)),
    }))
    .filter((t) => t.formulas.length > 0)
}
