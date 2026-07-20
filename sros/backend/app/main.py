from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging import logger
from app.api.routes import health, documents, chat, projects

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="SROS Foundation API",
    version="1.0.0",
    debug=settings.DEBUG
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(health.router)
app.include_router(documents.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")
app.include_router(projects.router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "message": "Welcome to SROS API",
        "docs_url": "/docs",
        "status": "online"
    }

logger.info("FastAPI application started and routers registered.")
