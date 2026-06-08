# THE SELECT TRADERS — PRD

## Original Problem
Competitive peer-to-peer trading platform (Landing + Client + Admin). React + FastAPI + MongoDB. Mock data only — no real broker / Stripe / KYC.

## Brand
Lime green #B4E04C + soft purple #A78BFA on off-white #FAFAF7. Satoshi font. Modern fintech aesthetic.

## What's Built

### v3 (2026-02-08) — Robust mock backend (CURRENT)
- **5-file backend** at `/app/backend/`: `models.py` (15 Pydantic models), `database.py` (Motor + 11 collections), `simulator.py` (deterministic on-read live P&L + leaderboards + earnings sparkline), `seed.py` (idempotent demo seeding), `server.py` (35+ endpoints, FastAPI dependency-injected mock auth via X-User-Id/X-Username headers, default `@TradeFury`).
- **Seeded demo state**: 10 users, 4 live duels (1 custom Pro), 6 royale lobbies (1 live), 2 tournaments (one Registration, one Group Stage with 8 hydrated groups), 2 teams, 6 transactions, 4 notifications, 5 match results, 2 linked accounts.
- **Live simulation**: P&L, equity series, royale leaderboards, time-left and spectator counts are computed from each entity's `seed` + wall-clock — same input ⇒ same output, no background tasks, no DB writes per tick. Frontend polls every 2-5 s and visibly updates.
- **Endpoints** (all `/api/*`): `/me` (GET, PATCH), `/me/stats`, `/dashboard`, `/duels/live`, `/duels/{id}` (with equity_series), `/duels/spawn` (creates duel + tx + notif), `/duels/custom` (Pro-gated), `/royale/lobbies` (filterable), `/royale/lobbies/{id}` (with leaderboard), `/royale/lobbies/{id}/join`, `/tournaments`, `/tournaments/{id}` (hydrated groups + prize distribution), `/tournaments/{id}/register`, `/teams` (GET/POST), `/wallet`, `/wallet/deposit`, `/wallet/withdraw` (KYC-gated), `/wallet/transactions`, `/notifications`, `/notifications/mark-all-read`, `/notifications/{id}/read`, `/match-history`, `/settings/kyc/upload`, `/settings/linked-accounts` (CRUD), `/community/notify`, `/stats/live`.
- **Validations enforced**: username immutable, Pro plan gating, capital-split must sum to total, KYC required before first withdrawal, min deposit/withdrawal $10, balance check, duplicate-join prevention, lobby capacity.
- **Frontend wiring**: new `/lib/api.js` (single fetch wrapper) + `/lib/useFetch.js` (polling hook). All 10 client pages + landing Community form now consume real API. Mock data file kept only for reference and is no longer imported. Streak hook added to Dashboard.
- **Verified end-to-end** via curl: spawn creates a real duel + transaction + notification, custom team creation persists, validation errors return proper 400/403, polling reflects DB writes immediately, wallet deposit increments balance.

### v2 — Modern fintech landing page
### v1 (deprecated) — Dark esports landing

## Mock data sources removed
`/app/frontend/src/lib/mockData.js` is no longer used by any page (kept on disk as reference, safe to delete).

## Backlog

### P0 (next)
- Real auth: JWT + Emergent Google. Token → X-User-Id header. Protect `/app/*`. Call `integration_playbook_expert_v2`.
- Active Match screen: server-driven trade feed (currently still hard-coded sample trades).
- Auto-tick Royale lobby status: filling → starting → live → completed (currently static after seed).

### P1
- Stripe test-mode for Pro subscription + entry fees.
- Real KYC upload to object storage.
- Email transactional (Resend/SendGrid) for prize/pair/tournament alerts.
- Settings page wired to PATCH `/api/me` for editable fields.

### P2 — Admin Portal
- `/admin/login`, audit-logged actions for user/duel/royale/tournament/finance/disputes/KYC/announcements.

## Next Tasks
1. Wire **real auth** (JWT + Emergent Google) — required before public launch.
2. Replace **Match screen sample trades** with `/api/duels/{id}/trades` endpoint.
3. Add **rotating duel lifecycle** (background task that auto-completes duels and credits prizes).
4. Begin **Admin Portal** scaffold.
