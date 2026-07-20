from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.config import settings

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True
)

SessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

async def get_db():
    """Dependency for obtaining an async database session."""
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
            
async def check_db_connection() -> bool:
    """Utility to test the database connection."""
    from sqlalchemy import text
    try:
        async with SessionLocal() as session:
            await session.execute(text("SELECT 1"))
            return True
    except Exception as e:
        print(f"Database connection error: {e}")
        return False
