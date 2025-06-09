from functools import wraps

import jwt
from flask import request

from ..classes import Response as res
from ..config import Config


def requires_roles(allowed_roles: list[str]):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            token = request.cookies.get('auth_token')
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

            user_role = payload.get('role')
            if user_role not in allowed_roles:
                return res.error(
                    'Forbidden: insufficient privileges', status_code=403
                )

            return f(*args, **kwargs)

        return wrapped

    return decorator
