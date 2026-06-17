import { useEffect, useState } from 'react'

// phone < 640 · tablet 640–1024 · laptop > 1024
function classify(w) {
  if (w < 640) return 'phone'
  if (w <= 1024) return 'tablet'
  return 'laptop'
}

export function useViewport() {
  const [vp, setVp] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    device: typeof window !== 'undefined' ? classify(window.innerWidth) : 'laptop',
  }))
  useEffect(() => {
    let raf = 0
    const onResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() =>
        setVp({ width: window.innerWidth, device: classify(window.innerWidth) })
      )
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
    }
  }, [])
  return vp
}

export default useViewport
