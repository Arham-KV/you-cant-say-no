import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Music } from 'lucide-react'

/**
 * Floating ♪ button. Never autoplays. If the music file can't be loaded,
 * the button simply never appears.
 */
export default function MusicToggle({ src, label = 'play our song' }) {
  const audioRef = useRef(null)
  const fadeRef = useRef(0)
  const [available, setAvailable] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [showLabel, setShowLabel] = useState(true)

  useEffect(() => {
    if (!src) return
    const audio = new Audio()
    audio.preload = 'metadata'
    audio.loop = true
    const ok = () => setAvailable(true)
    const fail = () => setAvailable(false)
    audio.addEventListener('loadedmetadata', ok)
    audio.addEventListener('error', fail)
    audio.src = src
    audioRef.current = audio
    return () => {
      audio.pause()
      audio.removeEventListener('loadedmetadata', ok)
      audio.removeEventListener('error', fail)
      cancelAnimationFrame(fadeRef.current)
    }
  }, [src])

  useEffect(() => {
    if (!available) return
    const t = setTimeout(() => setShowLabel(false), 5000)
    return () => clearTimeout(t)
  }, [available])

  const fadeTo = (target, done) => {
    const audio = audioRef.current
    cancelAnimationFrame(fadeRef.current)
    const step = () => {
      const diff = target - audio.volume
      if (Math.abs(diff) < 0.02) {
        audio.volume = target
        done?.()
        return
      }
      audio.volume = Math.min(1, Math.max(0, audio.volume + Math.sign(diff) * 0.02))
      fadeRef.current = requestAnimationFrame(step)
    }
    step()
  }

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio) return
    setShowLabel(false)
    if (playing) {
      setPlaying(false)
      fadeTo(0, () => audio.pause())
      return
    }
    try {
      audio.volume = 0
      await audio.play()
      setPlaying(true)
      fadeTo(0.55)
    } catch {
      setPlaying(false)
    }
  }

  if (!available) return null

  return (
    <div
      data-avoid-runaway
      className="fixed right-4 z-40 flex items-center gap-2"
      style={{ bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}
    >
      <AnimatePresence>
        {showLabel && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            className="rounded-full bg-cream/95 px-3 py-1.5 font-hand text-[19px] text-burgundy shadow-md"
          >
            {label} ♪
          </motion.span>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? 'Pause music' : 'Play music'}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        className="grid h-12 w-12 place-items-center rounded-full bg-cream text-rose shadow-[0_10px_24px_-10px_rgb(99_36_61/0.55)] ring-2 ring-petal"
      >
        {playing ? (
          <span className="flex h-5 items-end gap-[3px]" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                className="w-[3px] rounded-full bg-rose"
                animate={{ height: ['30%', '100%', '45%', '80%', '30%'] }}
                transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
              />
            ))}
          </span>
        ) : (
          <Music className="h-5 w-5" aria-hidden="true" strokeWidth={2.4} />
        )}
      </motion.button>
    </div>
  )
}
