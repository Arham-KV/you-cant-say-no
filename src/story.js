import { daysFromToday } from './lib/dates'

export const STEPS = ['intro', 'question', 'reaction', 'when', 'food', 'confirm', 'fee', 'final']

// Each chapter: the little handwritten label, the sticker on the card corner,
// and the background aura colors it fades into.
export const CHAPTERS = {
  intro: { label: 'a tiny letter for you', sticker: '💌', aura: ['#F3B6CE', '#FAD9CB', '#EBD6F2'] },
  question: { label: 'chapter one · the question', sticker: '🌷', aura: ['#F2AFCB', '#F6CFE0', '#E6D3F5'] },
  reaction: { label: 'chapter two · plot twist', sticker: '🙈', aura: ['#F59AC2', '#FFD3C2', '#F3C3E3'] },
  when: { label: 'chapter three · the plan', sticker: '🗓️', aura: ['#E8C2EE', '#F7C9DB', '#FCE0CF'] },
  food: { label: 'chapter four · the menu', sticker: '🍓', aura: ['#FFCDB8', '#F5B4CF', '#FBE3C4'] },
  confirm: { label: 'chapter five · it’s a date', sticker: '🥂', aura: ['#F3A8C8', '#F9D5C0', '#F0CDE9'] },
  fee: { label: 'chapter six · uh oh', sticker: '🧾', aura: ['#DCD3F0', '#F2C6DA', '#D9E6F2'] },
  final: { label: 'the end (or the beginning?)', sticker: '💖', aura: ['#F49CC4', '#FFD7B8', '#F7C1DC'] },
}

export const initialState = { step: 'intro', date: null, time: null, food: null, noAttempts: 0 }

export function storyReducer(state, action) {
  switch (action.type) {
    case 'go':
      return STEPS.includes(action.step) ? { ...state, step: action.step } : state
    case 'set':
      return { ...state, ...action.values }
    case 'noAttempt':
      return { ...state, noAttempts: state.noAttempts + 1 }
    case 'reset':
      return { ...initialState }
    default:
      return state
  }
}

// Keep progress if she refreshes mid-story (per tab). Fully optional; failures are ignored.
const KEY = 'a-very-important-question:v1'

export function loadState() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(KEY) || 'null')
    if (!saved || !STEPS.includes(saved.step)) return initialState
    const state = { ...initialState, ...saved }
    if (state.date && daysFromToday(state.date) < 0) {
      // A date in the past is stale — send her back to pick again.
      return { ...state, date: null, time: null, step: STEPS.indexOf(state.step) > 3 ? 'when' : state.step }
    }
    if (STEPS.indexOf(state.step) > 3 && (!state.date || !state.time)) return { ...state, step: 'when' }
    if (STEPS.indexOf(state.step) > 4 && !state.food) return { ...state, step: 'food' }
    return state
  } catch {
    return initialState
  }
}

export function saveState(state) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* storage blocked — the story still works, it just won't survive a refresh */
  }
}
