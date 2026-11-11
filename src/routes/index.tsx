import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Download, Plus, KeyRound, Users, Trophy, Flame, Smartphone, ShieldCheck, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Coins } from '@/components/coin'
import { RoomCard } from '@/components/room-card'
import { cdn } from '@/lib/img'
import { ANDROID_DOWNLOAD_URL, LEADERBOARD, MODES, PLATFORM_STATS, ROOMS } from '@/data/fixtures'

export const Route = createFileRoute('/')({
  component: Home,
})

function handleDownload() {
  if (ANDROID_DOWNLOAD_URL) {
    window.location.href = ANDROID_DOWNLOAD_URL
  } else {
    toast('Android build drops soon', { description: 'Pre-season is almost over. The download link goes live here first.' })
  }
}

const EMBERS = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 53) % 100}%`,
  delay: `${(i * 0.7) % 6}s`,
  duration: `${7 + ((i * 3) % 6)}s`,
}))

function Home() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <ModesSection />
      <HowItWorks />
      <LiveRooms />
      <Leaderboard />
      <DownloadSection />
    </>
  )
}

function JoinCodeForm({ compact }: { compact?: boolean }) {
  const [code, setCode] = useState('')
  const navigate = useNavigate()
  return (
    <form
      className="flex w-full max-w-md gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        if (!code.trim()) return
        navigate({ to: '/rooms', search: { code: code.trim().toUpperCase() } })
      }}
    >
      <label htmlFor={compact ? 'code-2' : 'code-1'} className="sr-only">
        Room code
      </label>
      <Input
        id={compact ? 'code-2' : 'code-1'}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Room code, e.g. BTL-7X2Q"
        autoCapitalize="characters"
        className="h-12 rounded-none border-primary/40 bg-black/50 font-semibold uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal"
      />
      <Button type="submit" variant="secondary" className="clip-angle-sm h-12 rounded-none px-5 font-semibold uppercase">
        <KeyRound /> Join
      </Button>
    </form>
  )
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <img
        src={cdn('/img/hero.png', 1600)}
        srcSet={`${cdn('/img/hero.png', 800)} 800w, ${cdn('/img/hero.png', 1600)} 1600w`}
        sizes="100vw"
        alt=""
        className="absolute inset-0 -z-20 size-full object-cover object-[60%_center]"
        fetchPriority="high"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/70 to-background/10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        {EMBERS.map((e, i) => (
          <span key={i} className="ember" style={{ left: e.left, animationDelay: e.delay, animationDuration: e.duration }} />
        ))}
      </div>

      <div className="mx-auto flex min-h-[min(88dvh,760px)] max-w-content flex-col justify-end gap-6 px-4 pb-12 pt-32 sm:px-6 md:justify-center md:pb-20">
        <Badge className="w-fit rounded-none bg-primary/20 text-primary uppercase tracking-widest">
          <Flame /> Season 4 · Ember Isle is live
        </Badge>
        <h1 className="font-display text-glow text-7xl leading-[0.85] tracking-wide sm:text-8xl md:text-9xl">
          FF<span className="text-primary">_</span>BETAL
        </h1>
        <p className="max-w-xl text-lg text-foreground/85 sm:text-xl">
          Drop in. Squad up. Own the zone. Host custom battle rooms, invite your crew with one code, and climb the
          ranks for virtual coin rewards.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            onClick={handleDownload}
            className="clip-angle h-14 rounded-none px-8 text-base font-bold uppercase tracking-wide shadow-[0_0_30px_-5px] shadow-primary/70"
          >
            <Download className="size-5" /> Download for Android
          </Button>
          <Button asChild size="lg" variant="outline" className="clip-angle h-14 rounded-none border-primary/50 bg-black/40 px-8 text-base font-bold uppercase tracking-wide">
            <Link to="/rooms" search={{ create: true }}>
              <Plus className="size-5" /> Create Room
            </Link>
          </Button>
        </div>
        <JoinCodeForm />
      </div>
    </section>
  )
}

function StatsStrip() {
  const items = [
    { label: 'Registered players', value: PLATFORM_STATS.players, icon: Users },
    { label: 'Rooms played today', value: PLATFORM_STATS.roomsToday, icon: Flame },
    { label: 'Virtual coins awarded', value: PLATFORM_STATS.coinsAwarded, icon: Trophy },
  ]
  return (
    <section aria-label="Platform stats" className="border-y border-border bg-card/60">
      <div className="mx-auto grid max-w-content grid-cols-3 divide-x divide-border px-2 sm:px-6">
        {items.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-1 py-5 text-center sm:flex-row sm:justify-center sm:gap-3">
            <s.icon className="size-5 text-primary" aria-hidden="true" />
            <div>
              <div className="font-display text-3xl leading-none sm:text-4xl">{s.value}</div>
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground sm:text-xs">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function SectionHead({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">{eyebrow}</p>
        <h2 className="font-display text-4xl leading-none sm:text-5xl">{title}</h2>
      </div>
      {action}
    </div>
  )
}

function ModesSection() {
  return (
    <section className="bg-grid">
      <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
        <SectionHead eyebrow="Pick your fight" title="Game modes" />
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {MODES.map((m) => (
            <Link
              key={m.id}
              to="/rooms"
              search={{ mode: m.id }}
              className="tilt-card clip-angle group relative aspect-[3/4] w-[70vw] max-w-72 shrink-0 snap-start overflow-hidden border border-border bg-card sm:w-auto sm:max-w-none"
            >
              {m.image ? (
                <img
                  src={cdn(m.image, 600)}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,oklch(0.6_0.235_27/0.55),transparent_60%)]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                  {m.teamSize === 1 ? 'Solo' : `${m.teamSize}-player teams`} · up to {m.maxPlayers}
                </p>
                <h3 className="font-display text-4xl leading-none">{m.name}</h3>
                <p className="text-sm text-foreground/75">{m.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { n: '01', title: 'Create a room', body: 'Pick a mode, map and slot count. You get a unique room code in seconds.' },
    { n: '02', title: 'Share the code', body: 'Send the code to your squad. They join from the app or this site with one tap.' },
    { n: '03', title: 'Play & earn coins', body: 'Top placements earn virtual coins for cosmetics, room hosting and bragging rights.' },
  ]
  return (
    <section className="mx-auto max-w-content px-4 py-16 sm:px-6">
      <SectionHead eyebrow="Custom rooms" title="Ready in three steps" />
      <ol className="grid gap-4 md:grid-cols-3">
        {steps.map((s) => (
          <li key={s.n} className="clip-angle relative border border-border bg-card p-6">
            <span className="font-display text-6xl leading-none text-primary/30">{s.n}</span>
            <h3 className="mt-2 font-display text-3xl leading-none">{s.title}</h3>
            <p className="mt-2 text-muted-foreground">{s.body}</p>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-col items-start gap-4 border-l-2 border-primary bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold">Got a code from your squad?</p>
        <JoinCodeForm compact />
      </div>
    </section>
  )
}

function LiveRooms() {
  return (
    <section className="border-y border-border bg-card/40">
      <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
        <SectionHead
          eyebrow="Happening now"
          title="Open rooms"
          action={
            <Link to="/rooms" className="flex items-center gap-1 text-sm font-semibold uppercase text-primary hover:underline">
              All rooms <ChevronRight className="size-4" />
            </Link>
          }
        />
        <div className="grid gap-4 md:grid-cols-3">
          {ROOMS.slice(0, 3).map((r) => (
            <RoomCard key={r.code} room={r} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Leaderboard() {
  return (
    <section className="mx-auto max-w-content px-4 py-16 sm:px-6">
      <SectionHead eyebrow="Season 4" title="Top survivors" />
      <ol className="divide-y divide-border border border-border bg-card">
        {LEADERBOARD.map((p, i) => (
          <li key={p.name} className="flex items-center gap-4 px-4 py-3">
            <span className={`font-display w-8 text-3xl leading-none ${i === 0 ? 'text-gold' : i < 3 ? 'text-primary' : 'text-muted-foreground'}`}>
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{p.name}</p>
              <p className="truncate text-xs text-muted-foreground">{p.guild}</p>
            </div>
            <div className="text-right text-sm">
              <p className="font-semibold">{p.booyahs} wins</p>
              <p className="text-xs text-muted-foreground">{p.kills.toLocaleString('en-US')} kills</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function DownloadSection() {
  return (
    <section id="download" className="relative overflow-hidden border-t border-border">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,oklch(0.6_0.235_27/0.35),transparent_65%)]" />
      <div className="mx-auto grid max-w-content items-center gap-10 px-4 py-20 sm:px-6 md:grid-cols-2">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Android first</p>
          <h2 className="font-display text-5xl leading-none sm:text-6xl">Get FF_BETAL on your phone</h2>
          <p className="text-muted-foreground">
            Built for Android: lightweight install, smooth on mid-range devices and tuned for touch. Your rooms, profile and
            coin wallet sync between the app and this site.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Smartphone className="size-4 text-primary" /> Android 8.0+ · ~450 MB</li>
            <li className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> Free to play · virtual coins only, no real-money betting</li>
            <li className="flex items-center gap-2"><Coins amount={500} className="text-gold" /> welcome bonus on first login</li>
          </ul>
          <Button onClick={handleDownload} size="lg" className="clip-angle h-14 rounded-none px-8 text-base font-bold uppercase">
            <Download className="size-5" /> Download for Android
          </Button>
        </div>
        <div className="relative mx-auto w-64 sm:w-72" aria-hidden="true">
          <div className="tilt-card rounded-[2.5rem] border-4 border-secondary bg-black p-2 shadow-2xl shadow-primary/30">
            <div className="overflow-hidden rounded-[2rem]">
              <img src={cdn('/img/mode-solo.png', 500)} alt="" loading="lazy" className="aspect-[9/17] w-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
