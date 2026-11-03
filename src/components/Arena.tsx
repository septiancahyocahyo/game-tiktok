import { AnimatePresence, motion } from 'framer-motion'
import { VIPS, type Vip } from '../data'
import { useGame } from '../store'
import VipAvatar from './VipAvatar'

function VipColumn({ side, panic }: { side: 'opp' | 'gov'; panic: boolean }) {
  const list = VIPS.filter((v) => v.side === side)
  const pos = side === 'opp' ? { left: '1%' } : { right: '1%' }
  return (
    <div className="absolute top-2 bottom-6 flex flex-col justify-around items-center" style={{ ...pos, width: '14%' }}>
      {list.map((v: Vip) => (
        <motion.div
          key={v.id} className="flex flex-col items-center"
          animate={panic ? { x: [-3, 3, -3], rotate: [-6, 6, -6] } : { y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: panic ? 0.25 : 2 }}
        >
          <VipAvatar vip={v} size={40} />
          <div className="text-[8px] font-bold text-center leading-none mt-0.5 bg-black/60 rounded px-1">{v.name.split(' ').slice(-1)[0]}</div>
        </motion.div>
      ))}
    </div>
  )
}

function Crowd({ side, line }: { side: 'opp' | 'gov'; line: number }) {
  const { shieldUntil, weakUntil, slowUntil, now } = useGame()
  const opp = side === 'opp'
  const shield = !opp && shieldUntil > now
  const weak = !opp && weakUntil > now
  const slow = opp && slowUntil > now
  const rows = [0, 1, 2, 3]
  const cols = opp ? ['✊', '🏃', '🏃'] : ['🛡️', '👮', '👮']
  const front = opp ? 'justify-end' : 'justify-start'
  return (
    <div className={`flex flex-col gap-0.5 ${shield ? 'drop-shadow-[0_0_10px_#fde047]' : ''} ${weak ? 'grayscale opacity-70' : ''}`}>
      {rows.map((r) => (
        <div key={r} className={`flex ${front} ${opp ? 'flex-row-reverse' : ''}`}>
          {cols.map((c, i) => (
            <motion.span
              key={i} className="text-2xl leading-none"
              animate={{ x: opp ? [0, 4, 0] : [0, -4, 0], y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: slow ? 1.2 : 0.5 + (line > 50 ? 0 : 0.1), delay: (r + i) * 0.07 }}
            >
              {c}
            </motion.span>
          ))}
        </div>
      ))}
      <div className="text-[9px] text-center font-bold">
        {shield && '🛡️ KEBAL'}{weak && '💫 LEMAH'}{slow && '🐌 LAMBAT'}
      </div>
    </div>
  )
}

export default function Arena() {
  const { line, tapFx } = useGame()
  const clash = 15 + line * 0.7 // posisi bentrokan dalam kontainer 150%
  const panicGov = line > 70
  const panicOpp = line < 30
  return (
    <div className="h-full relative overflow-hidden bg-gradient-to-b from-slate-700 to-slate-900">
      <div className="absolute bottom-0 inset-x-0 h-1/3 bg-neutral-800" />
      <motion.div
        className="absolute top-0 bottom-0 left-0"
        style={{ width: '150%' }}
        animate={{ x: `${-(line / 100) * 33.333}%` }}
        transition={{ type: 'spring', stiffness: 60, damping: 16 }}
      >
        <div className="absolute bottom-[14%] inset-x-0 border-t-4 border-dashed border-yellow-300/30" />
        <VipColumn side="opp" panic={panicOpp} />
        <VipColumn side="gov" panic={panicGov} />
        <motion.div
          className="absolute bottom-[10%] flex items-end gap-1"
          style={{ transform: 'translateX(-50%)' }}
          animate={{ left: `${clash}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 14 }}
        >
          <div className="absolute -top-7 left-0 text-xl">🚩📢</div>
          <Crowd side="opp" line={line} />
          <motion.div className="text-4xl self-center" animate={{ scale: [1, 1.4, 1], rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 0.5 }}>💥</motion.div>
          <Crowd side="gov" line={line} />
          <AnimatePresence>
            {tapFx.map((f) => (
              <motion.div
                key={f.id} className="absolute -top-2 pointer-events-none"
                style={{ left: `calc(50% + ${f.dx + (f.side === 'opp' ? -50 : 50)}px)` }}
                initial={{ y: 0, opacity: 1, scale: 0.6 }} animate={{ y: -50, opacity: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }}
              >
                <div className={`w-6 h-6 rounded-full border-2 border-white text-[10px] flex items-center justify-center font-bold ${f.side === 'opp' ? 'bg-blue-600' : 'bg-red-600'}`}>
                  {f.user[0]?.toUpperCase()}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <div className="absolute bottom-1 inset-x-3 flex justify-between text-[9px] text-white/50 font-bold">
        <span>◀ Geser ke Kiri</span><span>Geser ke Kanan ▶</span>
      </div>
    </div>
  )
}

