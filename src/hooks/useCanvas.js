import { useSyncExternalStore } from 'react'
import canvasStore from '../stores/canvasStore.js'

// Subscribe a component to the whole canvas state.
export function useCanvas() {
  return useSyncExternalStore(canvasStore.subscribe, canvasStore.getState)
}

export default useCanvas
