from pydantic import (
    BaseModel,
    field_validator,
    model_validator,
    ValidationInfo,
    Field,
    EmailStr,
    ConfigDict,
)
from pydantic_core import core_schema
from pydantic.functional_validators import BeforeValidator
from datetime import datetime, timezone
from bson import ObjectId
from typing import Any, Annotated, Union, Optional


PyObjectId = Annotated[Union[str, ObjectId], BeforeValidator(str)]


class UserInDB(BaseModel):
    id: PyObjectId = Field(alias="_id")
    username: str
    email: EmailStr
    password_hash: str
    is_active: bool = True
    is_admin: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    roles: list[str]
    profile_picture: Optional[str] = None

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
    )
