import os
import re
import httpx
from typing import Dict, Optional, List
from config import PEXELS_API_KEY, YOUTUBE_API_KEY


def extract_queries(text: str, max_queries: int = 3) -> List[str]:
    text = re.sub(r"__image\d+__|__ytvid\d+__", "", text)

    keywords = [
        "architecture diagram",
        "workflow diagram",
        "system overview",
        "introduction tutorial",
        "explainer guide",
    ]

    base = text.split(".")[0][:120].strip()

    queries = [f"{base} {k}" for k in keywords]

    return queries[:max_queries]


async def is_valid_url(url: str) -> bool:
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.head(url, follow_redirects=True)
            return response.status_code == 200
    except Exception:
        return False


async def search_images_pexels(query: str, max_results: int = 2) -> List[str]:
    pexels_api_key = PEXELS_API_KEY
    if not pexels_api_key:
        print("Warning: PEXELS_API_KEY not found in environment")
        return []

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                "https://api.pexels.com/v1/search",
                params={
                    "query": query,
                    "per_page": max_results,
                    "orientation": "landscape",
                },
                headers={"Authorization": pexels_api_key},
            )
            response.raise_for_status()
            data = response.json()

            images = []
            photos = data.get("photos", [])

            for photo in photos:
                img_url = photo.get("src", {}).get("large") or photo.get("src", {}).get(
                    "original"
                )
                if img_url:
                    images.append(img_url)

            return images[:max_results]

    except Exception as e:
        print(f"Error searching Pexels images for '{query}': {e}")
        return []


async def search_youtube_video(query: str, max_results: int = 1) -> List[str]:
    youtube_api_key = os.getenv("YOUTUBE_API_KEY")
    if not youtube_api_key:
        print("Warning: YOUTUBE_API_KEY not found in environment")
        return []

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                "https://www.googleapis.com/youtube/v3/search",
                params={
                    "part": "snippet",
                    "q": query,
                    "type": "video",
                    "maxResults": max_results,
                    "key": youtube_api_key,
                    "videoEmbeddable": "true",
                    "relevanceLanguage": "en",
                },
            )
            response.raise_for_status()
            data = response.json()

            videos = []
            items = data.get("items", [])
            for item in items:
                video_id = item.get("id", {}).get("videoId")
                if video_id:
                    videos.append(f"https://www.youtube.com/watch?v={video_id}")

            return videos

    except Exception as e:
        print(f"Error fetching YouTube video for query '{query}': {e}")
        return []


async def resolve_media_from_text(text: str) -> Dict:
    youtube_api_key = os.getenv("YOUTUBE_API_KEY")
    queries = extract_queries(text)

    images = []
    videos = []

    for query in queries:
        if len(images) < 2:
            img_results = await search_images_pexels(query, max_results=2)
            images.extend(img_results)

        if len(videos) < 2 and youtube_api_key:
            vid_results = await search_youtube_video(query, max_results=1)
            videos.extend(vid_results)

        if images and videos:
            break

    return {
        "image_links": {str(i + 1): img for i, img in enumerate(images[:2])},
        "ytvid_links": {str(i + 1): vid for i, vid in enumerate(videos[:2])},
    }


async def fetch_media_from_queries(
    image_queries: Dict[str, str], ytvid_queries: Dict[str, str]
) -> tuple[Dict[str, str], Dict[str, str]]:
    image_links = {}
    ytvid_links = {}

    for key, query in (image_queries or {}).items():
        if query:
            results = await search_images_pexels(query, max_results=1)
            if results:
                image_links[key] = results[0]
                print(f"Found image for '{query}': {results[0]}")
            else:
                print(f"No image found for query '{query}'")

    for key, query in (ytvid_queries or {}).items():
        if query:
            results = await search_youtube_video(query, max_results=1)
            if results:
                ytvid_links[key] = results[0]
                print(f"Found video for '{query}': {results[0]}")
            else:
                print(f"No video found for query '{query}'")

    return image_links, ytvid_links
