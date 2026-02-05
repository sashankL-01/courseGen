from models.prompt_model import Prompt
from utils.course_inference import infer_course_structure
from models.course_model import Course
import json
from bson import ObjectId
from fastapi import HTTPException
from datetime import datetime, timezone


async def get_response(prompt: Prompt, database) -> Course:
    section_collection = database.get_collection("sections")
    course_collection = database.get_collection("courses")
    prompt_data = prompt.model_dump()

    # Get course structure with media already fetched and placeholders replaced
    response = await infer_course_structure(prompt_data["prompt_text"])
    print("LLM Response with media:", response)

    if "error" in response:
        raise HTTPException(
            status_code=500, detail="Failed to generate course structure"
        )

    # Extract media links (already fetched by infer_course_structure)
    image_links = response.get("image_links", {})
    ytvid_links = response.get("ytvid_links", {})

    section_titles = response.get("sections", [])
    section_ids = []

    course_id = ObjectId()

    for idx, title in enumerate(section_titles):
        section_doc = {
            "_id": ObjectId(),
            "course_id": None,  # set later by section inference flow
            "title": title,
            "content": {
                "text": "",
                "image_links": [],
                "youtube_links": [],
                "mcqs": [],
                "headers": {"h1": [], "h2": []},
            },
            "order": idx,
        }
        result = await section_collection.insert_one(section_doc)
        section_ids.append(result.inserted_id)

    # Build description payload with actual links
    base_desc = response.get("description", "")
    description_payload = {
        "text": base_desc,
        "img_links": image_links,
        "ytvid_links": ytvid_links,
    }
    try:
        final_desc = json.dumps(description_payload)
    except Exception:
        final_desc = str(description_payload)

    course_doc = {
        "_id": course_id,
        "user_id": (
            ObjectId(prompt_data["user_id"])
            if not isinstance(prompt_data.get("user_id"), ObjectId)
            else prompt_data["user_id"]
        ),
        "prompt": prompt_data["prompt_text"],
        "title": response.get("title", ""),
        "description": final_desc,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
        "sections": section_ids,
        "section_titles": section_titles,
    }
    await course_collection.insert_one(course_doc)

    return Course(**course_doc)


async def get_user_courses(user_id: ObjectId, database) -> list[Course]:
    collection = database.get_collection("courses")
    cursor = collection.find({"user_id": user_id}).sort("created_at", -1)
    courses = await cursor.to_list(length=100)
    return [Course(**course) for course in courses]
