import { create } from 'zustand'
import { GIFTS, VIPS, getVip, type Side, type VipId } from './data'

export const SKILL_MS = 4800
const RUSH_MS = 20000
const RUSH_EVERY = 180000
const STREAK_GOAL = 50

type Kind = 'comment' | 'tap' | 'gift' | 'skill' | 'dot'

export interface Comment { id: number; user: string; text: string }
export interface Skill { key: number; vip: VipId; sender: string; light: boolean; startedAt: number }
export interface TapFx { id: number; side: Side; user: string; dx: number; born: number }
export interface Banner { id: number; side: Side; text: string; at: number }

interface State {
  line: number
  rounds: { opp: number; gov: number }
  banner: Banner | null
  oppComments: Comment[]
  govComments: Comment[]
  leaderboard: Record<string, number>
  skill: Skill | null
  queue: Skill[]
  weakUntil: number
  shieldUntil: number
  slowUntil: number
  dotUntil: number
  dotRate: number
  rushUntil: number
  nextRushAt: number
  autoRush: boolean
  streak: { side: Side | null; count: number }
  tapFx: TapFx[]
  now: number
  lastLog: string

  comment: (user: string, raw: string) => boolean
  tap: (side: Side, user: string, count: number) => void
  gift: (user: string, giftId: string, side: Side) => void
  tick: () => void
  startRush: () => void
  setAutoRush: (v: boolean) => void
  addStreak: (side: Side, n: number) => void
  setLine: (v: number) => void
  reset: () => void
}

let uid = 1
const next = () => uid++

const seed = (side: Side): Comment[] =>
  (side === 'opp'
    ? ['Kawal terus!!', 'Maju terus bang Windah!', 'Suara rakyat suara Tuhan', 'Data bicara, bukan opini']
    : ['Gas lanjutkan!!', 'Pertahankan barisan!', 'Siap pak!', 'Stabilitas nomor satu']
  ).map((text) => ({ id: next(), user: 'sistem', text }))

/** Hitung dorongan garis bentrok + modifier buff. */
function pushed(s: State, side: Side, amount: number, kind: Kind): Partial<State> {
  const t = Date.now()
  let a = amount
  if (kind === 'comment' || kind === 'tap') {
    if (s.rushUntil > t) a *= 5
    if (side === 'opp') {
      if (s.shieldUntil > t) a = 0
      else if (s.slowUntil > t) a *= 0.5
    }
  }
  if (side === 'opp' && s.weakUntil > t) a *= 1.5
  const line = Math.max(0, Math.min(100, s.line + (side === 'opp' ? a : -a)))
  if (line >= 100 || line <= 0) {
    const w: Side = line >= 100 ? 'opp' : 'gov'
    return {
      line: 50,
      rounds: { ...s.rounds, [w]: s.rounds[w] + 1 },
      banner: { id: next(), at: t, side: w, text: w === 'opp' ? 'OPOSISI MENANG RONDE!' : 'PEMERINTAH MENANG RONDE!' },
      shieldUntil: 0, weakUntil: 0, slowUntil: 0, dotUntil: 0,
    }
  }
  return { line }
}

function startSkill(s: State, sk: Skill): Partial<State> {
  const t = Date.now()
  const f = sk.light ? 0.5 : 1
  const merge = (p: Partial<State>, extra: Partial<State>) => ({ ...p, ...extra })
  switch (sk.vip) {
    case 'windah': return pushed(s, 'opp', 8 * f, 'skill')
    case 'pandji': return merge(pushed(s, 'opp', 2 * f, 'skill'), { weakUntil: t + 8000 * f, shieldUntil: 0 })
    case 'ferry': return { dotUntil: t + 10000 * f, dotRate: 1.5 }
    case 'prabowo': return pushed(s, 'gov', 15 * f, 'skill')
    case 'teddy': return merge(pushed(s, 'gov', 4 * f, 'skill'), { shieldUntil: t + 8000 * f })
    case 'bahlil': return merge(pushed(s, 'gov', 6 * f, 'skill'), { slowUntil: t + 8000 * f })
  }
}

const initial = () => ({
  line: 50,
  rounds: { opp: 0, gov: 0 },
  banner: null as Banner | null,
  oppComments: seed('opp'),
  govComments: seed('gov'),
  leaderboard: {} as Record<string, number>,
  skill: null as Skill | null,
  queue: [] as Skill[],
  weakUntil: 0, shieldUntil: 0, slowUntil: 0, dotUntil: 0, dotRate: 0, rushUntil: 0,
  nextRushAt: Date.now() + RUSH_EVERY,
  streak: { side: null as Side | null, count: 0 },
  tapFx: [] as TapFx[],
  now: Date.now(),
  lastLog: '',
})

export const useGame = create<State>((set) => ({
  ...initial(),
  autoRush: true,

  comment: (user, raw) => {
    const m = raw.trim().match(/^([12])(?:\s+(.*))?$/s)
    if (!m) return false
    const side: Side = m[1] === '1' ? 'opp' : 'gov'
    const c: Comment = { id: next(), user, text: `${m[1]} ${m[2] ?? ''}`.trim() }
    set((s) => {
      const streak = s.streak.side === side ? { side, count: s.streak.count + 1 } : { side, count: 1 }
      let queue = s.queue
      if (streak.count >= STREAK_GOAL) {
        const pool = VIPS.filter((v) => v.side === side)
        const vip = pool[Math.floor(Math.random() * pool.length)]
        queue = [...queue, { key: next(), vip: vip.id, sender: `Komunitas (${STREAK_GOAL} komen!)`, light: true, startedAt: 0 }]
        streak.count = 0
      }
      const key = side === 'opp' ? 'oppComments' : 'govComments'
      return {
        ...pushed(s, side, 0.5, 'comment'),
        [key]: [...s[key], c].slice(-10),
        streak, queue,
      }
    })
    return true
  },

  tap: (side, user, count) =>
    set((s) => {
      const t = Date.now()
      const fx: TapFx[] = Array.from({ length: Math.min(count, 4) }, () => ({
        id: next(), side, user, dx: Math.random() * 100 - 50, born: t,
      }))
      return { ...pushed(s, side, 0.2 * count, 'tap'), tapFx: [...s.tapFx, ...fx].slice(-24) }
    }),

  gift: (user, giftId, side) =>
    set((s) => {
      const g = GIFTS.find((x) => x.id === giftId)!
      const leaderboard = { ...s.leaderboard, [user]: (s.leaderboard[user] ?? 0) + g.coins }
      if (g.vip) {
        const sk: Skill = { key: next(), vip: g.vip, sender: user, light: false, startedAt: 0 }
        return { leaderboard, queue: [...s.queue, sk], lastLog: `${user} → ${g.name} → ${getVip(g.vip).name}` }
      }
      return { leaderboard, ...pushed(s, side, g.push, 'gift') }
    }),

  tick: () =>
    set((s) => {
      const t = Date.now()
      let st: State = { ...s, now: t }
      const apply = (p: Partial<State>) => { st = { ...st, ...p } }

      if (st.dotUntil > t) apply(pushed(st, 'opp', st.dotRate * 0.1, 'dot'))
      if (st.skill && t - st.skill.startedAt > SKILL_MS) apply({ skill: null })
      if (!st.skill && st.queue.length) {
        const [sk, ...rest] = st.queue
        const started = { ...sk, startedAt: t }
        apply({ skill: started, queue: rest })
        apply(startSkill(st, started))
      }
      if (st.autoRush && t >= st.nextRushAt) apply({ rushUntil: t + RUSH_MS, nextRushAt: t + RUSH_EVERY })
      if (st.tapFx.length) apply({ tapFx: st.tapFx.filter((f) => t - f.born < 2000) })
      if (st.banner && t - st.banner.at > 3000) apply({ banner: null })
      return st
    }),

  startRush: () => set(() => ({ rushUntil: Date.now() + RUSH_MS })),
  setAutoRush: (autoRush) => set(() => ({ autoRush })),
  addStreak: (side, n) => set((s) => ({ streak: { side, count: (s.streak.side === side ? s.streak.count : 0) + n } })),
  setLine: (line) => set(() => ({ line })),
  reset: () => set((s) => ({ ...initial(), autoRush: s.autoRush })),
}))

