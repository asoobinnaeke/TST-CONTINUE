# THE SELECT TRADERS — PRD

## Original Problem
Competitive peer-to-peer trading platform (Landing + Client + Admin). React + FastAPI + MongoDB. Mock data only — no real broker / Stripe / KYC.

## Brand
Lime green #B4E04C + soft purple #A78BFA on off-white #FAFAF7. Satoshi font. Modern fintech aesthetic.

## What's Built

### v4 (2026-02-09) — MT5 + 3-min countdown + Admin tabs + Landing Affiliate (CURRENT)
- **Client Match MT5 dialog**: `/app/frontend/src/pages/app/Match.jsx` shows a non-dismissable dialog to participants only, displaying MT5 login/password/server/platform with a live 3-minute countdown. Confirm button POSTs `/api/duels/{id}/confirm-login`; both-confirmed state sets `trading_started_at` server-side. Spectators do NOT see the dialog.
- **Admin Matches tabs**: `/app/frontend/src/pages/admin/Matches.jsx` rewritten with three Tabs (Active/Inactive/Completed) and count badges. Active rows show a `Mt5Monitor` cell with remaining countdown + A/B confirmation pips. Inactive includes pairing+cancelled; Completed is completed.
- **Admin Settlements detail**: `/app/frontend/src/pages/admin/Extras.jsx::AdminSettlements` — clickable settlement rows populate a styled summary panel (trader A/B, account size, entry fee, prize, winner highlight, status, started/ended timestamps, void reason).
- **Landing Affiliate section**: `/app/frontend/src/components/landing/Affiliate.jsx` — tiered marketing block (Rookie/Pro/Elite/Legend) with rev-share %, signup bonus, ref + volume thresholds, and a CTA to `/app/affiliate`. Added 'Affiliate' link to landing nav.
- **Backend additions**: `/api/duels/{id}` and `/api/admin/duels` now return `started_at`, `login_confirmed_a/b`, `trading_started_at` for MT5 monitoring. `/api/duels/{id}/mt5` (participant-gated) + `/api/duels/{id}/confirm-login` consumed by UI.
- **Tests**: 14 pytest cases at `/app/backend/tests/backend_test.py`, 100% passing. Frontend testids all verified by testing agent.

### v3 (2026-02-08) — Robust mock backend
- 5-file backend at `/app/backend/`: `models.py` (15 Pydantic models), `database.py`, `simulator.py` (deterministic on-read live P&L), `seed.py` (idempotent), `server.py` (35+ endpoints, mock auth via X-User-Id/X-Username, default @TradeFury).
- Seeded demo state: 10 users, duels, royale lobbies, tournaments, teams, transactions, notifications.
- Live simulation: P&L/leaderboards/timers computed from seed + wall-clock — no background tasks, no DB writes per tick.

### v2 — Modern fintech landing page
### v1 (deprecated) — Dark esports landing

## Backlog

### P1 (next)
- Real auth: JWT + Emergent Google. Token → X-User-Id header.
- Active Match screen: server-driven trade feed (`/api/duels/{id}/trades` — currently sample trades).
- Auto-tick Royale lobby status: filling → starting → live → completed.
- Wallet deposit UI polish in Client Area.

### P2
- Stripe test-mode for Pro subscription + entry fees.
- Real KYC upload to object storage.
- Email transactional (Resend/SendGrid) for prize/pair/tournament alerts.
- Refactor `server.py` (>1200 lines) into `/app/backend/routes/{client,admin,affiliate}.py`.
- Community Battles functional implementation.
- Recharts width(-1) warnings on Match.jsx (cosmetic; carry-over).

## Test Credentials
See `/app/memory/test_credentials.md`. Admin: admin@selecttraders.com / admin-2026.
