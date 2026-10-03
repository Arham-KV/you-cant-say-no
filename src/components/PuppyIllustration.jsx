import { HEART_D } from './Shapes'

/** Fallback illustration shown when no photo is provided: a hopeful little puppy holding a heart. */
export default function PuppyIllustration({ className = '' }) {
  return (
    <svg viewBox="0 0 260 195" className={className} role="img" aria-label="A cute puppy holding a heart">
      <defs>
        <linearGradient id="pup-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FDEAF1" />
          <stop offset="1" stopColor="#F7CFDF" />
        </linearGradient>
        <radialGradient id="pup-heart" cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#F07DB2" />
          <stop offset="1" stopColor="#C93B81" />
        </radialGradient>
      </defs>

      <rect width="260" height="195" fill="url(#pup-bg)" />

      {/* background hearts & sparkles */}
      <g fill="#fff" opacity=".75">
        <path d={HEART_D} transform="translate(26 26) scale(.75)" />
        <path d={HEART_D} transform="translate(214 18) scale(.6)" />
        <path d={HEART_D} transform="translate(222 120) scale(.5)" />
        <path d={HEART_D} transform="translate(18 132) scale(.45)" />
      </g>
      <g fill="#E9B872">
        <path d="M200 64c.8 4.5 2.8 6.5 7 7.3-4.2.8-6.2 2.8-7 7.3-.8-4.5-2.8-6.5-7-7.3 4.2-.8 6.2-2.8 7-7.3z" />
        <path d="M54 72c.6 3.4 2.1 4.9 5.2 5.5-3.1.6-4.6 2.1-5.2 5.5-.6-3.4-2.1-4.9-5.2-5.5 3.1-.6 4.6-2.1 5.2-5.5z" />
      </g>

      {/* ground shadow */}
      <ellipse cx="130" cy="183" rx="66" ry="7" fill="#63243D" opacity=".12" />

      {/* body & feet */}
      <ellipse cx="130" cy="156" rx="50" ry="32" fill="#F7E4D0" />
      <ellipse cx="104" cy="181" rx="15" ry="8" fill="#F7E4D0" stroke="#E7CBB0" strokeWidth="1.5" />
      <ellipse cx="156" cy="181" rx="15" ry="8" fill="#F7E4D0" stroke="#E7CBB0" strokeWidth="1.5" />

      {/* head */}
      <ellipse cx="130" cy="94" rx="58" ry="50" fill="#FBEDE0" stroke="#EBD2BA" strokeWidth="1.5" />
      {/* patch over one eye */}
      <ellipse cx="153" cy="90" rx="17" ry="15" fill="#EFD3B6" />

      {/* floppy ears */}
      <path d="M88 58C63 56 50 84 56 112c3 15 17 19 25 9 9-12 15-38 17-52 1-6-4-11-10-11z" fill="#C89A79" />
      <path d="M172 58c25-2 38 26 32 54-3 15-17 19-25 9-9-12-15-38-17-52-1-6 4-11 10-11z" fill="#C89A79" />
      <path d="M84 68c-12 6-18 22-16 38" stroke="#B88765" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".6" />
      <path d="M176 68c12 6 18 22 16 38" stroke="#B88765" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".6" />

      {/* happy closed eyes */}
      <g stroke="#4A2635" strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M103 93q8-9 16 0" />
        <path d="M141 93q8-9 16 0" />
      </g>

      {/* blush */}
      <ellipse cx="99" cy="108" rx="9.5" ry="5.5" fill="#F29BB9" opacity=".75" />
      <ellipse cx="161" cy="108" rx="9.5" ry="5.5" fill="#F29BB9" opacity=".75" />

      {/* muzzle, nose, mouth, tongue */}
      <ellipse cx="130" cy="113" rx="21" ry="15" fill="#FFF7EE" />
      <path d="M122 104.5q8-5.5 16 0q-2 7.5-8 8.5q-6-1-8-8.5z" fill="#4A2635" />
      <ellipse cx="127" cy="105.5" rx="2.6" ry="1.5" fill="#fff" opacity=".7" />
      <path d="M130 113v3.5M130 116.5q-5 5.5-10 1.5M130 116.5q5 5.5 10 1.5" stroke="#4A2635" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <path d="M126.5 119.5q3.5 9 7 0z" fill="#F07FA6" />

      {/* the heart it's holding */}
      <g transform="translate(103 128) scale(2.25)">
        <path d={HEART_D} fill="url(#pup-heart)" />
        <path d="M6.4 7.4c-1.4.3-2.3 1.6-2.2 3" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity=".75" />
      </g>
      {/* paws hugging the heart */}
      <ellipse cx="104" cy="153" rx="11" ry="9" fill="#FBEDE0" stroke="#EBD2BA" strokeWidth="1.5" />
      <ellipse cx="156" cy="153" rx="11" ry="9" fill="#FBEDE0" stroke="#EBD2BA" strokeWidth="1.5" />

      {/* little hearts floating up */}
      <g fill="#D94C91">
        <path className="bob" style={{ '--bob-dur': '3.2s' }} d={HEART_D} transform="translate(190 34) scale(.7)" />
        <path className="bob" style={{ '--bob-dur': '3.8s', '--bob-delay': '-1s' }} d={HEART_D} transform="translate(56 40) scale(.55)" opacity=".8" />
      </g>
    </svg>
  )
}
