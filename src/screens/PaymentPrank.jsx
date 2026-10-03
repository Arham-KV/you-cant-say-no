import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from 'framer-motion'
import { ArrowRight, LoaderCircle } from 'lucide-react'
import { Screen, useScreenFocus } from '../components/Motion'
import { PrimaryButton, QuietLink } from '../components/Buttons'
import { useEffects } from '../components/Effects'
import { heartPop } from '../lib/confetti'
import { vibrate } from '../lib/env'
import { config, findFood, herName } from '../config'

// THIS IS A JOKE. Nothing here touches real payments — there are no card
// fields, no payment provider, no network calls. The "pay" button only plays
// an animation and ends with the date being free.

const STATUSES = ['contacting your bank… 🏦', 'checking cuteness levels… dangerously high ✓', 'almost done… 💳']

const TIMING = {
  teaser: 1700,
  processing: 3000,
  declined: 2400,
  forgiven: 4200,
}

function lineItems(price, food, attempts) {
  const date = Math.round(price * 0.84)
  const dinner = Math.round(price * 0.12)
  const fee = price - date - dinner
  return [
    { label: '1× date with me (deluxe)', amount: date },
    { label: `1× ${food ? food.label.toLowerCase() : 'dinner'} for two ${food?.emoji ?? '🍽️'}`, amount: dinner },
    { label: attempts > 0 ? `"almost said no" fee (${attempts}×)` : 'emotional support fee', amount: fee },
  ]
}

/** Chapter six: the comedic twist — a fake $499 "Date Agreement™". */
export default function PaymentPrank({ food, noAttempts, onBack, onDone }) {
  const [stage, setStage] = useState('teaser') // teaser → idle → processing → declined → forgiven
  const [statusIndex, setStatusIndex] = useState(0)
  const headingRef = useScreenFocus()
  const receiptRef = useRef(null)
  const shake = useAnimationControls()
  const reduce = useReducedMotion()
  const { burst, flash } = useEffects()

  const price = config.prankPrice
  const money = (n) => `${config.currency}${n}`
  const foodItem = findFood(food)
  const items = lineItems(price, foodItem, noAttempts)

  // The little timeline that drives the whole bit.
  useEffect(() => {
    // Same pacing with reduced motion: it only removes movement, the joke still needs time to land.
    const scale = 1
    let timer
    if (stage === 'teaser') timer = setTimeout(() => setStage('idle'), TIMING.teaser * scale)
    if (stage === 'processing') {
      setStatusIndex(0)
      const step = (TIMING.processing * scale) / STATUSES.length
      const a = setTimeout(() => setStatusIndex(1), step)
      const b = setTimeout(() => setStatusIndex(2), step * 2)
      timer = setTimeout(() => setStage('declined'), TIMING.processing * scale)
      return () => [a, b, timer].forEach(clearTimeout)
    }
    if (stage === 'declined') {
      // make sure the big reveal is on screen (she may have scrolled down to the pay button)
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
      shake.start({ x: [0, -14, 14, -10, 10, -5, 5, 0], rotate: [0, -1.5, 1.5, -1, 1, 0], transition: { duration: 0.6 } })
      flash()
      vibrate([90, 50, 90])
      timer = setTimeout(() => setStage('forgiven'), TIMING.declined * scale)
    }
    if (stage === 'forgiven') {
      const r = receiptRef.current?.getBoundingClientRect()
      if (r) {
        burst(r.left + r.width / 2, r.top + r.height / 2, { count: 18, spread: 170 })
        heartPop(r.left + r.width / 2, r.top + r.height * 0.4, { power: 0.9 })
      }
      timer = setTimeout(onDone, TIMING.forgiven * scale)
    }
    return () => clearTimeout(timer)
  }, [stage, reduce, shake, flash, burst, onDone])

  const headline =
    stage === 'declined' ? 'declined' : stage === 'forgiven' ? 'forgiven' : 'fee'

  return (
    <Screen className="flex flex-col items-center text-center">
      <p className="sr-only" aria-live="assertive">
        {stage === 'processing' && 'Processing payment…'}
        {stage === 'declined' && 'Transaction declined!'}
        {stage === 'forgiven' && 'Okay fine, you get the date for free.'}
      </p>

      <AnimatePresence mode="wait" initial={false}>
        {stage === 'teaser' ? (
          <motion.div
            key="teaser"
            className="flex min-h-[300px] flex-col items-center justify-center py-6"
            exit={{ opacity: 0, scale: 0.94, filter: 'blur(6px)', transition: { duration: 0.3 } }}
          >
            <motion.p
              className="font-hand text-[24px] text-rose"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              hold on…
            </motion.p>
            <h1 ref={headingRef} tabIndex={-1} className="mt-1 font-serif text-[clamp(2.1rem,8.6vw,2.7rem)] font-semibold italic leading-[1.05] text-burgundy">
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35, duration: 0.5 }}>
                …one tiny problem.
              </motion.span>
            </h1>
            <motion.span
              className="sticker mt-5 inline-block text-[64px] leading-none"
              aria-hidden="true"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -10, 10, -6, 0] }}
              transition={{ delay: 0.75, duration: 0.7 }}
            >
              😬
            </motion.span>
          </motion.div>
        ) : (
          <motion.div
            key="bill"
            className="w-full"
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          >
            {/* headline changes with the stage */}
            <div className="min-h-[118px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={headline}
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                >
                  {headline === 'fee' && (
                    <>
                      <h2 className="font-serif text-[clamp(2rem,8vw,2.45rem)] font-semibold leading-[1.05] text-burgundy">
                        one small fee <span aria-hidden="true">💳</span>
                      </h2>
                      <p className="mx-auto mt-2 max-w-[36ch] text-[16px] leading-relaxed text-ink-soft">
                        To confirm your acceptance of this date, please complete the following transaction. Totally normal.
                        Everyone does this.
                      </p>
                    </>
                  )}
                  {headline === 'declined' && (
                    <>
                      <h2 className="serif-wonk font-serif text-[clamp(1.9rem,8vw,2.4rem)] font-extrabold uppercase leading-[1.02] text-decline">
                        Transaction declined <span aria-hidden="true">😭</span>
                      </h2>
                      <p className="mt-2 text-[16px] text-ink-soft">reason: card too cute to be charged.</p>
                    </>
                  )}
                  {headline === 'forgiven' && (
                    <>
                      <h2 className="font-serif text-[clamp(1.85rem,7.6vw,2.3rem)] font-semibold leading-[1.08] text-burgundy">
                        Okay fine... you get the date for free. <span aria-hidden="true">❤️</span>
                      </h2>
                      <p className="mt-2 font-hand text-[21px] text-rose-deep">(it was always free, obviously 🥹)</p>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* the receipt */}
            <motion.div ref={receiptRef} animate={shake} className="receipt-wrap relative mt-5 w-full">
              <div className="receipt relative px-5 pt-5 text-left sm:px-6">
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                  <p className="whitespace-nowrap font-serif text-[clamp(18px,5.4vw,21px)] font-bold leading-tight text-burgundy">Date Agreement™</p>
                  <span className="shrink-0 rounded-full bg-mist px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-rose-deep">
                    {stage === 'forgiven' ? 'paid ♥' : 'due now'}
                  </span>
                </div>
                <p className="mt-1 text-[11.5px] font-extrabold uppercase tracking-[0.13em] text-ink-soft/80">
                  invoice #0214 · billed to {herName()}
                </p>

                <ul className="mt-4 space-y-2.5 text-[15px] text-ink">
                  {items.map((it) => (
                    <li key={it.label} className="flex items-end gap-2">
                      <span className="min-w-0">{it.label}</span>
                      <span className="dotted-leader" aria-hidden="true" />
                      <span className="shrink-0 font-bold tabular-nums">{money(it.amount)}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex items-end justify-between border-t-2 border-dashed border-burgundy/10 pt-3">
                  <span className="pb-1 text-[13px] font-extrabold uppercase tracking-[0.14em] text-ink-soft">total</span>
                  <span className="flex items-end gap-3">
                    <span className={`relative font-serif text-[44px] font-bold leading-none tabular-nums transition-colors duration-500 ${stage === 'forgiven' ? 'text-ink-soft/50' : 'text-burgundy'}`}>
                      {money(price)}
                      {stage === 'forgiven' && (
                        <motion.span
                          className="absolute left-[-4px] right-[-4px] top-1/2 h-[4px] rounded-full bg-rose"
                          style={{ originX: 0 }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                          aria-hidden="true"
                        />
                      )}
                    </span>
                    <AnimatePresence>
                      {stage === 'forgiven' && (
                        <motion.span
                          className="font-serif text-[44px] font-bold leading-none text-rose"
                          initial={{ opacity: 0, scale: 0.4, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ type: 'spring', stiffness: 420, damping: 14, delay: 0.5 }}
                        >
                          {money(0)}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </div>

                <p className="mt-3 text-center text-[12.5px] font-bold text-ink-soft [text-wrap:balance]">one-time fee • non-refundable • absolutely worth it</p>

                {/* rubber stamps */}
                <AnimatePresence>
                  {stage === 'declined' && (
                    <motion.div
                      key="declined"
                      className="stamp pointer-events-none absolute left-1/2 top-[40%] whitespace-nowrap px-4 py-1.5 text-[34px] text-decline"
                      style={{ x: '-50%', y: '-50%' }}
                      initial={{ opacity: 0, scale: 2.4, rotate: -24 }}
                      animate={{ opacity: 0.92, scale: 1, rotate: -14 }}
                      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                      transition={{ type: 'spring', stiffness: 520, damping: 20 }}
                      aria-hidden="true"
                    >
                      declined
                    </motion.div>
                  )}
                  {stage === 'forgiven' && (
                    <motion.div
                      key="free"
                      className="stamp pointer-events-none absolute left-1/2 top-[40%] whitespace-nowrap px-4 py-1.5 text-[28px] text-rose"
                      style={{ x: '-50%', y: '-50%' }}
                      initial={{ opacity: 0, scale: 2.4, rotate: 20 }}
                      animate={{ opacity: 0.9, scale: 1, rotate: 9 }}
                      transition={{ type: 'spring', stiffness: 520, damping: 20, delay: 0.1 }}
                      aria-hidden="true"
                    >
                      100% off ♥
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* actions */}
            <div className="mt-7 flex min-h-[96px] flex-col items-center gap-3">
              <AnimatePresence mode="wait" initial={false}>
                {stage === 'idle' && (
                  <motion.div key="idle" className="flex flex-col items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <PrimaryButton onClick={() => setStage('processing')} pulse>
                      pay {money(price)} &amp; confirm <span aria-hidden="true">💕</span>
                    </PrimaryButton>
                    <QuietLink onClick={onBack}>go back</QuietLink>
                  </motion.div>
                )}
                {stage === 'processing' && (
                  <motion.div key="processing" className="w-full max-w-[320px]" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                    <div className="flex min-h-[54px] items-center justify-center gap-2.5 rounded-[28px] bg-white px-5 py-2 text-[15px] font-bold leading-snug text-burgundy shadow-[0_10px_24px_-14px_rgb(99_36_61/0.6)] ring-2 ring-petal">
                      <LoaderCircle className="h-5 w-5 shrink-0 animate-spin text-rose" strokeWidth={2.6} aria-hidden="true" />
                      <AnimatePresence mode="wait">
                        <motion.span key={statusIndex} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
                          {STATUSES[statusIndex]}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <div className="mx-auto mt-3 h-1.5 w-[80%] overflow-hidden rounded-full bg-mist">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-petal to-rose"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: TIMING.processing / 1000, ease: [0.3, 0.1, 0.4, 1] }}
                      />
                    </div>
                  </motion.div>
                )}
                {stage === 'declined' && (
                  <motion.p key="declined" className="pt-3 font-hand text-[22px] text-ink-soft" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    hmm. let me think about this…
                  </motion.p>
                )}
                {stage === 'forgiven' && (
                  <motion.div key="forgiven" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                    <PrimaryButton onClick={onDone} pulse>
                      yay! <ArrowRight className="h-5 w-5" strokeWidth={2.8} aria-hidden="true" />
                    </PrimaryButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Screen>
  )
}
