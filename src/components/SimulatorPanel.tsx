import { useEffect, useRef, useState } from 'react'
import { GIFTS, USERS, VIPS, getVip, type Side } from '../data'
import { useGame } from '../store'

const rand = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)]
const MSGS = { opp: ['Kawal terus!!', 'Hidup rakyat!', 'Turunkan harga!', 'Windah the best'], gov: ['Gas lanjutkan!', 'Pertahankan barisan!', 'Siap komandan!', 'NKRI harga mati'] }

const Sec = ({ t, children }: { t: string; children: React.ReactNode }) => (
  <section className="bg-white/5 rounded-xl p-3 border border-white/10">
    <h3 className="text-xs font-black tracking-wider text-yellow-300 mb-2 uppercase">{t}</h3>
    {children}
  </section>
)
const btn = 'rounded-md px-2 py-1.5 text-xs font-bold active:scale-95 transition'
const blue = `${btn} bg-blue-600 hover:bg-blue-500`
const red = `${btn} bg-red-600 hover:bg-red-500`
const gray = `${btn} bg-slate-700 hover:bg-slate-600`

export default function SimulatorPanel() {
  const g = useGame()
  const [user, setUser] = useState('Sultan_99')
  const [text, setText] = useState('1 Kawal terus!!')
  const [auto, setAuto] = useState(false)
  const [giftSide, setGiftSide] = useState<Side>('opp')
  const [err, setErr] = useState('')
  const ref = useRef({ user })
  ref.current.user = user

  useEffect(() => {
    if (!auto) return
    const id = setInterval(() => {
      const s = useGame.getState()
      s.tap('opp', rand(USERS), 1)
      s.tap('gov', rand(USERS), 1)
    }, 150)
    return () => clearInterval(id)
  }, [auto])

  const send = (raw = text) => setErr(g.comment(user, raw) ? '' : 'Komentar harus diawali "1" atau "2"')
  const spam = (side: Side, n: number) => {
    for (let i = 0; i < n; i++) g.comment(rand(USERS), `${side === 'opp' ? 1 : 2} ${rand(MSGS[side])}`)
  }
  const rushLeft = Math.max(0, Math.ceil((g.rushUntil - g.now) / 1000))
  const nextRush = Math.max(0, Math.ceil((g.nextRushAt - g.now) / 1000))

  return (
    <aside className="w-[400px] shrink-0 h-full overflow-y-auto bg-slate-950 border-l border-white/10 p-4 space-y-3">
      <h2 className="text-lg font-black">🎛️ Control Panel Simulator</h2>

      <Sec t="Pengguna">
        <div className="flex gap-2">
          <input value={user} onChange={(e) => setUser(e.target.value)} className="flex-1 bg-slate-800 rounded px-2 py-1.5 text-sm outline-none" />
          <button className={gray} onClick={() => setUser(rand(USERS))}>🎲 Acak</button>
        </div>
      </Sec>

      <Sec t="Komentar (1 = Oposisi, 2 = Pemerintah)">
        <div className="flex gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} className="flex-1 bg-slate-800 rounded px-2 py-1.5 text-sm outline-none" />
          <button className={gray} onClick={() => send()}>Kirim</button>
        </div>
        {err && <div className="text-xs text-red-400 mt-1">{err}</div>}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button className={blue} onClick={() => send(`1 ${rand(MSGS.opp)}`)}>1 Cepat</button>
          <button className={red} onClick={() => send(`2 ${rand(MSGS.gov)}`)}>2 Cepat</button>
          <button className={blue} onClick={() => spam('opp', 10)}>Spam 1 ×10</button>
          <button className={red} onClick={() => spam('gov', 10)}>Spam 2 ×10</button>
        </div>
        <div className="text-[11px] text-white/50 mt-2">Streak: {g.streak.side ? (g.streak.side === 'opp' ? '🔵' : '🔴') : '-'} {g.streak.count}/50</div>
      </Sec>

      <Sec t="Tap-Tap Layar (Like)">
        <div className="grid grid-cols-3 gap-2">
          {[1, 10, 50].map((n) => <button key={`o${n}`} className={blue} onClick={() => g.tap('opp', user, n)}>🔵 Tap ×{n}</button>)}
          {[1, 10, 50].map((n) => <button key={`g${n}`} className={red} onClick={() => g.tap('gov', user, n)}>🔴 Tap ×{n}</button>)}
        </div>
        <label className="flex items-center gap-2 text-xs mt-2">
          <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} /> Auto tap-spam kedua kubu
        </label>
      </Sec>

      <Sec t="Kirim Gift (trigger Panggung Animasi)">
        <div className="grid grid-cols-2 gap-2">
          {GIFTS.filter((x) => x.vip).map((x) => {
            const v = getVip(x.vip!)
            return (
              <button key={x.id} className={`${btn} text-left ${v.side === 'opp' ? 'bg-blue-900 hover:bg-blue-800' : 'bg-red-900 hover:bg-red-800'}`} onClick={() => g.gift(user, x.id, v.side)}>
                {x.emoji} {x.name} <span className="opacity-60">({x.coins})</span><br />
                <span className="font-normal opacity-80">{v.name}</span>
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <button className={gray} onClick={() => g.gift(user, 'mawar', giftSide)}>🌹 Mawar +5</button>
          <select value={giftSide} onChange={(e) => setGiftSide(e.target.value as Side)} className="bg-slate-800 rounded px-2 py-1.5 text-xs">
            <option value="opp">untuk Oposisi 🔵</option><option value="gov">untuk Pemerintah 🔴</option>
          </select>
        </div>
        <button className={`${gray} w-full mt-2`} onClick={() => VIPS.forEach((v) => g.gift(user, GIFTS.find((x) => x.vip === v.id)!.id, v.side))}>🎬 Antre semua 6 skill</button>
      </Sec>

      <Sec t="Plan B & Event">
        <div className="grid grid-cols-2 gap-2">
          <button className={gray} onClick={g.startRush}>🚨 Jam Rawan Demo {rushLeft > 0 ? `(${rushLeft}s)` : ''}</button>
          <button className={gray} onClick={() => g.addStreak(g.streak.side ?? 'opp', 49)}>+49 streak</button>
        </div>
        <label className="flex items-center gap-2 text-xs mt-2">
          <input type="checkbox" checked={g.autoRush} onChange={(e) => g.setAutoRush(e.target.checked)} /> Auto tiap 3 menit (berikutnya {nextRush}s)
        </label>
      </Sec>

      <Sec t="Status Game">
        <div className="text-xs mb-1">Garis bentrok: <b>{g.line.toFixed(1)}</b></div>
        <input type="range" min={0} max={100} step={0.5} value={g.line} onChange={(e) => g.setLine(+e.target.value)} className="w-full" />
        <button className={`${gray} w-full mt-2`} onClick={g.reset}>♻️ Reset semua</button>
      </Sec>
    </aside>
  )
}

