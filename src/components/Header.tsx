import { useGame } from '../store'

export default function Header() {
  const rounds = useGame((s) => s.rounds)
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-black to-slate-900 px-3 py-1">
      <div className="flex-1 flex items-center justify-between font-black text-lg">
        <span className="text-blue-400">🔵 OPOSISI <span className="bg-blue-600 text-white rounded px-2 ml-1">{rounds.opp}</span></span>
        <span className="text-xs text-white/50">vs</span>
        <span className="text-red-400"><span className="bg-red-600 text-white rounded px-2 mr-1">{rounds.gov}</span> PEMERINTAH 🔴</span>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-2 text-[11px] leading-tight text-center items-center">
        <div className="bg-blue-600/30 border border-blue-500 rounded px-1 py-0.5">💬 Ketik <b>"1 [Pesan]"</b><br />Dukung Oposisi 🔵</div>
        <div className="bg-red-600/30 border border-red-500 rounded px-1 py-0.5">💬 Ketik <b>"2 [Pesan]"</b><br />Dukung Pemerintah 🔴</div>
      </div>
    </div>
  )
}

