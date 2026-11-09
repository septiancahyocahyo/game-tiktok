import { useState } from 'react'
import { type Vip } from '../data'

export default function VipAvatar({ vip, size = 48, glow = false }: { vip: Vip; size?: number; glow?: boolean }) {
  const [imgError, setImgError] = useState(false)
  const imageSrc = `/assets/vips/${vip.id}.png`

  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 border-2 border-white/80 overflow-hidden"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.55,
        background: `linear-gradient(135deg, ${vip.from}, ${vip.to})`,
        boxShadow: glow ? `0 0 ${size / 2}px ${vip.to}` : '0 2px 6px rgba(0,0,0,.5)',
      }}
    >
      {!imgError ? (
        <img
          src={imageSrc}
          alt={vip.name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span>{vip.emoji}</span>
      )}
    </div>
  )
}
