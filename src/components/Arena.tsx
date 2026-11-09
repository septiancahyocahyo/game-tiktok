import { AnimatePresence, motion } from 'framer-motion'
import { VIPS, type Vip } from '../data'
import { useGame } from '../store'
import VipAvatar from './VipAvatar'

const MAHASISWA_SPRITES = {
  merah: '/assets/characters/mahasiswa-merah.png',
  biru: '/assets/characters/mahasiswa-biru.png',
  hijau: '/assets/characters/mahasiswa-hijau.png',
}
const POLISI_SPRITE = '/assets/characters/polisi-w-tameng.png'

interface MahasiswaSpec {
  id: string
  sprite: string
  /** Jarak sisi kanan gambar (bagian depan mahasiswa) dari titik bentrok (px) */
  right: number
  /** Posisi vertikal kaki dari bawah arena (px) */
  bottom: number
  /** Tinggi gambar sprite (px) */
  height: number
  /** Layer urutan render */
  z: number
  /** Tingkat kecerahan untuk efek kedalaman barisan (depth) */
  brightness: number
  /** Delay animasi dorong */
  delay: number
  /** Jarak dorongan maju ke kanan (px) */
  lunge: number
}

interface PolisiSpec {
  id: string
  /** Jarak sisi kiri gambar dari titik bentrok (px, sudah dikompensasi padding tameng) */
  left: number
  /** Posisi vertikal kaki dari bawah arena (px) */
  bottom: number
  /** Tinggi gambar sprite (px) */
  height: number
  /** Layer urutan render */
  z: number
  /** Tingkat kecerahan untuk efek kedalaman barisan (depth) */
  brightness: number
  /** Delay animasi dorong */
  delay: number
  /** Jarak dorongan maju ke kiri (px, bernilai negatif) */
  lunge: number
}

// Barisan Mahasiswa (Kiri -> mendorong ke Kanan, menghadap kanan)
// Disusun 3 lapis kedalaman (Belakang, Tengah, Depan) agar tampak berbaris rapat
const MAHASISWA_UNITS: MahasiswaSpec[] = [
  // Lapis Belakang (barisan ke-3 di sisi dalam jalan)
  { id: 'm-b1', sprite: MAHASISWA_SPRITES.hijau, right: 10, bottom: 26, height: 112, z: 10, brightness: 0.76, delay: 0.05, lunge: 9 },
  { id: 'm-b2', sprite: MAHASISWA_SPRITES.merah, right: 48, bottom: 28, height: 106, z: 10, brightness: 0.76, delay: 0.14, lunge: 8 },
  { id: 'm-b3', sprite: MAHASISWA_SPRITES.biru, right: 86, bottom: 26, height: 108, z: 10, brightness: 0.74, delay: 0.22, lunge: 7 },
  { id: 'm-b4', sprite: MAHASISWA_SPRITES.hijau, right: 122, bottom: 28, height: 112, z: 10, brightness: 0.72, delay: 0.3, lunge: 6 },
  { id: 'm-b5', sprite: MAHASISWA_SPRITES.merah, right: 164, bottom: 26, height: 106, z: 10, brightness: 0.7, delay: 0.38, lunge: 6 },

  // Lapis Tengah (barisan ke-2)
  { id: 'm-m1', sprite: MAHASISWA_SPRITES.biru, right: -2, bottom: 14, height: 116, z: 20, brightness: 0.88, delay: 0.02, lunge: 11 },
  { id: 'm-m2', sprite: MAHASISWA_SPRITES.hijau, right: 30, bottom: 15, height: 122, z: 20, brightness: 0.88, delay: 0.1, lunge: 10 },
  { id: 'm-m3', sprite: MAHASISWA_SPRITES.merah, right: 72, bottom: 14, height: 116, z: 20, brightness: 0.86, delay: 0.18, lunge: 9 },
  { id: 'm-m4', sprite: MAHASISWA_SPRITES.biru, right: 110, bottom: 15, height: 116, z: 20, brightness: 0.84, delay: 0.26, lunge: 8 },
  { id: 'm-m5', sprite: MAHASISWA_SPRITES.hijau, right: 146, bottom: 14, height: 120, z: 20, brightness: 0.82, delay: 0.34, lunge: 7 },

  // Lapis Depan (ujung tombak bentrokan langsung dengan tameng polisi)
  { id: 'm-f1', sprite: MAHASISWA_SPRITES.merah, right: -8, bottom: 2, height: 124, z: 32, brightness: 1, delay: 0, lunge: 13 },
  { id: 'm-f2', sprite: MAHASISWA_SPRITES.biru, right: 24, bottom: 2, height: 122, z: 31, brightness: 1, delay: 0.07, lunge: 11 },
  { id: 'm-f3', sprite: MAHASISWA_SPRITES.hijau, right: 56, bottom: 3, height: 128, z: 30, brightness: 0.98, delay: 0.15, lunge: 10 },
  { id: 'm-f4', sprite: MAHASISWA_SPRITES.merah, right: 98, bottom: 2, height: 122, z: 29, brightness: 0.96, delay: 0.23, lunge: 8 },
  { id: 'm-f5', sprite: MAHASISWA_SPRITES.biru, right: 136, bottom: 2, height: 122, z: 28, brightness: 0.94, delay: 0.31, lunge: 7 },
]

// Barisan Polisi Bertameng (Kanan -> menahan & mendorong ke Kiri, menghadap kiri)
// Catatan: sprite polisi memiliki ruang transparan ~32px di depan tameng, sehingga left: -34 menempatkan tameng tepat di x = 0
const POLISI_UNITS: PolisiSpec[] = [
  // Lapis Belakang
  { id: 'p-b1', left: -14, bottom: 26, height: 108, z: 11, brightness: 0.74, delay: 0.05, lunge: -8 },
  { id: 'p-b2', left: 20, bottom: 28, height: 108, z: 10, brightness: 0.74, delay: 0.14, lunge: -7 },
  { id: 'p-b3', left: 54, bottom: 26, height: 108, z: 9, brightness: 0.72, delay: 0.22, lunge: -6 },
  { id: 'p-b4', left: 88, bottom: 28, height: 106, z: 8, brightness: 0.7, delay: 0.3, lunge: -6 },
  { id: 'p-b5', left: 122, bottom: 26, height: 106, z: 7, brightness: 0.68, delay: 0.38, lunge: -5 },

  // Lapis Tengah
  { id: 'p-m1', left: -24, bottom: 14, height: 116, z: 22, brightness: 0.88, delay: 0.02, lunge: -10 },
  { id: 'p-m2', left: 10, bottom: 15, height: 116, z: 21, brightness: 0.88, delay: 0.1, lunge: -9 },
  { id: 'p-m3', left: 44, bottom: 14, height: 116, z: 20, brightness: 0.86, delay: 0.18, lunge: -8 },
  { id: 'p-m4', left: 78, bottom: 15, height: 114, z: 19, brightness: 0.84, delay: 0.26, lunge: -7 },
  { id: 'p-m5', left: 112, bottom: 14, height: 114, z: 18, brightness: 0.82, delay: 0.34, lunge: -6 },

  // Lapis Depan (dinding barikade tameng utama)
  { id: 'p-f1', left: -34, bottom: 1, height: 122, z: 33, brightness: 1, delay: 0, lunge: -12 },
  { id: 'p-f2', left: 0, bottom: 1, height: 122, z: 31, brightness: 1, delay: 0.07, lunge: -10 },
  { id: 'p-f3', left: 34, bottom: 2, height: 122, z: 30, brightness: 0.98, delay: 0.15, lunge: -9 },
  { id: 'p-f4', left: 68, bottom: 1, height: 120, z: 29, brightness: 0.96, delay: 0.23, lunge: -8 },
  { id: 'p-f5', left: 102, bottom: 2, height: 120, z: 28, brightness: 0.94, delay: 0.31, lunge: -7 },
]

function VipColumn({ side, panic }: { side: 'opp' | 'gov'; panic: boolean }) {
  const list = VIPS.filter((v) => v.side === side)
  const pos = side === 'opp' ? { left: '1.2%' } : { right: '1.2%' }
  return (
    <div
      className="absolute top-2 bottom-7 z-40 flex flex-col justify-around items-center pointer-events-none"
      style={{ ...pos, width: '10%' }}
    >
      {list.map((v: Vip) => (
        <motion.div
          key={v.id}
          className="flex flex-col items-center"
          animate={panic ? { x: [-3, 3, -3], rotate: [-6, 6, -6] } : { y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: panic ? 0.25 : 2 }}
        >
          <VipAvatar vip={v} size={36} />
          <div className="text-[8px] font-bold text-center leading-none mt-0.5 bg-black/75 border border-white/20 rounded px-1 py-0.5">
            {v.name.split(' ').slice(-1)[0]}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function Formation() {
  const { shieldUntil, weakUntil, slowUntil, rushUntil, now } = useGame()
  const shield = shieldUntil > now
  const weak = weakUntil > now
  const slow = slowUntil > now
  const rush = rushUntil > now

  const oppDuration = slow ? 1.05 : rush ? 0.3 : 0.48
  const govDuration = weak ? 0.95 : rush ? 0.32 : 0.5

  return (
    <div className="relative w-0 h-0">
      {/* Bayangan permukaan aspal di bawah kedua barisan */}
      <div
        className="absolute pointer-events-none rounded-full bg-black/50 blur-md"
        style={{ width: 430, height: 26, left: -215, bottom: 2, zIndex: 4 }}
      />

      {/* Barisan Mahasiswa (Kiri -> Mendorong ke Kanan) */}
      <div className={slow ? 'saturate-50 opacity-90' : ''}>
        {MAHASISWA_UNITS.map((u) => (
          <motion.img
            key={u.id}
            src={u.sprite}
            alt="Mahasiswa"
            draggable={false}
            className="absolute select-none pointer-events-none max-w-none origin-bottom"
            style={{
              height: u.height,
              bottom: u.bottom,
              right: u.right,
              zIndex: u.z,
              filter: `brightness(${u.brightness}) drop-shadow(0 3px 4px rgba(0,0,0,0.45))`,
            }}
            animate={{
              x: [0, u.lunge, -3, 0],
              y: [0, -2.5, 0, 0],
              rotate: [0, 4, -1.5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: oppDuration,
              delay: u.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Barisan Polisi Bertameng (Kanan -> Mendorong ke Kiri) */}
      <div className={`${shield ? 'drop-shadow-[0_0_12px_#fde047]' : ''} ${weak ? 'grayscale opacity-75' : ''}`}>
        {POLISI_UNITS.map((u) => (
          <motion.img
            key={u.id}
            src={POLISI_SPRITE}
            alt="Polisi Bertameng"
            draggable={false}
            className="absolute select-none pointer-events-none max-w-none origin-bottom"
            style={{
              height: u.height,
              bottom: u.bottom,
              left: u.left,
              zIndex: u.z,
              filter: `brightness(${u.brightness}) drop-shadow(0 3px 4px rgba(0,0,0,0.5))`,
            }}
            animate={{
              x: [0, u.lunge, 3, 0],
              y: [0, -2, 0, 0],
              rotate: [0, -3.5, 1, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: govDuration,
              delay: u.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Percikan Benturan di Garis Pertemuan Tameng vs Mahasiswa */}
      <motion.div
        className="absolute pointer-events-none select-none z-40 flex flex-col items-center"
        style={{ left: -12, bottom: 44 }}
        animate={{ scale: [0.85, 1.35, 0.9], rotate: [-12, 14, -12] }}
        transition={{ repeat: Infinity, duration: 0.4 }}
      >
        <span className="text-3xl drop-shadow-[0_0_10px_rgba(255,200,0,0.95)]">💥</span>
      </motion.div>

      {/* Kepulan Debu Kaki di Aspal */}
      <motion.div
        className="absolute pointer-events-none select-none z-35 text-lg opacity-80"
        style={{ left: -14, bottom: 2 }}
        animate={{ scale: [0.8, 1.35, 0.8], opacity: [0.35, 0.85, 0.35], y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 0.52 }}
      >
        💨
      </motion.div>

      {/* Badge Status Buff / Debuff Aktif */}
      {(shield || weak || slow) && (
        <div
          className="absolute z-40 flex gap-1 whitespace-nowrap text-[10px] font-black pointer-events-none"
          style={{ bottom: 134, left: -55 }}
        >
          {slow && <span className="bg-orange-600/95 text-white px-1.5 py-0.5 rounded shadow">🐌 PENDEMO MELAMBAT</span>}
          {shield && <span className="bg-yellow-400 text-black px-1.5 py-0.5 rounded shadow">🛡️ BARIKADE KEBAL</span>}
          {weak && <span className="bg-purple-600/95 text-white px-1.5 py-0.5 rounded shadow">💫 PERTAHANAN GOYAH</span>}
        </div>
      )}
    </div>
  )
}

export default function Arena() {
  const { line, tapFx } = useGame()
  const clash = 18 + line * 0.64 // posisi bentrokan dalam kontainer 150%
  const panicGov = line > 70
  const panicOpp = line < 30

  return (
    <div className="h-full relative overflow-hidden bg-sky-300">
      {/* Dunia Arena 150% Lebar Layar dengan Background Jalanan Kota */}
      <motion.div
        className="absolute inset-y-0 left-0 bg-no-repeat"
        style={{
          width: '150%',
          backgroundImage: "url('/assets/backgrounds/bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
        }}
        animate={{ x: `${-(line / 100) * 33.333}%` }}
        transition={{ type: 'spring', stiffness: 60, damping: 16 }}
      >
        {/* Tokoh VIP di Belakang Barisan Kiri & Kanan */}
        <VipColumn side="opp" panic={panicOpp} />
        <VipColumn side="gov" panic={panicGov} />

        {/* Titik Bentrokan Barisan Mahasiswa vs Polisi Bertameng */}
        <motion.div
          className="absolute bottom-[3%]"
          animate={{ left: `${clash}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 14 }}
        >
          <Formation />

          {/* Floating Avatar Penonton saat Tap-Tap Layar */}
          <AnimatePresence>
            {tapFx.map((f) => (
              <motion.div
                key={f.id}
                className="absolute z-50 pointer-events-none"
                style={{
                  bottom: 98,
                  left: f.dx + (f.side === 'opp' ? -75 : 75),
                }}
                initial={{ y: 0, opacity: 1, scale: 0.6 }}
                animate={{ y: -55, opacity: 0, scale: 1.05 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4 }}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 border-white text-[10px] flex items-center justify-center font-bold shadow-md ${
                    f.side === 'opp' ? 'bg-blue-600' : 'bg-red-600'
                  }`}
                >
                  {f.user[0]?.toUpperCase()}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Label Indikator Arah Dorongan di Bawah Jalan */}
      <div className="absolute bottom-1 inset-x-3 z-40 flex justify-between text-[9px] text-white/85 font-bold drop-shadow">
        <span className="bg-black/45 px-1.5 py-0.5 rounded">◀ Desak ke Kiri (Pemerintah)</span>
        <span className="bg-black/45 px-1.5 py-0.5 rounded">Desak ke Kanan (Oposisi) ▶</span>
      </div>
    </div>
  )
}
