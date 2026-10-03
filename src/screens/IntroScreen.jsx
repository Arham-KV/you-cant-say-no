import { useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Item, Screen, useScreenFocus } from '../components/Motion'
import { PrimaryButton } from '../components/Buttons'
import Envelope from '../components/Envelope'
import { useEffects } from '../components/Effects'
import { config } from '../config'

/** Prologue: "Hey Sarah… I have a very important question." + an envelope to open. */
export default function IntroScreen({ onNext }) {
  const [opening, setOpening] = useState(false)
  const envelopeRef = useRef(null)
  const headingRef = useScreenFocus()
  const reduce = useReducedMotion()
  const { burst } = useEffects()

  const open = () => {
    if (opening) return
    setOpening(true)
    const r = envelopeRef.current?.getBoundingClientRect()
    if (r) setTimeout(() => burst(r.left + r.width / 2, r.top + r.height * 0.3, { count: 12, spread: 120 }), 380)
    setTimeout(onNext, reduce ? 250 : 1250)
  }

  return (
    <Screen className="flex flex-col items-center text-center">
      <Item ref={envelopeRef} className="mt-2 w-full">
        <Envelope open={opening} onOpen={open} />
      </Item>

      <Item as="p" className="mt-5 font-hand text-[26px] text-rose">
        psst… wait.
      </Item>

      <Item
        as="h1"
        ref={headingRef}
        tabIndex={-1}
        className="mt-1 font-serif text-[clamp(2.3rem,9vw,2.9rem)] font-semibold leading-[1.02] tracking-[-0.01em] text-burgundy"
      >
        Hey {config.herName || 'you'}<span className="text-rose">…</span>
      </Item>

      <Item as="p" className="mt-3 max-w-[30ch] text-[18px] leading-relaxed text-ink-soft">
        {config.defaultMessage}
      </Item>

      <Item className="mt-7">
        <PrimaryButton onClick={open} disabled={opening} pulse>
          open it <span aria-hidden="true">💌</span>
        </PrimaryButton>
      </Item>

      <Item as="p" className="mt-4 font-hand text-[21px] text-ink-soft/80">
        (no pressure. okay, maybe a little.)
      </Item>
    </Screen>
  )
}
