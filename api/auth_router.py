from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Body
from models.password_reset_model import ResetRequest, ResetConfirm
from bson import ObjectId
from models.user_model import UserCreate, UserResponse
from models.token_model import Token
from services.auth_service import login_user
from services.user_service import create_user
from auth.jwt_handler import (
    verify_token,
    verify_refresh_token,
    create_access_token,
    create_refresh_token,
)
from auth.password_handler import get_password_hash, validate_password
from db.connect import get_database

router = APIRouter()


@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate, database=Depends(get_database)):
    print("register start", user.email)
    created = await create_user(user, database)
    print("register ok", created.email)
    return created


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(), database=Depends(get_database)
):
    print("login start", form_data.username)
    tokens = await login_user(form_data.username, form_data.password, database)
    print("login ok", form_data.username)
    return tokens


@router.post("/refresh", response_model=Token)
async def refresh_token(refresh_token: str = Body(...), database=Depends(get_database)):
    print("refresh start")
    payload = verify_refresh_token(refresh_token)
    token_data = {
        "sub": payload.get("sub"),
        "email": payload.get("email"),
        "scopes": payload.get("scopes", []),
    }
    access_token = create_access_token(data=token_data)
    new_refresh_token = create_refresh_token(data=token_data)
    out = {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
        "user_id": token_data.get("sub"),
    }
    print("refresh ok", token_data.get("sub"))
    return out


@router.post("/reset-password/request", status_code=200)
async def request_password_reset(payload: ResetRequest, database=Depends(get_database)):
    print("reset request start", payload.email)
    user = await database["users"].find_one({"email": payload.email})
    if not user:
        print("reset request no user", payload.email)
        return {
            "message": "If an account with that email exists, a reset link has been sent."
        }
    reset_token = create_access_token(
        {"sub": str(user["_id"])}, extra_claims={"reset": True}
    )
    print("reset request ok", payload.email)
    return {
        "message": "If an account with that email exists, a reset link has been sent.",
        "reset_token": reset_token,
    }


@router.post("/reset-password/confirm", status_code=200)
async def confirm_password_reset(payload: ResetConfirm, database=Depends(get_database)):
    print("reset confirm start")
    token_payload = verify_token(payload.token)
    if not token_payload.get("reset"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid reset token"
        )
    user_id = token_payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reset token payload",
        )
    if not validate_password(payload.new_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character"
            ),
        )
    hashed = get_password_hash(payload.new_password)
    result = await database["users"].update_one(
        {"_id": ObjectId(user_id)}, {"$set": {"password_hash": hashed}}
    )
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    print("reset confirm ok", user_id)
    return {"message": "Password has been reset successfully."}
