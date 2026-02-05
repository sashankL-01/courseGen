from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from models.user_model import UserCreate, UserResponse
from schemas.user_schema import UserInDB
from auth.password_handler import verify_password
from auth.jwt_handler import create_access_token, create_refresh_token
from services.user_service import get_user_by_email
from db.connect import get_database


async def login_user(email: str, password: str, database=Depends(get_database)) -> dict:
    print("login_user start", email)

    print("authenticate_user start", email)
    user = await get_user_by_email(email, database)

    if not user or not verify_password(password, user.password_hash):
        print("login_user invalid credentials", email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    print("authenticate_user ok", email)

    if not user.is_active:
        print("login_user inactive", email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_data = {
        "sub": str(user.id),
        "email": user.email,
        "scopes": user.roles,
    }
    print(
        "login_user token_data scopes",
        token_data.get("scopes"),
        "type",
        type(token_data.get("scopes")),
    )

    access_token = create_access_token(data=token_data)
    refresh_token = create_refresh_token(data=token_data)
    print("login_user tokens issued", email)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user_id": str(user.id),
    }
