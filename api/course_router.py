from fastapi import APIRouter, Depends, HTTPException
from typing import List
from pydantic import BaseModel
from models.prompt_model import Prompt
from models.course_model import Course
from schemas.user_schema import UserInDB
from services.course_service import get_response, get_user_courses
from auth.dependencies import get_course_access_user
from db.connect import get_database
from bson import ObjectId

router = APIRouter()


@router.post("/", response_model=Course)
async def create_course(
    prompt: Prompt,
    current_user: UserInDB = Depends(get_course_access_user),
    database=Depends(get_database),
) -> Course:
    if str(prompt.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="User ID mismatch")

    return await get_response(prompt, database)


@router.get("/all", response_model=List[Course])
async def list_courses(
    current_user: UserInDB = Depends(get_course_access_user),
    database=Depends(get_database),
) -> List[Course]:
    return await get_user_courses(ObjectId(current_user.id), database)


@router.get("/{course_id}", response_model=Course)
async def get_course(
    course_id: str,
    current_user: UserInDB = Depends(get_course_access_user),
    database=Depends(get_database),
) -> Course:
    try:
        course_collection = database.get_collection("courses")
        course = await course_collection.find_one({"_id": ObjectId(course_id)})

        if not course:
            raise HTTPException(status_code=404, detail="Course not found")

        # Verify the course belongs to the current user
        if str(course.get("user_id")) != str(current_user.id):
            raise HTTPException(status_code=403, detail="Access denied")

        return Course(**course)
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=400, detail=f"Invalid course ID: {str(e)}")


@router.delete("/{course_id}")
async def delete_course(
    course_id: str,
    current_user: UserInDB = Depends(get_course_access_user),
    database=Depends(get_database),
):
    try:
        course_collection = database.get_collection("courses")
        section_collection = database.get_collection("sections")
        
        # Find the course
        course = await course_collection.find_one({"_id": ObjectId(course_id)})

        if not course:
            raise HTTPException(status_code=404, detail="Course not found")

        # Verify the course belongs to the current user
        if str(course.get("user_id")) != str(current_user.id):
            raise HTTPException(status_code=403, detail="Access denied")

        # Delete all sections associated with this course
        sections_delete_result = await section_collection.delete_many(
            {"course_id": ObjectId(course_id)}
        )

        # Delete the course
        course_delete_result = await course_collection.delete_one(
            {"_id": ObjectId(course_id)}
        )

        if course_delete_result.deleted_count == 0:
            raise HTTPException(status_code=500, detail="Failed to delete course")

        return {
            "message": "Course deleted successfully",
            "course_id": course_id,
            "sections_deleted": sections_delete_result.deleted_count
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=400, detail=f"Error deleting course: {str(e)}")
