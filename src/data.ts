export type Side = 'opp' | 'gov'
export type VipId = 'windah' | 'pandji' | 'ferry' | 'prabowo' | 'teddy' | 'bahlil'

export interface Vip {
  id: VipId
  name: string
  side: Side
  emoji: string
  role: string
  skillName: string
  effect: string
  from: string
  to: string
}

export const VIPS: Vip[] = [
  { id: 'windah', name: 'Windah Basudara', side: 'opp', emoji: '🧢', role: 'Mic di mobil komando', skillName: 'Panggilan Bocil Kematian', effect: 'Bocil menyerbu! Dorongan cepat ke kanan', from: '#2563eb', to: '#22d3ee' },
  { id: 'pandji', name: 'Pandji Pragiwaksono', side: 'opp', emoji: '🎙️', role: 'Mic stand-up', skillName: 'Roasting Pedas / Mens Rea', effect: 'Perisai polisi melemah (debuff)', from: '#4f46e5', to: '#a78bfa' },
  { id: 'ferry', name: 'Ferry Irwandi', side: 'opp', emoji: '👓', role: 'Papan tulis logika', skillName: 'Bedah Logika & Fakta', effect: 'Dorongan stabil terus-menerus (DoT)', from: '#0369a1', to: '#38bdf8' },
  { id: 'prabowo', name: 'Prabowo', side: 'gov', emoji: '🕺', role: 'Podium negara', skillName: 'Joget Gemoy / Pidato Berapi-api', effect: 'ULTIMATE PUSH ke kiri!', from: '#b91c1c', to: '#fb923c' },
  { id: 'teddy', name: 'Mayor Teddy', side: 'gov', emoji: '🫡', role: 'Ajudan baret merah', skillName: 'Ajudan Sigap / Barikade Ketat', effect: 'Perisai kebal tap & komentar + dorong balik', from: '#991b1b', to: '#f43f5e' },
  { id: 'bahlil', name: 'Bahlil', side: 'gov', emoji: '🍈', role: 'Map kebijakan', skillName: 'Manuver Kebijakan / Gas Melon', effect: 'Pendemo melambat + dorongan menengah', from: '#9f1239', to: '#f97316' },
]

export const getVip = (id: VipId) => VIPS.find((v) => v.id === id)!

export interface Gift {
  id: string
  name: string
  emoji: string
  coins: number
  vip?: VipId
  push: number
}

export const GIFTS: Gift[] = [
  { id: 'mawar', name: 'Mawar', emoji: '🌹', coins: 1, push: 5 },
  { id: 'headset', name: 'Headset', emoji: '🎧', coins: 99, vip: 'windah', push: 0 },
  { id: 'mic', name: 'Mic', emoji: '🎤', coins: 199, vip: 'pandji', push: 0 },
  { id: 'kopi', name: 'Kopi', emoji: '☕', coins: 299, vip: 'ferry', push: 0 },
  { id: 'donat', name: 'Donat', emoji: '🍩', coins: 499, vip: 'prabowo', push: 0 },
  { id: 'baret', name: 'Baret', emoji: '🎖️', coins: 399, vip: 'teddy', push: 0 },
  { id: 'melon', name: 'Melon', emoji: '🍈', coins: 599, vip: 'bahlil', push: 0 },
]

export const USERS = ['Sultan_99', 'bocil_kematian', 'ayu.ndut', 'Rizky_', 'wongcilik', 'dinda.k', 'si_paling_demo', 'abang_gojek', 'nina_', 'kang.bakso']

