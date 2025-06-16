import inspect
from functools import wraps

import jwt
from flask import g, request

from ..classes import Response as res
from ..config import Config


def requires_roles(allowed_roles: list[str]):
    def decorator(f):
        @wraps(f)
        async def wrapper(*args, **kwargs):
            token = request.cookies.get('qrware_auth_token')
            if not token:
                return res.error(
                    'Authentication token is missing', status_code=401
                )

            try:
                payload = jwt.decode(
                    token, Config.SECRET_KEY, algorithms=['HS256']
                )
            except jwt.ExpiredSignatureError:
                return res.error('Token expired', status_code=401)
            except jwt.InvalidTokenError:
                return res.error('Invalid token', status_code=401)

            role = payload.get('role')
            if role not in allowed_roles:
                return res.error(
                    'Forbidden: insufficient privileges', status_code=403
                )

            g.current_user = {
                'email': payload.get('email'),
                'name': payload.get('name'),
                'role': role,
            }

            if inspect.iscoroutinefunction(f):
                return await f(*args, **kwargs)
            else:
                return f(*args, **kwargs)

        return wrapper

    return decorator
