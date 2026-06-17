// ============================================================
// Persistence — debounced localStorage autosave + safe restore.
// ============================================================
import canvasStore from '../stores/canvasStore.js'

const KEY = 'daf:layout:v1'
const SCHEMA_VERSION = 1
const DEBOUNCE_MS = 300

let timer = null

// Returns true if a saved layout existed and was restored.
export function restore() {
  let raw
  try {
    raw = localStorage.getItem(KEY)
  } catch {
    return false
  }
  if (!raw) return false
  try {
    const doc = JSON.parse(raw)
    // migration hook: bump SCHEMA_VERSION + transform older docs here
    if (!doc || doc.version !== SCHEMA_VERSION) {
      if (!doc || !Array.isArray(doc.blocks)) return false
    }
    if (!Array.isArray(doc.blocks) || doc.blocks.length === 0) return false
    return canvasStore.hydrate(doc)
  } catch {
    // corrupt data → graceful blank canvas
    try {
      localStorage.removeItem(KEY)
    } catch {}
    return false
  }
}

export function startAutosave() {
  return canvasStore.subscribe(() => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(write, DEBOUNCE_MS)
  })
}

function write() {
  try {
    localStorage.setItem(KEY, JSON.stringify(canvasStore.toJSON()))
  } catch {
    // storage full / blocked — fail silently, app stays usable
  }
}

export function clearSaved() {
  try {
    localStorage.removeItem(KEY)
  } catch {}
}

export default { restore, startAutosave, clearSaved }
