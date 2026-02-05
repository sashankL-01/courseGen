import json
import re
import ast
import os
from groq import Groq
from utils.media_fetcher import fetch_media_from_queries
from config import GROQ_API_KEY, GROQ_MODEL


def _extract_json_like(text: str) -> str:
    if not isinstance(text, str):
        text = str(text)
    m = re.search(r"```(?:json)?\s*(.*?)\s*```", text, flags=re.S | re.I)
    if m:
        inner = m.group(1).strip()
        return inner
    text = re.sub(r"```.*?```", "", text, flags=re.S)
    text = re.sub(r"`([^`]*)`", r"\1", text)
    text = text.strip()
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        return text[start : end + 1]
    return text


def _find_balanced_json(text: str) -> str | None:
    start = text.find("{")
    if start == -1:
        return None
    depth = 0
    for i in range(start, len(text)):
        ch = text[i]
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return text[start : i + 1]
    return None


def _clean_json_text(s: str) -> str:
    if s.startswith("```") and s.endswith("```"):
        s = s[3:-3].strip()
    s = re.sub(r",\s*([}\]])", r"\1", s)
    return s


async def infer_course_structure(topic: str) -> dict:
    prompt = f"""
        You are an expert course designer and educator.

        Your task is to generate a high-quality course outline for the topic provided.
        The audience is technical learners (students, developers, or engineers).

        The course description should:
        - Be intermediate to high-level
        - Explain *what* the learner will gain and *why* the topic matters
        - Include placeholders for images and videos where they add educational value:
           - __image1__ for 1st image
           - __image2__ for 2nd image
           - __ytvid1__ for 1st youtube video
           - __ytvid2__ for 2nd youtube video
        
        MEDIA QUERY RULES (CRITICAL):
        - DO NOT generate URLs or links yourself
        - Instead, provide SEARCH QUERIES that will be used to find real content
        - Image queries should describe visual content: diagrams, infographics, screenshots
        - Video queries should describe educational content: tutorials, explanations, demonstrations
        - Queries should be specific enough to find relevant, high-quality content

        Generate a JSON object with the following structure:

        {{
        "title": "Concise, professional course title derived from the topic",

        "description": "A well-written introduction that flows naturally.
                        Insert placeholders inline where media fits contextually.
                        Example:
                        'We begin by understanding the core architecture of modern systems __image1__,
                        followed by a high-level overview of real-world applications __ytvid1__.'",

        "image_queries": {{
            "1": "specific search query for relevant diagram or infographic",
            "2": "another specific image search query"
        }},

        "ytvid_queries": {{
            "1": "specific search query for educational YouTube video",
            "2": "optional second video search query if clearly valuable"
        }},

        "sections": [
            "Clear, top-down section titles that guide the learner",
            "Start from fundamentals and progress logically",
            "Each section represents a major learning milestone",
            "Sections should flow naturally and build on each other"
        ]
        }}

        SECTION DESIGN RULES:
        - Follow a strategic top-down approach
        - Start with fundamentals and context
        - Progress toward applied understanding
        - End with real-world usage, best practices, or system-level thinking
        - Avoid overly granular or implementation-specific titles

        STRICT RULES:
        1. Output strictly valid JSON (no markdown, no explanations).
        2. Only include placeholders if you provide corresponding queries.
        3. Do NOT include empty keys.
        4. The output must be directly parseable by a JSON parser.
        5. Queries should be clear, specific, and likely to return relevant results.
        6. The description should be at least 300 words long and highly relevant to the course topic.

        Generate the JSON for this course topic:
        "{topic}"
        """

    api_key = GROQ_API_KEY
    if not api_key:
        return {"error": "Missing GROQ_API_KEY"}
    client = Groq(api_key=api_key)
    try:
        groq_model = GROQ_MODEL
        chat = client.chat.completions.create(
            model=groq_model,
            messages=[
                {"role": "system", "content": "Return strictly valid JSON only."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.2,
        )
        raw = chat.choices[0].message.content
    except Exception as e:
        return {"error": "Groq request failed", "detail": str(e)}
    print("Raw LLM Response:", raw)
    try:
        parsed_response = json.loads(raw)
    except Exception:
        parsed_response = None

    if not parsed_response:
        balanced = _find_balanced_json(raw)
        if balanced:
            cleaned = _clean_json_text(balanced)
            try:
                parsed_response = json.loads(cleaned)
            except Exception:
                try:
                    parsed_response = ast.literal_eval(cleaned)
                except Exception:
                    pass

    if not parsed_response:
        candidate = _extract_json_like(raw)
        if candidate and candidate != raw:
            cleaned = _clean_json_text(candidate)
            try:
                parsed_response = json.loads(cleaned)
            except Exception:
                try:
                    parsed_response = ast.literal_eval(cleaned)
                except Exception:
                    try:
                        relaxed = cleaned.replace("'", '"')
                        parsed_response = json.loads(relaxed)
                    except Exception:
                        pass

    if not parsed_response:
        print("Raw model output (repr):")
        print(repr(raw))
        return {"error": "Failed to parse model output", "raw": raw}

    # Fetch actual media from queries and replace placeholders
    image_queries = parsed_response.get("image_queries", {})
    ytvid_queries = parsed_response.get("ytvid_queries", {})

    if image_queries or ytvid_queries:
        try:
            print(f"Fetching media - Images: {image_queries}, Videos: {ytvid_queries}")
            image_links, ytvid_links = await fetch_media_from_queries(
                image_queries, ytvid_queries
            )
            print(f"Fetched media - Images: {image_links}, Videos: {ytvid_links}")

            # Replace placeholders in description with actual links
            description = parsed_response.get("description", "")

            # First, replace found placeholders with actual links
            # Replace image placeholders
            for key, url in image_links.items():
                placeholder = f"__image{key}__"
                description = description.replace(placeholder, url)

            # Replace video placeholders
            for key, url in ytvid_links.items():
                placeholder = f"__ytvid{key}__"
                description = description.replace(placeholder, url)

            # Remove any remaining unreplaced placeholders (for missing media)
            # This handles cases like __image1__ when we only have image '2'
            description = re.sub(r"__image\d+__", " ", description)
            description = re.sub(r"__ytvid\d+__", " ", description)

            # Clean up: remove comma/period followed by space that comes after URLs
            # This handles "text https://url, other" -> "text https://url other"
            description = re.sub(r"(https?://[^\s,\.]+)[,\.](\s)", r"\1\2", description)

            # Clean up multiple spaces
            description = re.sub(r"\s+", " ", description).strip()

            # Update response with replaced description and links
            parsed_response["description"] = description
            parsed_response["image_links"] = image_links
            parsed_response["ytvid_links"] = ytvid_links

            # Remove queries from response (no longer needed)
            parsed_response.pop("image_queries", None)
            parsed_response.pop("ytvid_queries", None)

        except Exception as e:
            print(f"Error fetching media: {e}")
            # Continue with original response if media fetching fails

    return parsed_response
