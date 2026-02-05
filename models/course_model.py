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
from typing import Any, Annotated, Union, Optional, List


PyObjectId = Annotated[Union[str, ObjectId], BeforeValidator(str)]


class Course(BaseModel):
    id: PyObjectId = Field(alias="_id")
    user_id: PyObjectId
    prompt: str
    title: str
    description: Optional[str] = ""
    sections: List[PyObjectId] = []
    section_titles: List[str] = []
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str, datetime: lambda v: v.isoformat() if v else None},
    )
