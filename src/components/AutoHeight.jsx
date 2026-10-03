import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * Smoothly animates its height to fit its content, so the card "morphs"
 * between chapters instead of jumping.
 */
export default function AutoHeight({ children, className = '' }) {
  const inner = useRef(null)
  const [height, setHeight] = useState('auto')
  const reduce = useReducedMotion()

  useLayoutEffect(() => {
    const el = inner.current
    if (!el) return
    const measure = () => setHeight(el.offsetHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <motion.div
      className={className}
      style={{ overflow: 'hidden' }}
      initial={false}
      animate={{ height }}
      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 210, damping: 30, mass: 0.9 }}
    >
      <div ref={inner}>{children}</div>
    </motion.div>
  )
}
