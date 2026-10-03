import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Item, Screen, useScreenFocus } from '../components/Motion'
import { PrimaryButton, QuietLink } from '../components/Buttons'
import { HeartShape } from '../components/Shapes'
import { findFood } from '../config'
import { formatLongDate, formatTimeCasual, relativeDay } from '../lib/dates'

/** Hearts rising inside the card, just for this chapter. */
function RisingHearts() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        left: `${6 + i * 11 + (i % 2 ? 3 : -2)}%`,
        size: 10 + (i % 3) * 5,
        delay: i * 0.55,
        dur: 4.5 + (i % 4) * 0.8,
        color: ['#F3B6CE', '#D94C91', '#F8D9E5'][i % 3],
      })),
    [],
  )
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {hearts.map((h, i) => (
        <motion.span
          key={i}
          className="absolute bottom-0"
          style={{ left: h.left, width: h.size, height: h.size }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: [20, -380], opacity: [0, 0.8, 0], x: [0, i % 2 ? 14 : -14, 0] }}
          transition={{ duration: h.dur, delay: h.delay, repeat: Infinity, ease: 'easeOut' }}
        >
          <HeartShape className="h-full w-full" fill={h.color} />
        </motion.span>
      ))}
    </div>
  )
}

/** Chapter five: everything she picked, read back like a sweet note. */
export default function ConfirmationScreen({ date, time, food, onAccept, onEdit }) {
  const headingRef = useScreenFocus()
  const foodItem = findFood(food)
  const relative = relativeDay(date)

  return (
    <Screen className="relative flex flex-col items-center text-center">
      <RisingHearts />

      <Item
        as="h1"
        ref={headingRef}
        tabIndex={-1}
        className="relative font-serif text-[clamp(2rem,8vw,2.5rem)] font-semibold italic leading-[1.08] text-burgundy"
      >
        glad you didn't say no. <span className="not-italic" aria-hidden="true">❤️</span>
      </Item>

      <Item className="relative mt-6 w-full">
        <div className="relative rotate-[-1deg] rounded-[22px] bg-white px-5 pb-6 pt-5 text-left shadow-[0_18px_34px_-22px_rgb(99_36_61/0.6)] ring-1 ring-burgundy/6 sm:px-6">
          <div className="relative">
            <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-rose">so it's official</p>
            <p className="mt-1 font-serif text-[clamp(1.45rem,6vw,1.75rem)] font-semibold leading-tight text-burgundy">
              {formatLongDate(date)}
            </p>
            {relative && <p className="font-hand text-[20px] text-rose-deep">(that's {relative}!)</p>}

            <ul className="mt-4 space-y-3 text-[17px] font-semibold text-ink">
              <li className="flex gap-3">
                <span aria-hidden="true">⏰</span>
                <span>Be ready by {formatTimeCasual(time)}, I'm coming to get you 🚗</span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true">🍽️</span>
                <span>
                  Looks like we're having {foodItem ? `${foodItem.label.toLowerCase()} ${foodItem.emoji}` : 'something yummy'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Item>

      <Item className="relative mt-6 max-w-[30ch] rotate-[1.5deg]">
        <p className="font-hand text-[23px] leading-[1.15] text-ink-soft">
          P.S. Normal people text.
          <br />
          I made you a whole website instead.
          <br />
          No big deal. 😌
        </p>
      </Item>

      <Item className="relative mt-7 flex flex-col items-center gap-3">
        <PrimaryButton onClick={onAccept} pulse>
          okay, I accept <span aria-hidden="true">🥰</span>
        </PrimaryButton>
        <QuietLink onClick={onEdit}>wait, let me change something</QuietLink>
      </Item>
    </Screen>
  )
}
