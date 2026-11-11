import { Link } from '@tanstack/react-router'
import { Lock, MapPin, Clock } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Coins } from '@/components/coin'
import { cn } from '@/lib/utils'
import { modeById, type Room, type RoomStatus } from '@/data/fixtures'

const STATUS: Record<RoomStatus, { label: string; className: string }> = {
  open: { label: 'Open', className: 'bg-emerald-500/15 text-emerald-400' },
  full: { label: 'Full', className: 'bg-muted text-muted-foreground' },
  live: { label: 'Live', className: 'bg-primary/20 text-primary' },
  finished: { label: 'Ended', className: 'bg-muted text-muted-foreground' },
}

export function startsLabel(iso: string) {
  const mins = Math.round((new Date(iso).getTime() - Date.now()) / 60_000)
  if (mins <= 0) return 'In progress'
  if (mins < 60) return `Starts in ${mins} min`
  return `Starts in ${Math.floor(mins / 60)}h ${mins % 60}m`
}

export function RoomCard({ room, className }: { room: Room; className?: string }) {
  const mode = modeById(room.mode)
  const s = STATUS[room.status]
  return (
    <Link
      to="/rooms"
      search={{ code: room.code }}
      className={cn('tilt-card clip-angle block border border-border bg-card p-4 transition-colors hover:border-primary/60', className)}
    >
      <div className="flex items-center justify-between gap-2">
        <Badge className={cn('rounded-none uppercase', s.className)}>
          {room.status === 'live' && <span className="size-1.5 animate-pulse rounded-full bg-primary motion-reduce:animate-none" />}
          {s.label}
        </Badge>
        <span className="flex items-center gap-1 font-mono text-xs tracking-widest text-muted-foreground">
          {room.locked && <Lock className="size-3" aria-label="Password protected" />}
          {room.code}
        </span>
      </div>
      <h3 className="mt-3 truncate font-display text-3xl leading-none">{room.name}</h3>
      <p className="text-sm text-muted-foreground">
        {mode.name} · hosted by <span className="text-foreground">{room.host}</span>
      </p>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><MapPin className="size-3" /> {room.map}</span>
        <span className="flex items-center gap-1" suppressHydrationWarning><Clock className="size-3" /> {startsLabel(room.startsAt)}</span>
      </div>
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs">
          <span>Players</span>
          <span className="tabular-nums">{room.players}/{room.maxPlayers}</span>
        </div>
        <Progress value={(room.players / room.maxPlayers) * 100} className="h-1.5 rounded-none" />
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm">
        <span className="text-muted-foreground">
          Entry {room.entryCoins === 0 ? <span className="font-semibold text-emerald-400">Free</span> : <Coins amount={room.entryCoins} />}
        </span>
        <span className="text-muted-foreground">
          Reward <Coins amount={room.prizeCoins} className="text-gold" />
        </span>
      </div>
    </Link>
  )
}
