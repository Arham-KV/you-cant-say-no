const LOCALE = 'en-US'
const pad = (n) => String(n).padStart(2, '0')

export const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
export const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
export const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

export const toISODate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export function fromISODate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const daysFromToday = (iso) =>
  Math.round((fromISODate(iso) - startOfDay(new Date())) / 86400000)

export function formatLongDate(iso) {
  if (!iso) return 'soon'
  const d = fromISODate(iso)
  const sameYear = d.getFullYear() === new Date().getFullYear()
  return d.toLocaleDateString(LOCALE, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  })
}

export function formatShortDate(iso) {
  if (!iso) return 'soon'
  return fromISODate(iso).toLocaleDateString(LOCALE, { weekday: 'short', month: 'short', day: 'numeric' })
}

export const formatMonth = (y, m) =>
  new Date(y, m, 1).toLocaleDateString(LOCALE, { month: 'long', year: 'numeric' })

export const minutesOf = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** "19:00" → "7:00 PM" */
export function formatTime(hhmm) {
  if (!hhmm) return 'whenever you want'
  const [h, m] = hhmm.split(':').map(Number)
  return new Date(2000, 0, 1, h, m).toLocaleTimeString(LOCALE, { hour: 'numeric', minute: '2-digit' })
}

/** "19:00" → "7 PM", "13:30" → "1:30 PM" (for compact chips) */
export function formatTimeCompact(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 === 0 ? 12 : h % 12
  return m ? `${hour}:${pad(m)} ${suffix}` : `${hour} ${suffix}`
}

/** "19:00" → "7", "13:30" → "1:30" (for "be ready by 7") */
export function formatTimeCasual(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  const hour = h % 12 === 0 ? 12 : h % 12
  return m ? `${hour}:${pad(m)}` : `${hour}`
}

export function timeMood(hhmm) {
  const h = Number(hhmm.split(':')[0])
  if (h < 12) return { emoji: '☀️', word: 'morning' }
  if (h < 16) return { emoji: '🌤️', word: 'daytime' }
  if (h < 19) return { emoji: '🌇', word: 'golden hour' }
  return { emoji: '🌙', word: 'night' }
}

/** "today" / "tomorrow" / "this Saturday" / "next Saturday" / null */
export function relativeDay(iso) {
  if (!iso) return null
  const diff = daysFromToday(iso)
  const weekday = fromISODate(iso).toLocaleDateString(LOCALE, { weekday: 'long' })
  if (diff === 0) return 'today'
  if (diff === 1) return 'tomorrow'
  if (diff > 1 && diff < 7) return `this ${weekday}`
  if (diff >= 7 && diff < 14) return `next ${weekday}`
  return null
}

export function dayReaction(iso) {
  const diff = daysFromToday(iso)
  const day = fromISODate(iso).getDay()
  const weekday = fromISODate(iso).toLocaleDateString(LOCALE, { weekday: 'long' }).toLowerCase()
  if (diff === 0) return 'today?? someone’s excited 😳'
  if (diff === 1) return 'tomorrow! no time to overthink it 🫶'
  if (diff > 45) return 'that’s… far away. but I’ll wait 🥲'
  if (day === 5) return 'a friday date? very main character 💅'
  if (day === 6) return 'saturday it is ✨ clearing my whole schedule'
  if (day === 0) return 'a sunday date. soft and cozy, I like it ☁️'
  return `a ${weekday} date? spontaneous. I love that 😌`
}

/** Builds a .ics calendar file for the date (local "floating" time). */
export function buildICS({ date, time, title, description }) {
  const [y, mo, d] = date.split('-').map(Number)
  const [h, mi] = time.split(':').map(Number)
  const start = new Date(y, mo - 1, d, h, mi)
  const end = new Date(y, mo - 1, d, h + 3, mi)
  const fmt = (dt) =>
    `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`
  const esc = (s) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//a-very-important-question//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}-${Math.random().toString(36).slice(2)}@date-invite`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${esc(title)}`,
    `DESCRIPTION:${esc(description)}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${esc(title)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}
