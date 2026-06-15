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
    """Given a lobby and its participating users, return a sorted leaderboard.

    Marks users as eliminated based on the two-phase elimination engine:
    Phase 1 (first half of timeline) — no eliminations; Phase 2 (second half) —
    eliminations happen at equal intervals (rounded to the nearest 30s) with the
    lowest-equity active trader eliminated each tick until 1 winner remains.
    """
    seed = lobby.get("seed", 42)
    started_at = lobby.get("started_at") or lobby.get("starts_at") or _now()
    if isinstance(started_at, str):
        started_at = datetime.fromisoformat(started_at)
    elapsed = max(0, int((_now() - started_at).total_seconds()))
    t_bucket = elapsed // 3

    def _equity(idx: int, bucket: int) -> float:
        rng = random.Random((seed * 7901) ^ (idx * 131) ^ bucket)
        drift = 0.42 + rng.random() * 0.18
        pnl = _smooth_drift(seed * 1000 + idx, bucket, drift) * 0.5
        return 50000 + pnl, pnl

    state = compute_royale_state(lobby)
    elim_set = set(state["eliminated_user_ids"])
    elim_order = state["eliminated_user_ids"]  # in order of elimination

    rows = []
    for idx, p in enumerate(participants):
        equity, pnl = _equity(idx, t_bucket)
        rows.append({
            "user": p, "pnl": round(pnl, 2),
            "equity": round(equity, 2),
            "is_eliminated": p["id"] in elim_set,
            "_idx": idx,
        })

    # Active first (sorted by equity desc), then eliminated (in reverse elim order — last out first)
    active = [r for r in rows if not r["is_eliminated"]]
    eliminated = [r for r in rows if r["is_eliminated"]]
    active.sort(key=lambda r: r["equity"], reverse=True)
    # eliminated_user_ids is in order of elimination; preserve so "last eliminated" is shown first
    elim_idx_map = {uid: i for i, uid in enumerate(elim_order)}
    eliminated.sort(key=lambda r: elim_idx_map.get(r["user"]["id"], 0), reverse=True)

    # rank-change vs previous bucket — only for active
    prev_bucket = max(0, t_bucket - 1)
    prev_rows = [(p["id"], _equity(idx, prev_bucket)[0]) for idx, p in enumerate(participants) if p["id"] not in elim_set]
    prev_rows.sort(key=lambda r: r[1], reverse=True)
    prev_ranks = {uid: i for i, (uid, _) in enumerate(prev_rows)}

    out = []
    rank = 0
    for r in active:
        rank += 1
        old_rank = prev_ranks.get(r["user"]["id"], rank - 1)
        out.append({
            "rank": rank, "user": r["user"],
            "equity": r["equity"], "pnl": r["pnl"],
            "change": old_rank - (rank - 1),
            "is_eliminated": False,
        })
    for r in eliminated:
        rank += 1
        out.append({
            "rank": rank, "user": r["user"],
            "equity": r["equity"], "pnl": r["pnl"],
            "change": 0,
            "is_eliminated": True,
        })
    return out


def compute_royale_state(lobby: dict) -> dict:
    """Compute two-phase elimination state for a Royale lobby.

    Phase 1: first half of timeline, no eliminations.
    Phase 2: second half — at equal intervals (rounded to nearest 30s)
    eliminate the lowest-equity active trader, until 1 winner remains.
    """
    size = lobby.get("size", 10)
    timeline_seconds = lobby.get("timeline_seconds", 600)
    status = lobby.get("status", "filling")
    participant_ids = lobby.get("participant_ids", [])
    seed = lobby.get("seed", 42)

    started_at = lobby.get("started_at")
    if isinstance(started_at, str):
        started_at = datetime.fromisoformat(started_at)
    if not started_at or status not in ("live", "completed"):
        # Pre-live: no eliminations yet
        return {
            "phase": "pre", "phase_label": "Awaiting start",
            "next_elimination_in_seconds": None,
            "eliminations_remaining": max(0, len(participant_ids) - 1),
            "total_active": len(participant_ids),
            "eliminated_user_ids": [],
            "phase_1_ends_in_seconds": None,
            "phase_2_ends_in_seconds": None,
        }

    elapsed = max(0, int((_now() - started_at).total_seconds()))
    half = timeline_seconds // 2
    n = len(participant_ids)
    if n <= 1:
        return {
            "phase": "finished", "phase_label": "Royale finished",
            "next_elimination_in_seconds": None,
            "eliminations_remaining": 0,
            "total_active": n,
            "eliminated_user_ids": [],
            "phase_1_ends_in_seconds": 0,
            "phase_2_ends_in_seconds": 0,
        }

    # Compute elimination interval — round to nearest 30s
    raw_interval = half / max(1, n - 1)
    interval = max(30, round(raw_interval / 30) * 30)

    # Schedule elimination ticks: at half, half+interval, half+2*interval, ...
    # We need (n - 1) eliminations to crown a winner.
    tick_times = [half + i * interval for i in range(n - 1)]

    # Determine which ticks have already occurred
    occurred = [t for t in tick_times if elapsed >= t]

    def _equity(idx: int, t_seconds: int) -> float:
        bucket = t_seconds // 3
        rng = random.Random((seed * 7901) ^ (idx * 131) ^ bucket)
        drift = 0.42 + rng.random() * 0.18
        pnl = _smooth_drift(seed * 1000 + idx, bucket, drift) * 0.5
        return 50000 + pnl

    # Walk through occurred ticks and eliminate lowest equity at each tick
    alive_idxs = list(range(n))
    eliminated_user_ids: List[str] = []
    for t in occurred:
        if len(alive_idxs) <= 1:
            break
        equities = [(idx, _equity(idx, t)) for idx in alive_idxs]
        equities.sort(key=lambda x: x[1])  # lowest first
        eliminated_idx = equities[0][0]
        alive_idxs.remove(eliminated_idx)
        eliminated_user_ids.append(participant_ids[eliminated_idx])

    # Build response
    if elapsed < half:
        phase = "phase1"
        next_elim_in = half - elapsed
        phase_label = "Phase 1 — All fighting"
    elif len(alive_idxs) <= 1:
        phase = "finished"
        next_elim_in = None
        phase_label = "Royale finished"
    else:
        phase = "phase2"
        # next tick beyond current elapsed
        future = [t for t in tick_times if t > elapsed]
        next_elim_in = (future[0] - elapsed) if future else None
        phase_label = "Phase 2 — Elimination round"

    return {
        "phase": phase,
        "phase_label": phase_label,
        "next_elimination_in_seconds": next_elim_in,
        "eliminations_remaining": max(0, n - 1 - len(eliminated_user_ids)),
        "total_active": len(alive_idxs),
        "eliminated_user_ids": eliminated_user_ids,
        "elimination_interval_seconds": interval,
        "phase_1_ends_in_seconds": max(0, half - elapsed),
        "phase_2_ends_in_seconds": max(0, timeline_seconds - elapsed),
    }


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
