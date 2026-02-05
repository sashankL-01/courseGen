from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.user_router import router as user_router
from api.course_router import router as course_router
from api.section_router import router as section_router
from api.auth_router import router as auth_router
from config import CORS_ORIGINS


app = FastAPI(title="CourseGen API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://course-gen-five.vercel.app",  # your frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "CourseGen API is running", "status": "healthy"}


app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(user_router, prefix="/users", tags=["Users"])
app.include_router(course_router, prefix="/course", tags=["Courses"])
app.include_router(section_router, prefix="/section", tags=["Sections"])
