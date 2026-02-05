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

# Initialize async Motor client with production-ready SSL/TLS configuration
# For MongoDB Atlas, this ensures proper SSL handling
client_options = {
    "serverSelectionTimeoutMS": 10000,
    "connectTimeoutMS": 20000,
    "socketTimeoutMS": 20000,
    "retryWrites": True,
    "w": "majority",
}

# Add SSL/TLS for MongoDB Atlas (mongodb.net domains)
if "mongodb.net" in MONGO_URL:
    logger.info("Detected MongoDB Atlas URL, enabling TLS")
    client_options.update({
        "tls": True,
        "tlsAllowInvalidCertificates": False,
    })

logger.info(f"Connecting to MongoDB: {DB_NAME}")
client = AsyncIOMotorClient(MONGO_URL, **client_options)
db = client[DB_NAME]

user_collection = db.get_collection("users")
prompt_collection = db.get_collection("prompts")
response_collection = db.get_collection("responses")
course_collection = db.get_collection("courses")
section_collection = db.get_collection("sections")


async def get_database() -> AsyncIOMotorDatabase:
    print("get_database", DB_NAME)
    return db


async def get_user_collection(database: AsyncIOMotorDatabase):
    return database.get_collection("users")
