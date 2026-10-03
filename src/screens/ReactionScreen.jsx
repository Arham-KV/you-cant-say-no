import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Item, PopWords, Screen, useScreenFocus } from '../components/Motion'
import { PrimaryButton } from '../components/Buttons'

function attemptsNote(n) {
  if (n === 0) return "(you didn't even touch the no button. I'm honored 🥹)"
  if (n === 1) return '(you tried the no button once. I saw that 👀)'
  if (n < 5) return `(you tried the no button ${n} times. I saw that 👀)`
  return `(you chased that poor no button ${n} times btw 😭)`
}

/** Chapter two: the over-the-top reaction. */
export default function ReactionScreen({ attempts, onNext }) {
  const headingRef = useScreenFocus()

  return (
    <Screen className="flex flex-col items-center text-center">
      <Item className="relative mt-1 h-[92px] w-[120px]" aria-hidden="true">
        <motion.span
          className="sticker absolute left-1/2 top-0 -translate-x-1/2 text-[76px] leading-none"
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: [0, 1.25, 1], rotate: [-30, 10, -6] }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
        >
          <motion.span
            className="inline-block"
            animate={{ rotate: [-6, 6, -6], y: [0, -4, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
          >
            😭
          </motion.span>
        </motion.span>
        <motion.span
          className="absolute -right-1 top-1 font-hand text-[34px] font-bold text-rose"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 400, damping: 12 }}
        >
          !!
        </motion.span>
        <motion.span
          className="absolute -left-1 top-8 text-[24px]"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1, rotate: -15 }}
          transition={{ delay: 0.75, type: 'spring', stiffness: 400, damping: 12 }}
        >
          💕
        </motion.span>
      </Item>

      <Item
        as="h1"
        ref={headingRef}
        tabIndex={-1}
        className="serif-wonk mt-4 font-serif text-[clamp(2.05rem,8.6vw,2.7rem)] font-extrabold uppercase leading-[1.02] tracking-[-0.015em] text-burgundy"
      >
        <PopWords text="WAIT... YOU ACTUALLY SAID YES?? 😭💕" delay={0.2} />
      </Item>

      <Item as="p" className="mt-5 text-[18px] text-ink-soft">
        I was fully prepared for you to say no <span aria-hidden="true">😂</span>
      </Item>

      <Item as="p" className="mt-2 max-w-[32ch] font-hand text-[21px] text-rose-deep/90">
        {attemptsNote(attempts)}
      </Item>

      <Item className="mt-8">
        <PrimaryButton onClick={onNext} pulse>
          okay okay!
          <motion.span
            className="inline-flex"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            <ArrowRight className="h-5 w-5" strokeWidth={2.8} />
          </motion.span>
        </PrimaryButton>
      </Item>
    </Screen>
  )
}
