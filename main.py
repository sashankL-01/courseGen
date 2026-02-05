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


app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(user_router, prefix="/users", tags=["Users"])
app.include_router(course_router, prefix="/course", tags=["Courses"])
app.include_router(section_router, prefix="/section", tags=["Sections"])
