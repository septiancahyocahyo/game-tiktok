import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { VIPS, type Vip } from '../data'
import { useGame } from '../store'
import VipAvatar from './VipAvatar'

// Daftar 5 background panoramik dari Barat (Penjara) hingga Timur (Istana Negara)
const BG_STAGES = [
  { id: 'bg-1', name: 'Penjara', src: '/assets/backgrounds/bg-1.png' },
  { id: 'bg-2', name: 'Universitas', src: '/assets/backgrounds/bg-2.png' },
  { id: 'bg-3', name: 'Silang Monas', src: '/assets/backgrounds/bg-3.png' },
  { id: 'bg-4', name: 'Gedung DPR / MPR', src: '/assets/backgrounds/bg-4.png' },
  { id: 'bg-5', name: 'Istana Negara', src: '/assets/backgrounds/bg-5.png' },
]

// Dimensi matematika dunia horizontal:
// Setiap panel 2000x857 pada tinggi 288px memiliki lebar alami 288 * (2000/857) = 672px
const PANEL_WIDTH = 672
const TOTAL_WORLD_WIDTH = PANEL_WIDTH * 5 // 3360px
const VIEWPORT_WIDTH = 540
const MAX_SCROLL = TOTAL_WORLD_WIDTH - VIEWPORT_WIDTH // 2820px

const MAHASISWA_SPRITES = {
  merah: '/assets/characters/mahasiswa-merah.png',
  biru: '/assets/characters/mahasiswa-biru.png',
  hijau: '/assets/characters/mahasiswa-hijau.png',
}
const POLISI_SPRITE = '/assets/characters/polisi-w-tameng.png'

interface MahasiswaSpec {
  id: string
  sprite: string
  /** Jarak sisi kanan gambar dari titik bentrok (px) */
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
  /** Jarak dorongan maju ke kiri (px) */
  lunge: number
}

// Barisan Mahasiswa (Kiri -> mendorong ke Kanan, menghadap kanan)
const MAHASISWA_UNITS: MahasiswaSpec[] = [
  // Lapis Belakang
  { id: 'm-b1', sprite: MAHASISWA_SPRITES.hijau, right: 10, bottom: 26, height: 112, z: 10, brightness: 0.76, delay: 0.05, lunge: 9 },
  { id: 'm-b2', sprite: MAHASISWA_SPRITES.merah, right: 48, bottom: 28, height: 106, z: 10, brightness: 0.76, delay: 0.14, lunge: 8 },
  { id: 'm-b3', sprite: MAHASISWA_SPRITES.biru, right: 86, bottom: 26, height: 108, z: 10, brightness: 0.74, delay: 0.22, lunge: 7 },
  { id: 'm-b4', sprite: MAHASISWA_SPRITES.hijau, right: 122, bottom: 28, height: 112, z: 10, brightness: 0.72, delay: 0.3, lunge: 6 },
  { id: 'm-b5', sprite: MAHASISWA_SPRITES.merah, right: 164, bottom: 26, height: 106, z: 10, brightness: 0.7, delay: 0.38, lunge: 6 },

  // Lapis Tengah
  { id: 'm-m1', sprite: MAHASISWA_SPRITES.biru, right: -2, bottom: 14, height: 116, z: 20, brightness: 0.88, delay: 0.02, lunge: 11 },
  { id: 'm-m2', sprite: MAHASISWA_SPRITES.hijau, right: 30, bottom: 15, height: 122, z: 20, brightness: 0.88, delay: 0.1, lunge: 10 },
  { id: 'm-m3', sprite: MAHASISWA_SPRITES.merah, right: 72, bottom: 14, height: 116, z: 20, brightness: 0.86, delay: 0.18, lunge: 9 },
  { id: 'm-m4', sprite: MAHASISWA_SPRITES.biru, right: 110, bottom: 15, height: 116, z: 20, brightness: 0.84, delay: 0.26, lunge: 8 },
  { id: 'm-m5', sprite: MAHASISWA_SPRITES.hijau, right: 146, bottom: 14, height: 120, z: 20, brightness: 0.82, delay: 0.34, lunge: 7 },

  // Lapis Depan
  { id: 'm-f1', sprite: MAHASISWA_SPRITES.merah, right: -8, bottom: 2, height: 124, z: 32, brightness: 1, delay: 0, lunge: 13 },
  { id: 'm-f2', sprite: MAHASISWA_SPRITES.biru, right: 24, bottom: 2, height: 122, z: 31, brightness: 1, delay: 0.07, lunge: 11 },
  { id: 'm-f3', sprite: MAHASISWA_SPRITES.hijau, right: 56, bottom: 3, height: 128, z: 30, brightness: 0.98, delay: 0.15, lunge: 10 },
  { id: 'm-f4', sprite: MAHASISWA_SPRITES.merah, right: 98, bottom: 2, height: 122, z: 29, brightness: 0.96, delay: 0.23, lunge: 8 },
  { id: 'm-f5', sprite: MAHASISWA_SPRITES.biru, right: 136, bottom: 2, height: 122, z: 28, brightness: 0.94, delay: 0.31, lunge: 7 },
]

// Barisan Polisi Bertameng (Kanan -> menahan & mendorong ke Kiri, menghadap kiri)
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

  // Lapis Depan
  { id: 'p-f1', left: -34, bottom: 1, height: 122, z: 33, brightness: 1, delay: 0, lunge: -12 },
  { id: 'p-f2', left: 0, bottom: 1, height: 122, z: 31, brightness: 1, delay: 0.07, lunge: -10 },
  { id: 'p-f3', left: 34, bottom: 2, height: 122, z: 30, brightness: 0.98, delay: 0.15, lunge: -9 },
  { id: 'p-f4', left: 68, bottom: 1, height: 120, z: 29, brightness: 0.96, delay: 0.23, lunge: -8 },
  { id: 'p-f5', left: 102, bottom: 2, height: 120, z: 28, brightness: 0.94, delay: 0.31, lunge: -7 },
]

function VipColumn({ side, panic }: { side: 'opp' | 'gov'; panic: boolean }) {
  const list = VIPS.filter((v) => v.side === side)
  const pos = side === 'opp' ? { left: '1.5%' } : { right: '1.5%' }
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
          <div className="text-[8px] font-bold text-center leading-none mt-0.5 bg-black/80 border border-white/20 rounded px-1 py-0.5 shadow">
            {v.name.split(' ').slice(-1)[0]}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

/** Efek angin / asap di belakang barisan yang sedang mendorong kuat. dir: +1 = Oposisi (angin di kiri), -1 = Pemerintah (angin di kanan) */
function WindStreaks({ dir }: { dir: 1 | -1 }) {
  const streaks = useMemo(
    () => Array.from({ length: 9 }, (_, i) => ({
      y: 8 + ((i * 37) % 110),
      w: 46 + ((i * 29) % 56),
      start: 60 + ((i * 23) % 70),
      delay: (i % 5) * 0.06,
      dur: 0.45 + ((i * 13) % 25) / 100,
    })),
    [],
  )
  // Sisi belakang barisan: Oposisi di kiri titik bentrok, Pemerintah di kanan
  const back = -dir
  return (
    <div className="absolute w-0 h-0 pointer-events-none" style={{ bottom: 0, left: 0, zIndex: 45 }}>
      {streaks.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: s.w, height: 3, bottom: s.y,
            left: back * (s.start + 120) - (back < 0 ? s.w : 0),
            background: `linear-gradient(${dir === 1 ? '90deg' : '270deg'}, rgba(255,255,255,0), rgba(255,255,255,0.85))`,
            filter: 'blur(0.6px)',
          }}
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: [0, 0.9, 0], x: [0, dir * 70] }}
          transition={{ duration: s.dur, delay: s.delay, ease: 'easeOut' }}
        />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={`s${i}`}
          className="absolute text-2xl"
          style={{ bottom: 6 + i * 22, left: back * (150 + i * 28) - 12 }}
          initial={{ opacity: 0, scale: 0.6, x: 0 }}
          animate={{ opacity: [0, 0.85, 0], scale: [0.6, 1.5], x: [0, back * 40] }}
          transition={{ duration: 0.8, delay: i * 0.07, ease: 'easeOut' }}
        >
          💨
        </motion.span>
      ))}
    </div>
  )
}

function Formation({ surge }: { surge: 0 | 1 | -1 }) {
  const { shieldUntil, weakUntil, slowUntil, rushUntil, now } = useGame()
  const shield = shieldUntil > now
  const weak = weakUntil > now
  const slow = slowUntil > now
  const rush = rushUntil > now

  // Saat dorongan kuat, barisan yang mendorong bergerak lebih cepat (tanpa berpindah tempat)
  const oppDuration = (slow ? 1.05 : rush ? 0.3 : 0.48) * (surge === 1 ? 0.55 : 1)
  const govDuration = (weak ? 0.95 : rush ? 0.32 : 0.5) * (surge === -1 ? 0.55 : 1)
  const oppBoost = surge === 1 ? 1.6 : 1
  const govBoost = surge === -1 ? 1.6 : 1

  return (
    <div className="relative w-0 h-0">
      {surge !== 0 && <WindStreaks key={`${surge}-${now > 0 ? Math.floor(now / 700) : 0}`} dir={surge} />}
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
              x: [0, u.lunge * oppBoost, -3, 0],
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
              x: [0, u.lunge * govBoost, 3, 0],
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

const CHECKPOINTS = [
  { percent: 0, name: 'Penjara', label: '0%', img: '/assets/buildings/penjara.png' },
  { percent: 25, name: 'Universitas', label: '25%', img: '/assets/buildings/universitas.png' },
  { percent: 50, name: 'Monas', label: '50%', img: '/assets/buildings/monas.png' },
  { percent: 75, name: 'Gedung DPR', label: '75%', img: '/assets/buildings/gedung-dpr.png' },
  { percent: 100, name: 'Istana Negara', label: '100%', img: '/assets/buildings/istana-negara.png' },
]

function FloatingTugBar({ line }: { line: number }) {
  const opp = Math.round(line)
  const gov = 100 - opp

  // Cari checkpoint terdekat
  const activeIdx = line < 12.5 ? 0 : line < 37.5 ? 1 : line < 62.5 ? 2 : line < 87.5 ? 3 : 4

  return (
    <div className="absolute top-1 left-1/2 -translate-x-1/2 z-40 w-[380px] pointer-events-none select-none">
      <div className="relative flex flex-col items-center">
        {/* === AREA ATAS: PIN BENTROKAN ⚔️ (Menunjuk ke Bawah seperti di gambar) === */}
        <div className="relative w-full h-8 px-4">
          <div
            className="absolute top-0 flex flex-col items-center transition-all duration-150"
            style={{ left: `${line}%`, transform: 'translateX(-50%)' }}
          >
            {/* Gelembung Bulat dengan Ikon Pedang Bentrok ⚔️ */}
            <div className="w-7 h-7 rounded-full bg-slate-900 border-2 border-yellow-400 shadow-[0_0_10px_#fde047] flex items-center justify-center text-xs animate-pulse">
              ⚔️
            </div>
            {/* Jarum / Segitiga Menunjuk ke Bawah (Menempel ke Bar) */}
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-yellow-400" />
          </div>
        </div>

        {/* === AREA TENGAH: PROGRESS BAR DENGAN 4 SEGMEN (DIVIDER) === */}
        <div className="relative w-full px-4">
          <div className="relative h-6 w-full rounded-md bg-slate-900/90 border-2 border-slate-950 shadow-xl overflow-hidden backdrop-blur-sm flex items-center">
            {/* Isi Oposisi (Biru) dari Kiri */}
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 transition-all duration-150 flex items-center px-2"
              style={{ width: `${line}%` }}
            >
              <span className="text-[10px] font-black text-white drop-shadow whitespace-nowrap">
                🔵 {opp}%
              </span>
            </div>

            {/* Isi Pemerintah (Merah) dari Kanan */}
            <div
              className="absolute inset-y-0 right-0 bg-gradient-to-l from-red-700 via-red-600 to-orange-500 transition-all duration-150 flex items-center justify-end px-2"
              style={{ width: `${100 - line}%` }}
            >
              <span className="text-[10px] font-black text-white drop-shadow whitespace-nowrap">
                {gov}% 🔴
              </span>
            </div>

            {/* Garis Pembatas Vertikal (Dividers pada 25%, 50%, 75% sesuai gambar sketsa) */}
            <div className="absolute inset-y-0 left-[25%] w-[1.5px] bg-slate-950/80 z-10 shadow" />
            <div className="absolute inset-y-0 left-[50%] w-[2px] bg-slate-950 z-10 shadow" />
            <div className="absolute inset-y-0 left-[75%] w-[1.5px] bg-slate-950/80 z-10 shadow" />
          </div>
        </div>

        {/* === AREA BAWAH: 5 PIN CHECKPOINT (Menunjuk ke Atas seperti di gambar) === */}
        <div className="relative w-full px-4 pt-0">
          <div className="relative w-full flex justify-between">
            {CHECKPOINTS.map((cp, idx) => {
              const isActive = idx === activeIdx
              return (
                <div
                  key={cp.name}
                  className="flex flex-col items-center"
                  style={{ width: 0 }}
                >
                  {/* Jarum / Segitiga Menunjuk ke Atas (Menempel ke Bawah Bar) */}
                  <div
                    className={`w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] transition-colors duration-200 ${
                      isActive ? 'border-b-yellow-400' : 'border-b-slate-700'
                    }`}
                  />
                  {/* Gelembung Bulat Pin Checkpoint */}
                  <div
                    className={`w-8 h-8 rounded-full p-1 flex items-center justify-center transition-all duration-200 shadow-lg ${
                      isActive
                        ? 'bg-slate-900 border-2 border-yellow-400 scale-110 shadow-[0_0_10px_rgba(250,204,21,0.9)]'
                        : 'bg-slate-900/95 border-2 border-slate-700 opacity-80'
                    }`}
                  >
                    <img
                      src={cp.img}
                      alt={cp.name}
                      className="w-full h-full object-contain filter drop-shadow"
                    />
                  </div>
                  {/* Label Nama Bangunan */}
                  <span
                    className={`text-[8px] font-black tracking-tight leading-none mt-1 whitespace-nowrap drop-shadow ${
                      isActive ? 'text-yellow-300 font-extrabold' : 'text-white/80'
                    }`}
                  >
                    {cp.name}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Arena() {
  const { line, tapFx } = useGame()

  // Garis dihaluskan dengan spring sehingga kamera DAN barisan bergerak mulus bersama (tanpa teleport)
  const lineMV = useMotionValue(line)
  const smoothLine = useSpring(lineMV, { stiffness: 38, damping: 15, mass: 1 })
  useEffect(() => { lineMV.set(line) }, [line, lineMV])

  const worldX = useTransform(smoothLine, (v) => -(v / 100) * MAX_SCROLL)
  // Titik bentrokan di dunia panjang (x=270 di Penjara ke x=3090 di Istana)
  const clashLeft = useTransform(smoothLine, (v) => 270 + (v / 100) * MAX_SCROLL)

  // Deteksi dorongan kuat (tap x10, gift, skill) untuk memicu efek angin/asap
  const prevLine = useRef(line)
  const [surge, setSurge] = useState<0 | 1 | -1>(0)
  useEffect(() => {
    const d = line - prevLine.current
    prevLine.current = line
    if (Math.abs(d) >= 1.5 && Math.abs(d) < 20) {
      setSurge(d > 0 ? 1 : -1)
      const t = setTimeout(() => setSurge(0), 900)
      return () => clearTimeout(t)
    }
  }, [line])

  const panicGov = line > 70
  const panicOpp = line < 30

  return (
    <div className="h-full relative overflow-hidden bg-sky-300">
      {/* Tokoh VIP di Sisi Kiri & Kanan Layar (Pinned Commander Pillars) */}
      <VipColumn side="opp" panic={panicOpp} />
      <VipColumn side="gov" panic={panicGov} />

      {/* Floating Checkpoints & Tug-of-War Bar di Tengah Atas Game */}
      <FloatingTugBar line={line} />

      {/* Dunia Arena Panjang (3360px) Berisi 5 Background Panoramik Bersambung */}
      <motion.div
        className="absolute inset-y-0 left-0 bg-slate-900"
        style={{ width: TOTAL_WORLD_WIDTH, x: worldX }}
      >
        {/* Rangkaian 5 Background: Penjara -> Kampus -> Monas -> DPR -> Istana */}
        <div className="flex h-full select-none" style={{ width: TOTAL_WORLD_WIDTH }}>
          {BG_STAGES.map((bg, idx) => (
            <img
              key={bg.id}
              src={bg.src}
              alt={bg.name}
              draggable={false}
              className={`h-full block select-none pointer-events-none shrink-0 ${idx > 0 ? '-ml-[1px]' : ''}`}
              style={{
                width: idx > 0 ? PANEL_WIDTH + 1 : PANEL_WIDTH,
                objectFit: 'cover',
                objectPosition: 'center bottom',
              }}
            />
          ))}
        </div>

        {/* Titik Bentrokan Barisan Mahasiswa vs Polisi Bertameng */}
        <motion.div
          className="absolute bottom-[3%]"
          style={{ left: clashLeft }}
        >
          <Formation surge={surge} />

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

      {/* Indikator Arah Dorongan di Bawah Layar */}
      <div className="absolute bottom-1 inset-x-3 z-40 flex items-center justify-between text-[8.5px] text-white/75 font-bold drop-shadow pointer-events-none">
        <span className="bg-black/55 px-2 py-0.5 rounded border border-blue-500/30">◀ Dorong ke Penjara</span>
        <span className="bg-black/55 px-2 py-0.5 rounded border border-red-500/30">Dorong ke Istana ▶</span>
      </div>
    </div>
  )
}
