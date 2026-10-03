import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import { AnimatePresence, MotionConfig, useReducedMotion } from 'framer-motion'
import { CHAPTERS, loadState, saveState, storyReducer } from './story'
import { asset, config } from './config'
import { markNavigated } from './lib/env'

import { EffectsProvider } from './components/Effects'
import StoryCard from './components/StoryCard'
import FloatingHearts from './components/FloatingHearts'
import DesktopDoodles from './components/DesktopDoodles'
import CursorSparkles from './components/CursorSparkles'
import MusicToggle from './components/MusicToggle'

import IntroScreen from './screens/IntroScreen'
import DateQuestion from './screens/DateQuestion'
import ReactionScreen from './screens/ReactionScreen'
import DateTimeScreen from './screens/DateTimeScreen'
import FoodSelection from './screens/FoodSelection'
import ConfirmationScreen from './screens/ConfirmationScreen'
import PaymentPrank from './screens/PaymentPrank'
import FinalScreen from './screens/FinalScreen'

function Story() {
  const [state, dispatch] = useReducer(storyReducer, undefined, loadState)
  const reduce = useReducedMotion()
  const firstRender = useRef(true)

  useEffect(() => saveState(state), [state])

  // Scroll back to the top whenever a new chapter starts.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }, [state.step, reduce])

  // Stable handlers (screens use them in effects).
  const actions = useMemo(() => {
    const go = (step) => {
      markNavigated()
      dispatch({ type: 'go', step })
    }
    return {
      go,
      set: (values) => dispatch({ type: 'set', values }),
      setFood: (food) => dispatch({ type: 'set', values: { food } }),
      noAttempt: () => dispatch({ type: 'noAttempt' }),
      reset: () => {
        markNavigated()
        dispatch({ type: 'reset' })
      },
      toQuestion: () => go('question'),
      toReaction: () => go('reaction'),
      toWhen: () => go('when'),
      toFood: () => go('food'),
      toConfirm: () => go('confirm'),
      toFee: () => go('fee'),
      toFinal: () => go('final'),
    }
  }, [])

  const { step, date, time, food, noAttempts } = state

  const screens = {
    intro: <IntroScreen key="intro" onNext={actions.toQuestion} />,
    question: <DateQuestion key="question" attempts={noAttempts} onAttempt={actions.noAttempt} onYes={actions.toReaction} />,
    reaction: <ReactionScreen key="reaction" attempts={noAttempts} onNext={actions.toWhen} />,
    when: <DateTimeScreen key="when" date={date} time={time} onChange={actions.set} onNext={actions.toFood} />,
    food: <FoodSelection key="food" food={food} onChange={actions.setFood} onNext={actions.toConfirm} />,
    confirm: <ConfirmationScreen key="confirm" date={date} time={time} food={food} onAccept={actions.toFee} onEdit={actions.toWhen} />,
    fee: <PaymentPrank key="fee" food={food} noAttempts={noAttempts} onBack={actions.toConfirm} onDone={actions.toFinal} />,
    final: <FinalScreen key="final" date={date} time={time} food={food} onReplay={actions.reset} />,
  }

  const [a1, a2, a3] = CHAPTERS[step].aura

  return (
    <div className="app-shell" style={{ '--aura-1': a1, '--aura-2': a2, '--aura-3': a3 }}>
      <div className="aura" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <FloatingHearts />
      <DesktopDoodles />

      <main className="relative z-10 flex min-h-[inherit] flex-col items-stretch px-4 pb-8 pt-10 sm:px-6 sm:pt-14 [@media(max-height:640px)]:pt-6">
        <StoryCard step={step}>
          <AnimatePresence mode="wait">{screens[step]}</AnimatePresence>
        </StoryCard>

        <footer className="mx-auto mt-8 text-center font-hand text-[19px] text-burgundy/55">
          made with way too much love{config.myName ? ` by ${config.myName}` : ''} ♡
        </footer>
      </main>

      <MusicToggle src={asset(config.music)} label={config.musicLabel} />
      <CursorSparkles />
    </div>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <EffectsProvider>
        <Story />
      </EffectsProvider>
    </MotionConfig>
  )
}
