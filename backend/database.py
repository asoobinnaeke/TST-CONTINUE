"""MongoDB access layer + collection accessors."""
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

_client = AsyncIOMotorClient(os.environ["MONGO_URL"])
_db = _client[os.environ["DB_NAME"]]


def db():
    return _db


# Collection accessors (each returns the Motor collection)
def users():
    return _db.users


def duels():
    return _db.duels


def spawn_queue():
    return _db.spawn_queue


def royale_lobbies():
    return _db.royale_lobbies


def tournaments():
    return _db.tournaments


def teams():
    return _db.teams


def transactions():
    return _db.transactions


def notifications():
    return _db.notifications


def community_signups():
    return _db.community_signups


def match_results():
    return _db.match_results


def linked_accounts():
    return _db.linked_accounts


# ---------- Helpers ----------

PROJECTION_NO_ID = {"_id": 0}


async def find_one(collection, filter_):
    return await collection.find_one(filter_, PROJECTION_NO_ID)


async def find_many(collection, filter_=None, sort=None, limit=None):
    cursor = collection.find(filter_ or {}, PROJECTION_NO_ID)
    if sort:
        cursor = cursor.sort(sort)
    if limit:
        cursor = cursor.limit(limit)
    return await cursor.to_list(length=limit or 1000)
