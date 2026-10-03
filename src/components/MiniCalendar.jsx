import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { addDays, formatMonth, fromISODate, isSameDay, startOfDay, toISODate } from '../lib/dates'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function monthCells(y, m) {
  const first = new Date(y, m, 1)
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const cells = Array.from({ length: first.getDay() }, () => null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(y, m, d))
  return cells
}

/**
 * A small, fully keyboard-accessible calendar.
 * Arrow keys move by day/week, Home/End jump within the week, PageUp/PageDown change month.
 */
export default function MiniCalendar({ value, onChange, maxDaysAhead = 180, labelledBy }) {
  const today = useMemo(() => startOfDay(new Date()), [])
  const max = useMemo(() => addDays(today, maxDaysAhead), [today, maxDaysAhead])
  const selected = value ? fromISODate(value) : null

  const [view, setView] = useState(() => {
    const d = selected ?? today
    return { y: d.getFullYear(), m: d.getMonth() }
  })
  const [dir, setDir] = useState(0)
  const [focusDate, setFocusDate] = useState(() => selected ?? today)
  const keyboardMove = useRef(false)
  const dayRefs = useRef(new Map())

  const cells = useMemo(() => monthCells(view.y, view.m), [view])
  const viewIndex = view.y * 12 + view.m
  const canPrev = viewIndex > today.getFullYear() * 12 + today.getMonth()
  const canNext = viewIndex < max.getFullYear() * 12 + max.getMonth()

  const isDisabled = (d) => d < today || d > max
  const inView = (d) => d.getFullYear() === view.y && d.getMonth() === view.m

  // Which day gets tabIndex=0 (roving focus).
  const tabbable = useMemo(() => {
    if (inView(focusDate) && !isDisabled(focusDate)) return toISODate(focusDate)
    if (selected && inView(selected)) return toISODate(selected)
    const first = cells.find((d) => d && !isDisabled(d))
    return first ? toISODate(first) : null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cells, focusDate, value])

  useEffect(() => {
    if (!keyboardMove.current) return
    keyboardMove.current = false
    dayRefs.current.get(toISODate(focusDate))?.focus()
  }, [focusDate, view])

  const changeMonth = (delta) => {
    setDir(delta)
    setView((v) => {
      const d = new Date(v.y, v.m + delta, 1)
      return { y: d.getFullYear(), m: d.getMonth() }
    })
  }

  const onKeyDown = (e) => {
    const steps = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
    let next
    if (e.key in steps) next = addDays(focusDate, steps[e.key])
    else if (e.key === 'Home') next = addDays(focusDate, -focusDate.getDay())
    else if (e.key === 'End') next = addDays(focusDate, 6 - focusDate.getDay())
    else if (e.key === 'PageUp' || e.key === 'PageDown') {
      const delta = e.key === 'PageUp' ? -1 : 1
      const target = new Date(focusDate.getFullYear(), focusDate.getMonth() + delta, 1)
      const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate()
      next = new Date(target.getFullYear(), target.getMonth(), Math.min(focusDate.getDate(), lastDay))
    } else return
    e.preventDefault()
    if (next < today) next = today
    if (next > max) next = max
    keyboardMove.current = true
    if (!inView(next)) {
      setDir(next > focusDate ? 1 : -1)
      setView({ y: next.getFullYear(), m: next.getMonth() })
    }
    setFocusDate(next)
  }

  const pick = (d) => {
    setFocusDate(d)
    onChange(toISODate(d))
  }

  return (
    <div className="rounded-[22px] border border-burgundy/8 bg-white p-3 shadow-[0_10px_24px_-18px_rgb(99_36_61/0.5)] sm:p-4">
      <div className="mb-2 flex items-center justify-between px-1">
        <motion.button
          type="button"
          onClick={() => changeMonth(-1)}
          disabled={!canPrev}
          whileTap={{ scale: 0.88 }}
          aria-label="Previous month"
          className="grid h-10 w-10 place-items-center rounded-full text-burgundy transition-colors hover:bg-mist disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.6} aria-hidden="true" />
        </motion.button>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={viewIndex}
            className="font-serif text-[19px] font-semibold text-burgundy"
            initial={{ opacity: 0, y: dir >= 0 ? 6 : -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: dir >= 0 ? -6 : 6 }}
            transition={{ duration: 0.18 }}
            aria-live="polite"
          >
            {formatMonth(view.y, view.m)}
          </motion.p>
        </AnimatePresence>
        <motion.button
          type="button"
          onClick={() => changeMonth(1)}
          disabled={!canNext}
          whileTap={{ scale: 0.88 }}
          aria-label="Next month"
          className="grid h-10 w-10 place-items-center rounded-full text-burgundy transition-colors hover:bg-mist disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:bg-transparent"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={2.6} aria-hidden="true" />
        </motion.button>
      </div>

      <div className="grid grid-cols-7 pb-1 text-center text-[12px] font-extrabold tracking-wide text-ink-soft/70" aria-hidden="true">
        {WEEKDAYS.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false} custom={dir}>
        <motion.div
          key={viewIndex}
          role="group"
          aria-labelledby={labelledBy}
          className="grid grid-cols-7 gap-y-1"
          onKeyDown={onKeyDown}
          initial={{ opacity: 0, x: dir * 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -24 }}
          transition={{ duration: 0.2 }}
        >
          {cells.map((d, i) => {
            if (!d) return <span key={`b${i}`} aria-hidden="true" />
            const iso = toISODate(d)
            const disabled = isDisabled(d)
            const isSel = selected && isSameDay(d, selected)
            const isToday = isSameDay(d, today)
            return (
              <button
                key={iso}
                ref={(el) => (el ? dayRefs.current.set(iso, el) : dayRefs.current.delete(iso))}
                type="button"
                tabIndex={iso === tabbable ? 0 : -1}
                disabled={disabled}
                aria-pressed={Boolean(isSel)}
                aria-current={isToday ? 'date' : undefined}
                aria-label={`${WEEKDAY_NAMES[d.getDay()]}, ${d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}${isToday ? ' (today)' : ''}`}
                onClick={() => pick(d)}
                onFocus={() => !isSameDay(d, focusDate) && setFocusDate(d)}
                className={`cal-day relative mx-auto grid aspect-square w-full max-w-[42px] place-items-center rounded-full text-[15px] font-bold transition-colors ${
                  disabled
                    ? 'cursor-not-allowed text-ink/20'
                    : isSel
                      ? ''
                      : 'text-ink hover:bg-mist'
                }`}
              >
                {isSel && (
                  <motion.span
                    layoutId="calendar-selected"
                    className="absolute inset-[2px] rounded-full bg-gradient-to-br from-[#E35EA1] to-[#B8306F] shadow-[0_6px_14px_-6px_rgb(185_48_111/0.8)]"
                    transition={{ type: 'spring', stiffness: 520, damping: 34 }}
                  />
                )}
                <span className="relative">{d.getDate()}</span>
                {isToday && !isSel && <span className="absolute bottom-[5px] h-1 w-1 rounded-full bg-rose" aria-hidden="true" />}
              </button>
            )
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
