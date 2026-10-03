import { memo } from 'react'

// Hand-drawn doodles that frame the card on larger screens.
const stroke = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }

const Doodles = {
  heart: (
    <svg viewBox="0 0 80 72" className="h-full w-full">
      <path {...stroke} stroke="#D94C91" strokeWidth="3" d="M40 66C24 54 6 41 7 23 8 11 18 5 27 7c6 1.3 10 6 13 11 3-6 8-10 15-11 10-1 18 7 17 18-1 18-17 30-32 41" />
      <path {...stroke} stroke="#D94C91" strokeWidth="2" opacity=".5" d="M43 63c13-10 25-21 26-37" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 64 64" className="h-full w-full">
      <path {...stroke} stroke="#63243D" strokeWidth="2.6" opacity=".55" d="M32 6c2 11 6 18 15 22-9 3-13 10-15 22-3-12-7-19-16-22 9-4 13-11 16-22z" />
      <path {...stroke} stroke="#E9B872" strokeWidth="2.6" d="M52 8v10M47 13h10" />
    </svg>
  ),
  flower: (
    <svg viewBox="0 0 80 80" className="h-full w-full">
      <g {...stroke} stroke="#D94C91" strokeWidth="2.6">
        <path d="M40 34c-6-10-4-22 0-24 5 2 6 14 0 24z" />
        <path d="M46 38c9-7 21-7 23-3-1 5-13 8-23 3z" />
        <path d="M42 46c7 9 7 21 3 23-5-1-8-13-3-23z" />
        <path d="M34 44c-10 6-21 4-23 0 2-5 14-6 23 0z" />
        <path d="M34 36c-9-7-11-18-8-21 5 0 10 11 8 21z" />
      </g>
      <circle cx="40" cy="40" r="5" fill="#E9B872" />
    </svg>
  ),
  squiggle: (
    <svg viewBox="0 0 120 40" className="h-full w-full">
      <path {...stroke} stroke="#F3B6CE" strokeWidth="4" d="M4 26c10-16 18-16 24 0s14 16 22 0 16-16 24 0 14 16 22 0 12-14 20-6" />
    </svg>
  ),
  envelope: (
    <svg viewBox="0 0 80 60" className="h-full w-full">
      <g {...stroke} stroke="#63243D" strokeWidth="2.4" opacity=".55">
        <rect x="6" y="10" width="68" height="44" rx="6" />
        <path d="M8 13l32 23 32-23" />
      </g>
      <path d="M40 30c-4-5-11-2-8 4l8 7 8-7c3-6-4-9-8-4z" fill="#D94C91" />
    </svg>
  ),
  sparkles: (
    <svg viewBox="0 0 70 70" className="h-full w-full">
      <path d="M20 8c1.5 9 5 13 13 14-8 1.5-11.5 5-13 14-1.5-9-5-12.5-13-14 8-1 11.5-5 13-14z" fill="#F3B6CE" />
      <path d="M50 34c1 6 3.5 8.5 9 9.5-5.5 1-8 3.5-9 9.5-1-6-3.5-8.5-9-9.5 5.5-1 8-3.5 9-9.5z" fill="#E9B872" />
    </svg>
  ),
}

const PLACEMENT = [
  { kind: 'flower', className: 'left-[5%] top-[10%] h-20 w-20', r: '-8deg', dur: '6s' },
  { kind: 'star', className: 'right-[7%] top-[9%] h-16 w-16', r: '6deg', dur: '5s', delay: '-1s' },
  { kind: 'heart', className: 'left-[9%] bottom-[14%] h-20 w-20', r: '-12deg', dur: '5.5s', delay: '-2s' },
  { kind: 'envelope', className: 'right-[8%] bottom-[16%] h-16 w-20', r: '10deg', dur: '6.5s', delay: '-3s' },
  { kind: 'squiggle', className: 'left-[16%] top-[46%] h-8 w-28', r: '-4deg', dur: '7s', delay: '-1.5s' },
  { kind: 'sparkles', className: 'right-[15%] top-[48%] h-16 w-16', r: '0deg', dur: '4.5s', delay: '-2.5s' },
]

function DesktopDoodles() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[3] hidden md:block" aria-hidden="true">
      {PLACEMENT.map((p) => (
        <div
          key={p.kind}
          className={`bob absolute ${p.className}`}
          style={{ '--r': p.r, '--bob-dur': p.dur, '--bob-delay': p.delay || '0s' }}
        >
          {Doodles[p.kind]}
        </div>
      ))}
      <p
        className="bob absolute bottom-[6%] left-[4%] rotate-[-6deg] font-hand text-[26px] text-burgundy/50"
        style={{ '--r': '-6deg', '--bob-dur': '7s' }}
      >
        xoxo
      </p>
    </div>
  )
}

export default memo(DesktopDoodles)
