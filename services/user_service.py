from typing import Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.user_model import UserCreate, UserResponse
from schemas.user_schema import UserInDB
from bson import ObjectId
from fastapi import HTTPException
from datetime import datetime, timezone
from auth.password_handler import get_password_hash, validate_password


async def create_user(user: UserCreate, database: AsyncIOMotorDatabase) -> UserResponse:
    print("create_user start", user.email)
    collection = database.get_collection("users")

    if await get_user_by_email(user.email, database):
        print("create_user duplicate email", user.email)
        raise HTTPException(
            status_code=400, detail="User with this email already exists"
        )

    if await get_user_by_username(user.username, database):
        print("create_user duplicate username", user.username)
        raise HTTPException(
            status_code=400, detail="User with this username already exists"
        )

    if not validate_password(user.password):
        print("create_user weak password", user.email)
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters and contain uppercase, lowercase, number, and special character",
        )

    user_dict = user.model_dump()
    user_dict["password_hash"] = get_password_hash(user_dict.pop("password"))
    user_dict["created_at"] = datetime.now(timezone.utc)
    user_dict["is_active"] = True
    user_dict["is_admin"] = False
    user_dict["roles"] = ["user", "course", "section"]
    user_dict["profile_picture"] = None

    result = await collection.insert_one(user_dict)
    user_dict["_id"] = result.inserted_id
    print("create_user ok", user.email)
    return UserResponse(**user_dict)


async def get_user_by_id(id: str, database: AsyncIOMotorDatabase) -> Optional[UserInDB]:
    collection = database.get_collection("users")
    try:
        id = ObjectId(id)
    except:
        print("get_user_by_id invalid")
        raise HTTPException(status_code=400, detail="Invalid user id")

    user = await collection.find_one({"_id": id})
    if user:
        print("get_user_by_id found")
        return UserInDB(**user)
    print("get_user_by_id not found")
    return None


async def get_user_by_email(
    email: str, database: AsyncIOMotorDatabase
) -> Optional[UserInDB]:
    collection = database.get_collection("users")
    user = await collection.find_one({"email": email})
    if user:
        print("get_user_by_email found", email)
        return UserInDB(**user)
    print("get_user_by_email not found", email)
    return None


async def get_user_by_username(
    username: str, database: AsyncIOMotorDatabase
) -> Optional[UserInDB]:
    collection = database.get_collection("users")
    user = await collection.find_one({"username": username})
    if user:
        print("get_user_by_username found", username)
        return UserInDB(**user)
    print("get_user_by_username not found", username)
    return None


async def get_users_by_username_pattern(name: str, database: AsyncIOMotorDatabase):
    collection = database.get_collection("users")
    cursor = await collection.find(
        {"username": {"$regex": name, "$options": "i"}}
    ).to_list(length=None)

    return [UserResponse(**user) for user in cursor]


async def get_all_users(database: AsyncIOMotorDatabase):
    collection = database.get_collection("users")
    cursor = await collection.find({}).to_list(length=None)
    return [UserResponse(**user) for user in cursor]
