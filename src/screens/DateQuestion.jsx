import { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Item, Screen, useScreenFocus } from '../components/Motion'
import { PrimaryButton } from '../components/Buttons'
import PhotoPolaroid from '../components/PhotoPolaroid'
import RunawayButton from '../components/RunawayButton'
import { useEffects } from '../components/Effects'
import { heartPop } from '../lib/confetti'
import { hintFor } from '../lib/taunts'

/** Chapter one: the big question, with a NO button that refuses to be caught. */
export default function DateQuestion({ attempts, onAttempt, onYes }) {
  const yesRef = useRef(null)
  const [saidYes, setSaidYes] = useState(false)
  const headingRef = useScreenFocus()
  const reduce = useReducedMotion()
  const { burst } = useEffects()

  const handleYes = () => {
    if (saidYes) return
    setSaidYes(true)
    const r = yesRef.current?.getBoundingClientRect()
    if (r) {
      const x = r.left + r.width / 2
      const y = r.top + r.height / 2
      burst(x, y, { count: 20, spread: 180 })
      heartPop(x, y, { power: 1.15 })
    }
    setTimeout(onYes, reduce ? 350 : 1050)
  }

  const yesScale = saidYes ? 1.12 : 1 + Math.min(attempts, 10) * 0.024
  const hint = hintFor(attempts)

  return (
    <Screen className="flex flex-col items-center text-center">
      <Item className="w-full pt-1">
        <PhotoPolaroid />
      </Item>

      <Item as="p" className="mt-6 font-hand text-[23px] text-rose [@media(max-height:640px)]:hidden">
        okay. deep breath…
      </Item>

      <Item
        as="h1"
        ref={headingRef}
        tabIndex={-1}
        data-avoid-runaway
        className="mt-1 max-w-[15ch] font-serif text-[clamp(1.85rem,8.2vw,2.55rem)] [@media(max-height:640px)]:mt-5 font-semibold leading-[1.08] tracking-[-0.01em] text-burgundy"
      >
        <span aria-hidden="true">🌸 </span>Will you go on a date with me?<span aria-hidden="true"> 🌸</span>
      </Item>

      <Item className="mt-7 flex min-h-[64px] w-full flex-wrap items-center justify-center gap-4">
        <motion.div layout transition={{ type: 'spring', stiffness: 300, damping: 26 }}>
          <motion.div animate={{ scale: yesScale }} transition={{ type: 'spring', stiffness: 300, damping: 14 }}>
            <PrimaryButton ref={yesRef} size="lg" pulse={!saidYes} onClick={handleYes} disabled={saidYes} aria-label="Yes!">
              YES <span aria-hidden="true">❤️</span>
            </PrimaryButton>
          </motion.div>
        </motion.div>
        <RunawayButton attempts={attempts} onAttempt={onAttempt} avoidRef={yesRef} hidden={saidYes} />
      </Item>

      <Item className="mt-5 min-h-[26px]" data-avoid-runaway>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={hint}
            className="font-hand text-[21px] text-ink-soft"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            {saidYes ? 'eeee 🥹' : hint}
          </motion.p>
        </AnimatePresence>
      </Item>
    </Screen>
  )
}
