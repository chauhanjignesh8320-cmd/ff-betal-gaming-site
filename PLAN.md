# FF_BETAL roadmap

FF_BETAL is a battle-royale community hub: players register, host and join custom rooms by code, track their profile, and earn **virtual coins**. Coins have no cash value: they can't be bought with real money, withdrawn, traded or used as a wager. Every milestone must preserve that rule.

## Milestone 1: Product surface ✅ (done)
- Branded dark red/black theme, original generated artwork, mobile bottom nav built for Android.
- Homepage: hero, Android download CTA, game modes, how-it-works, open rooms, leaderboard, download section.
- Rooms: browse/filter, create a room (mode, map, slots, entry coins, private password) with a generated room code and share/copy, join by code with found/not-found/full/live states.
- Wallet: balance, coin rules, ways to earn, transaction history, daily reward claim.
- Profile: rank, level/XP, career stats, recent matches, badges.
- Login/Register screen with client-side validation.
- All data comes from `src/data/fixtures.ts`.

## Milestone 2: Player accounts
- Netlify Identity for email/password signup and login (plus optional Google OAuth).
- Wire `/login` to Identity; session-aware header (avatar, logout); protect `/profile`, `/wallet`, room creation.
- Create a `players` row on first login (player name, UID, region) and grant the 500-coin welcome bonus once.

## Milestone 3: Data model (Netlify Database + Drizzle)
- Tables: `players`, `rooms`, `room_members`, `coin_ledger` (append-only, signed amounts, reason, reference), `matches`, `match_results`.
- The wallet balance is derived from the ledger (or cached with a transactional update) so it always reconciles.
- Seed from the current fixtures.

## Milestone 4: Rooms backend
- Server functions: create room (charge hosting fee, unique code generation, hashed password), list/filter rooms, get room by code, join/leave (hold entry coins, enforce capacity/status), cancel (refund).
- Swap the Rooms screen from fixtures to loaders and server functions; add the room detail route `/rooms/$code`.

## Milestone 5: Virtual coin wallet
- Daily check-in with streaks (one claim per UTC day, enforced on the server).
- Prize distribution when a host or admin submits results; level-up bonuses.
- Hard guardrails: no purchase or top-up endpoint, no withdrawals, no player-to-player transfers.

## Milestone 6: Admin dashboard
- `admin` role via Identity `app_metadata`; gated `/admin` routes.
- Overview KPIs (players, rooms today, coins issued), room moderation (close/cancel, refund), player management (ban/unban, manual coin adjustment with an audit reason), match result entry and verification.

## Milestone 7: Download & polish
- Set `ANDROID_DOWNLOAD_URL` (APK or Play Store) and track download clicks.
- PWA manifest and install prompt, Open Graph image, leaderboard backed by real match results.
- Live room updates (polling or SSE) and notifications when a room starts.
