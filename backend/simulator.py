"""Deterministic on-read live data simulation.

Computes current P&L, equity, time-left and leaderboards based on each entity's
seed + the current wall clock. No background tasks, no DB writes per tick.
"""
from __future__ import annotations
import math
import random
from datetime import datetime, timezone
from typing import List, Tuple


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _smooth_drift(seed: int, t_bucket: int, drift: float) -> float:
    """Pseudo-random walk value seeded by (seed, t_bucket).
    Drift > 0.5 biases upward, < 0.5 downward.
    Returns a P&L value in roughly [-5000, 5000] over many buckets.
    """
    rng = random.Random((seed * 1000003) ^ t_bucket)
    total = 0.0
    for i in range(t_bucket + 1):
        step_rng = random.Random((seed * 1000003) ^ i)
        step = (step_rng.random() - (1 - drift)) * 60
        # add some sine-modulated noise for visual life
        step += math.sin(i / 7.0 + seed % 11) * 18
        total += step
    return round(total, 2)


def compute_duel_pnl(duel: dict) -> Tuple[float, float, int]:
    """Returns (pnl_a, pnl_b, time_left_seconds) for a live duel."""
    started_at = duel["started_at"]
    ends_at = duel["ends_at"]
    if isinstance(started_at, str):
        started_at = datetime.fromisoformat(started_at)
    if isinstance(ends_at, str):
        ends_at = datetime.fromisoformat(ends_at)

    now = _now()
    elapsed = max(0, int((now - started_at).total_seconds()))
    # bucket by 2-second windows for visual liveness without flicker
    t_bucket = elapsed // 2

    pnl_a = _smooth_drift(duel.get("seed_a", 1234), t_bucket, duel.get("drift_a", 0.5))
    pnl_b = _smooth_drift(duel.get("seed_b", 5678), t_bucket, duel.get("drift_b", 0.5))

    # Scale P&L proportional to account size — bigger account, bigger moves
    scale = duel["account_size"] / 100000
    pnl_a = round(pnl_a * scale, 2)
    pnl_b = round(pnl_b * scale, 2)

    time_left = max(0, int((ends_at - now).total_seconds()))
    return pnl_a, pnl_b, time_left


def compute_spectators(duel: dict) -> int:
    """Slight variation around a base count so it feels alive."""
    base = duel.get("spectator_base", 50)
    seed = duel.get("seed_a", 0) + duel.get("seed_b", 0)
    t_bucket = int(_now().timestamp()) // 4
    rng = random.Random((seed << 7) ^ t_bucket)
    return base + rng.randint(-8, 12)


def compute_equity_series(duel: dict, points: int = 40) -> List[dict]:
    """Sample the random-walk in `points` evenly spaced buckets up to now."""
    started_at = duel["started_at"]
    if isinstance(started_at, str):
        started_at = datetime.fromisoformat(started_at)
    elapsed = max(1, int((_now() - started_at).total_seconds()))
    bucket_size = max(1, elapsed // points)
    out = []
    scale = duel["account_size"] / 100000
    for i in range(points):
        b = (i + 1) * bucket_size // 2
        a_val = _smooth_drift(duel["seed_a"], b, duel.get("drift_a", 0.5)) * scale
        b_val = _smooth_drift(duel["seed_b"], b, duel.get("drift_b", 0.5)) * scale
        out.append({"i": i, "a": round(a_val, 2), "b": round(b_val, 2)})
    return out


def compute_royale_leaderboard(lobby: dict, participants: List[dict]) -> List[dict]:
    """Given a lobby and its participating users, return a sorted leaderboard."""
    seed = lobby.get("seed", 42)
    started_at = lobby.get("started_at") or lobby.get("starts_at") or _now()
    if isinstance(started_at, str):
        started_at = datetime.fromisoformat(started_at)
    elapsed = max(0, int((_now() - started_at).total_seconds()))
    t_bucket = elapsed // 3

    rows = []
    for idx, p in enumerate(participants):
        rng = random.Random((seed * 7901) ^ (idx * 131) ^ t_bucket)
        drift = 0.42 + rng.random() * 0.18
        pnl = _smooth_drift(seed * 1000 + idx, t_bucket, drift)
        # scale based on default royale account ($5K)
        pnl = round(pnl * 0.5, 2)
        rows.append({"user": p, "pnl": pnl, "equity": 50000 + pnl})

    rows.sort(key=lambda r: r["equity"], reverse=True)

    # rank-change vs previous bucket
    prev_bucket = max(0, t_bucket - 1)
    prev_rows = []
    for idx, p in enumerate(participants):
        rng = random.Random((seed * 7901) ^ (idx * 131) ^ prev_bucket)
        drift = 0.42 + rng.random() * 0.18
        pnl = _smooth_drift(seed * 1000 + idx, prev_bucket, drift) * 0.5
        prev_rows.append({"user": p, "equity": 50000 + pnl})
    prev_rows.sort(key=lambda r: r["equity"], reverse=True)
    prev_ranks = {r["user"]["id"]: i for i, r in enumerate(prev_rows)}

    out = []
    for new_rank, r in enumerate(rows):
        old_rank = prev_ranks.get(r["user"]["id"], new_rank)
        out.append({
            "rank": new_rank + 1,
            "user": r["user"],
            "equity": round(r["equity"], 2),
            "pnl": round(r["pnl"], 2),
            "change": old_rank - new_rank,
        })
    return out


def compute_starts_in(lobby: dict) -> str:
    """Human-readable starts-in label."""
    if lobby["status"] == "live":
        return "Live"
    if lobby["status"] == "starting":
        return "Starting"
    starts_at = lobby.get("starts_at")
    if not starts_at:
        return "Filling"
    if isinstance(starts_at, str):
        starts_at = datetime.fromisoformat(starts_at)
    delta = (starts_at - _now()).total_seconds()
    if delta <= 0:
        return "Starting"
    mins = int(delta // 60)
    if mins < 60:
        return f"{mins}m"
    hrs = mins // 60
    return f"{hrs}h"


def compute_earnings_trend(user: dict, days: int = 30) -> List[dict]:
    """Deterministic earnings sparkline for a user over the last `days` days."""
    seed = sum(ord(c) for c in user.get("username", "x"))
    rng = random.Random(seed)
    base = 1800
    out = []
    cumulative = 0
    for i in range(days):
        delta = int((rng.random() - 0.35) * 600 + math.sin(i / 4) * 200 + i * 100)
        cumulative = max(0, cumulative + delta)
        out.append({"day": i + 1, "earnings": cumulative})
    return out
