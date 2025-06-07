import asyncio
from dataclasses import dataclass
from datetime import datetime, timedelta

import bcrypt
import jwt
from dataclasses_json import LetterCase, dataclass_json
from flask import Blueprint, make_response, request
from pydantic import ValidationError

from ..classes import Response as res
from ..config import Config
from ..schemas import UserLoginPayload, UserRegisterPayload, UserRole
from ..supabase_client import get_connection

auth_bp = Blueprint('auth', __name__)


@dataclass_json(letter_case=LetterCase.SNAKE)
@dataclass
class UserData:
    email: str
    name: str
    password_hash: str
    role: str = UserRole.OPERATOR.to_string()
    created_at: str = datetime.utcnow().isoformat()


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
            await conn.table('users').select('*').eq('email', email).execute
        )

        if response.data:
            return UserData.from_dict(response.data[0])

    @staticmethod
    async def create_user(
        name: str,
        email: str,
        password: str,
        role: str = UserRole.OPERATOR.to_string(),
    ) -> bool:
        password_hash = await AuthService.hash_password(password)
        user = UserData(
            name=name, email=email, password_hash=password_hash, role=role
        )

        conn = await get_connection()

        await conn.table('users').insert(user.to_dict()).execute()

        return True

    @staticmethod
    def create_token(user: UserData):
        return jwt.encode(
            payload={
                'email': user.email,
                'role': user.role,
                'exp': datetime.utcnow() + timedelta(days=30),
            },
            key=Config.SECRET_KEY,
            algorithm='HS256',
        ).decode('utf-8')


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

    await AuthService.create_user(data.name, data.email, data.password)

    return res.success(message=f'User {data.name} registered successfully')


@auth_bp.route('/login', methods=['POST'])
async def login():
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
        'auth_token',
        token,
        httponly=True,
        secure=True,
        samesite='Lax',
        max_age=2592000,  # 30 días
        path='/',
    )

    return response
