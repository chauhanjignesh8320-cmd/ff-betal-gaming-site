/**
 * Stubbed product data for FF_BETAL.
 * Everything here is sample data used by the UI until real persistence
 * (accounts, rooms, wallet ledger) is wired in. Swap these exports for
 * server-function calls in a later milestone — keep the shapes.
 *
 * FF_BETAL uses VIRTUAL coins only. Coins have no cash value and cannot be
 * bought with, or withdrawn as, real money.
 */

export type GameMode = 'squad' | 'clash' | 'solo' | 'duo'
export type RoomStatus = 'open' | 'full' | 'live' | 'finished'

export interface ModeInfo {
  id: GameMode
  name: string
  tagline: string
  teamSize: number
  maxPlayers: number
  image: string | null
}

export const MODES: ModeInfo[] = [
  { id: 'squad', name: 'Squad Storm', tagline: '4-player teams, full island drop', teamSize: 4, maxPlayers: 48, image: '/img/mode-squad.png' },
  { id: 'clash', name: 'Red Clash', tagline: 'Close-quarter 4v4 arena rounds', teamSize: 4, maxPlayers: 8, image: '/img/mode-clash.png' },
  { id: 'solo', name: 'Lone Wolf', tagline: 'Every player for themselves', teamSize: 1, maxPlayers: 48, image: '/img/mode-solo.png' },
  { id: 'duo', name: 'Twin Fang', tagline: 'Pair up and outlast the zone', teamSize: 2, maxPlayers: 48, image: null },
]

export const MAPS = ['Ember Isle', 'Ashfall Ridge', 'Crimson Port', 'Night Quarry'] as const
export type MapName = (typeof MAPS)[number]

export interface Room {
  code: string
  name: string
  host: string
  mode: GameMode
  map: MapName
  players: number
  maxPlayers: number
  entryCoins: number
  prizeCoins: number
  status: RoomStatus
  startsAt: string // ISO
  locked: boolean
}

const inMinutes = (m: number) => new Date(Date.now() + m * 60_000).toISOString()

export const ROOMS: Room[] = [
  { code: 'BTL-7X2Q', name: 'Midnight Squad Cup', host: 'RedViper', mode: 'squad', map: 'Ember Isle', players: 36, maxPlayers: 48, entryCoins: 50, prizeCoins: 1800, status: 'open', startsAt: inMinutes(12), locked: false },
  { code: 'BTL-K9MD', name: 'Clash Scrims #42', host: 'AshQueen', mode: 'clash', map: 'Crimson Port', players: 8, maxPlayers: 8, entryCoins: 20, prizeCoins: 160, status: 'full', startsAt: inMinutes(4), locked: false },
  { code: 'BTL-W4LF', name: 'Lone Wolf Sunday', host: 'Ghost_07', mode: 'solo', map: 'Ashfall Ridge', players: 19, maxPlayers: 48, entryCoins: 0, prizeCoins: 500, status: 'open', startsAt: inMinutes(35), locked: false },
  { code: 'BTL-T2FN', name: 'Twin Fang Training', host: 'Blaze', mode: 'duo', map: 'Night Quarry', players: 30, maxPlayers: 48, entryCoins: 10, prizeCoins: 400, status: 'live', startsAt: inMinutes(-6), locked: true },
  { code: 'BTL-R3DZ', name: 'Guild Night: Red Zone', host: 'RedViper', mode: 'squad', map: 'Crimson Port', players: 12, maxPlayers: 48, entryCoins: 100, prizeCoins: 4000, status: 'open', startsAt: inMinutes(90), locked: true },
]

export interface Player {
  uid: string
  name: string
  guild: string
  level: number
  xp: number
  xpToNext: number
  rank: string
  region: string
  joined: string
  coins: number
  stats: { matches: number; wins: number; kills: number; kd: number; headshotPct: number; top10: number }
  badges: string[]
}

export const CURRENT_PLAYER: Player = {
  uid: '8814 2290 31',
  name: 'BetalHunter',
  guild: 'Crimson Fangs',
  level: 47,
  xp: 7420,
  xpToNext: 10000,
  rank: 'Heroic II',
  region: 'India',
  joined: '2026-03-14',
  coins: 2450,
  stats: { matches: 612, wins: 88, kills: 2934, kd: 4.79, headshotPct: 31, top10: 341 },
  badges: ['Booyah x88', 'Room Host', 'Sharpshooter', 'Season 3 Veteran'],
}

export type TxKind = 'daily' | 'prize' | 'entry' | 'refund' | 'bonus'
export interface WalletTx {
  id: string
  kind: TxKind
  label: string
  amount: number // positive = credit, negative = debit
  at: string
}

export const WALLET_TX: WalletTx[] = [
  { id: 't1', kind: 'daily', label: 'Daily check-in reward', amount: 25, at: '2026-11-11T06:10:00Z' },
  { id: 't2', kind: 'prize', label: 'Prize — Midnight Squad Cup (2nd)', amount: 450, at: '2026-11-10T21:42:00Z' },
  { id: 't3', kind: 'entry', label: 'Room entry — Midnight Squad Cup', amount: -50, at: '2026-11-10T20:58:00Z' },
  { id: 't4', kind: 'bonus', label: 'Level 47 reached', amount: 100, at: '2026-11-09T18:20:00Z' },
  { id: 't5', kind: 'refund', label: 'Refund — Room BTL-PX01 cancelled', amount: 20, at: '2026-11-08T15:03:00Z' },
  { id: 't6', kind: 'entry', label: 'Room entry — Clash Scrims #41', amount: -20, at: '2026-11-08T14:40:00Z' },
]

export const MATCH_HISTORY = [
  { id: 'm1', room: 'Midnight Squad Cup', mode: 'squad' as GameMode, placement: 2, kills: 9, coins: 450, at: '2026-11-10' },
  { id: 'm2', room: 'Clash Scrims #41', mode: 'clash' as GameMode, placement: 1, kills: 14, coins: 160, at: '2026-11-08' },
  { id: 'm3', room: 'Lone Wolf Saturday', mode: 'solo' as GameMode, placement: 7, kills: 4, coins: 0, at: '2026-11-07' },
  { id: 'm4', room: 'Guild Night: Ash', mode: 'squad' as GameMode, placement: 1, kills: 11, coins: 900, at: '2026-11-05' },
]

export const LEADERBOARD = [
  { name: 'RedViper', guild: 'Crimson Fangs', booyahs: 214, kills: 6120 },
  { name: 'AshQueen', guild: 'Night Owls', booyahs: 198, kills: 5890 },
  { name: 'Ghost_07', guild: 'Silent Ash', booyahs: 173, kills: 5210 },
  { name: 'Blaze', guild: 'Crimson Fangs', booyahs: 160, kills: 4987 },
  { name: 'BetalHunter', guild: 'Crimson Fangs', booyahs: 88, kills: 2934 },
]

export const PLATFORM_STATS = { players: '120K+', roomsToday: '3,480', coinsAwarded: '9.2M' }

/** Set to a real APK / Play Store URL once the client build is published. */
export const ANDROID_DOWNLOAD_URL: string | null = null

export const modeById = (id: GameMode) => MODES.find((m) => m.id === id)!
export const findRoom = (code: string) =>
  ROOMS.find((r) => r.code.replace('-', '') === code.trim().toUpperCase().replace(/[^A-Z0-9]/g, ''))
