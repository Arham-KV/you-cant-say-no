import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { HeartShape } from './Shapes'

const COLORS = ['#D94C91', '#F3B6CE', '#E77BAE', '#B8306F', '#F8D9E5']

const EffectsContext = createContext({ burst: () => {}, flash: () => {} })
export const useEffects = () => useContext(EffectsContext)

let uid = 0

/**
 * Global effect layer: heart bursts from any point on screen, and a full-screen
 * color flash (used when the fake payment is "declined").
 */
export function EffectsProvider({ children }) {
  const reduce = useReducedMotion()
  const [bursts, setBursts] = useState([])
  const [flashes, setFlashes] = useState([])

  const burst = useCallback(
    (x, y, { count = 14, spread = 140 } = {}) => {
      if (reduce) return
      const id = ++uid
      const parts = Array.from({ length: count }, (_, i) => {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.7
        const dist = spread * (0.5 + Math.random() * 0.6)
        return {
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist - 40,
          size: 12 + Math.random() * 16,
          rot: (Math.random() - 0.5) * 90,
          color: COLORS[i % COLORS.length],
          delay: Math.random() * 0.08,
        }
      })
      setBursts((b) => [...b, { id, x, y, parts }])
      setTimeout(() => setBursts((b) => b.filter((p) => p.id !== id)), 1500)
    },
    [reduce],
  )

  const flash = useCallback((color = 'rgb(194 38 60 / 0.22)') => {
    const id = ++uid
    setFlashes((f) => [...f, { id, color }])
    setTimeout(() => setFlashes((f) => f.filter((p) => p.id !== id)), 50)
  }, [])

  const value = useMemo(() => ({ burst, flash }), [burst, flash])

  return (
    <EffectsContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed inset-0 z-[70]" aria-hidden="true">
          {bursts.map((b) =>
            b.parts.map((p, i) => (
              <motion.span
                key={`${b.id}-${i}`}
                className="absolute"
                style={{ left: b.x - p.size / 2, top: b.y - p.size / 2, width: p.size, height: p.size }}
                initial={{ x: 0, y: 0, scale: 0.2, opacity: 1, rotate: 0 }}
                animate={{ x: p.dx, y: [0, p.dy, p.dy + 50], scale: [0.2, 1.15, 0.9], opacity: [1, 1, 0], rotate: p.rot }}
                transition={{ duration: 1.25, delay: p.delay, ease: [0.2, 0.8, 0.3, 1], times: [0, 0.55, 1] }}
              >
                <HeartShape className="h-full w-full drop-shadow-sm" fill={p.color} />
              </motion.span>
            )),
          )}
          <AnimatePresence>
            {flashes.map((f) => (
              <motion.div
                key={f.id}
                className="absolute inset-0"
                style={{ background: f.color }}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.9 } }}
              />
            ))}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </EffectsContext.Provider>
  )
}
