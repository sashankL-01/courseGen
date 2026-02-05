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
from datetime import datetime
from bson import ObjectId
from typing import Any, Annotated, Union


class ResetRequest(BaseModel):
    email: EmailStr


class ResetConfirm(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)
