import { useMemo, useState } from 'react'
import { motion, useSpring } from 'framer-motion'
import PuppyIllustration from './PuppyIllustration'
import { asset, config } from '../config'
import { canHover } from '../lib/env'

/** Subtle 3D tilt that follows the mouse (desktop only). */
export function useTilt(max = 7) {
  const rotateX = useSpring(0, { stiffness: 180, damping: 16 })
  const rotateY = useSpring(0, { stiffness: 180, damping: 16 })
  const enabled = useMemo(() => canHover(), [])
  if (!enabled) return { style: {} }
  return {
    style: { rotateX, rotateY, transformPerspective: 900 },
    onPointerMove: (e) => {
      const r = e.currentTarget.getBoundingClientRect()
      rotateY.set(((e.clientX - r.left) / r.width - 0.5) * max * 2)
      rotateX.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2)
    },
    onPointerLeave: () => {
      rotateX.set(0)
      rotateY.set(0)
    },
  }
}

/**
 * The photo on the question screen. Replace /public/images/date-photo.jpg
 * (path set in dateConfig.js). Until a photo loads, the puppy illustration shows.
 */
export default function PhotoPolaroid() {
  const src = asset(config.photo)
  const [status, setStatus] = useState(src ? 'loading' : 'missing')
  const tilt = useTilt()

  return (
    <motion.figure
      className="polaroid relative mx-auto w-[min(240px,68vw)] rotate-[-2.5deg] p-[10px] pb-[42px] sm:w-[262px] [@media(max-height:640px)]:w-[190px] [@media(max-height:640px)]:pb-[36px]"
      style={tilt.style}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
    >
      <div className="tape absolute -top-3 left-1/2 z-10 h-[24px] w-[84px] -translate-x-1/2 rotate-[4deg]" aria-hidden="true" />
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] bg-mist">
        {status !== 'loaded' && <PuppyIllustration className="absolute inset-0 h-full w-full" />}
        {src && status !== 'missing' && (
          <img
            src={src}
            alt={config.photoAlt}
            onLoad={() => setStatus('loaded')}
            onError={() => setStatus('missing')}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
      </div>
      <figcaption className="absolute inset-x-0 bottom-[9px] text-center font-hand text-[22px] text-burgundy/85">
        {config.photoCaption}
      </figcaption>
    </motion.figure>
  )
}
