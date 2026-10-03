import { dateConfig } from './dateConfig'

// Resolves the user-editable config into what the app actually uses
// (URL overrides, placeholder detection, asset paths).

const clean = (value, max = 40) => (typeof value === 'string' ? value.trim().slice(0, max) : '')

function readParams() {
  try {
    const params = new URLSearchParams(window.location.search)
    return { to: clean(params.get('to') || ''), from: clean(params.get('from') || '') }
  } catch {
    return { to: '', from: '' }
  }
}

const params = readParams()
const her = params.to || clean(dateConfig.girlfriendName)
const me = params.from || clean(dateConfig.senderName)

const isPlaceholder = (value, placeholder) => !value || value.toLowerCase() === placeholder

export function asset(path) {
  if (!path) return null
  if (/^(https?:|data:|blob:|\/)/.test(path)) return path
  return `${import.meta.env.BASE_URL}${path.replace(/^\.?\//, '')}`
}

export const config = {
  ...dateConfig,
  herName: isPlaceholder(her, 'her name') ? '' : her,
  myName: isPlaceholder(me, 'your name') ? '' : me,
}

export const herName = (fallback = 'you') => config.herName || fallback

export const findFood = (id) => config.foods.find((f) => f.id === id) || null
