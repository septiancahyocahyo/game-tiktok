import { useGame, type Comment } from '../store'

function Strip({ list, color, rev }: { list: Comment[]; color: string; rev?: boolean }) {
  const content = list.map((c) => (
    <span key={c.id} className="mx-5 font-semibold text-sm">
      <span className="opacity-70 text-xs">@{c.user}</span> {c.text}
    </span>
  ))
  return (
    <div className={`flex-1 flex items-center overflow-hidden ${color}`}>
      <span className="px-2 font-black text-xs shrink-0 bg-black/40 h-full flex items-center">{rev ? '<<' : '>>'}</span>
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
  const { oppComments, govComments } = useGame()
  return (
    <div className="h-full flex flex-col justify-stretch">
      <Strip list={oppComments} color="bg-blue-700" />
      <Strip list={govComments} color="bg-red-700" rev />
    </div>
  )
}
