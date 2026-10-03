import { memo, useMemo } from 'react'
import { FlowerShape, HeartShape, SparkleShape } from './Shapes'

// Deterministic pseudo-random so the layout is stable between renders.
function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

const KINDS = ['heart', 'heart', 'flower', 'sparkle', 'heart', 'flower']
const HEART_COLORS = ['#D94C91', '#F3B6CE', '#ffffff', '#E77BAE']

/** Soft hearts, flowers and sparkles drifting up behind everything. */
function FloatingHearts({ count = 16 }) {
  const items = useMemo(() => {
    const rand = seeded(7)
    return Array.from({ length: count }, (_, i) => {
      const dur = 14 + rand() * 12
      return {
        id: i,
        kind: KINDS[i % KINDS.length],
        left: `${(i / count) * 100 + rand() * (100 / count)}%`,
        size: 10 + rand() * 16,
        color: HEART_COLORS[Math.floor(rand() * HEART_COLORS.length)],
        style: {
          '--dur': `${dur}s`,
          '--delay': `${-rand() * dur}s`,
          '--sway': `${(rand() - 0.5) * 120}px`,
          '--rot': `${(rand() - 0.5) * 70}deg`,
          '--o': (0.35 + rand() * 0.35).toFixed(2),
        },
      }
    })
  }, [count])

  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden" aria-hidden="true">
      {items.map((it) => (
        <span key={it.id} className="float-item" style={{ ...it.style, left: it.left, width: it.size, height: it.size }}>
          {it.kind === 'heart' && <HeartShape className="h-full w-full" fill={it.color} />}
          {it.kind === 'flower' && <FlowerShape className="h-full w-full" petal="#F7C3D7" center="#F2CB8C" />}
          {it.kind === 'sparkle' && <SparkleShape className="h-full w-full" fill="#ffffff" />}
        </span>
      ))}
    </div>
  )
}

export default memo(FloatingHearts)
