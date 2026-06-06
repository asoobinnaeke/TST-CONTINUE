# THE SELECT TRADERS — Product Requirements

## Original Problem Statement
Build a full-stack competitive trading platform called **THE SELECT TRADERS** — a peer-to-peer competitive trading platform where traders compete against each other (not the broker) using platform-allocated trading accounts. The platform has three areas: Landing Page, Client Area, Admin Portal.

## User Choices (locked)
- Stack: React + FastAPI + MongoDB
- Scope strategy: **Landing Page first**, then build the rest in iterations
- Market data: Simulated (mocked candle/price ticks)
- Payments: Mocked for now; add Stripe later
- Auth: Both JWT custom + Emergent Google social login (when client area is built)

## Brand Identity (v2 — confirmed by user assets)
- **Logo**: "The Select Traders" wordmark (Title Case, NOT all caps) — modern rounded sans
- **Primary colour**: Lime green `#B4E04C`
- **Secondary colour**: Soft lavender purple `#A78BFA`
- **Neutrals**: Off-white `#FAFAF7` background, black `#0F0F12` text
- **Brand asset URLs** (live):
  - Wordmark: https://customer-assets.emergentagent.com/job_trade-duel-arena/artifacts/aemoxt7k_Asset%2025%404x-8.png
  - Icon variants (purple/white/black backgrounds) — see /app/design_guidelines.json
- **Direction**: Modern fintech aesthetic (Mercury / Ramp / Wise / Linear-meets-finance) — clean, premium, friendly, confident. NOT esports/dark/gold.
- **Typography**: Satoshi (Fontshare CDN), Geist Mono (Google Fonts). NOT Inter/Roboto/Bebas Neue.

## User Personas
- **Competitive Retail Trader** — wants to prove skill against peers, earn from competition
- **Pro Plan Member** — creates custom duels and tournaments
- **Spectator/Newcomer** — watches live duels, considers joining
- **Platform Operator** (admin) — manages users, matches, disputes, payouts

## Tech Stack
- Frontend: React (CRA + craco) + Tailwind + shadcn/ui + lucide-react + Recharts + sonner
- Backend: FastAPI + Motor (MongoDB async)
- Fonts loaded via CDN: Satoshi (Fontshare), Geist Mono (Google Fonts)

## What's Been Implemented

### v1 (2026-02-06) — Dark esports landing page (DEPRECATED)
- Original cinematic dark-navy + gold aesthetic with Bebas Neue. Scrapped after user feedback requesting modern fintech direction.

### v2 (2026-02-06) — Modern fintech landing page (CURRENT)
- Light off-white (#FAFAF7) primary theme with strategic dark blocks for impact
- Satoshi typography (Title Case headings, generous whitespace)
- Brand logo image embedded in nav and footer
- Sticky pill navigation (Mercury-style)
- Hero: bold left copy + right-side product UI mockup (duel preview card with live Recharts chart, two trader P&L cards, floating "Avg. winner ROI" pill, decorative lime/purple accent blocks)
- Mission/Vision: lime + purple pills with clean cards + bold pull-quote
- Problem: 3 clean white cards + dark "Third path" CTA pill
- Product Suite: Bento grid (5 products, 1v1 Duel as featured large card with floating winner pill)
- Product Deep-Dive: 5 alternating sections with bespoke UI mockup cards per product (duel tier table, royale lobby with leaderboard, multi-trader prize stages, tag-team match with avatars, community battles dark CTA block)
- Pricing: White Free card + dark Pro card with purple glow + lime "Go Pro" CTA
- 10-question FAQ: asymmetric two-col, hairline accordion (Linear-style)
- T&C summary card
- Subtle Bloomberg-style live ticker
- Massive dark closing CTA in footer with lime green "Start trading against people."
- Multi-column footer with social icons

## Prioritised Backlog

### P0 — Foundation
- Auth (JWT + Emergent Google) with immutable username
- Client Area shell (sidebar layout, dashboard, plan badge)
- Spawn Centre flow (mocked pairing with countdown)
- Active Match screen with simulated live P&L

### P1 — Core Client Flows
- 1v1 Duel Centre (Broadcast / Spawn / Create tabs)
- Trading Royale lobby browser + live leaderboard
- Multi Trader bracket view
- Tag Team team creation + match view
- My Stats (charts, history)
- Wallet (deposits, withdrawals, transaction history — mocked)
- Settings (profile, account, KYC stubs, notifications)
- /terms full page

### P2 — Admin Portal
- Admin login, Overview KPIs, User Mgmt, Duel/Royale/Tournament mgmt, Finance, Disputes, KYC, Announcements, Platform Settings

### P3 — Real integrations
- Stripe (subscriptions + entry fees)
- Real market data feed
- Email transactional
- Object storage (avatars, KYC docs)

## Next Tasks
1. Add /terms full page
2. Build Auth flow (call integration_playbook_expert_v2 for JWT + Emergent Google Auth)
3. Scaffold Client Area shell + Dashboard
4. Backend endpoint for Community Battles email capture (mongo collection `notify_signups`)
