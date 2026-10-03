import { forwardRef, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { shouldMoveFocus } from '../lib/env'

const EASE_OUT = [0.22, 1, 0.36, 1]

export const screenVariants = {
  initial: { opacity: 0, y: 26, scale: 0.97, filter: 'blur(8px)' },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: EASE_OUT, staggerChildren: 0.08, delayChildren: 0.08 },
  },
  exit: {
    opacity: 0,
    y: -18,
    scale: 0.97,
    filter: 'blur(8px)',
    transition: { duration: 0.32, ease: [0.4, 0, 1, 1] },
  },
}

export const itemVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 240, damping: 24 } },
}

/** One chapter of the story. Children wrapped in <Item> reveal in a stagger. */
export const Screen = forwardRef(function Screen({ className = '', children, ...rest }, ref) {
  return (
    <motion.section
      ref={ref}
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
      {...rest}
    >
      {children}
    </motion.section>
  )
})

const cache = {}
export const Item = forwardRef(function Item({ as = 'div', ...rest }, ref) {
  const Component = cache[as] || (cache[as] = motion[as])
  return <Component ref={ref} variants={itemVariants} {...rest} />
})

/** Moves keyboard/screen-reader focus to a screen's heading when the chapter changes. */
export function useScreenFocus() {
  const ref = useRef(null)
  useEffect(() => {
    if (!shouldMoveFocus()) return
    const t = setTimeout(() => ref.current?.focus({ preventScroll: true }), 80)
    return () => clearTimeout(t)
  }, [])
  return ref
}

/** Word-by-word pop-in for big headings. */
export function PopWords({ text, className = '', delay = 0, stagger = 0.07 }) {
  const words = text.split(' ')
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          aria-hidden="true"
          className="inline-block whitespace-pre"
          initial={{ opacity: 0, y: 22, scale: 0.6, rotate: i % 2 ? 6 : -6 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 16, delay: delay + i * stagger }}
        >
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </span>
  )
}
