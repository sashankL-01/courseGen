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

PyObjectId = Annotated[Union[str, ObjectId], BeforeValidator(str)]


class Prompt(BaseModel):
    user_id: str
    prompt_text: str

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
    )
