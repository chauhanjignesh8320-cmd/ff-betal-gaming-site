import { Link } from '@tanstack/react-router'
import { Home, Swords, User, Wallet, LogIn, ShieldCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import { Coins } from '@/components/coin'
import { CURRENT_PLAYER } from '@/data/fixtures'

const NAV = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/rooms', label: 'Rooms', icon: Swords },
  { to: '/wallet', label: 'Wallet', icon: Wallet },
  { to: '/profile', label: 'Profile', icon: User },
] as const

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-content items-center gap-4 px-4 sm:px-6">
        <Link to="/" aria-label="FF_BETAL home">
          <Logo />
        </Link>
        <nav className="ml-6 hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === '/' }}
              className="rounded-md px-3 py-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-primary"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/wallet"
            className="clip-angle-sm flex items-center bg-secondary px-3 py-1.5 text-sm transition-colors hover:bg-muted"
            aria-label={`Wallet: ${CURRENT_PLAYER.coins} virtual coins`}
          >
            <Coins amount={CURRENT_PLAYER.coins} className="text-gold" />
          </Link>
          <Button asChild size="sm" className="clip-angle-sm hidden rounded-none font-semibold uppercase sm:inline-flex">
            <Link to="/login">
              <LogIn /> Login
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

export function MobileNav() {
  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="grid grid-cols-5">
        {NAV.map((n) => (
          <li key={n.to}>
            <Link
              to={n.to}
              activeOptions={{ exact: n.to === '/' }}
              className="flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground data-[status=active]:text-primary"
            >
              <n.icon className="size-5" aria-hidden="true" />
              {n.label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            to="/login"
            className="flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground data-[status=active]:text-primary"
          >
            <LogIn className="size-5" aria-hidden="true" />
            Login
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/40 pb-24 md:pb-0">
      <div className="mx-auto grid max-w-content gap-6 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-reading text-sm text-muted-foreground">
            FF_BETAL is a community hub for custom battle royale rooms. All coins are virtual, in-game rewards with
            no cash value. They can't be bought with real money, withdrawn, or exchanged. No betting, no wagering.
          </p>
        </div>
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
          <span>Fair play · Virtual coins only · 13+</span>
        </div>
      </div>
      <p className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © 2026 FF_BETAL. Not affiliated with any other game publisher.
      </p>
    </footer>
  )
}
