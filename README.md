# FF_BETAL

FF_BETAL is a dark, red-and-black battle royale community website. Players can create custom rooms, join a squad's room with a code, check their profile and stats, and earn **virtual coins**. Coins are in-game rewards only. There's no real money, no betting and no cash wagering.

The site is built mobile-first for Android phones, with a bottom tab bar, large touch targets and safe-area support.

## What's live
- **Home** (`/`): hero with Android download CTA, quick join-by-code, game modes, open rooms, leaderboard.
- **Rooms** (`/rooms`): browse and filter rooms, create a room and get a shareable code, join by code.
- **Wallet** (`/wallet`): virtual coin balance, daily reward, ways to earn, history.
- **Profile** (`/profile`): rank, level, career stats, recent matches, badges.
- **Login / Register** (`/login`).

The screens currently run on sample data in `src/data/fixtures.ts`.

## Tech
TanStack Start (React 19, TanStack Router) · Vite · Tailwind CSS 4 · shadcn/ui (Radix) · lucide-react · sonner · deployed on Netlify. Images are served through the Netlify Image CDN.

## Run locally
```bash
pnpm install
netlify dev        # or: pnpm dev (Vite on :3000)
```

## Roadmap
Player accounts (Netlify Identity), a Netlify Database data model, a real rooms backend, the server-enforced coin ledger, the admin dashboard and the Android download link are next. See [PLAN.md](PLAN.md).
