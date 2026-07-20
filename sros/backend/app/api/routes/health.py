from fastapi import APIRouter, Depends
from app.core.config import settings
from app.db.session import check_db_connection

router = APIRouter()


@router.get("/health", tags=["system"])
async def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENV,
        "debug_mode": settings.DEBUG
    }


@router.get("/db-status", tags=["system"])
async def db_status():
    connected = await check_db_connection()
    if connected:
        return {
            "database": "connected",
            "message": "PostgreSQL connection successfully established."
        }
    else:
        return {
            "database": "disconnected",
            "message": "Could not connect to PostgreSQL. Please check settings."
        }
