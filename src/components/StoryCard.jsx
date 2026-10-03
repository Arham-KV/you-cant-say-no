import { AnimatePresence, motion } from 'framer-motion'
import AutoHeight from './AutoHeight'
import { HeartShape } from './Shapes'
import { CHAPTERS, STEPS } from '../story'

const PROGRESS_STEPS = STEPS.slice(1) // chapters after the opening letter

/** The cream "paper" card every chapter lives on. */
export default function StoryCard({ step, children }) {
  const chapter = CHAPTERS[step]
  const index = PROGRESS_STEPS.indexOf(step)

  return (
    <motion.div
      className="relative mx-auto my-auto w-full max-w-[480px]"
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 140, damping: 20, delay: 0.05 }}
    >
      {/* washi tape */}
      <div className="tape absolute -top-3 left-1/2 z-20 h-[30px] w-[118px] -translate-x-1/2 -rotate-3" aria-hidden="true" />

      {/* chapter sticker */}
      <div className="pointer-events-none absolute -right-2 -top-5 z-20 sm:-right-5 sm:-top-6" aria-hidden="true">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={chapter.sticker}
            className="sticker block text-[42px] leading-none sm:text-[50px]"
            initial={{ scale: 0, rotate: -40, opacity: 0 }}
            animate={{ scale: 1, rotate: 12, opacity: 1 }}
            exit={{ scale: 0, rotate: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 15, delay: 0.25 }}
          >
            {chapter.sticker}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="story-card">
        <AutoHeight>
          <div className="px-5 pb-7 pt-8 min-[380px]:px-7 sm:px-10 sm:pb-9 sm:pt-10">
            <header className="mb-5 flex min-h-[28px] items-center justify-between gap-3">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={chapter.label}
                  className="whitespace-nowrap font-hand text-[19px] text-rose-deep min-[420px]:text-[21px]"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.3 }}
                >
                  {chapter.label}
                </motion.p>
              </AnimatePresence>

              {index >= 0 && (
                <div
                  className="hidden shrink-0 items-center gap-[2px] min-[380px]:flex"
                  role="img"
                  aria-label={`Chapter ${index + 1} of ${PROGRESS_STEPS.length}`}
                >
                  {PROGRESS_STEPS.map((s, i) => (
                    <motion.span
                      key={s}
                      animate={{ scale: i === index ? 1.25 : 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 14 }}
                    >
                      <HeartShape
                        className="h-[10px] w-[10px] transition-colors duration-500"
                        fill={i <= index ? '#D94C91' : '#F3D3DE'}
                      />
                    </motion.span>
                  ))}
                </div>
              )}
            </header>

            {children}
          </div>
        </AutoHeight>
      </div>
    </motion.div>
  )
}
