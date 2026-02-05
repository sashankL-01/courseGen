from fastapi import APIRouter, Depends, HTTPException
from models.section_model import Section_response, Section_request
from schemas.user_schema import UserInDB
from services.section_service import get_section
from auth.dependencies import get_section_access_user
from db.connect import get_database

router = APIRouter()


@router.post("/", response_model=Section_response)
async def get_section_with_slash(
    section: Section_request,
    current_user: UserInDB = Depends(get_section_access_user),
    database=Depends(get_database),
) -> Section_response:
    return await get_section(section, database)
