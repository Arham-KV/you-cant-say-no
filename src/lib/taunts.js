// Messages the runaway NO button says. Early ones are random,
// later ones escalate in order, then loop randomly.

const EARLY = [
  'nope 😌',
  'too slow 😂',
  'nice try',
  "you can't catch me",
  'hehe no',
  'not happening 🙈',
  'try again',
  'almost!',
  'whoosh 💨',
  'wrong button, cutie',
]

const LATE = [
  'girl be serious 😭',
  "you really thought I'd let you say no?",
  'the yes button is RIGHT there 👉',
  'ok this is getting embarrassing',
  'I will run forever. I have cardio.',
  "I'm literally a decoy 🥲",
  "so stubborn. it's cute though.",
  'just press yes 😮‍💨',
]

export const LATE_AFTER = 6

export function pickTaunt(attempt, used) {
  if (attempt >= LATE_AFTER) {
    const i = attempt - LATE_AFTER
    return i < LATE.length ? LATE[i] : LATE[Math.floor(Math.random() * LATE.length)]
  }
  const pool = EARLY.filter((t) => !used.includes(t))
  const pick = pool[Math.floor(Math.random() * pool.length)] ?? EARLY[0]
  used.push(pick)
  return pick
}

export function hintFor(n) {
  if (n === 0) return 'choose wisely 🤭'
  if (n < 3) return 'hmm. interesting choice 🤔'
  if (n < 6) return 'the yes button is feeling a little ignored 🥺'
  if (n < 10) return `you've tried ${n} times. I admire the commitment 😂`
  return `${n} attempts. the yes button is right there, I promise ❤️`
}
