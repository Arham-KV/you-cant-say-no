import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from 'framer-motion'
import { Item, Screen, useScreenFocus } from '../components/Motion'
import { PrimaryButton } from '../components/Buttons'
import MiniCalendar from '../components/MiniCalendar'
import { heartPop } from '../lib/confetti'
import { config } from '../config'
import { dayReaction, daysFromToday, formatTimeCompact, minutesOf, timeMood } from '../lib/dates'

const SHAKE = { x: [0, -9, 9, -6, 6, -3, 0], transition: { duration: 0.45 } }

/** Chapter three: pick a day and a time. */
export default function DateTimeScreen({ date, time, onChange, onNext }) {
  const headingRef = useScreenFocus()
  const reduce = useReducedMotion()
  const calendarShake = useAnimationControls()
  const timeShake = useAnimationControls()
  const buttonRef = useRef(null)
  const [error, setError] = useState('')
  const [leaving, setLeaving] = useState(false)

  const isToday = date && daysFromToday(date) === 0
  const slots = useMemo(() => {
    const now = new Date()
    const nowMinutes = now.getHours() * 60 + now.getMinutes()
    return config.timeSlots.map((t) => ({ value: t, disabled: Boolean(isToday) && minutesOf(t) < nowMinutes + 30 }))
  }, [isToday])

  // If she switches to today and the chosen time already passed, clear it.
  useEffect(() => {
    if (time && slots.find((s) => s.value === time)?.disabled) onChange({ time: null })
  }, [slots, time, onChange])

  useEffect(() => {
    if (error && date && time) setError('')
  }, [date, time, error])

  const allTodayPassed = isToday && slots.every((s) => s.disabled)
  const valid = Boolean(date && time)

  const submit = () => {
    if (leaving) return
    if (!date) {
      setError('pick a day first, silly 🙈')
      calendarShake.start(SHAKE)
      return
    }
    if (!time) {
      setError('and a time! I need to know when to show up 😅')
      timeShake.start(SHAKE)
      return
    }
    setLeaving(true)
    const r = buttonRef.current?.getBoundingClientRect()
    if (r) heartPop(r.left + r.width / 2, r.top + r.height / 2, { power: 0.6 })
    setTimeout(onNext, reduce ? 200 : 450)
  }

  return (
    <Screen className="flex flex-col text-center">
      <Item
        as="h1"
        ref={headingRef}
        tabIndex={-1}
        className="font-serif text-[clamp(1.95rem,7.6vw,2.4rem)] font-semibold leading-[1.08] text-burgundy"
      >
        So... when are you free? <span aria-hidden="true">🥹</span>
      </Item>
      <Item as="p" className="mx-auto mt-2 max-w-[32ch] text-[17px] text-ink-soft">
        Pick a day. I'll handle the important stuff. <span aria-hidden="true">❤️</span>
      </Item>

      <Item className="mt-6 text-left">
        <h2 id="pick-day" className="mb-2.5 pl-1 text-[15px] font-extrabold text-burgundy">
          Pick a Day <span aria-hidden="true">📅</span>
        </h2>
        <motion.div animate={calendarShake}>
          <MiniCalendar
            value={date}
            onChange={(iso) => onChange({ date: iso })}
            maxDaysAhead={config.maxDaysAhead}
            labelledBy="pick-day"
          />
        </motion.div>
        <div className="min-h-[34px] pt-2 text-center">
          <AnimatePresence mode="wait" initial={false}>
            {date && (
              <motion.p
                key={date}
                className="font-hand text-[21px] text-rose-deep"
                initial={{ opacity: 0, y: 6, rotate: -1 }}
                animate={{ opacity: 1, y: 0, rotate: -1 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                aria-live="polite"
              >
                {dayReaction(date)}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </Item>

      <Item className="mt-2 text-left">
        <fieldset>
          <legend className="mb-2.5 pl-1 text-[15px] font-extrabold text-burgundy">
            What Time? <span aria-hidden="true">⏰</span>
          </legend>
          <motion.div animate={timeShake} className="grid grid-cols-4 gap-2">
            {slots.map(({ value, disabled }) => {
              const mood = timeMood(value)
              return (
                <label key={value} className={`relative block ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                  <input
                    type="radio"
                    name="date-time"
                    value={value}
                    checked={time === value}
                    disabled={disabled}
                    onChange={() => onChange({ time: value })}
                    className="peer sr-only"
                  />
                  <motion.span
                    whileTap={disabled ? undefined : { scale: 0.93 }}
                    className="flex h-[60px] flex-col items-center justify-center rounded-2xl border-[1.5px] border-burgundy/10 bg-white text-ink shadow-[0_6px_14px_-12px_rgb(99_36_61/0.6)] transition-[border-color,background-color,box-shadow,color] duration-200 hover:border-petal peer-checked:border-rose peer-checked:bg-[#FFF1F7] peer-checked:text-rose-deep peer-checked:shadow-[0_0_0_4px_rgb(217_76_145/0.14),0_10px_20px_-10px_rgb(217_76_145/0.6)] peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-rose peer-disabled:opacity-35 peer-disabled:hover:border-burgundy/10"
                  >
                    <span className="text-[15px] leading-none" aria-hidden="true">
                      {mood.emoji}
                    </span>
                    <span className="mt-1 text-[14px] font-extrabold leading-none tracking-tight">{formatTimeCompact(value)}</span>
                  </motion.span>
                </label>
              )
            })}
          </motion.div>
          {allTodayPassed && (
            <p className="mt-2 text-center text-[14px] text-ink-soft">it's a bit late for today, pick another day? 🌙</p>
          )}
        </fieldset>
      </Item>

      <Item className="mt-6 flex flex-col items-center">
        <div className="min-h-[30px]" aria-live="assertive">
          <AnimatePresence>
            {error && (
              <motion.p
                key={error}
                className="font-hand text-[21px] text-decline"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <PrimaryButton ref={buttonRef} onClick={submit} soft={!valid} pulse={valid} className="mt-1">
          set the date! <span aria-hidden="true">♥</span>
        </PrimaryButton>
      </Item>
    </Screen>
  )
}
