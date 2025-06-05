from supabase import AsyncClient, create_async_client

from .config import Config

_instance = None


async def get_connection() -> AsyncClient:
    global _instance

    if _instance is not None:
        return _instance

    _instance = await create_async_client(
        Config.SUPABASE_URL, Config.SUPABASE_KEY
    )

    return _instance
