from supabase import AsyncClient, create_async_client

from .config import Config

_instance: AsyncClient = None


async def get_connection() -> AsyncClient:
    return await create_async_client(Config.SUPABASE_URL, Config.SUPABASE_KEY)
