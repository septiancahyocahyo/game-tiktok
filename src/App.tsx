import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from './store'
import Header from './components/Header'
import SkillStage from './components/SkillStage'
import RunningText from './components/RunningText'
import Arena from './components/Arena'
import Hud from './components/Hud'
import SimulatorPanel from './components/SimulatorPanel'

const W = 540, H = 960, PANEL = 400

function useScale() {
  const calc = () => Math.min((window.innerWidth - PANEL - 32) / W, (window.innerHeight - 24) / H)
  const [s, setS] = useState(calc)
  useEffect(() => {
    const f = () => setS(calc())
    window.addEventListener('resize', f)
    return () => window.removeEventListener('resize', f)
  }, [])
  return Math.max(0.3, s)
}

export default function App() {
  const scale = useScale()
  const tick = useGame((s) => s.tick)
  const banner = useGame((s) => s.banner)
  const rush = useGame((s) => s.rushUntil > s.now)

  useEffect(() => {
    const id = setInterval(tick, 100)
    return () => clearInterval(id)
  }, [tick])

  return (
    <div className="h-full flex">
      <main className="flex-1 flex items-center justify-center overflow-hidden">
        <div style={{ width: W * scale, height: H * scale }}>
          <div className="relative bg-black overflow-hidden shadow-2xl ring-1 ring-white/20" style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
            <div className="h-[8%]"><Header /></div>
            <div className="h-[22%]"><SkillStage /></div>
            <div className="h-[10%]"><RunningText /></div>
            <div className="h-[30%]"><Arena /></div>
            <div className="h-[30%]"><Hud /></div>

            {rush && (
              <>
                <div className="absolute inset-0 bg-red-600 pointer-events-none" style={{ animation: 'siren 0.8s infinite' }} />
                <div className="absolute top-[32%] inset-x-0 text-center text-sm font-black bg-red-700/90 py-0.5">🚨 JAM RAWAN DEMO — KEKUATAN ×5 🚨</div>
              </>
            )}
            <AnimatePresence>
              {banner && (
                <motion.div key={banner.id} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="absolute inset-x-0 top-[45%] flex justify-center pointer-events-none">
                  <div className={`px-6 py-3 rounded-xl text-2xl font-black shadow-2xl ${banner.side === 'opp' ? 'bg-blue-600' : 'bg-red-600'}`}>🏁 {banner.text}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <SimulatorPanel />
    </div>
  )
}

