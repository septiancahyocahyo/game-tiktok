import { GIFTS, getVip } from '../data'
import { useGame } from '../store'

export default function Hud() {
  const leaderboard = useGame((s) => s.leaderboard)
  const top = Object.entries(leaderboard).sort((a, b) => b[1] - a[1]).slice(0, 3)
  return (
    <div className="h-full flex">
      <div className="w-[60%] h-full bg-black/75 p-2 text-[11px] flex flex-col gap-1.5 overflow-hidden">
        <div className="font-black text-xs text-yellow-300">🎁 HARGA SKILL GIFT</div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
          {GIFTS.map((g) => (
            <div key={g.id} className="leading-tight">
              {g.emoji} {g.name} <span className="text-white/50">{g.vip ? `→ ${getVip(g.vip).name.split(' ')[0]}` : '+5 dorong'}</span>
            </div>
          ))}
        </div>
        <div className="font-black text-xs text-yellow-300 mt-1">🏆 MVP</div>
        {top.length === 0 && <div className="text-white/40">Belum ada gifter…</div>}
        {top.map(([u, c], i) => (
          <div key={u} className="flex justify-between bg-white/10 rounded px-1.5 py-0.5">
            <span>{['🥇', '🥈', '🥉'][i]} @{u}</span><b>{c}</b>
          </div>
        ))}
      </div>
      <div className="w-[40%] h-full flex items-end justify-center p-2">
        <div className="w-full h-[85%] border-2 border-dashed border-white/30 rounded-xl flex flex-col items-center justify-center text-white/40 text-xs">
          <div className="text-4xl">🧑‍💻</div>WAJAH HOST
        </div>
      </div>
    </div>
  )
}

