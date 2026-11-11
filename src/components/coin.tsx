import { cn } from '@/lib/utils'

/** The FF_BETAL virtual coin glyph. Purely in-game — no cash value. */
export function CoinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn('size-4 shrink-0', className)}>
      <circle cx="12" cy="12" r="10" fill="oklch(0.82 0.16 80)" />
      <circle cx="12" cy="12" r="7.2" fill="none" stroke="oklch(0.55 0.13 60)" strokeWidth="1.4" />
      <path d="M9 7.5h4.2a2.3 2.3 0 0 1 0 4.5H9zm0 4.5h4.7a2.3 2.3 0 0 1 0 4.5H9z" fill="none" stroke="oklch(0.4 0.1 50)" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

export function Coins({ amount, className, signed }: { amount: number; className?: string; signed?: boolean }) {
  const text = (signed && amount > 0 ? '+' : '') + amount.toLocaleString('en-US')
  return (
    <span className={cn('inline-flex items-center gap-1 font-semibold tabular-nums', className)}>
      <CoinIcon />
      {text}
      <span className="sr-only"> virtual coins</span>
    </span>
  )
}
