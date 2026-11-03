import { useGame, type Comment } from '../store'

function Strip({ list, color, rev }: { list: Comment[]; color: string; rev?: boolean }) {
  const content = list.map((c) => (
    <span key={c.id} className="mx-5 font-semibold text-sm">
      <span className="opacity-70 text-xs">@{c.user}</span> {c.text}
    </span>
  ))
  return (
    <div className={`flex-1 flex items-center overflow-hidden ${color}`}>
      <span className="px-1.5 font-black text-sm shrink-0 bg-black/30 h-full flex items-center">{rev ? '<<' : '>>'}</span>
      <div className="overflow-hidden flex-1">
        <div className={`marquee ${rev ? 'rev' : ''}`}>
          <span className="inline-flex">{content}</span>
          <span className="inline-flex">{content}</span>
        </div>
      </div>
    </div>
  )
}

export default function RunningText() {
  const { oppComments, govComments, line } = useGame()
  const opp = Math.round(line)
  return (
    <div className="h-full flex flex-col">
      <Strip list={oppComments} color="bg-blue-700" />
      <div className="flex-1 relative bg-slate-900 flex items-center text-[11px] font-black">
        <div className="absolute inset-y-0 left-0 bg-blue-500 transition-all duration-200" style={{ width: `${line}%` }} />
        <div className="absolute inset-y-0 right-0 bg-red-500 transition-all duration-200" style={{ width: `${100 - line}%` }} />
        <div className="relative z-10 flex w-full justify-between px-2 drop-shadow">
          <span>⬅️ OPOSISI {opp}%</span><span>⚡</span><span>{100 - opp}% PEMERINTAH ➡️</span>
        </div>
      </div>
      <Strip list={govComments} color="bg-red-700" rev />
    </div>
  )
}

