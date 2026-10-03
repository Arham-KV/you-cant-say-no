import { motion } from 'framer-motion'
import { HEART_D } from './Shapes'

/** A little envelope with a wax-seal heart. `open` flips the flap and slides the letter up. */
export default function Envelope({ open, onOpen }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      disabled={open}
      aria-label="Open the letter"
      className="group relative mx-auto block w-[210px] rounded-2xl sm:w-[230px]"
      whileHover={open ? undefined : { y: -4, rotate: -1.5 }}
      whileTap={open ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
      <motion.div
        animate={open ? { y: 10 } : { y: [0, -6, 0] }}
        transition={open ? { duration: 0.4 } : { duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg viewBox="0 -46 220 200" className="w-full overflow-visible" aria-hidden="true">
          {/* shadow */}
          <ellipse cx="110" cy="150" rx="88" ry="6" fill="#63243D" opacity=".1" />
          {/* back of the envelope */}
          <rect x="10" y="40" width="200" height="106" rx="12" fill="#F1A9C7" />
          {/* open flap (behind the letter) */}
          <motion.path
            d="M10 46 Q10 40 16 38 L104 -18 Q110 -22 116 -18 L204 38 Q210 40 210 46 Z"
            fill="#EE9FBF"
            style={{ originX: 0.5, originY: 1 }}
            initial={false}
            animate={{ scaleY: open ? 1 : 0 }}
            transition={{ duration: 0.25, delay: open ? 0.22 : 0, ease: 'easeOut' }}
          />
          {/* the letter */}
          <motion.g initial={false} animate={{ y: open ? -62 : 0 }} transition={{ type: 'spring', stiffness: 160, damping: 16, delay: open ? 0.42 : 0 }}>
            <rect x="26" y="46" width="168" height="94" rx="8" fill="#FFFDF8" />
            <rect x="26" y="46" width="168" height="94" rx="8" fill="none" stroke="#F3B6CE" strokeWidth="1.5" />
            <path d={HEART_D} fill="#D94C91" transform="translate(98 54)" />
            <g stroke="#F3B6CE" strokeWidth="3" strokeLinecap="round">
              <path d="M48 90h124" />
              <path d="M48 104h124" />
              <path d="M48 118h80" />
            </g>
          </motion.g>
          {/* front pocket */}
          <path d="M10 52 L104 104 Q110 107 116 104 L210 52 L210 134 Q210 146 198 146 L22 146 Q10 146 10 134 Z" fill="#F8C4D8" />
          <path d="M10 146 L92 92 M210 146 L128 92" stroke="#EFA6C4" strokeWidth="1.5" opacity=".9" />
          {/* closed flap */}
          <motion.path
            d="M10 46 Q10 40 16 40 L204 40 Q210 40 210 46 L116 104 Q110 108 104 104 Z"
            fill="#F3B6CE"
            stroke="#EFA6C4"
            strokeWidth="1.5"
            style={{ originX: 0.5, originY: 0 }}
            initial={false}
            animate={{ scaleY: open ? 0 : 1 }}
            transition={{ duration: 0.22, ease: 'easeIn' }}
          />
          {/* wax seal */}
          <motion.g initial={false} animate={open ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }} style={{ originX: 0.5, originY: 0.5 }} transition={{ duration: 0.2 }}>
            <circle cx="110" cy="96" r="17" fill="#C93B81" />
            <circle cx="110" cy="96" r="13" fill="none" stroke="#E86AA6" strokeWidth="1.5" />
            <path d={HEART_D} fill="#FFE3EE" transform="translate(101.6 87.8) scale(.7)" />
          </motion.g>
        </svg>
      </motion.div>
    </motion.button>
  )
}
