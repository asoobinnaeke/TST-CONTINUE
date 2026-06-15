"""
Backend tests for Multi Trader (tournament) admin endpoints.
Covers:
 - Admin login + audit log
 - GET /admin/tournaments listing contract
 - POST /admin/tournaments (create)
 - POST /admin/tournaments/{id}/advance (STAGE_PROGRESSION)
 - 409 when already Completed
 - POST /admin/tournaments/{id}/stage-length (1d/5d, locked outside Registration)
 - POST /admin/tournaments/{id}/void (refund Transactions)
"""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
ADMIN_EMAIL = "admin@selecttraders.com"
ADMIN_PASSWORD = "admin-2026"

STAGE_PROGRESSION = [
    "Registration", "Group Stage", "Round of 16",
    "Quarter-Finals", "Semi-Finals", "Final", "Completed",
]


@pytest.fixture(scope="session")
def admin_token():
    r = requests.post(
        f"{BASE_URL}/api/admin/login",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        timeout=20,
    )
    assert r.status_code == 200, f"admin login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "token" in data and isinstance(data["token"], str) and len(data["token"]) > 0
    return data["token"]


@pytest.fixture(scope="session")
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


# ---------- Login + audit log ----------
class TestAdminLogin:
    def test_login_returns_token(self):
        r = requests.post(
            f"{BASE_URL}/api/admin/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
            timeout=20,
        )
        assert r.status_code == 200
        body = r.json()
        assert "token" in body
        assert isinstance(body["token"], str)
        assert len(body["token"]) > 10

    def test_login_creates_audit_entry(self, admin_headers):
        r = requests.get(f"{BASE_URL}/api/admin/audit-log", headers=admin_headers, timeout=20)
        assert r.status_code == 200
        logs = r.json()
        assert isinstance(logs, list)
        # Expect at least one login-ish action in the recent log
        actions = [str(x.get("action", "")).lower() for x in logs]
        assert any("login" in a for a in actions), f"no admin login audit entry, actions sample={actions[:8]}"


# ---------- List ----------
class TestListTournaments:
    def test_list_contract(self, admin_headers):
        r = requests.get(f"{BASE_URL}/api/admin/tournaments", headers=admin_headers, timeout=20)
        assert r.status_code == 200
        arr = r.json()
        assert isinstance(arr, list)
        if not arr:
            pytest.skip("no tournaments yet")
        t = arr[0]
        for f in ("id", "name", "stage", "stage_length", "start_date",
                  "prize_pool", "account_size", "capacity", "registered"):
            assert f in t, f"missing field {f} in tournament: {t}"
        assert t["stage_length"] in ("1d", "5d")


# ---------- Create + Advance + 409 ----------
class TestCreateAdvanceTournament:
    @pytest.fixture(scope="class")
    def created_id(self, admin_headers):
        payload = {
            "name": "TEST_Sprint_Cup",
            "start_date": "Mar 01",
            "prize_pool": 12345,
            "account_size": 25000,
            "stage_length": "1d",
            "capacity": 16,
        }
        r = requests.post(f"{BASE_URL}/api/admin/tournaments", headers=admin_headers, json=payload, timeout=20)
        assert r.status_code == 200, f"create failed {r.status_code} {r.text}"
        body = r.json()
        assert body.get("ok") is True
        assert "id" in body
        return body["id"]

    def test_create_appears_in_list(self, admin_headers, created_id):
        r = requests.get(f"{BASE_URL}/api/admin/tournaments", headers=admin_headers, timeout=20)
        assert r.status_code == 200
        ids = [t["id"] for t in r.json()]
        assert created_id in ids
        t = next(t for t in r.json() if t["id"] == created_id)
        assert t["name"] == "TEST_Sprint_Cup"
        assert t["stage_length"] == "1d"
        assert t["stage"] == "Registration"
        assert t["prize_pool"] == 12345
        assert t["account_size"] == 25000
        assert t["capacity"] == 16

    def test_advance_through_progression(self, admin_headers, created_id):
        # Step from Registration → Completed and verify each transition
        for i in range(len(STAGE_PROGRESSION) - 1):
            expected_next = STAGE_PROGRESSION[i + 1]
            r = requests.post(
                f"{BASE_URL}/api/admin/tournaments/{created_id}/advance",
                headers=admin_headers, timeout=20,
            )
            assert r.status_code == 200, f"advance {i} failed: {r.status_code} {r.text}"
            body = r.json()
            assert body.get("ok") is True
            assert body.get("stage") == expected_next, f"expected {expected_next}, got {body}"

    def test_advance_completed_returns_409(self, admin_headers, created_id):
        r = requests.post(
            f"{BASE_URL}/api/admin/tournaments/{created_id}/advance",
            headers=admin_headers, timeout=20,
        )
        assert r.status_code == 409, f"expected 409 when Completed, got {r.status_code} {r.text}"


# ---------- Stage length toggle ----------
class TestStageLength:
    @pytest.fixture(scope="class")
    def reg_id(self, admin_headers):
        r = requests.post(
            f"{BASE_URL}/api/admin/tournaments", headers=admin_headers,
            json={
                "name": "TEST_StageLen_Cup", "start_date": "Mar 02",
                "prize_pool": 5000, "account_size": 25000,
                "stage_length": "5d", "capacity": 16,
            }, timeout=20,
        )
        assert r.status_code == 200
        return r.json()["id"]

    def test_toggle_to_1d_then_5d(self, admin_headers, reg_id):
        r = requests.post(
            f"{BASE_URL}/api/admin/tournaments/{reg_id}/stage-length",
            headers=admin_headers, json={"stage_length": "1d"}, timeout=20,
        )
        assert r.status_code == 200, r.text
        assert r.json().get("stage_length") == "1d"
        # verify GET
        arr = requests.get(f"{BASE_URL}/api/admin/tournaments", headers=admin_headers, timeout=20).json()
        t = next(x for x in arr if x["id"] == reg_id)
        assert t["stage_length"] == "1d"
        # back to 5d
        r2 = requests.post(
            f"{BASE_URL}/api/admin/tournaments/{reg_id}/stage-length",
            headers=admin_headers, json={"stage_length": "5d"}, timeout=20,
        )
        assert r2.status_code == 200
        assert r2.json().get("stage_length") == "5d"

    def test_invalid_value_400(self, admin_headers, reg_id):
        r = requests.post(
            f"{BASE_URL}/api/admin/tournaments/{reg_id}/stage-length",
            headers=admin_headers, json={"stage_length": "2d"}, timeout=20,
        )
        assert r.status_code == 400

    def test_locked_after_advance(self, admin_headers, reg_id):
        # advance past Registration
        adv = requests.post(
            f"{BASE_URL}/api/admin/tournaments/{reg_id}/advance",
            headers=admin_headers, timeout=20,
        )
        assert adv.status_code == 200
        # now stage-length must be 409
        r = requests.post(
            f"{BASE_URL}/api/admin/tournaments/{reg_id}/stage-length",
            headers=admin_headers, json={"stage_length": "1d"}, timeout=20,
        )
        assert r.status_code == 409, f"expected 409, got {r.status_code} {r.text}"


# ---------- Void ----------
class TestVoidTournament:
    def test_void_marks_completed_and_returns_refund_count(self, admin_headers):
        # create then void
        r = requests.post(
            f"{BASE_URL}/api/admin/tournaments", headers=admin_headers,
            json={
                "name": "TEST_Void_Cup", "start_date": "Mar 03",
                "prize_pool": 8000, "account_size": 25000,
                "stage_length": "5d", "capacity": 8,
            }, timeout=20,
        )
        assert r.status_code == 200
        tid = r.json()["id"]

        v = requests.post(
            f"{BASE_URL}/api/admin/tournaments/{tid}/void",
            headers=admin_headers, json={"reason": "TEST_void"}, timeout=20,
        )
        assert v.status_code == 200, v.text
        body = v.json()
        assert body.get("ok") is True
        assert "refunded" in body and isinstance(body["refunded"], int)

        # confirm stage = Completed
        arr = requests.get(f"{BASE_URL}/api/admin/tournaments", headers=admin_headers, timeout=20).json()
        t = next(x for x in arr if x["id"] == tid)
        assert t["stage"] == "Completed"
