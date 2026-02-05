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
from typing import Any, Annotated, Union, List


PyObjectId = Annotated[Union[str, ObjectId], BeforeValidator(str)]


class Mcq(BaseModel):
    question: str
    options: List[str]
    answer: str


class Section_request(BaseModel):
    section_id: PyObjectId
    course_id: PyObjectId

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
    )


class Section_response(BaseModel):
    id: PyObjectId = Field(alias="_id")
    course_id: PyObjectId
    title: str
    content: dict = {
        "text": "",
        "image_links": [],
        "youtube_links": [],
        "mcqs": [],
        "headers": {"h1": [], "h2": []},
    }
    order: int = 0

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
    )
