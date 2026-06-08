"""Seed data — populates the DB with realistic demo content on startup if empty."""
from __future__ import annotations
import random
from datetime import datetime, timedelta, timezone

from models import (
    User, Duel, DuelRules, RoyaleLobby, Tournament, Team, Transaction,
    Notification, MatchResult, LinkedAccount,
)
import database as db


def _now():
    return datetime.now(timezone.utc)


def _iso(dt: datetime) -> str:
    return dt.isoformat()


DEMO_USERS_SEED = [
    {"username": "TradeFury", "full_name": "Riley Chen", "email": "riley@example.com", "plan": "PRO", "tier": "Gold", "global_rank": 142, "win_rate": 62.4, "matches_played": 84, "wins": 52, "losses": 32, "win_streak": 4, "best_streak": 9, "best_trade": 3420, "worst_drawdown": -1840, "balance": 12480.5, "pending": 3200, "lifetime_earned": 48720, "country": "🇺🇸", "kyc_status": "not_started"},
    {"username": "GoldHands", "full_name": "Jonas Weber", "email": "jonas@example.com", "plan": "PRO", "tier": "Diamond", "global_rank": 38, "win_rate": 71.2, "matches_played": 156, "wins": 111, "losses": 45, "win_streak": 7, "best_streak": 14, "balance": 24800, "lifetime_earned": 112400, "country": "🇩🇪"},
    {"username": "StealthAlpha", "full_name": "Maya Park", "email": "maya@example.com", "plan": "PRO", "tier": "Elite", "global_rank": 12, "win_rate": 76.8, "matches_played": 220, "balance": 41200, "lifetime_earned": 218000, "country": "🇰🇷"},
    {"username": "PaperHandsNoMore", "full_name": "Felix Cole", "email": "felix@example.com", "plan": "FREE", "tier": "Silver", "global_rank": 401, "win_rate": 54.1, "matches_played": 41, "balance": 1840, "lifetime_earned": 7600, "country": "🇨🇦"},
    {"username": "FXSamurai", "full_name": "Hiro Tanaka", "email": "hiro@example.com", "plan": "PRO", "tier": "Gold", "global_rank": 188, "win_rate": 60.5, "matches_played": 92, "balance": 9120, "lifetime_earned": 38400, "country": "🇯🇵"},
    {"username": "CryptoKing", "full_name": "Aisha Khan", "email": "aisha@example.com", "plan": "FREE", "tier": "Bronze", "global_rank": 920, "win_rate": 48.3, "matches_played": 28, "balance": 540, "lifetime_earned": 2200, "country": "🇦🇪"},
    {"username": "TradeNova", "full_name": "Lucia Rossi", "email": "lucia@example.com", "plan": "PRO", "tier": "Diamond", "global_rank": 71, "win_rate": 68.7, "matches_played": 134, "balance": 18400, "lifetime_earned": 84200, "country": "🇮🇹"},
    {"username": "MarketBeast", "full_name": "Owen Reilly", "email": "owen@example.com", "plan": "FREE", "tier": "Gold", "global_rank": 251, "win_rate": 57.2, "matches_played": 73, "balance": 4220, "lifetime_earned": 18900, "country": "🇮🇪"},
    {"username": "RileyJess", "full_name": "Jess Park", "email": "jess@example.com", "plan": "PRO", "tier": "Gold", "global_rank": 198, "win_rate": 61.0, "matches_played": 60, "balance": 6200, "country": "🇺🇸"},
    {"username": "MoCapital", "full_name": "Mo Ibrahim", "email": "mo@example.com", "plan": "PRO", "tier": "Silver", "global_rank": 320, "win_rate": 55.8, "matches_played": 48, "balance": 3100, "country": "🇪🇬"},
]


async def is_empty() -> bool:
    n = await db.users().count_documents({})
    return n == 0


async def seed_all():
    if not await is_empty():
        return False
    now = _now()

    # ----- USERS -----
    users_map = {}
    for u in DEMO_USERS_SEED:
        user = User(**u)
        doc = user.model_dump()
        doc["created_at"] = _iso(doc["created_at"])
        await db.users().insert_one(doc)
        users_map[user.username] = user

    # ----- DUELS (4 live) -----
    duel_specs = [
        ("TradeFury", "GoldHands", 100000, False, 0.62, 0.42),   # current user winning
        ("StealthAlpha", "PaperHandsNoMore", 250000, True, 0.58, 0.55),  # custom Pro
        ("FXSamurai", "CryptoKing", 50000, False, 0.46, 0.58),
        ("TradeNova", "MarketBeast", 25000, False, 0.55, 0.48),
    ]
    duel_tiers = {5000: (60, 100), 10000: (125, 200), 25000: (280, 500), 50000: (550, 1000),
                  100000: (1100, 2000), 250000: (2800, 5000), 500000: (5500, 10000), 1000000: (11000, 20000)}

    for a_name, b_name, acc, is_custom, drift_a, drift_b in duel_specs:
        entry, prize = duel_tiers[acc]
        duration_hours = 24 if acc >= 50000 else 4
        # stagger start times so timers vary
        started = now - timedelta(minutes=random.randint(15, 90))
        ends = started + timedelta(hours=duration_hours)
        duel = Duel(
            type="custom" if is_custom else "standard",
            trader_a_id=users_map[a_name].id,
            trader_b_id=users_map[b_name].id,
            creator_id=users_map[a_name].id if is_custom else None,
            account_size=acc,
            entry_fee=entry,
            prize=prize,
            status="live",
            started_at=started,
            ends_at=ends,
            drift_a=drift_a,
            drift_b=drift_b,
            spectator_base=random.randint(40, 480),
            rules=DuelRules(
                leverage="1:100" if is_custom else "1:50",
                daily_dd=10 if is_custom else 15,
                max_dd=20,
                timeline=f"{duration_hours}h",
            ),
        )
        doc = duel.model_dump()
        doc["started_at"] = _iso(doc["started_at"])
        doc["ends_at"] = _iso(doc["ends_at"])
        await db.duels().insert_one(doc)

    # ----- ROYALE LOBBIES -----
    timeline_map = {"5min": 300, "10min": 600, "15min": 900, "30min": 1800, "1h": 3600,
                    "4h": 14400, "24h": 86400, "36h": 129600, "48h": 172800, "72h": 259200}
    lobby_specs = [
        (50, "24h", "filling", 47, 12),     # filling, starts in 12 min
        (20, "1h", "live", 20, 0),           # live now
        (10, "5min", "filling", 6, 0),       # filling, no specific start
        (50, "72h", "filling", 12, 0),
        (20, "4h", "filling", 15, 120),      # starts in 2h
        (10, "30min", "starting", 10, 1),    # starting soon
    ]
    for size, timeline, status, joined, starts_min in lobby_specs:
        starts_at = now + timedelta(minutes=starts_min) if starts_min else None
        started_at = now - timedelta(minutes=27) if status == "live" else None
        ends_at = (started_at + timedelta(seconds=timeline_map[timeline])) if started_at else None
        participants = list(users_map.values())[:joined] if joined else []
        lobby = RoyaleLobby(
            size=size,
            timeline=timeline,
            timeline_seconds=timeline_map[timeline],
            participant_ids=[u.id for u in participants],
            status=status,
            starts_at=starts_at,
            started_at=started_at,
            ends_at=ends_at,
        )
        doc = lobby.model_dump()
        for k in ("starts_at", "started_at", "ends_at"):
            if doc.get(k):
                doc[k] = _iso(doc[k])
        await db.royale_lobbies().insert_one(doc)

    # ----- TOURNAMENTS -----
    user_ids = [u.id for u in users_map.values()]

    def make_groups(active_user_id: str, week_1_done: bool):
        groups = []
        for label in "ABCDEFGH":
            rows = []
            for i in range(4):
                u_id = active_user_id if (label == "A" and i == 0) else random.choice(user_ids)
                if week_1_done:
                    w, d, l = random.choice([(3, 0, 0), (2, 1, 0), (1, 0, 2), (0, 1, 2)])
                    equity = random.randint(-5000, 14000)
                    advanced = (w >= 2)
                else:
                    w, d, l = 0, 0, 0
                    equity = 0
                    advanced = False
                rows.append({
                    "user_id": u_id,
                    "w": w, "d": d, "l": l,
                    "equity": equity,
                    "advanced": advanced,
                })
            groups.append({"label": label, "rows": rows})
        return groups

    tournaments_seed = [
        {"name": "February Open", "stage": "Registration", "start_date": "Feb 10", "prize_pool": 12800,
         "registered": user_ids[:6], "groups": []},
        {"name": "Crypto Circuit", "stage": "Group Stage", "start_date": "Feb 12", "prize_pool": 25600,
         "registered": user_ids[:10], "groups": make_groups(users_map["TradeFury"].id, True)},
    ]
    for t in tournaments_seed:
        tour = Tournament(
            name=t["name"],
            stage=t["stage"],
            start_date=t["start_date"],
            prize_pool=t["prize_pool"],
            registered_ids=t["registered"],
            groups=t["groups"],
        )
        await db.tournaments().insert_one(tour.model_dump())

    # ----- TEAMS -----
    team_specs = [
        {"name": "Alpha", "format": "3v3", "captain": "TradeFury",
         "members": ["TradeFury", "RileyJess", "MoCapital"], "splits": [400000, 350000, 250000], "total": 1000000,
         "wins": 4, "losses": 1},
        {"name": "Capital", "format": "5v5", "captain": "MoCapital",
         "members": ["MoCapital", "TradeFury", "FXSamurai", "TradeNova", "RileyJess"],
         "splits": [200000, 200000, 200000, 200000, 200000], "total": 1000000, "wins": 2, "losses": 3},
    ]
    for t in team_specs:
        team = Team(
            name=t["name"],
            format=t["format"],
            captain_id=users_map[t["captain"]].id,
            member_ids=[users_map[n].id for n in t["members"]],
            splits=t["splits"],
            total_account=t["total"],
            wins=t["wins"],
            losses=t["losses"],
        )
        await db.teams().insert_one(team.model_dump())

    # ----- TRANSACTIONS for current user -----
    tradefury_id = users_map["TradeFury"].id
    tx_seed = [
        ("Prize", 1000, "completed", "Duel #4779", 5),
        ("Entry Fee", -550, "completed", "Duel #4779", 5),
        ("Deposit", 500, "completed", "Card •••4242", 6),
        ("Prize", 500, "completed", "Duel #4756", 7),
        ("Withdrawal", -2000, "processing", "Bank •••1184", 8),
        ("Entry Fee", -280, "completed", "Duel #4731", 10),
    ]
    for type_, amount, status, ref, days_ago in tx_seed:
        tx = Transaction(
            user_id=tradefury_id, type=type_, amount=amount,
            status=status, reference=ref,
            created_at=now - timedelta(days=days_ago),
        )
        doc = tx.model_dump()
        doc["created_at"] = _iso(doc["created_at"])
        await db.transactions().insert_one(doc)

    # ----- NOTIFICATIONS -----
    notif_seed = [
        ("pair", "Opponent found", "You've been paired with @FXSamurai for a $50K Duel.", True, 0.03),
        ("prize", "Prize credited", "$1,000 added to your wallet for Duel #4779.", True, 1),
        ("tournament", "Tournament starting soon", "February Open registration closes in 2 days.", False, 5),
        ("system", "KYC reminder", "Complete KYC before your first withdrawal.", False, 24),
    ]
    for type_, title, body, unread, hours_ago in notif_seed:
        n_obj = Notification(
            user_id=tradefury_id, type=type_, title=title, body=body, unread=unread,
            created_at=now - timedelta(hours=hours_ago),
        )
        doc = n_obj.model_dump()
        doc["created_at"] = _iso(doc["created_at"])
        await db.notifications().insert_one(doc)

    # ----- MATCH RESULTS (recent history) -----
    results_seed = [
        ("1v1 Duel", "@FXSamurai", 50000, 850, "win", 1000, 240, 2),
        ("Royale 50p", "Lobby R-2188", 5000, -45, "loss", 0, 90, 3),
        ("1v1 Duel", "@StealthAlpha", 25000, 410, "win", 500, 180, 4),
        ("Tag Team 3v3", "Team Beta", 100000, 1240, "win", 800, 360, 5),
        ("1v1 Duel", "@TradeNova", 10000, -180, "loss", 0, 120, 7),
    ]
    for fmt, opp, acc, pnl, result, prize, duration, days_ago in results_seed:
        mr = MatchResult(
            user_id=tradefury_id, match_id=f"M-{random.randint(4000,4999)}",
            format=fmt, opponent=opp, account_size=acc, pnl=pnl, result=result,
            prize=prize, duration_minutes=duration,
            date_label=(now - timedelta(days=days_ago)).strftime("%b %d"),
            created_at=now - timedelta(days=days_ago),
        )
        doc = mr.model_dump()
        doc["created_at"] = _iso(doc["created_at"])
        await db.match_results().insert_one(doc)

    # ----- LINKED ACCOUNTS -----
    for la_spec in [
        {"label": "Bank •••1184", "type": "Bank", "country": "🇺🇸", "is_default": True},
        {"label": "USDT (TRC20) •••f7c2", "type": "Crypto", "country": "—", "is_default": False},
    ]:
        la = LinkedAccount(user_id=tradefury_id, **la_spec)
        await db.linked_accounts().insert_one(la.model_dump())

    return True
