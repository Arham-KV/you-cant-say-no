import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarPlus, Check, Copy, MessageCircleHeart, RotateCcw } from 'lucide-react'
import { Item, Screen, useScreenFocus } from '../components/Motion'
import { PrimaryButton, QuietLink, SoftButton } from '../components/Buttons'
import { HeartShape } from '../components/Shapes'
import { useTilt } from '../components/PhotoPolaroid'
import { useEffects } from '../components/Effects'
import { finale } from '../lib/confetti'
import { isCoarse, isEmbedded } from '../lib/env'
import { formatLongDate, formatShortDate, formatTime } from '../lib/dates'
import { downloadCalendar } from '../lib/calendar'
import { config, findFood, herName } from '../config'

function answerText({ date, time, foodItem }) {
  return [
    'I said YES 🥰',
    `📅 ${formatLongDate(date)}`,
    `⏰ ${formatTime(time)}`,
    `🍽️ ${foodItem ? `${foodItem.label} ${foodItem.emoji}` : 'surprise me'}`,
    `(the ${config.currency}${config.prankPrice} fee got declined btw 😌)`,
  ].join('\n')
}

function Ticket({ date, time, foodItem }) {
  const tilt = useTilt(5)
  return (
    <motion.div className="ticket-wrap" style={tilt.style} onPointerMove={tilt.onPointerMove} onPointerLeave={tilt.onPointerLeave}>
      <div className="ticket relative flex text-left text-white">
        <div className="min-w-0 flex-1 px-5 py-5 sm:px-6">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/80">admit one · {herName()}</p>
          <p className="mt-1 font-serif text-[22px] font-semibold leading-tight">A Very Important Date</p>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">date</dt>
              <dd className="text-[16px] font-extrabold">{formatShortDate(date)}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">time</dt>
              <dd className="text-[16px] font-extrabold">{formatTime(time)}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">your food choice</dt>
              <dd className="text-[16px] font-extrabold">
                {foodItem ? `${foodItem.label} ${foodItem.emoji}` : 'surprise me ✨'}
              </dd>
            </div>
          </dl>
        </div>
        <div className="flex w-[84px] shrink-0 flex-col items-center justify-between border-l-2 border-dashed border-white/45 py-4">
          <HeartShape className="h-6 w-6" fill="#fff" />
          <span className="font-serif text-[13px] font-bold tracking-[0.12em] [writing-mode:vertical-rl]">{config.currency}0 · PAID ♥</span>
          <span className="barcode h-9 w-10 rounded-[2px]" aria-hidden="true" />
        </div>
      </div>
    </motion.div>
  )
}

/** The finale: the date, the time, the food, and the sweetest line. */
export default function FinalScreen({ date, time, food, onReplay }) {
  const headingRef = useScreenFocus()
  const heartRef = useRef(null)
  const { burst } = useEffects()
  const foodItem = findFood(food)
  const text = answerText({ date, time, foodItem })
  const [copyState, setCopyState] = useState('idle') // idle | copied | shared | manual
  const manualRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => {
      finale()
      const r = heartRef.current?.getBoundingClientRect()
      if (r) burst(r.left + r.width / 2, r.top + r.height / 2, { count: 16, spread: 150 })
    }, 350)
    return () => clearTimeout(t)
  }, [burst])

  useEffect(() => {
    if (copyState === 'manual') manualRef.current?.select()
    if (copyState === 'copied' || copyState === 'shared') {
      const t = setTimeout(() => setCopyState('idle'), 2600)
      return () => clearTimeout(t)
    }
  }, [copyState])

  const sendAnswer = async () => {
    if (!isEmbedded && isCoarse() && navigator.share) {
      try {
        await navigator.share({ text })
        setCopyState('shared')
        return
      } catch (err) {
        if (err?.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(text)
      setCopyState('copied')
    } catch {
      setCopyState('manual')
    }
  }

  // Calendar files need a real download, which iframes/previews block.
  const addToCalendar =
    import.meta.env.MODE === 'artifact' || isEmbedded
      ? null
      : () =>
          downloadCalendar({
            date,
            time,
            title: `Date${config.myName ? ` with ${config.myName}` : ''} 💕`,
            description: `Food: ${foodItem ? foodItem.label : 'surprise'}. Price: ${config.currency}0 (transaction declined 😌)`,
          })

  const whatsapp = config.whatsappNumber?.replace(/\D/g, '')

  return (
    <Screen className="flex flex-col items-center text-center">
      <Item className="relative" aria-hidden="true">
        <motion.div
          ref={heartRef}
          animate={{ scale: [1, 1.14, 1, 1.1, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.6, ease: 'easeInOut' }}
        >
          <HeartShape className="h-[62px] w-[62px] drop-shadow-[0_10px_16px_rgb(217_76_145/0.45)]" fill="#D94C91" />
        </motion.div>
      </Item>

      <Item as="p" className="mt-3 font-hand text-[24px] text-rose">
        it's official 💌
      </Item>

      <Item
        as="h1"
        ref={headingRef}
        tabIndex={-1}
        className="mt-1 font-serif text-[clamp(1.9rem,7.8vw,2.45rem)] font-semibold leading-[1.1] text-burgundy"
      >
        See you on <span className="italic text-rose-deep">{formatLongDate(date)}</span>
        <br />
        at <span className="italic text-rose-deep">{formatTime(time)}</span>
      </Item>

      <Item className="mt-6 w-full">
        <Ticket date={date} time={time} foodItem={foodItem} />
      </Item>

      <Item as="p" className="mt-7 font-serif text-[clamp(1.6rem,6.6vw,2rem)] font-medium italic leading-tight text-burgundy">
        {config.finalMessage}
      </Item>
      {config.myName && (
        <Item as="p" className="mt-1 font-hand text-[26px] text-rose-deep">
          — {config.myName}
        </Item>
      )}

      <Item className="mt-7 flex w-full flex-col items-center gap-3">
        {whatsapp ? (
          <motion.a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary btn-pulse h-[54px] px-8 text-[17px]"
          >
            <span className="shine" aria-hidden="true" />
            <span className="relative z-10 inline-flex items-center gap-2">
              <MessageCircleHeart className="h-5 w-5" strokeWidth={2.6} aria-hidden="true" /> text me your answer
            </span>
          </motion.a>
        ) : (
          <PrimaryButton onClick={sendAnswer} pulse>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={copyState === 'copied' || copyState === 'shared' ? 'done' : 'idle'}
                className="inline-flex items-center gap-2"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                {copyState === 'copied' ? (
                  <>
                    <Check className="h-5 w-5" strokeWidth={3} aria-hidden="true" /> copied! send it to me 💌
                  </>
                ) : copyState === 'shared' ? (
                  <>
                    <Check className="h-5 w-5" strokeWidth={3} aria-hidden="true" /> sent 💌
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5" strokeWidth={2.6} aria-hidden="true" /> send me your answer
                  </>
                )}
              </motion.span>
            </AnimatePresence>
          </PrimaryButton>
        )}

        <AnimatePresence>
          {copyState === 'manual' && (
            <motion.div className="w-full" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <label htmlFor="answer-text" className="mb-1.5 block font-hand text-[20px] text-ink-soft">
                copy this & send it to me 💌
              </label>
              <textarea
                id="answer-text"
                ref={manualRef}
                readOnly
                rows={5}
                value={text}
                className="w-full resize-none rounded-2xl border-2 border-petal bg-white p-3 text-left text-[15px] text-ink focus:outline-none focus-visible:border-rose"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {addToCalendar && (
          <SoftButton onClick={addToCalendar}>
            <CalendarPlus className="mr-2 h-5 w-5 text-rose" strokeWidth={2.4} aria-hidden="true" /> add to calendar
          </SoftButton>
        )}

        <p className="mt-2 font-hand text-[20px] text-ink-soft/85">(screenshot this for the group chat 📸)</p>
        <QuietLink onClick={onReplay} className="inline-flex items-center gap-1.5">
          <RotateCcw className="h-4 w-4" strokeWidth={2.6} aria-hidden="true" /> replay the story
        </QuietLink>
      </Item>
    </Screen>
  )
}
