import { buildICS } from './dates'

/** Saves an .ics file so she can add the date to her calendar. */
export function downloadCalendar(details) {
  const url = URL.createObjectURL(new Blob([buildICS(details)], { type: 'text/calendar;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'our-date.ics'
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}
