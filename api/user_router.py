from fastapi import APIRouter, Depends, HTTPException, status
from models.user_model import UserCreate, UserResponse
from schemas.user_schema import UserInDB
from services.user_service import (
    create_user,
    get_user_by_id,
    get_all_users,
    get_users_by_username_pattern,
)
from auth.dependencies import get_current_active_user, get_admin_user
from db.connect import get_database

router = APIRouter()


@router.post("/", response_model=UserResponse)
async def register_user(user: UserCreate, database=Depends(get_database)):
    return await create_user(user, database)


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: UserInDB = Depends(get_current_active_user),
):
    return current_user


@router.get("/{id}", response_model=UserResponse)
async def get_user_by_ID(
    id: str,
    current_user: UserInDB = Depends(get_admin_user),
    database=Depends(get_database),
):
    return await get_user_by_id(id, database)


@router.get("/", response_model=list[UserResponse])
async def list_all_users(
    current_user: UserInDB = Depends(get_admin_user), database=Depends(get_database)
):
    return await get_all_users(database)


@router.get("/search/", response_model=list[UserResponse])
async def search_users_by_username(
    name: str,
    current_user: UserInDB = Depends(get_admin_user),
    database=Depends(get_database),
):
    return await get_users_by_username_pattern(name, database)
