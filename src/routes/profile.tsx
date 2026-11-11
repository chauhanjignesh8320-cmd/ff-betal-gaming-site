import { createFileRoute, Link } from '@tanstack/react-router'
import { Copy, Crosshair, Medal, Pencil, Shield, Skull, Target, Trophy } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Coins } from '@/components/coin'
import { cdn } from '@/lib/img'
import { CURRENT_PLAYER as P, MATCH_HISTORY, ROOMS, modeById } from '@/data/fixtures'
import { RoomCard } from '@/components/room-card'

export const Route = createFileRoute('/profile')({
  head: () => ({ meta: [{ title: `${P.name} — FF_BETAL Profile` }] }),
  component: ProfilePage,
})

function ProfilePage() {
  const stats = [
    { label: 'Matches', value: P.stats.matches, icon: Shield },
    { label: 'Wins', value: P.stats.wins, icon: Trophy },
    { label: 'Kills', value: P.stats.kills.toLocaleString('en-US'), icon: Skull },
    { label: 'K/D', value: P.stats.kd.toFixed(2), icon: Crosshair },
    { label: 'Headshot', value: `${P.stats.headshotPct}%`, icon: Target },
    { label: 'Top 10', value: P.stats.top10, icon: Medal },
  ]
  const hosted = ROOMS.filter((r) => r.host === 'RedViper').slice(0, 2)

  return (
    <div>
      <section className="relative isolate overflow-hidden border-b border-border">
        <img src={cdn('/img/hero.png', 1400)} alt="" className="absolute inset-0 -z-20 size-full object-cover opacity-40" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/80 to-background/30" />
        <div className="mx-auto flex max-w-content flex-col gap-6 px-4 pb-8 pt-16 sm:flex-row sm:items-end sm:px-6">
          <div className="clip-angle grid size-28 shrink-0 place-items-center bg-gradient-to-br from-primary to-primary/40 font-display text-6xl shadow-lg shadow-primary/40">
            {P.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-none bg-gold text-gold-foreground uppercase">{P.rank}</Badge>
              <Badge variant="outline" className="rounded-none uppercase">{P.guild}</Badge>
            </div>
            <h1 className="font-display text-6xl leading-none">{P.name}</h1>
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(P.uid.replace(/\s/g, ''))
                toast.success('Player UID copied')
              }}
              className="flex items-center gap-1.5 font-mono text-sm text-muted-foreground hover:text-foreground"
            >
              UID {P.uid} <Copy className="size-3.5" aria-hidden="true" />
              <span className="sr-only">Copy player UID</span>
            </button>
            <div className="max-w-sm">
              <div className="mb-1 flex justify-between text-xs">
                <span>Level {P.level}</span>
                <span className="tabular-nums text-muted-foreground">{P.xp.toLocaleString('en-US')} / {P.xpToNext.toLocaleString('en-US')} XP</span>
              </div>
              <Progress value={(P.xp / P.xpToNext) * 100} className="h-2 rounded-none" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="secondary" className="clip-angle-sm h-11 rounded-none font-semibold uppercase">
              <Link to="/wallet"><Coins amount={P.coins} className="text-gold" /></Link>
            </Button>
            <Button
              variant="outline"
              className="clip-angle-sm h-11 rounded-none font-semibold uppercase"
              onClick={() => toast('Profile editing arrives with player accounts')}
            >
              <Pencil /> Edit
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-content px-4 py-10 sm:px-6">
        <section aria-label="Career stats" className="grid grid-cols-3 gap-3 md:grid-cols-6">
          {stats.map((s) => (
            <div key={s.label} className="clip-angle-sm border border-border bg-card p-3 text-center">
              <s.icon className="mx-auto size-5 text-primary" aria-hidden="true" />
              <p className="mt-1 font-display text-3xl leading-none tabular-nums">{s.value}</p>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </section>

        <Tabs defaultValue="matches" className="mt-10">
          <TabsList className="h-11 rounded-none bg-card p-1">
            <TabsTrigger value="matches" className="rounded-none px-4 font-semibold uppercase data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Recent matches</TabsTrigger>
            <TabsTrigger value="badges" className="rounded-none px-4 font-semibold uppercase data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Badges</TabsTrigger>
            <TabsTrigger value="rooms" className="rounded-none px-4 font-semibold uppercase data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Guild rooms</TabsTrigger>
          </TabsList>
          <TabsContent value="matches" className="mt-5">
            <ul className="divide-y divide-border border border-border bg-card">
              {MATCH_HISTORY.map((m) => (
                <li key={m.id} className="flex items-center gap-4 px-4 py-3">
                  <span className={`font-display w-12 text-4xl leading-none ${m.placement === 1 ? 'text-gold' : m.placement <= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                    #{m.placement}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{m.room}</p>
                    <p className="text-xs text-muted-foreground">{modeById(m.mode).name} · {m.kills} kills · {m.at}</p>
                  </div>
                  {m.coins > 0 ? <Coins amount={m.coins} signed className="text-emerald-400" /> : <span className="text-sm text-muted-foreground">—</span>}
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="badges" className="mt-5">
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {P.badges.map((b) => (
                <li key={b} className="tilt-card clip-angle flex flex-col items-center gap-2 border border-border bg-card p-5 text-center">
                  <Medal className="size-8 text-gold" aria-hidden="true" />
                  <span className="font-semibold">{b}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="rooms" className="mt-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {hosted.map((r) => <RoomCard key={r.code} room={r} />)}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
