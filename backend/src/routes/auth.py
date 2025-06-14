import asyncio
from datetime import datetime, timedelta

import bcrypt
import jwt
from flask import Blueprint, make_response, request
from pydantic import ValidationError

from ..classes import Response as res
from ..config import Config
from ..schemas import UserData, UserLoginPayload, UserRegisterPayload, UserRole
from ..supabase_client import get_connection

auth_bp = Blueprint('auth', __name__)


class AuthService:
    @staticmethod
    async def hash_password(password: str) -> str:
        hashed = await asyncio.to_thread(
            bcrypt.hashpw, password.encode(), bcrypt.gensalt()
        )
        return hashed.decode()

    @staticmethod
    async def verify_password(password: str, password_hash: str) -> bool:
        return await asyncio.to_thread(
            bcrypt.checkpw, password.encode(), password_hash.encode()
        )

    @staticmethod
    async def fetch_user(email: str) -> UserData | None:
        conn = await get_connection()
        response = (
            await conn.table('users').select('*').eq('email', email).execute()
        )
        if response.data:
            return UserData.from_dict(response.data[0])
        return None

    @staticmethod
    async def create_user(data: UserRegisterPayload) -> bool:
        password_hash = await AuthService.hash_password(data.password)
        user = UserData(
            name=data.name,
            email=data.email,
            password_hash=password_hash,
            role=data.role or UserRole.OPERATOR.to_string(),
        )
        conn = await get_connection()
        await conn.table('users').insert(user.to_dict()).execute()
        return True

    @staticmethod
    def create_token(user: UserData) -> str:
        return jwt.encode(
            {
                'email': user.email,
                'role': user.role,
                'exp': datetime.utcnow() + timedelta(days=30),
            },
            Config.SECRET_KEY,
            algorithm='HS256',
        )


@auth_bp.route('/register', methods=['POST'])
async def register():
    try:
        raw_data = request.get_json()
        data = UserRegisterPayload(**raw_data)
    except ValidationError as e:
        return res.error(errors=e.errors())
    except Exception:
        return res.error('Invalid JSON')

    if await AuthService.fetch_user(data.email):
        return res.error('Email already registered')

    await AuthService.create_user(data)

    return res.success(message=f'User {data.name} registered successfully')


@auth_bp.route('/login', methods=['POST'])
async def login():
    existing_token = request.cookies.get('qrware_auth_token')

    if existing_token:
        return res.error('Already logged in')

    try:
        raw_data = request.get_json()
        data = UserLoginPayload(**raw_data)
    except ValidationError as e:
        return res.error(errors=e.errors())
    except Exception:
        return res.error('Invalid JSON')

    if not (user := await AuthService.fetch_user(data.email)):
        return res.error('Email not registered')

    if not await AuthService.verify_password(data.password, user.password_hash):
        return res.error('Invalid password')

    token = AuthService.create_token(user)

    response = make_response(res.success('Logged in')[0])
    response.set_cookie(
        'qrware_auth_token',
        token,
        httponly=True,
        secure=True,
        samesite='Lax',
        max_age=2592000,  # 30 dias
        path='/',
    )

    return response


@auth_bp.route('/logout', methods=['POST'])
async def logout():
    token = request.cookies.get('qrware_auth_token')

    if not token:
        return res.error('User is not logged in', status=401)

    try:
        jwt.decode(token, key=Config.SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return res.error('Session expired', status_code=401)
    except jwt.InvalidTokenError:
        return res.error('Invalid token', status_code=401)

    response = make_response(res.success('Logged out successfully')[0])
    response.set_cookie(
        'qrware_auth_token',
        '',
        httponly=True,
        secure=True,
        samesite='Lax',
        expires=0,
        path='/',
    )
    return response
