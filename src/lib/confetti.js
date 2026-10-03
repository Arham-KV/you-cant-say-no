import confetti from 'canvas-confetti'

const COLORS = ['#D94C91', '#F3B6CE', '#F8D9E5', '#63243D', '#E9B872', '#FFFFFF']
const HEART_PATH =
  'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z'

let heart = null
const heartShape = () => {
  if (!heart) {
    try {
      heart = confetti.shapeFromPath({ path: HEART_PATH })
    } catch {
      heart = 'circle'
    }
  }
  return heart
}

const emojiShapes = new Map()
const emojiShape = (emoji) => {
  if (!emojiShapes.has(emoji)) {
    try {
      emojiShapes.set(emoji, confetti.shapeFromText({ text: emoji, scalar: 2.2 }))
    } catch {
      emojiShapes.set(emoji, null)
    }
  }
  return emojiShapes.get(emoji)
}

const base = { disableForReducedMotion: true, zIndex: 80, colors: COLORS }

/** Origin is in viewport pixels; converts to the 0–1 range canvas-confetti expects. */
const toOrigin = (x, y) => ({
  x: Math.min(Math.max(x / window.innerWidth, 0), 1),
  y: Math.min(Math.max(y / window.innerHeight, 0), 1),
})

export function heartPop(x, y, { power = 1 } = {}) {
  const origin = toOrigin(x, y)
  confetti({ ...base, origin, shapes: [heartShape()], particleCount: Math.round(46 * power), spread: 85, startVelocity: 34 * power, scalar: 1.5, gravity: 0.85, ticks: 230 })
  confetti({ ...base, origin, particleCount: Math.round(36 * power), spread: 120, startVelocity: 26 * power, scalar: 0.85, ticks: 200 })
}

export function emojiPop(emoji, x, y) {
  const shape = emojiShape(emoji)
  if (!shape) return heartPop(x, y, { power: 0.5 })
  confetti({ ...base, origin: toOrigin(x, y), shapes: [shape], scalar: 2.2, particleCount: 10, spread: 75, startVelocity: 20, gravity: 0.75, ticks: 140, flat: true })
}

/** Two side cannons + a heart shower. Used for the grand finale. */
export function finale() {
  const shapes = [heartShape(), 'circle']
  const end = Date.now() + 1600
  const frame = () => {
    confetti({ ...base, shapes, particleCount: 4, angle: 60, spread: 60, startVelocity: 55, origin: { x: 0, y: 0.75 }, scalar: 1.2 })
    confetti({ ...base, shapes, particleCount: 4, angle: 120, spread: 60, startVelocity: 55, origin: { x: 1, y: 0.75 }, scalar: 1.2 })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
  setTimeout(() => {
    confetti({ ...base, shapes: [heartShape()], particleCount: 60, spread: 160, startVelocity: 30, origin: { x: 0.5, y: 0.3 }, scalar: 1.6, gravity: 0.6, ticks: 300 })
  }, 500)
}
