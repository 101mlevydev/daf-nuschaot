// ============================================================
// Canvas store — the mutable document model.
// A tiny observable singleton (subscribe / getState / setState)
// consumed in React via useSyncExternalStore. The autosave effect
// subscribes here (see lib/persistence.js).
// ============================================================
import { GRID, snap, clampToPage, nextFreeSlot } from '../lib/grid.js'

let uid = 0
const newId = () => `blk_${Date.now().toString(36)}_${(uid++).toString(36)}`

const initialState = {
  version: 1,
  page: { size: 'A4', sides: 1, grid: GRID, density: 1 },
  blocks: [],
  selectedId: null,
}

let state = initialState
const listeners = new Set()

function emit() {
  for (const l of listeners) l()
}
function set(next) {
  state = next
  emit()
}

export const canvasStore = {
  getState: () => state,
  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },

  // hydrate from persistence (only doc fields; never trust selection)
  hydrate(doc) {
    if (!doc || typeof doc !== 'object' || !Array.isArray(doc.blocks)) return false
    set({
      ...initialState,
      version: doc.version || 1,
      page: { ...initialState.page, ...(doc.page || {}) },
      blocks: doc.blocks.map((b) => ({ ...b })),
      selectedId: null,
    })
    return true
  },

  // serializable document (what we persist)
  toJSON() {
    const { version, page, blocks } = state
    return { version, page, blocks }
  },

  topZ() {
    return state.blocks.reduce((m, b) => Math.max(m, b.z || 0), 0)
  },

  addFormula(formula, pos) {
    const z = this.topZ() + 1
    const slot = pos || nextFreeSlot(state.blocks)
    const block = {
      id: newId(),
      type: 'formula',
      ref: formula.id,
      latex: formula.latex, // denormalized copy — survives library changes
      label: formula.label,
      color: formula.color || null,
      text: null,
      x: snap(slot.x),
      y: snap(slot.y),
      w: 180,
      h: 46,
      scale: 1,
      z,
    }
    set({ ...state, blocks: [...state.blocks, block], selectedId: block.id })
    return block.id
  },

  addBlock(type, pos) {
    const z = this.topZ() + 1
    const slot = pos || nextFreeSlot(state.blocks)
    const block = {
      id: newId(),
      type, // 'text' | 'header'
      ref: null,
      latex: null,
      label: null,
      text: type === 'header' ? '' : '',
      x: snap(slot.x),
      y: snap(slot.y),
      w: type === 'header' ? 260 : 200,
      h: type === 'header' ? 34 : 40,
      scale: 1,
      z,
    }
    set({ ...state, blocks: [...state.blocks, block], selectedId: block.id })
    return block.id
  },

  moveBlock(id, x, y, doSnap = true) {
    const blocks = state.blocks.map((b) => {
      if (b.id !== id) return b
      const nx = doSnap ? snap(x) : Math.round(x)
      const ny = doSnap ? snap(y) : Math.round(y)
      const c = clampToPage(nx, ny, b.w, b.h)
      return { ...b, x: c.x, y: c.y }
    })
    set({ ...state, blocks })
  },

  resizeBlock(id, w, h) {
    const blocks = state.blocks.map((b) =>
      b.id === id
        ? { ...b, w: Math.max(48, Math.round(w)), h: Math.max(26, Math.round(h)) }
        : b
    )
    set({ ...state, blocks })
  },

  setText(id, text) {
    const blocks = state.blocks.map((b) => (b.id === id ? { ...b, text } : b))
    set({ ...state, blocks })
  },

  setScaleAbsolute(id, scale) {
    const s = Math.min(2.4, Math.max(0.55, +scale.toFixed(2)))
    const blocks = state.blocks.map((b) => (b.id === id ? { ...b, scale: s } : b))
    set({ ...state, blocks })
  },

  bumpScale(id, delta) {
    const blocks = state.blocks.map((b) =>
      b.id === id
        ? { ...b, scale: Math.min(2.4, Math.max(0.55, +(b.scale + delta).toFixed(2))) }
        : b
    )
    set({ ...state, blocks })
  },

  bringToFront(id) {
    const z = this.topZ() + 1
    const blocks = state.blocks.map((b) => (b.id === id ? { ...b, z } : b))
    set({ ...state, blocks })
  },

  removeBlock(id) {
    set({
      ...state,
      blocks: state.blocks.filter((b) => b.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })
  },

  select(id) {
    if (state.selectedId === id) return
    set({ ...state, selectedId: id })
  },

  setDensity(d) {
    set({ ...state, page: { ...state.page, density: d } })
  },

  clearCanvas() {
    set({ ...initialState, blocks: [], selectedId: null, page: { ...state.page, density: 1 } })
  },
}

export default canvasStore
