from datetime import datetime
from typing import Optional, List, Callable
from fastapi import Depends, HTTPException, status, Security
from fastapi.security import OAuth2PasswordBearer, SecurityScopes
from auth.jwt_handler import verify_token
from schemas.user_schema import UserInDB
from services.user_service import get_user_by_id
from db.connect import get_database

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="auth/login",
    scopes={
        "user": "Read information about the current user",
        "course": "Access to course operations",
        "section": "Access to section operations",
        "admin": "Full administrative access",
    },
)


async def get_current_user(
    security_scopes: SecurityScopes,
    token: str = Depends(oauth2_scheme),
    database=Depends(get_database),
) -> UserInDB:
    if security_scopes.scopes:
        authenticate_value = f'Bearer scope="{security_scopes.scope_str}"'
    else:
        authenticate_value = "Bearer"

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": authenticate_value},
    )

    try:
        payload = verify_token(token)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception

        token_scopes = payload.get("scopes", [])
        print("get_current_user token_scopes", token_scopes, "type", type(token_scopes))
    except Exception:
        raise credentials_exception

    user = await get_user_by_id(user_id, database)
    if user is None:
        raise credentials_exception

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user",
            headers={"WWW-Authenticate": authenticate_value},
        )

    for scope in security_scopes.scopes:
        print("scope check", scope, "in", token_scopes, "?", scope in token_scopes)
        if scope not in token_scopes:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions",
                headers={"WWW-Authenticate": authenticate_value},
            )

    return user


async def get_current_active_user(
    current_user: UserInDB = Security(get_current_user, scopes=["user"])
) -> UserInDB:
    return current_user


async def get_course_access_user(
    current_user: UserInDB = Security(get_current_user, scopes=["course"])
) -> UserInDB:
    return current_user


async def get_section_access_user(
    current_user: UserInDB = Security(get_current_user, scopes=["section"])
) -> UserInDB:
    return current_user


async def get_admin_user(
    current_user: UserInDB = Security(get_current_user, scopes=["admin"])
) -> UserInDB:
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required"
        )
    return current_user
