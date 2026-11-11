import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { CalendarCheck, Gift, Trophy, Ticket, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Coins, CoinIcon } from '@/components/coin'
import { cn } from '@/lib/utils'
import { CURRENT_PLAYER, WALLET_TX, type TxKind, type WalletTx } from '@/data/fixtures'

export const Route = createFileRoute('/wallet')({
  head: () => ({ meta: [{ title: 'Coin Wallet — FF_BETAL' }] }),
  component: WalletPage,
})

const TX_ICON: Record<TxKind, typeof Gift> = {
  daily: CalendarCheck,
  prize: Trophy,
  entry: Ticket,
  refund: RotateCcw,
  bonus: Sparkles,
}

const EARN = [
  { title: 'Daily check-in', body: 'Log in every day. Streaks multiply the reward.', amount: 25, icon: CalendarCheck },
  { title: 'Room placements', body: 'Finish top 3 in a custom room to win from the reward pool.', amount: 450, icon: Trophy },
  { title: 'Level up', body: 'Every 5 levels unlocks a coin bonus.', amount: 100, icon: Sparkles },
]

function WalletPage() {
  const [balance, setBalance] = useState(CURRENT_PLAYER.coins)
  const [tx, setTx] = useState<WalletTx[]>(WALLET_TX)
  const [claimed, setClaimed] = useState(true)
  const earned = tx.filter((t) => t.amount > 0).reduce((a, t) => a + t.amount, 0)
  const spent = tx.filter((t) => t.amount < 0).reduce((a, t) => a - t.amount, 0)

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Virtual wallet</p>
      <h1 className="font-display text-5xl leading-none sm:text-6xl">Coin Wallet</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <section aria-label="Balance" className="clip-angle relative overflow-hidden border border-primary/50 bg-gradient-to-br from-primary/25 via-card to-card p-6">
          <CoinIcon className="absolute -right-10 -top-10 size-48 opacity-10" />
          <p className="text-sm uppercase tracking-widest text-muted-foreground">Balance</p>
          <p className="font-display text-glow flex items-center gap-3 text-7xl leading-none">
            <CoinIcon className="size-12" />
            <span className="tabular-nums">{balance.toLocaleString('en-US')}</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">FF_BETAL coins</p>
          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-4 text-sm">
            <div><dt className="text-muted-foreground">Earned (recent)</dt><dd><Coins amount={earned} className="text-emerald-400" signed /></dd></div>
            <div><dt className="text-muted-foreground">Spent on entries</dt><dd><Coins amount={spent} /></dd></div>
          </dl>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button
              disabled={claimed}
              onClick={() => {
                setClaimed(true)
                setBalance((b) => b + 25)
                setTx((t) => [{ id: `t${Date.now()}`, kind: 'daily', label: 'Daily check-in reward', amount: 25, at: new Date().toISOString() }, ...t])
                toast.success('+25 coins claimed')
              }}
              className="clip-angle-sm h-12 rounded-none font-bold uppercase"
            >
              <Gift /> {claimed ? 'Daily reward claimed' : 'Claim daily reward'}
            </Button>
            <Button asChild variant="outline" className="clip-angle-sm h-12 rounded-none font-bold uppercase">
              <Link to="/rooms">Spend in rooms</Link>
            </Button>
          </div>
          {claimed && (
            <button type="button" onClick={() => setClaimed(false)} className="mt-3 text-xs text-muted-foreground underline-offset-2 hover:underline">
              Preview tomorrow's reward
            </button>
          )}
        </section>

        <section aria-label="Coin rules" className="space-y-3 border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-display text-3xl leading-none">
            <ShieldCheck className="size-6 text-primary" /> Virtual coins only
          </h2>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Coins are in-game rewards with no cash value.</li>
            <li>You can't buy coins with real money or withdraw them.</li>
            <li>Coins can't be traded or transferred between players.</li>
            <li>Use them for room entries, hosting and cosmetic unlocks.</li>
          </ul>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-4xl leading-none">Ways to earn</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {EARN.map((e) => (
            <div key={e.title} className="tilt-card clip-angle border border-border bg-card p-5">
              <e.icon className="size-6 text-primary" aria-hidden="true" />
              <h3 className="mt-2 font-display text-2xl leading-none">{e.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{e.body}</p>
              <p className="mt-3 text-sm">Up to <Coins amount={e.amount} className="text-gold" /></p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-4xl leading-none">History</h2>
        <ul className="divide-y divide-border border border-border bg-card">
          {tx.map((t) => {
            const Icon = TX_ICON[t.kind]
            return (
              <li key={t.id} className="flex items-center gap-3 px-4 py-3">
                <span className={cn('grid size-10 shrink-0 place-items-center', t.amount > 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-primary/15 text-primary')}>
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{t.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(t.at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                  </p>
                </div>
                <Coins amount={t.amount} signed className={t.amount > 0 ? 'text-emerald-400' : 'text-foreground'} />
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
