import json
import re
import ast
import os
from groq import Groq
from config import GROQ_API_KEY, GROQ_MODEL


def _extract_json_like(text: str) -> str:
    if not isinstance(text, str):
        text = str(text)

    # fenced json
    m = re.search(r"```(?:json)?\s*(.*?)\s*```", text, flags=re.S | re.I)
    if m:
        return m.group(1).strip()

    # remove inline code
    text = re.sub(r"`([^`]*)`", r"\1", text)

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
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                return text[start : i + 1]
    return None


def _clean_json_text(s: str) -> str:
    s = s.strip()
    s = re.sub(r",\s*([}\]])", r"\1", s)
    return s


async def infer_section_content(section_title: str, course_title: str) -> dict:
    print(f"\n=== infer_section_content called ===")
    print(f"Section title: {section_title}")
    print(f"Course title: {course_title}")

    prompt = f"""
        You are an expert course author having lot of experience in creating technical courses.
        Generate **one section** content of a technical course.
        place the below placeholders in the content where relevant media or headings or MCQs should appear.
        Allowed placeholders:
                __image1__, __image2__
                __ytvid1__, __ytvid2__
                __h1_1__, __h1_2__
                __h2_1__, __h2_2__
                __mcq1__, __mcq2__
        CRITICAL OUTPUT RULES:
        - DO NOT generate URLs
        - DO NOT generate image/video links
        - USE PLACEHOLDERS ONLY

    
        You must return VALID JSON in the structure below.

        {{
        "text": "Long-form educational text only related to the section title in the course. Headings must appear ONLY via placeholders. Example: __h1_1__ Explanation... __image1__ More explanation... __h2_1__ __ytvid1__ __mcq1__",
        "image_queries": {{
            "1": "search query describing the related image to the section content",
            "2": "optional second image query",
            ...
        }},
        "ytvid_queries": {{
            "1": "search query for educational youtube video",
            "2": "optional second video query",
            ...
        }},
        "headings": {{
            "h1": {{
            "1": "Main conceptual heading",
            "2": "Another major concept",
            ...
            }},
            "h2": {{
            "1": "Subheading for first concept",
            "2": "Subheading for second concept",
            ...
            }}
        }},
        "mcqs": [
            {{
            "question": "Clear test question",
            "options": ["A", "B", "C", "D"],
            "answer": "Correct option"
            }},
            ...
        ]
        }}

        for images and youtube videos, provide specific SEARCH QUERIES only that can be used to find relevant media.    
        The text content should atleast be 500 words long and highly relevant to the section title and course title.
        Atleast 3 mcqs must be provided which intermediate to advanced learners can solve.
        atleast 2 images related to section and 2 youtube video queries must be provided (placeholders must be used in text accordingly).
        heading placeholders must be used in text accordingly.
        Course Title: "{course_title}"
        Section Title: "{section_title}"

        Generate ONLY the JSON. No markdown, no extra text.
        """

    api_key = GROQ_API_KEY
    print(f"GROQ_API_KEY present: {bool(api_key)}")
    if not api_key:
        return {"error": "Missing GROQ_API_KEY"}

    client = Groq(api_key=api_key)

    try:
        model = GROQ_MODEL
        chat = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "Return strictly valid JSON only."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.2,
        )
        raw = chat.choices[0].message.content
    except Exception as e:
        return {"error": "Groq request failed", "detail": str(e)}

    try:
        return json.loads(raw)
    except Exception:
        pass
    print("Raw LLM Section Response:", raw)

    balanced = _find_balanced_json(raw)
    if balanced:
        try:
            return json.loads(_clean_json_text(balanced))
        except Exception:
            try:
                return ast.literal_eval(_clean_json_text(balanced))
            except Exception:
                pass

    candidate = _extract_json_like(raw)
    if candidate:
        try:
            return json.loads(_clean_json_text(candidate))
        except Exception:
            try:
                return ast.literal_eval(_clean_json_text(candidate))
            except Exception:
                pass

    return {"error": "Failed to parse model output", "raw": raw}
