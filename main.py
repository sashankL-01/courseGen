from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from api.user_router import router as user_router
from api.course_router import router as course_router
from api.section_router import router as section_router
from api.auth_router import router as auth_router
from config import CORS_ORIGINS
import logging

logger = logging.getLogger(__name__)

app = FastAPI(title="CourseGen API")

# CORS - Allow all origins temporarily for debugging
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


# Global exception handler to ensure CORS headers are always added
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error", "error": str(exc)},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
        },
    )


@app.get("/")
async def root():
    return {"message": "CourseGen API is running", "status": "healthy"}


@app.get("/health/db")
async def health_db():
    """Check database connection health"""
    try:
        from db.connect import client, db
        import os

        # Try to ping the database
        await client.admin.command("ping")

        # Get connection info (without exposing password)
        mongo_uri = os.environ.get("MONGO_URL") or os.environ.get("MONGODB_URI", "local")
        mongo_host = (
            mongo_uri.split("@")[1].split("/")[0] if "@" in mongo_uri else "local"
        )
        connection_type = "mongodb+srv" if "mongodb+srv://" in mongo_uri else "mongodb"

        return {
            "status": "healthy",
            "database": db.name,
            "host": mongo_host,
            "connection_type": connection_type,
            "message": "Database connection successful",
        }
    except Exception as e:
        logger.error(f"Database health check failed: {e}", exc_info=True)
        return {
            "status": "unhealthy",
            "error": str(e),
            "type": type(e).__name__,
            "message": "Database connection failed - check MONGO_URL format (must use mongodb+srv:// for Atlas)",
        }


app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(user_router, prefix="/users", tags=["Users"])
app.include_router(course_router, prefix="/course", tags=["Courses"])
app.include_router(section_router, prefix="/section", tags=["Sections"])
