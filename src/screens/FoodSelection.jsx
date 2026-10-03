import { useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { Item, Screen, useScreenFocus } from '../components/Motion'
import { PrimaryButton } from '../components/Buttons'
import { emojiPop } from '../lib/confetti'
import { config, findFood } from '../config'

/** Chapter four: what are we eating? */
export default function FoodSelection({ food, onChange, onNext }) {
  const headingRef = useScreenFocus()
  const reduce = useReducedMotion()
  const gridShake = useAnimationControls()
  const lastPop = useRef(0)
  const [nudge, setNudge] = useState(false)
  const selected = findFood(food)

  const choose = (item, e) => {
    onChange(item.id)
    setNudge(false)
    const now = performance.now()
    if (now - lastPop.current < 250) return
    lastPop.current = now
    const r = e.currentTarget.closest('label')?.getBoundingClientRect()
    if (r) emojiPop(item.emoji, r.left + r.width / 2, r.top + r.height / 2)
  }

  const submit = () => {
    if (!selected) {
      setNudge(true)
      gridShake.start({ x: [0, -8, 8, -5, 5, 0], transition: { duration: 0.4 } })
      return
    }
    setTimeout(onNext, reduce ? 0 : 120)
  }

  return (
    <Screen className="flex flex-col text-center">
      <Item
        as="h1"
        ref={headingRef}
        tabIndex={-1}
        className="font-serif text-[clamp(1.95rem,7.6vw,2.4rem)] font-semibold leading-[1.08] text-burgundy"
      >
        What are we feeling? <span aria-hidden="true">🍽️✨</span>
      </Item>
      <Item as="p" className="mt-1 font-hand text-[25px] text-rose">
        pick your vibe
      </Item>

      <Item className="mt-5">
        <fieldset>
          <legend className="sr-only">Pick the food for our date</legend>
          <motion.div animate={gridShake} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {config.foods.map((item) => {
              const isSel = food === item.id
              return (
                <label key={item.id} className="wiggle-on-hover relative block cursor-pointer">
                  <input
                    type="radio"
                    name="food"
                    value={item.id}
                    checked={isSel}
                    onChange={(e) => choose(item, e)}
                    className="peer sr-only"
                  />
                  <motion.span
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    animate={isSel ? { scale: [1, 0.94, 1.05, 1] } : { scale: 1 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                    className="relative flex h-full flex-col items-center rounded-[22px] border-2 border-burgundy/8 bg-white px-2 pb-4 pt-4 shadow-[0_10px_22px_-18px_rgb(99_36_61/0.7)] transition-[border-color,background-color,box-shadow] duration-200 hover:border-petal peer-checked:border-rose peer-checked:bg-[#FFF3F8] peer-checked:shadow-[0_0_0_5px_rgb(217_76_145/0.13),0_16px_30px_-14px_rgb(217_76_145/0.65)] peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-rose"
                  >
                    <span className={`wiggle-target inline-block text-[44px] leading-none ${isSel ? 'wiggle' : ''}`} aria-hidden="true">
                      {item.emoji}
                    </span>
                    <span className="mt-2.5 text-[17px] font-extrabold leading-tight text-burgundy">{item.label}</span>
                    <span className="mt-0.5 text-[13px] leading-snug text-ink-soft">{item.note}</span>
                    <AnimatePresence>
                      {isSel && (
                        <motion.span
                          className="absolute right-2.5 top-2.5 grid h-6 w-6 place-items-center rounded-full bg-rose text-white shadow"
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                          aria-hidden="true"
                        >
                          <Check className="h-3.5 w-3.5" strokeWidth={3.5} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.span>
                </label>
              )
            })}
          </motion.div>
        </fieldset>
      </Item>

      <Item className="mt-5 min-h-[58px]" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              <p className="text-[17px] font-bold text-burgundy">
                that's a very important decision <span aria-hidden="true">😌</span>
              </p>
              <p className="mt-0.5 font-hand text-[21px] text-rose-deep">
                {selected.emoji} {selected.reaction}
              </p>
            </motion.div>
          ) : (
            <motion.p
              key={nudge ? 'nudge' : 'empty'}
              className={`pt-3 font-hand text-[21px] ${nudge ? 'text-decline' : 'text-ink-soft/80'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {nudge ? 'you have to pick one, I’m starving 😩' : 'choose carefully. this is serious.'}
            </motion.p>
          )}
        </AnimatePresence>
      </Item>

      <Item className="mt-4 flex justify-center">
        <PrimaryButton onClick={submit} soft={!selected} pulse={Boolean(selected)}>
          that's the vibe <ArrowRight className="h-5 w-5" strokeWidth={2.8} aria-hidden="true" />
        </PrimaryButton>
      </Item>
    </Screen>
  )
}
