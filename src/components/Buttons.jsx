import { forwardRef } from 'react'
import { motion } from 'framer-motion'

const SIZES = {
  md: 'h-[54px] px-8 text-[17px]',
  lg: 'h-[60px] px-10 text-[19px]',
}

const spring = { type: 'spring', stiffness: 420, damping: 17 }

/** The big pink "yes / continue" button. */
export const PrimaryButton = forwardRef(function PrimaryButton(
  { children, className = '', size = 'md', pulse = false, soft = false, ...props },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type="button"
      whileHover={soft ? { y: -1 } : { y: -2, scale: 1.035 }}
      whileTap={{ scale: 0.94, y: 1 }}
      transition={spring}
      aria-disabled={soft || undefined}
      className={`btn-primary ${pulse && !soft ? 'btn-pulse' : ''} ${SIZES[size]} ${className}`}
      {...props}
    >
      <span className="shine" aria-hidden="true" />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </motion.button>
  )
})

/** Secondary cream button. */
export const SoftButton = forwardRef(function SoftButton({ children, className = '', ...props }, ref) {
  return (
    <motion.button
      ref={ref}
      type="button"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={spring}
      className={`btn-soft h-[50px] px-6 text-[16px] ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
})

/** Small underlined text action. */
export function QuietLink({ children, className = '', ...props }) {
  return (
    <button type="button" className={`link-quiet px-1 text-[15px] ${className}`} {...props}>
      {children}
    </button>
  )
}
