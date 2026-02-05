import json
import re
from bson import ObjectId
from fastapi import HTTPException
from datetime import datetime, timezone
from models.section_model import Section_response, Section_request
from utils.section_inference import infer_section_content
from utils.media_fetcher import fetch_media_from_queries


async def get_section(section: Section_request, database) -> Section_response:
    print("\n=== get_section called ===")
    section_collection = database.get_collection("sections")
    course_collection = database["courses"]
    section = section.model_dump()
    print(f"Section data: {section}")
    section_id = section["section_id"]
    course_id = section["course_id"]
    print(f"Looking for section_id: {section_id}, course_id: {course_id}")

    section_doc = await section_collection.find_one({"_id": ObjectId(section_id)})
    print(f"Section doc found: {section_doc is not None}")
    if not section_doc:
        raise HTTPException(status_code=404, detail="Section not found")

    print(f"Section doc has course_id: {section_doc.get('course_id')}")
    if section_doc.get("course_id"):
        print("Returning existing section with content")
        return Section_response(**section_doc)

    course_doc = await course_collection.find_one({"_id": ObjectId(course_id)})
    print(f"Course doc found: {course_doc is not None}")
    if not course_doc:
        raise HTTPException(status_code=404, detail="Course not found")
    course_title = course_doc.get("title", "")
    print(f"Course title: {course_title}")

    section_title = section_doc.get("title", "")
    print(f"Section title: {section_title}")
    print("Calling infer_section_content...")

    section_data = await infer_section_content(section_title, course_title)
    print(f"Section data received: {type(section_data)}")
    print(
        f"Section data keys: {section_data.keys() if isinstance(section_data, dict) else 'Not a dict'}"
    )
    print("Processing section data...")
    if "error" in section_data:
        print(f"Error in section data: {section_data['error']}")
        raise HTTPException(
            status_code=500, detail="Failed to generate section content"
        )
    print("successfully inferred section content")
    # Extract data from new format
    text = section_data.get("text", "")
    image_queries = section_data.get("image_queries", {})
    ytvid_queries = section_data.get("ytvid_queries", {})
    headings = section_data.get("headings", {})
    mcqs = section_data.get("mcqs", [])

    print(
        f"Extracted - text length: {len(text)}, image_queries: {len(image_queries)}, ytvid_queries: {len(ytvid_queries)}"
    )

    # Fetch actual media from queries
    print("Fetching media from queries...")
    img_links, ytvid_links = await fetch_media_from_queries(
        image_queries, ytvid_queries
    )
    print(f"Media fetched - images: {len(img_links)}, videos: {len(ytvid_links)}")

    # Don't replace placeholders in text - keep them for frontend rendering
    # The frontend will handle replacing placeholders with embedded components

    print(f"Text length: {len(text)}")
    print("Updating section in database...")

    # Prepare content in the expected format with separate arrays
    content_dict = {
        "text": text,  # Keep placeholders in text
        "image_links": list(img_links.values()),  # Array of image URLs
        "youtube_links": list(ytvid_links.values()),  # Array of video URLs
        "mcqs": mcqs,
        "headers": headings,
    }

    await section_collection.update_one(
        {"_id": ObjectId(section_id)},
        {"$set": {"course_id": ObjectId(course_id), "content": content_dict}},
    )
    print("Section updated successfully")

    updated_section_doc = await section_collection.find_one(
        {"_id": ObjectId(section_id)}
    )
    print(f"Updated section doc retrieved: {updated_section_doc is not None}")
    print(
        f"Updated section doc keys: {list(updated_section_doc.keys()) if updated_section_doc else 'None'}"
    )
    print("Creating Section_response...")

    try:
        response = Section_response(**updated_section_doc)
        print(f"Section_response created successfully")
        return response
    except Exception as e:
        print(f"ERROR creating Section_response: {e}")
        print(f"updated_section_doc: {updated_section_doc}")
        raise
