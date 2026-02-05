import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file in the project root (for local dev)
# On Render/production, environment variables are set directly in the dashboard
env_path = Path(__file__).parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)

# Export environment variables as constants
# Use os.environ.get() for production compatibility
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
GROQ_MODEL = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")
YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY")
PEXELS_API_KEY = os.environ.get("PEXELS_API_KEY")
MONGO_URL = os.environ.get("MONGO_URL") or os.environ.get("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "coursegen")
ACCESS_SECRET_KEY = os.environ.get("ACCESS_SECRET_KEY")
REFRESH_SECRET_KEY = os.environ.get("REFRESH_SECRET_KEY")
ALGORITHM = os.environ.get("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.environ.get("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

# CORS Configuration
CORS_ORIGINS = os.environ.get(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173"
).split(",")
