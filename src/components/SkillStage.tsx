import { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getVip, VIPS, type VipId } from '../data'
import { useGame, type Skill } from '../store'
import VipAvatar from './VipAvatar'

type Mode = 'runRight' | 'rise' | 'rain' | 'flyLeft' | 'pop'
const FX: Record<VipId, { items: string[]; mode: Mode; count: number }> = {
  windah: { items: ['🧒', '👦', '🧒🏽', '👧'], mode: 'runRight', count: 22 },
  pandji: { items: ['😂', '🤣', '🎤', '👏'], mode: 'rise', count: 18 },
  ferry: { items: ['📊', '📈', 'DATA', 'FAKTA', 'LOGIKA', '🧠'], mode: 'pop', count: 14 },
  prabowo: { items: ['📦', '🎁', '💃', '🇮🇩'], mode: 'rain', count: 20 },
  teddy: { items: ['🛡️', '🫡', 'SIAP!', '🎖️'], mode: 'pop', count: 12 },
  bahlil: { items: ['🍈', '📑', '🚧', '🍈'], mode: 'flyLeft', count: 16 },
}

function Particles({ vip }: { vip: VipId }) {
  const { items, mode, count } = FX[vip]
  const ps = useMemo(
    () => Array.from({ length: count }, (_, i) => ({
      e: items[i % items.length], x: Math.random() * 90, y: Math.random() * 80,
      d: 1.4 + Math.random() * 1.6, delay: Math.random() * 2.4,
    })),
    [items, count],
  )
  return (
    <>
      {ps.map((p, i) => {
        const base = 'absolute text-2xl font-black pointer-events-none drop-shadow'
        const style = { left: `${p.x}%`, top: `${p.y}%` }
        const tr = { duration: p.d, delay: p.delay, ease: 'linear' as const }
        const anim =
          mode === 'runRight' ? { initial: { x: -80, opacity: 1 }, animate: { x: 620 }, style: { left: 0, top: `${p.y}%` } } :
          mode === 'flyLeft' ? { initial: { x: 620, rotate: 0 }, animate: { x: -80, rotate: -720 }, style: { left: 0, top: `${p.y}%` } } :
          mode === 'rise' ? { initial: { y: 240, opacity: 1 }, animate: { y: -40 }, style: { left: style.left, top: 0 } } :
          mode === 'rain' ? { initial: { y: -50 }, animate: { y: 260, rotate: 180 }, style: { left: style.left, top: 0 } } :
          { initial: { scale: 0, opacity: 1 }, animate: { scale: [0, 1.8, 0], opacity: [1, 1, 0] }, style }
        return <motion.div key={i} className={base} initial={anim.initial} animate={anim.animate} transition={tr} style={anim.style}>{p.e}</motion.div>
      })}
    </>
  )
}

function Playing({ sk }: { sk: Skill }) {
  const vip = getVip(sk.vip)
  const left = vip.side === 'opp'
  return (
    <motion.div
      key={sk.key}
      className="absolute inset-0 overflow-hidden"
      style={{ background: `linear-gradient(120deg, ${vip.from}, #0b0d14 70%)` }}
      initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
    >
      <Particles vip={sk.vip} />
      <div className={`absolute inset-0 flex items-center gap-3 px-4 ${left ? '' : 'flex-row-reverse text-right'}`}>
        <motion.div
          initial={{ x: left ? -200 : 200, scale: 0.4 }}
          animate={{ x: 0, scale: [1, 1.1, 1] }}
          transition={{ x: { type: 'spring', stiffness: 120, damping: 12 }, scale: { repeat: Infinity, duration: 0.7 } }}
        >
          <VipAvatar vip={vip} size={96} glow />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex-1 min-w-0">
          {sk.light && <div className="inline-block text-[10px] bg-yellow-400 text-black font-bold rounded px-1.5 mb-1">PREVIEW GRATIS</div>}
          <div className="text-[11px] uppercase tracking-widest text-white/70">{vip.name}</div>
          <div className="text-2xl font-black leading-tight drop-shadow-lg">{vip.skillName}</div>
          <div className="text-[11px] text-white/80 mt-0.5">{vip.effect}</div>
          <div className="mt-1.5 inline-block bg-black/50 rounded-full px-2.5 py-0.5 text-xs">🎁 @{sk.sender}</div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function SkillStage() {
  const skill = useGame((s) => s.skill)
  const queue = useGame((s) => s.queue.length)
  return (
    <div className="h-full p-1.5">
      <div className="relative h-full rounded-xl overflow-hidden border border-white/20 bg-slate-950">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <div className="text-xs tracking-widest text-white/50 font-bold">🎬 PANGGUNG SKILL</div>
          <div className="flex gap-2">
            {VIPS.map((v, i) => (
              <motion.div key={v.id} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1.6, delay: i * 0.15 }}>
                <VipAvatar vip={v} size={44} />
              </motion.div>
            ))}
          </div>
          <div className="text-[11px] text-white/60">Kirim gift untuk memanggil tokoh VIP!</div>
        </div>
        <AnimatePresence mode="wait">{skill && <Playing key={skill.key} sk={skill} />}</AnimatePresence>
        {queue > 0 && <div className="absolute top-1 right-2 text-[10px] bg-black/60 rounded px-1.5 py-0.5">Antrean: {queue}</div>}
      </div>
    </div>
  )
}

