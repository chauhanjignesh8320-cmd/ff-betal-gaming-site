import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <svg viewBox="0 0 32 32" aria-hidden="true" className="size-8">
        <path d="M16 2 29 9v14l-13 7L3 23V9z" fill="oklch(0.6 0.235 27)" />
        <path d="M16 6.5 25 11.3v9.4L16 25.5l-9-4.8v-9.4z" fill="oklch(0.13 0.008 20)" />
        <path d="M12 11h6.5l-2.3 4H20l-7.5 7 2-5.2H11z" fill="oklch(0.82 0.16 80)" />
      </svg>
      <span className="font-display text-2xl leading-none tracking-wider">
        FF<span className="text-primary">_</span>BETAL
      </span>
    </span>
  )
}
