import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'framer-motion'
import { pickTaunt } from '../lib/taunts'
import { canHover } from '../lib/env'

const EDGE = 16 // keep this far from the screen edges
const BUBBLE_SPACE = 64 // room above the button for its speech bubble
const NEAR = 38 // mouse distance (px) that makes it run on desktop

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)

/** The visible part of the screen, in the same coordinates `position: fixed` uses. */
function viewport() {
  const vv = window.visualViewport
  return vv
    ? { x: vv.offsetLeft, y: vv.offsetTop, w: vv.width, h: vv.height }
    : { x: 0, y: 0, w: window.innerWidth, h: window.innerHeight }
}

const overlaps = (a, b, pad) =>
  a.left < b.right + pad && a.right > b.left - pad && a.top < b.bottom + pad && a.bottom > b.top - pad

/** Picks a random spot on screen: away from the pointer, away from where it was, never on the YES button. */
function pickSpot({ w, h, from, pointer, avoid }) {
  const vp = viewport()
  const minX = vp.x + EDGE
  const maxX = Math.max(minX, vp.x + vp.w - w - EDGE)
  const minY = vp.y + BUBBLE_SPACE
  const maxY = Math.max(minY, vp.y + vp.h - h - EDGE)
  let best = null
  let bestScore = -Infinity
  for (let i = 0; i < 80; i++) {
    const x = minX + Math.random() * (maxX - minX)
    const y = minY + Math.random() * (maxY - minY)
    const cx = x + w / 2
    // footprint includes the speech bubble that appears above the button
    const rect = { left: Math.min(x, cx - 100), top: y - BUBBLE_SPACE + 8, right: Math.max(x + w, cx + 100), bottom: y + h }
    const cy = y + h / 2
    let score = Math.random() * 60
    if (avoid.some((r) => overlaps(rect, r, 18))) score -= 10000
    if (pointer) {
      const d = Math.hypot(cx - pointer.x, cy - pointer.y)
      score += Math.min(d, 420)
      if (d < 150) score -= 2000
    }
    if (from) {
      const d = Math.hypot(cx - from.x, cy - from.y)
      if (d < 110) score -= 1500
      score += Math.min(d, 300) * 0.3
    }
    if (score > bestScore) {
      bestScore = score
      best = { x, y }
    }
  }
  return best
}

function bubbleAlign(x, w) {
  const vp = viewport()
  const center = x + w / 2
  if (center - 105 < vp.x + 8) return 'left'
  if (center + 105 > vp.x + vp.w - 8) return 'right'
  return 'center'
}

/**
 * The NO button that refuses to be pressed. It sits next to YES until the
 * first attempt, then jumps to random safe spots on screen (portaled to
 * <body> with fixed positioning, so it can never leave the visible area).
 *
 * - Mouse: it runs when the cursor gets close.
 * - Touch: it runs on touch-down, before a tap can land.
 * - Keyboard: Enter/Space make it run too (and focus follows it).
 */
export default function RunawayButton({ attempts, onAttempt, avoidRef, hidden = false, label = 'NO 🙈' }) {
  const reduce = useReducedMotion()
  const isPresent = useIsPresent()
  const inflowRef = useRef(null)
  const floatRef = useRef(null)
  const size = useRef({ w: 116, h: 54 })
  const lastEscape = useRef(0)
  const lastPointerEscape = useRef(0)
  const refocus = useRef(false)
  const used = useRef([])
  const attemptsRef = useRef(attempts)
  attemptsRef.current = attempts

  const [spot, setSpot] = useState(null) // { from, x, y, rot, scale }
  const [bubble, setBubble] = useState(null) // { id, text, align }

  const escape = useCallback(
    (pointer, viaPointer = false) => {
      const now = performance.now()
      if (now - lastEscape.current < 260) return
      lastEscape.current = now
      if (viaPointer) lastPointerEscape.current = now

      const el = floatRef.current || inflowRef.current
      if (!el) return
      if (!floatRef.current) size.current = { w: el.offsetWidth, h: el.offsetHeight }
      const r = el.getBoundingClientRect()
      const { w, h } = size.current

      const avoid = []
      const yes = avoidRef?.current?.getBoundingClientRect()
      if (yes) avoid.push(yes)
      document.querySelectorAll('[data-avoid-runaway]').forEach((n) => avoid.push(n.getBoundingClientRect()))

      const next = pickSpot({ w, h, from: { x: r.left + r.width / 2, y: r.top + r.height / 2 }, pointer, avoid })
      const n = attemptsRef.current + 1

      refocus.current = document.activeElement === el
      setSpot((prev) => ({
        from: prev?.from ?? { x: r.left, y: r.top },
        x: next.x,
        y: next.y,
        rot: Math.random() * 28 - 14,
        scale: Math.max(0.72, 1 - n * 0.028),
      }))
      setBubble({ id: n, text: pickTaunt(n, used.current), align: bubbleAlign(next.x, w) })
      onAttempt?.(n)
    },
    [avoidRef, onAttempt],
  )

  // Desktop: flee when the mouse gets close.
  useEffect(() => {
    if (hidden || !canHover()) return
    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return
      const el = floatRef.current || inflowRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right)
      const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom)
      if (Math.hypot(dx, dy) < NEAR) escape({ x: e.clientX, y: e.clientY }, true)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [escape, hidden])

  // Keep it on screen if the window is resized / rotated / keyboard opens.
  useEffect(() => {
    if (!spot) return
    const onResize = () =>
      setSpot((s) => {
        if (!s) return s
        const vp = viewport()
        const { w, h } = size.current
        return {
          ...s,
          x: clamp(s.x, vp.x + EDGE, Math.max(vp.x + EDGE, vp.x + vp.w - w - EDGE)),
          y: clamp(s.y, vp.y + BUBBLE_SPACE, Math.max(vp.y + BUBBLE_SPACE, vp.y + vp.h - h - EDGE)),
        }
      })
    window.addEventListener('resize', onResize)
    window.visualViewport?.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.visualViewport?.removeEventListener('resize', onResize)
    }
  }, [spot])

  // Speech bubble disappears after a moment.
  useEffect(() => {
    if (!bubble) return
    const t = setTimeout(() => setBubble(null), 1700)
    return () => clearTimeout(t)
  }, [bubble])

  // If it was focused with the keyboard, keep focus on it after it jumps.
  useEffect(() => {
    if (spot && refocus.current && floatRef.current && document.activeElement !== floatRef.current) {
      floatRef.current.focus({ preventScroll: true })
    }
    refocus.current = false
  }, [spot])

  const onPointerDown = (e) => escape({ x: e.clientX, y: e.clientY }, true)
  const onClick = (e) => {
    // Pointer clicks were already handled on pointer-down; this is for keyboard (detail === 0).
    if (e.detail > 0 && performance.now() - lastPointerEscape.current < 1200) return
    const r = (floatRef.current || inflowRef.current)?.getBoundingClientRect()
    escape(r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null)
  }

  const buttonClass = 'btn-soft h-[54px] px-7 text-[17px]'
  const showFloating = Boolean(spot) && !hidden && isPresent

  return (
    <>
      {!spot && (
        <motion.button
          ref={inflowRef}
          type="button"
          className={buttonClass}
          onPointerDown={onPointerDown}
          onClick={onClick}
          aria-label="No"
          disabled={hidden}
          animate={hidden ? { opacity: 0, scale: 0.6 } : { opacity: 1, scale: 1 }}
        >
          {label}
        </motion.button>
      )}

      <span className="sr-only" aria-live="polite">
        {bubble?.text}
      </span>

      {createPortal(
        <AnimatePresence>
          {showFloating && (
            <motion.div
              key="runaway"
              className="fixed left-0 top-0 z-[60]"
              initial={{ x: spot.from.x, y: spot.from.y, opacity: 1 }}
              animate={{ x: spot.x, y: spot.y, opacity: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.22 } }}
              transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 430, damping: 27, mass: 0.8 }}
            >
              <AnimatePresence>
                {bubble && (
                  <motion.div
                    key={bubble.id}
                    className={`taunt taunt-${bubble.align}`}
                    style={{ x: bubble.align === 'center' ? '-50%' : 0 }}
                    initial={{ opacity: 0, y: 8, scale: 0.7 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.9, transition: { duration: 0.18 } }}
                    transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                    aria-hidden="true"
                  >
                    {bubble.text}
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.button
                ref={floatRef}
                type="button"
                className={buttonClass}
                onPointerDown={onPointerDown}
                onClick={onClick}
                aria-label="No"
                initial={{ rotate: 0, scale: 1 }}
                animate={{ rotate: spot.rot, scale: spot.scale }}
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 12 }}
              >
                {label}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}
