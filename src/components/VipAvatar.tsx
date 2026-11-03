import { type Vip } from '../data'

export default function VipAvatar({ vip, size = 48, glow = false }: { vip: Vip; size?: number; glow?: boolean }) {
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 border-2 border-white/80"
      style={{
        width: size, height: size, fontSize: size * 0.55,
        background: `linear-gradient(135deg, ${vip.from}, ${vip.to})`,
        boxShadow: glow ? `0 0 ${size / 2}px ${vip.to}` : '0 2px 6px rgba(0,0,0,.5)',
      }}
    >
      {vip.emoji}
    </div>
  )
}

