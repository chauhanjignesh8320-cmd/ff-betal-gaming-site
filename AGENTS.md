# AGENTS.md

## Project
FF_BETAL: a battle royale community hub (custom rooms, room codes, profiles, virtual coin wallet). **Continue from [PLAN.md](PLAN.md).** Milestone 1 (the UI surface on stub data) is complete. Start with the next unchecked milestone.

**Non-negotiable product rule:** coins are virtual. Never add real-money purchase, top-up, withdrawal, cash-out, player-to-player transfer or wagering features. Keep the "no cash value" copy wherever coins appear.

The artwork is original (generated). Don't add another publisher's names, characters or assets.

## Stack
TanStack Start + React 19 + TanStack Router (file routes), Vite 8, Tailwind CSS 4, shadcn/ui in `src/components/ui`, lucide-react icons, sonner toasts, zod. Deployed via `@netlify/vite-plugin-tanstack-start`.

## Layout
```
src/
  data/fixtures.ts       # ALL stub data and domain types (Room, Player, WalletTx, modes, maps). Replace with server functions in later milestones; keep the shapes.
  lib/img.ts             # cdn(src, width): Netlify Image CDN URL helper. Always use it for /public/img assets.
  components/
    site-chrome.tsx      # Sticky header, footer (virtual-coin disclaimer), mobile bottom tab bar
    logo.tsx, coin.tsx   # Brand mark; CoinIcon / <Coins amount signed />
    room-card.tsx        # RoomCard + startsLabel()
  routes/
    __root.tsx           # HTML shell (forced `dark` class), fonts, metadata, chrome
    index.tsx            # Homepage
    rooms.tsx            # Browse / Create / Join tabs; search params: code, create, mode
    wallet.tsx, profile.tsx, login.tsx
public/img/              # hero.png, mode-*.png (generated key art)
```

## Conventions
- Theme tokens live in `src/styles.css` `:root`. The site is dark-only (`<html class="dark">`). `primary` is crimson red. `gold` (`text-gold`, `bg-gold`) is reserved for coins and ranks. `accent` is a dark hover surface used by the UI kit.
- Fonts: Teko (`font-display`) for headings, Chakra Petch for body.
- Utilities: `.clip-angle` / `.clip-angle-sm` (angled corners, used with `rounded-none`), `.tilt-card` (3D hover tilt), `.text-glow`, `.bg-grid`, `.ember` (animated, disabled under reduced motion).
- Mobile first: `main` content must leave room for the fixed bottom nav (the footer already pads for it). Keep touch targets at h-11 or larger.
- Times computed from `Date.now()` render with `suppressHydrationWarning`.
- Login, room creation and joining currently update only local component state. They're the integration points for milestones 2–5.
