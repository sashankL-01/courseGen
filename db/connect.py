"""
Database connection using Motor (async MongoDB driver).
Pure async implementation - no PyMongo threadpool execution.
"""

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
import os

# Get MongoDB URI from environment (works both locally and on Render)
MONGO_URI = os.environ.get("MONGO_URL") or os.environ.get("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "coursegen")

# Create async Motor client - minimal configuration
# Motor handles SSL/TLS automatically for mongodb+srv:// URIs
client = AsyncIOMotorClient(
    MONGO_URI,
    serverSelectionTimeoutMS=10000,
)

db = client[DB_NAME]


async def get_database() -> AsyncIOMotorDatabase:
    """
    Dependency function for FastAPI routes.
    Returns the Motor database instance (fully async).
    No PyMongo, no threadpool, pure async/await.
    """
    return db
