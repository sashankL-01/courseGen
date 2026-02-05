"""
Database connection using Motor (async MongoDB driver).
- Using AsyncIOMotorClient (NOT direct MongoClient)
- All database operations are async/await
- Compatible with FastAPI's async nature
"""

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Generator
from config import MONGO_URL, DB_NAME
import logging

logger = logging.getLogger(__name__)

# Initialize async Motor client with production-ready configuration
# Motor automatically handles SSL/TLS for mongodb+srv:// URIs
client_options = {
    "serverSelectionTimeoutMS": 10000,
    "connectTimeoutMS": 20000,
    "retryWrites": True,
    "w": "majority",
}

logger.info(f"Connecting to MongoDB: {DB_NAME}")
logger.info(f"Using connection URI: {MONGO_URL[:20]}...")
client = AsyncIOMotorClient(MONGO_URL, **client_options)
db = client[DB_NAME]


async def get_database() -> AsyncIOMotorDatabase:
    """
    Dependency function for FastAPI routes.
    Returns the shared async Motor database instance.
    All collections should be accessed via: database.get_collection("name")
    """
    return db

