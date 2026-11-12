import { useEffect, useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { Copy, KeyRound, Lock, MapPin, Plus, Search, Share2, Swords, Users, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { onValue, ref, set, push } from 'firebase/database'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Coins } from '@/components/coin'
import { RoomCard, startsLabel } from '@/components/room-card'
import { CURRENT_PLAYER, MAPS, MODES, ROOMS, modeById, type GameMode, type MapName, type Room } from '@/data/fixtures'

const searchSchema = z.object({
  code: z.string().optional(),
  create: z.boolean().optional(),
  mode: z.enum(['squad', 'clash', 'solo', 'duo']).optional(),
})

export const Route = createFileRoute('/rooms')({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: 'Custom Rooms — FF_BETAL' }] }),
  component: RoomsPage,
})

const normalize = (c: string) => c.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')

function makeCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return `BTL-${s}`
}

function RoomsPage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const [rooms, setRooms] = useState<Room[]>(ROOMS)
  useEffect(() => {
  const roomsRef = ref(db, 'rooms')

  const unsubscribe = onValue(roomsRef, (snapshot) => {
    const data = snapshot.val()

    if (data) {
      setRooms(Object.values(data) as Room[])
    }
  })

  return unsubscribe
}, [])
  const [tab, setTab] = useState(search.create ? 'create' : search.code ? 'join' : 'browse')
  const [created, setCreated] = useState<Room | null>(null)

  useEffect(() => {
    if (search.create) setTab('create')
    else if (search.code) setTab('join')
  }, [search.create, search.code])

  return (
    <div className="bg-grid">
      <div className="mx-auto max-w-content px-4 py-10 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Custom rooms</p>
        <h1 className="font-display text-5xl leading-none sm:text-6xl">Battle Rooms</h1>
        <p className="mt-2 max-w-reading text-muted-foreground">
          Host your own match or jump into one with a room code. Entry fees and rewards use virtual coins only.
        </p>

        <Tabs value={tab} onValueChange={setTab} className="mt-8">
          <TabsList className="grid h-12 w-full grid-cols-3 rounded-none bg-card p-1 sm:w-auto sm:inline-grid">
            <TabsTrigger value="browse" className="rounded-none font-semibold uppercase data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Search /> Browse
            </TabsTrigger>
            <TabsTrigger value="create" className="rounded-none font-semibold uppercase data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Plus /> Create
            </TabsTrigger>
            <TabsTrigger value="join" className="rounded-none font-semibold uppercase data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <KeyRound /> Join
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-6">
            <BrowseRooms rooms={rooms} initialMode={search.mode} />
          </TabsContent>
          <TabsContent value="create" className="mt-6">
  <CreateRoomForm
    onCreate={async (room) => {
      try {
        const newRoomRef = push(ref(db, 'rooms'))
        await set(newRoomRef, room)
        setCreated(room)
        toast.success('Room saved successfully!')
      } catch (error) {
        toast.error('Could not save room to Firebase')
      }
    }}
  />
</TabsContent>
          <TabsContent value="join" className="mt-6">
            <JoinRoom
              rooms={rooms}
              initialCode={search.code ?? ''}
              onCodeChange={(code) => navigate({ search: { code: code || undefined }, replace: true })}
            />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!created} onOpenChange={(o) => !o && setCreated(null)}>
        <DialogContent className="rounded-none border-primary/50">
          <DialogHeader>
            <DialogTitle className="font-display text-4xl leading-none">Room created</DialogTitle>
            <DialogDescription>Share this code with your squad so they can join.</DialogDescription>
          </DialogHeader>
          {created && (
            <div className="space-y-4">
              <div className="clip-angle bg-primary/10 py-6 text-center">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Room code</p>
                <p className="font-display text-glow text-6xl tracking-[0.2em] text-primary">{created.code}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {created.name} · {modeById(created.mode).name} · {created.map} · {created.maxPlayers} slots
                {created.locked && ' · password protected'}
              </p>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="rounded-none"
              onClick={async () => {
                if (!created) return
                const text = `Join my FF_BETAL room "${created.name}" with code ${created.code}`
                if (navigator.share) {
                  await navigator.share({ title: 'FF_BETAL room', text }).catch(() => {})
                } else {
                  await navigator.clipboard.writeText(text)
                  toast.success('Invite copied')
                }
              }}
            >
              <Share2 /> Share invite
            </Button>
            <Button
              className="rounded-none"
              onClick={async () => {
                if (!created) return
                await navigator.clipboard.writeText(created.code)
                toast.success(`Copied ${created.code}`)
              }}
            >
              <Copy /> Copy code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function BrowseRooms({ rooms, initialMode }: { rooms: Room[]; initialMode?: GameMode }) {
  const [mode, setMode] = useState<GameMode | 'all'>(initialMode ?? 'all')
  const [q, setQ] = useState('')
  const list = useMemo(
    () =>
      rooms.filter(
        (r) =>
          (mode === 'all' || r.mode === mode) &&
          (!q || `${r.name} ${r.host} ${r.code}`.toLowerCase().includes(q.toLowerCase())),
      ),
    [rooms, mode, q],
  )
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            aria-label="Search rooms"
            placeholder="Search by room, host or code"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-11 rounded-none pl-9"
          />
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="group" aria-label="Filter by mode">
          {(['all', ...MODES.map((m) => m.id)] as const).map((m) => (
            <Button
              key={m}
              size="sm"
              variant={mode === m ? 'default' : 'secondary'}
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className="h-11 shrink-0 rounded-none font-semibold uppercase"
            >
              {m === 'all' ? 'All' : modeById(m).name}
            </Button>
          ))}
        </div>
      </div>
      {list.length === 0 ? (
        <div className="border border-dashed border-border p-10 text-center text-muted-foreground">
          <Swords className="mx-auto mb-2 size-8 text-primary" aria-hidden="true" />
          No rooms match. Try another mode, or create one yourself.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((r) => (
            <RoomCard key={r.code} room={r} />
          ))}
        </div>
      )}
    </div>
  )
}

function CreateRoomForm({ onCreate }: { onCreate: (r: Room) => void }) {
  const [name, setName] = useState('')
  const [mode, setMode] = useState<GameMode>('squad')
  const [map, setMap] = useState<MapName>(MAPS[0])
  const [slots, setSlots] = useState(48)
  const [entry, setEntry] = useState(0)
  const [locked, setLocked] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const maxSlots = modeById(mode).maxPlayers
  const hostFee = 25

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (name.trim().length < 3) return setError('Give your room a name of at least 3 characters.')
    if (locked && password.length < 4) return setError('Room password must be at least 4 characters.')
    if (CURRENT_PLAYER.coins < hostFee) return setError('Not enough virtual coins to host a room.')
    setError(null)
    onCreate({
      code: makeCode(),
      name: name.trim(),
      host: CURRENT_PLAYER.name,
      mode,
      map,
      players: 1,
      maxPlayers: slots,
      entryCoins: entry,
      prizeCoins: Math.max(100, Math.round(entry * slots * 0.9)),
      status: 'open',
      startsAt: new Date(Date.now() + 15 * 60_000).toISOString(),
      locked,
    })
    setName('')
    setPassword('')
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_20rem]" noValidate>
      <div className="clip-angle space-y-5 border border-border bg-card p-5 sm:p-6">
        <div className="space-y-2">
          <Label htmlFor="room-name">Room name</Label>
          <Input id="room-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} placeholder="e.g. Friday Night Squads" className="h-11 rounded-none" />
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Mode</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setMode(m.id)
                  setSlots((s) => Math.min(s, m.maxPlayers))
                }}
                aria-pressed={mode === m.id}
                className="clip-angle-sm border border-border bg-secondary p-3 text-left transition-colors aria-pressed:border-primary aria-pressed:bg-primary/15"
              >
                <span className="block font-display text-2xl leading-none">{m.name}</span>
                <span className="text-xs text-muted-foreground">{m.teamSize === 1 ? 'Solo' : `Teams of ${m.teamSize}`}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="room-map">Map</Label>
            <Select value={map} onValueChange={(v) => setMap(v as MapName)}>
              <SelectTrigger id="room-map" className="h-11 w-full rounded-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MAPS.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="room-slots">Player slots: <span className="tabular-nums text-primary">{slots}</span></Label>
            <input
              id="room-slots"
              type="range"
              min={2}
              max={maxSlots}
              step={mode === 'solo' ? 1 : modeById(mode).teamSize}
              value={slots}
              onChange={(e) => setSlots(Number(e.target.value))}
              className="h-11 w-full accent-[var(--primary)]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="room-entry">Entry (virtual coins): <span className="tabular-nums text-gold">{entry === 0 ? 'Free' : entry}</span></Label>
          <input id="room-entry" type="range" min={0} max={200} step={10} value={entry} onChange={(e) => setEntry(Number(e.target.value))} className="h-11 w-full accent-[var(--primary)]" />
          <p className="text-xs text-muted-foreground">Virtual coins only. They have no cash value and can't be withdrawn.</p>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border pt-5">
          <div>
            <Label htmlFor="room-lock">Private room</Label>
            <p className="text-xs text-muted-foreground">Players need a password as well as the code.</p>
          </div>
          <Switch id="room-lock" checked={locked} onCheckedChange={setLocked} />
        </div>
        {locked && (
          <div className="space-y-2">
            <Label htmlFor="room-pass">Room password</Label>
            <Input id="room-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 rounded-none" />
          </div>
        )}
        {error && (
          <p role="alert" className="flex items-center gap-2 text-sm text-destructive">
            <AlertTriangle className="size-4" /> {error}
          </p>
        )}
      </div>

      <aside className="clip-angle h-fit space-y-4 border border-primary/40 bg-card p-5 lg:sticky lg:top-20">
        <h2 className="font-display text-3xl leading-none">Summary</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-muted-foreground">Mode</dt><dd>{modeById(mode).name}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">Map</dt><dd>{map}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">Slots</dt><dd>{slots}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">Est. reward pool</dt><dd><Coins amount={Math.max(100, Math.round(entry * slots * 0.9))} className="text-gold" /></dd></div>
          <div className="flex justify-between border-t border-border pt-2"><dt className="text-muted-foreground">Hosting fee</dt><dd><Coins amount={hostFee} /></dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">Your balance</dt><dd><Coins amount={CURRENT_PLAYER.coins} /></dd></div>
        </dl>
        <Button type="submit" size="lg" className="clip-angle h-13 w-full rounded-none text-base font-bold uppercase">
          <Plus /> Create room
        </Button>
      </aside>
    </form>
  )
}

function JoinRoom({ rooms, initialCode, onCodeChange }: { rooms: Room[]; initialCode: string; onCodeChange: (c: string) => void }) {
  const [code, setCode] = useState(initialCode)
  const [submitted, setSubmitted] = useState(initialCode)
  const [password, setPassword] = useState('')
  const [joined, setJoined] = useState<string | null>(null)

  useEffect(() => {
    setCode(initialCode)
    setSubmitted(initialCode)
  }, [initialCode])

  const room = submitted ? rooms.find((r) => normalize(r.code) === normalize(submitted)) : undefined

  function join(r: Room) {
    if (r.locked && password.length < 4) {
      toast.error('Enter the room password to join')
      return
    }
    if (CURRENT_PLAYER.coins < r.entryCoins) {
      toast.error('Not enough virtual coins for this room')
      return
    }
    setJoined(r.code)
    toast.success(`You're in ${r.name}`, {
      description: r.entryCoins ? `${r.entryCoins} virtual coins held for entry.` : 'Free entry — good luck!',
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form
        className="clip-angle space-y-4 border border-border bg-card p-5 sm:p-6"
        onSubmit={(e) => {
          e.preventDefault()
          setSubmitted(code)
          setJoined(null)
          onCodeChange(code.trim().toUpperCase())
        }}
      >
        <h2 className="font-display text-3xl leading-none">Enter room code</h2>
        <p className="text-sm text-muted-foreground">Ask the host for the code. It looks like <span className="font-mono text-foreground">BTL-7X2Q</span>.</p>
        <Label htmlFor="join-code" className="sr-only">Room code</Label>
        <Input
          id="join-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="BTL-XXXX"
          autoCapitalize="characters"
          autoComplete="off"
          className="h-14 rounded-none text-center font-display text-4xl tracking-[0.3em] uppercase"
        />
        <Button type="submit" size="lg" className="clip-angle h-12 w-full rounded-none font-bold uppercase" disabled={!code.trim()}>
          <Search /> Find room
        </Button>
      </form>

      <div aria-live="polite">
        {!submitted ? (
          <div className="flex h-full min-h-56 flex-col items-center justify-center border border-dashed border-border p-8 text-center text-muted-foreground">
            <KeyRound className="mb-2 size-8 text-primary" aria-hidden="true" />
            Room details show up here once you enter a code.
          </div>
        ) : !room ? (
          <div className="flex h-full min-h-56 flex-col items-center justify-center border border-destructive/50 bg-destructive/10 p-8 text-center">
            <AlertTriangle className="mb-2 size-8 text-destructive" aria-hidden="true" />
            <p className="font-semibold">No room found for “{submitted.toUpperCase()}”</p>
            <p className="text-sm text-muted-foreground">Check the code with your host. Codes are not case-sensitive.</p>
          </div>
        ) : (
          <div className="clip-angle space-y-4 border border-primary/50 bg-card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs tracking-widest text-primary">{room.code}</p>
                <h2 className="font-display text-4xl leading-none">{room.name}</h2>
                <p className="text-sm text-muted-foreground">Hosted by {room.host}</p>
              </div>
              {room.locked && <Lock className="size-5 text-gold" aria-label="Password protected" />}
            </div>
            <ul className="grid grid-cols-2 gap-3 text-sm">
              <li className="flex items-center gap-2"><Swords className="size-4 text-primary" /> {modeById(room.mode).name}</li>
              <li className="flex items-center gap-2"><MapPin className="size-4 text-primary" /> {room.map}</li>
              <li className="flex items-center gap-2"><Users className="size-4 text-primary" /> {room.players}/{room.maxPlayers} players</li>
              <li className="text-muted-foreground" suppressHydrationWarning>{startsLabel(room.startsAt)}</li>
              <li>Entry: {room.entryCoins ? <Coins amount={room.entryCoins} /> : <span className="text-emerald-400">Free</span>}</li>
              <li>Reward: <Coins amount={room.prizeCoins} className="text-gold" /></li>
            </ul>
            {joined === room.code ? (
              <p className="flex items-center gap-2 border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-300">
                <CheckCircle2 className="size-4" /> You've joined. Open FF_BETAL on your phone, and the room appears in your lobby.
              </p>
            ) : room.status !== 'open' ? (
              <p className="border border-border bg-muted p-3 text-sm text-muted-foreground">
                This room is {room.status === 'full' ? 'full' : room.status === 'live' ? 'already in progress' : 'closed'}. Try another code or browse open rooms.
              </p>
            ) : (
              <>
                {room.locked && (
                  <div className="space-y-2">
                    <Label htmlFor="join-pass">Room password</Label>
                    <Input id="join-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 rounded-none" />
                  </div>
                )}
                <Button size="lg" onClick={() => join(room)} className="clip-angle h-12 w-full rounded-none font-bold uppercase">
                  Join room
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
