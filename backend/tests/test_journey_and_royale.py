"""Tests for the v4.2 Trading Station detail endpoints,
royale phase engine, tournament journey + bracket endpoints.
"""
import os
import re
from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest
import requests
from pymongo import MongoClient


def _load_env():
    """Resolve BASE_URL and Mongo creds from /app/frontend/.env + /app/backend/.env"""
    base = os.environ.get("REACT_APP_BACKEND_URL")
    if not base:
        for line in Path("/app/frontend/.env").read_text().splitlines():
            m = re.match(r"^REACT_APP_BACKEND_URL=(.*)$", line.strip())
            if m:
                base = m.group(1)
                break
    mongo = os.environ.get("MONGO_URL")
    dbn = os.environ.get("DB_NAME")
    if not mongo or not dbn:
        for line in Path("/app/backend/.env").read_text().splitlines():
            if line.startswith("MONGO_URL="):
                mongo = mongo or line.split("=", 1)[1].strip()
            if line.startswith("DB_NAME="):
                dbn = dbn or line.split("=", 1)[1].strip()
    return base.rstrip("/"), mongo, dbn


BASE_URL, MONGO_URL, DB_NAME = _load_env()


@pytest.fixture(scope="module")
def mdb():
    c = MongoClient(MONGO_URL)
    yield c[DB_NAME]
    c.close()


@pytest.fixture(scope="module")
def s():
    sess = requests.Session()
    sess.headers.update({"X-Username": "TradeFury", "Content-Type": "application/json"})
    return sess


@pytest.fixture(scope="module")
def me(s):
    r = s.get(f"{BASE_URL}/api/me")
    assert r.status_code == 200, r.text
    return r.json()


# ---------------- Journey endpoint ----------------

class TestTournamentJourney:
    def test_journey_returns_list(self, s):
        r = s.get(f"{BASE_URL}/api/me/tournaments/journey")
        assert r.status_code == 200, r.text
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 3, f"Expected >=3 journeys (T-SPRING, T-BRONZE, Diamond Open + maybe others) got {len(data)}"

    def test_journey_tspring_sf_exit_with_prize(self, s):
        data = s.get(f"{BASE_URL}/api/me/tournaments/journey").json()
        spring = next((j for j in data if j["tournament_id"] == "T-SPRING"), None)
        assert spring is not None, "Spring Classic (T-SPRING) journey missing"
        assert spring["tournament_stage"] == "Completed"
        assert spring["exit_stage"] == "Semi-Finals"
        assert spring["prize_won"] > 0, f"SF exit must have prize > 0, got {spring['prize_won']}"
        # Path includes Group Stage + R16 + QF + SF (4 entries), last lost
        stages = [p["stage"] for p in spring["path"]]
        assert stages == ["Group Stage", "Round of 16", "Quarter-Finals", "Semi-Finals"], stages
        assert spring["path"][-1]["result"] == "Lost"
        assert spring["path"][-2]["result"] == "Won"
        # Opponent usernames populated
        for p in spring["path"][1:]:
            assert p.get("opponent", "").startswith("@"), p

    def test_journey_tbronze_r16_exit(self, s):
        data = s.get(f"{BASE_URL}/api/me/tournaments/journey").json()
        bronze = next((j for j in data if j["tournament_id"] == "T-BRONZE"), None)
        assert bronze is not None, "Bronze Cup (T-BRONZE) journey missing"
        assert bronze["tournament_stage"] == "Completed"
        assert bronze["exit_stage"] == "Round of 16"
        assert bronze["prize_won"] > 0
        # Should have Group Stage + R16 only (lost in R16)
        stages = [p["stage"] for p in bronze["path"]]
        assert stages == ["Group Stage", "Round of 16"], stages
        assert bronze["path"][-1]["result"] == "Lost"

    def test_journey_includes_ongoing_diamond_open(self, s):
        data = s.get(f"{BASE_URL}/api/me/tournaments/journey").json()
        diamond = next((j for j in data if "Diamond Open 2026" in j["tournament_name"]), None)
        assert diamond is not None, "Diamond Open 2026 ongoing journey missing"
        assert diamond["tournament_stage"] == "Group Stage"
        # Should be in group stage, no bracket exit
        # exit_stage should be 'Group Stage' label or 'Not started'
        assert diamond["prize_won"] == 0


# ---------------- Tournament bracket ----------------

class TestTournamentBracket:
    def test_bracket_full_for_completed(self, s, me):
        r = s.get(f"{BASE_URL}/api/tournaments/T-SPRING/bracket")
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["id"] == "T-SPRING"
        assert d["stages"] == ["R16", "QF", "SF", "Final"]
        b = d["bracket"]
        assert len(b["R16"]) == 8, len(b["R16"])
        assert len(b["QF"]) == 4
        assert len(b["SF"]) == 2
        assert len(b["Final"]) == 1
        # Each match has user_a/user_b with username/tier/is_you/id
        for stage in ["R16", "QF", "SF"]:
            for m in b[stage]:
                if m["user_a"]:
                    assert "username" in m["user_a"]
                    assert "tier" in m["user_a"]
                    assert "is_you" in m["user_a"]
                assert "pnl_a" in m
                assert "pnl_b" in m
        # is_you=True flag should appear somewhere for TradeFury since she's in T-SPRING
        any_is_you = any(
            (m["user_a"] and m["user_a"]["is_you"]) or (m["user_b"] and m["user_b"]["is_you"])
            for stage in ["R16", "QF", "SF", "Final"] for m in b[stage]
        )
        assert any_is_you, "TradeFury should appear with is_you=True somewhere in T-SPRING bracket"
        # winner field present
        assert "winner" in d
        # winner_is_you flag exists on matches
        for m in b["R16"]:
            assert "winner_is_you" in m

    def test_bracket_404(self, s):
        r = s.get(f"{BASE_URL}/api/tournaments/does-not-exist/bracket")
        assert r.status_code == 404


# ---------------- Station detail: duel ----------------

class TestStationDuelDetail:
    @pytest.fixture(scope="class")
    def live_duel_id(self, s, me, mdb):
        # Find any live duel involving TradeFury, else fall back to any participant duel
        d = mdb.duels.find_one({"$or": [{"trader_a_id": me["id"]}, {"trader_b_id": me["id"]}],
                                "status": "live"}, {"_id": 0})
        if not d:
            # any duel for participation check
            d = mdb.duels.find_one({"$or": [{"trader_a_id": me["id"]}, {"trader_b_id": me["id"]}]}, {"_id": 0})
        assert d, "No duel found for TradeFury in seed"
        return d["id"]

    def test_station_duel_returns_me_opp_mt5(self, s, live_duel_id):
        r = s.get(f"{BASE_URL}/api/me/trading-station/duel/{live_duel_id}")
        assert r.status_code == 200, r.text
        d = r.json()
        assert "me" in d and "opponent" in d
        for side in (d["me"], d["opponent"]):
            assert "pnl" in side
            assert "equity" in side
            assert "equity_series" in side
            assert isinstance(side["equity_series"], list)
        mt5 = d["me"]["mt5"]
        assert set(mt5.keys()) >= {"login", "password", "server", "platform"}
        assert mt5["platform"] == "MetaTrader 5"
        assert len(mt5["password"]) == 10
        assert mt5["login"].isdigit()

    def test_station_duel_403_for_non_participant(self, live_duel_id):
        # Use a user who is not in this duel
        r = requests.get(f"{BASE_URL}/api/me/trading-station/duel/{live_duel_id}",
                         headers={"X-Username": "PaperHandsNoMore"})
        # PaperHandsNoMore probably is not in TradeFury's duel; if they are, fall back
        if r.status_code == 200:
            pytest.skip("Random non-participant happened to be in this duel")
        assert r.status_code == 403, r.text

    def test_station_duel_404(self, s):
        r = s.get(f"{BASE_URL}/api/me/trading-station/duel/non-existent-id")
        assert r.status_code == 404


# ---------------- Station detail: tournament ----------------

class TestStationTournamentDetail:
    def test_tournament_journey_spring(self, s):
        r = s.get(f"{BASE_URL}/api/me/trading-station/tournament/T-SPRING")
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["id"] == "T-SPRING"
        assert "journey" in d
        assert d["journey"]["exit_stage"] == "Semi-Finals"
        assert d["journey"]["prize_won"] > 0
        assert "mt5" in d["me"]

    def test_tournament_403_not_registered(self):
        # Create a brand-new user via direct mongo? Instead use a user unlikely to be registered.
        # Find a user that isn't in T-SPRING registered_ids.
        r = requests.get(f"{BASE_URL}/api/me/trading-station/tournament/T-SPRING",
                         headers={"X-Username": "PaperHandsNoMore"})
        # If they are registered, skip
        if r.status_code == 200:
            pytest.skip("PaperHandsNoMore happens to be registered for T-SPRING")
        assert r.status_code == 403

    def test_tournament_404(self, s):
        r = s.get(f"{BASE_URL}/api/me/trading-station/tournament/nope")
        assert r.status_code == 404


# ---------------- Station detail: royale ----------------

class TestStationRoyaleDetail:
    @pytest.fixture(scope="class")
    def royale_lobby_id(self, mdb, me):
        # Find a live royale lobby where TradeFury is a participant.
        l = mdb.royale_lobbies.find_one({"status": "live", "participant_ids": me["id"]}, {"_id": 0})
        if not l:
            # Fall back to any live lobby for phase-math testing (will 403 station endpoint though)
            l = mdb.royale_lobbies.find_one({"status": "live"}, {"_id": 0})
        assert l, "No live royale lobby seeded"
        return l["id"], l["participant_ids"]

    def test_station_royale_detail(self, s, royale_lobby_id, me):
        lid, pids = royale_lobby_id
        if me["id"] not in pids:
            pytest.skip("TradeFury not in any live royale lobby")
        r = s.get(f"{BASE_URL}/api/me/trading-station/royale/{lid}")
        assert r.status_code == 200, r.text
        d = r.json()
        assert "state" in d
        assert "leaderboard" in d
        assert "mt5" in d["me"]
        assert d["state"]["phase"] in ("phase1", "phase2", "finished", "pre")
        for row in d["leaderboard"]:
            assert "is_eliminated" in row

    def test_station_royale_403(self, royale_lobby_id):
        lid, _ = royale_lobby_id
        # Empty participant lobby check - use a user that is unlikely to be in it
        r = requests.get(f"{BASE_URL}/api/me/trading-station/royale/{lid}",
                         headers={"X-Username": "PaperHandsNoMore"})
        if r.status_code == 200:
            pytest.skip("Random user happened to be in the lobby")
        assert r.status_code == 403

    def test_station_royale_404(self, s):
        r = s.get(f"{BASE_URL}/api/me/trading-station/royale/no-such-lobby")
        assert r.status_code == 404


# ---------------- Royale state engine: phase math ----------------

class TestRoyaleStateEngine:
    def test_30min_lobby_22m_in_is_phase2(self, s, mdb):
        """Force the 10p/30min lobby to exactly 22m-in to validate phase 2 math.

        timeline=1800s, half=900s, n=10 -> raw_interval=100, rounded to 90s.
        At elapsed=1320s, ticks at 900,990,1080,1170,1260 -> 5 eliminated.
        """
        l = mdb.royale_lobbies.find_one(
            {"size": 10, "timeline": "30min", "status": "live"}, {"_id": 0})
        assert l, "Expected seeded 10p/30min live lobby not found"
        orig = l["started_at"]
        try:
            new_started = (datetime.now(timezone.utc) - timedelta(minutes=22)).isoformat()
            mdb.royale_lobbies.update_one({"id": l["id"]}, {"$set": {"started_at": new_started}})
            r = s.get(f"{BASE_URL}/api/royale/lobbies/{l['id']}/state")
            assert r.status_code == 200, r.text
            body = r.json()
            st = body["state"]
            assert st["phase"] == "phase2", st
            assert st["elimination_interval_seconds"] == 90, st
            n_part = len(l["participant_ids"])
            assert st["total_active"] == n_part - 5, f"Expected {n_part-5} active, got {st['total_active']}"
            assert len(st["eliminated_user_ids"]) == 5
            assert st["next_elimination_in_seconds"] is not None
            # next tick = 1350 -> in 30s
            assert 0 <= st["next_elimination_in_seconds"] <= 60, st["next_elimination_in_seconds"]
            # leaderboard alignment
            leaderboard = body["leaderboard"]
            eliminated_count = sum(1 for row in leaderboard if row["is_eliminated"])
            assert eliminated_count == 5
            # Active rows come before eliminated rows
            seen_elim = False
            for row in leaderboard:
                if row["is_eliminated"]:
                    seen_elim = True
                else:
                    assert not seen_elim, "Active row appeared after an eliminated row"
        finally:
            mdb.royale_lobbies.update_one({"id": l["id"]}, {"$set": {"started_at": orig}})

    def test_1h_lobby_12m_in_is_phase1(self, s, mdb):
        """Force the 1h lobby to exactly 12m-in (720s < half=1800s -> phase1)."""
        l = mdb.royale_lobbies.find_one(
            {"size": 20, "timeline": "1h", "status": "live"}, {"_id": 0})
        assert l, "Expected seeded 20p/1h live lobby not found"
        orig = l["started_at"]
        try:
            new_started = (datetime.now(timezone.utc) - timedelta(minutes=12)).isoformat()
            mdb.royale_lobbies.update_one({"id": l["id"]}, {"$set": {"started_at": new_started}})
            r = s.get(f"{BASE_URL}/api/royale/lobbies/{l['id']}/state")
            assert r.status_code == 200
            st = r.json()["state"]
            assert st["phase"] == "phase1", st
            # total_active == actual participants (capped by seeded users)
            assert st["total_active"] == len(l["participant_ids"]), st
            assert st["eliminated_user_ids"] == []
            # next elim = phase 2 start = 1800 - 720 = 1080s
            assert st["next_elimination_in_seconds"] is not None
            assert 1050 <= st["next_elimination_in_seconds"] <= 1110, st["next_elimination_in_seconds"]
        finally:
            mdb.royale_lobbies.update_one({"id": l["id"]}, {"$set": {"started_at": orig}})

    def test_force_finished_phase(self, s, mdb):
        """Backdate a 30min lobby to long past so all elims have occurred -> finished."""
        l = mdb.royale_lobbies.find_one({"size": 10, "timeline": "30min", "status": "live"}, {"_id": 0})
        assert l
        orig_started = l["started_at"]
        try:
            # Force well past timeline end
            new_started = (datetime.now(timezone.utc) - timedelta(hours=2)).isoformat()
            mdb.royale_lobbies.update_one({"id": l["id"]}, {"$set": {"started_at": new_started}})
            r = s.get(f"{BASE_URL}/api/royale/lobbies/{l['id']}/state")
            st = r.json()["state"]
            assert st["phase"] == "finished", st
            assert st["total_active"] == 1
            assert st["next_elimination_in_seconds"] is None
            assert len(st["eliminated_user_ids"]) == 9
        finally:
            mdb.royale_lobbies.update_one({"id": l["id"]}, {"$set": {"started_at": orig_started}})

    def test_force_phase1_at_start(self, s, mdb):
        """Backdate started_at to ~1 minute ago, should be phase1 still."""
        l = mdb.royale_lobbies.find_one({"size": 10, "timeline": "30min", "status": "live"}, {"_id": 0})
        orig_started = l["started_at"]
        try:
            new_started = (datetime.now(timezone.utc) - timedelta(minutes=1)).isoformat()
            mdb.royale_lobbies.update_one({"id": l["id"]}, {"$set": {"started_at": new_started}})
            r = s.get(f"{BASE_URL}/api/royale/lobbies/{l['id']}/state")
            st = r.json()["state"]
            assert st["phase"] == "phase1"
            assert st["total_active"] == 10
            assert st["eliminated_user_ids"] == []
            # phase 1 ends in ~900-60 = 840s
            assert 800 < st["next_elimination_in_seconds"] <= 900
        finally:
            mdb.royale_lobbies.update_one({"id": l["id"]}, {"$set": {"started_at": orig_started}})


# ---------------- Regression smoke ----------------

class TestRegression:
    def test_me(self, s):
        r = s.get(f"{BASE_URL}/api/me")
        assert r.status_code == 200
        assert r.json()["username"] == "TradeFury"

    def test_trading_station_groups(self, s):
        r = s.get(f"{BASE_URL}/api/me/trading-station")
        assert r.status_code == 200
        g = r.json()
        assert set(g.keys()) == {"active", "pending", "completed"}
        # Royale fix: TradeFury must see royale lobbies she's a participant in
        royales = [row for row in (g["active"] + g["pending"] + g["completed"]) if row["kind"] == "royale"]
        assert len(royales) >= 1, "Trading station should surface royale lobbies via participant_ids"

    def test_tournaments_list(self, s):
        r = s.get(f"{BASE_URL}/api/tournaments")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_tournament_detail(self, s):
        r = s.get(f"{BASE_URL}/api/tournaments/T-SPRING")
        # Completed tournaments may still be fetchable
        assert r.status_code == 200
        assert r.json()["id"] == "T-SPRING"

    def test_royale_lobbies_list(self, s):
        r = s.get(f"{BASE_URL}/api/royale/lobbies")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_royale_lobby_get(self, s, mdb):
        l = mdb.royale_lobbies.find_one({"status": "live"}, {"_id": 0})
        r = s.get(f"{BASE_URL}/api/royale/lobbies/{l['id']}")
        assert r.status_code == 200
        assert "leaderboard" in r.json()
