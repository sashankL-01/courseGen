"""
Database connection using Motor (async MongoDB driver).
- Using AsyncIOMotorClient (NOT direct MongoClient)
- All database operations are async/await
- Compatible with FastAPI's async nature
"""
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Generator
from config import MONGO_URL, DB_NAME

# Initialize async Motor client
client = AsyncIOMotorClient(MONGO_URL)
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
