const mq = (query) => {
  try {
    return window.matchMedia(query).matches
  } catch {
    return false
  }
}

export const canHover = () => mq('(hover: hover) and (pointer: fine)')
export const isCoarse = () => mq('(pointer: coarse)')
export const prefersReducedMotion = () => mq('(prefers-reduced-motion: reduce)')

/** True when the page runs inside an iframe (e.g. a preview), where downloads/share are blocked. */
export const isEmbedded = (() => {
  try {
    return window.self !== window.top
  } catch {
    return true
  }
})()

export function vibrate(pattern) {
  try {
    navigator.vibrate?.(pattern)
  } catch {
    /* not supported — that's fine */
  }
}

// Focus management between screens: focus the new heading only after the
// first navigation (never steal focus on initial page load).
let hasNavigated = false
export const markNavigated = () => {
  hasNavigated = true
}
export const shouldMoveFocus = () => hasNavigated
